import { NextRequest, NextResponse } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';

import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';

import { HumanMessage, AIMessage, ChatMessage } from '@langchain/core/messages';
import { ChatGroq } from "@langchain/groq";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from '@langchain/core/prompts';
import { Document } from '@langchain/core/documents';
import { RunnableSequence } from '@langchain/core/runnables';
import { type MongoClient } from 'mongodb';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { loadMongoDBStore } from "@/lib/mongo";
import { loadEmbeddings } from "@/lib/embeddings";
import { env } from '@/lib/env';

export const runtime = "nodejs";

const formatVercelMessages = (message: VercelChatMessage) => {
    if (message.role === 'user') {
      return new HumanMessage(message.content);
    } else if (message.role === 'assistant') {
      return new AIMessage(message.content);
    } else {
      console.warn(
        `Unknown message type passed: "${message.role}". Falling back to generic message type.`,
      );
      return new ChatMessage({ content: message.content, role: message.role });
    }
}

const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder('chat_history'),
    ['user', '{input}'],
    [
      'user',
      'Given the above conversation, generate a concise vector store search query to look up in order to get information relevant to the conversation.',
    ],
]);

const ANSWER_SYSTEM_TEMPLATE = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

<context>
{context}
</context>

Please return your answer in markdown with clear headings and lists.`;

const answerPrompt = ChatPromptTemplate.fromMessages([
  ['system', ANSWER_SYSTEM_TEMPLATE],
  new MessagesPlaceholder('chat_history'),
  ['user', '{input}'],
]);

export async function POST(req: NextRequest) {
    let mongoDbClient: MongoClient | null = null

    try {

        const body = await req.json()
        const messages = body.messages ?? [];
        if(!messages.length) {
            throw new Error("Message unavailable")
        }
        const formattedPreviousMessages = messages.slice(0, -1).map(formatVercelMessages)
        const currentMessageContent = messages[messages.length - 1].content;
        const chatId = body.chatId

        const model = new ChatGroq({
            temperature: 0.9,
            modelName: "mixtral-8x7b-32768",
            apiKey: env.GROQ_API_KEY
        });

        const embeddings = loadEmbeddings()

        const store = await loadMongoDBStore({
            embeddings
        })

        const vectorstore = store.vectorestore;
        if ('mongoDbClient' in store) {
            mongoDbClient = store.mongoDBClient
        }

        let resolveWithDocuments: (value: Document[]) => void;
        const documentPromise = new Promise<Document[]>((resolve) => {
            resolveWithDocuments = resolve;
        })

        //For mongodb
        const filter = env.NEXT_PUBLIC_VECTORSTORE === 'mongodb' ? {
            preFilter: {
                docstore_document_id: {
                    $eq: chatId
                }
            }
        } : undefined

        const retriever = vectorstore.asRetriever(
            {
            filter,
            callbacks: [
                {
                    handleRetrieverEnd(documents) {
                      resolveWithDocuments(documents);
                    },
                }
            ]
            }
        )
        const historyAwareRetrieverChain = await createHistoryAwareRetriever({
            llm: model,
            retriever,
            rephrasePrompt: historyAwarePrompt,
        })

        const documentChain = await createStuffDocumentsChain({
            llm: model,
            prompt: answerPrompt,
        })

        const conversationalRetrievalChain = await createRetrievalChain({
            retriever: historyAwareRetrieverChain,
            combineDocsChain: documentChain,
        })

        const outputChain = RunnableSequence.from([
            conversationalRetrievalChain.pick('answer'),
            new HttpResponseOutputParser({ contentType: 'text/plain' }),
        ])

        const stream = await outputChain.stream({
            chat_history: formattedPreviousMessages,
            input: currentMessageContent,
        })

        const documents = await documentPromise;
        const serializedSources = Buffer.from(
          JSON.stringify(
            documents.map((doc) => {
              return {
                pageContent: doc.pageContent.slice(0, 50) + '...',
                metadata: doc.metadata,
              };
            }),
          ),
        ).toString('base64')

        return new StreamingTextResponse(stream, {
            headers: {
              'x-message-index': (formattedPreviousMessages.length + 1).toString(),
              'x-sources': serializedSources,
            },
        })

    } catch (e: any) {
        return NextResponse.json({error: e.message}, { status: 500})
    } finally {
        if(mongoDbClient) {
            await mongoDbClient.close();
        }
    }
}