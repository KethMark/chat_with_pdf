import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { loadEmbeddings } from "@/lib/embeddings";
import { loadMongoDBStore } from "@/lib/mongo";
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { type MongoClient } from "mongodb";

export async function POST(req: Request) {
    let mongoDBClient: MongoClient | null = null

    const { fileUrl, fileName } = await req.json();

    const { userId } = getAuth(req as any)

    if(!userId) {
        return NextResponse.json({ error: "LoggedIn sa pd arn dli mo error"})
    }

    const doc = await prisma.document.create({
        data: {
            fileName,
            fileUrl,
            userId
        }
    })

    const namespace = doc.id

    try {
        
        /** Start the process */
        /** Accept the file/read the file */
        const response = await fetch(fileUrl);
        const buffer = await response.blob();
        const loader = new PDFLoader(buffer);
        const rawDocs = await loader.load();

        /** Split the text into chunks */
        const text_splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 100
        })

        const splitDocs = await text_splitter.splitDocuments(rawDocs);

        /** Exclusive for mongodb */
        for (const splitDoc of splitDocs) {
            splitDoc.metadata.docstore_document_id = namespace;
        }

        console.log('creating vector store...')

        /** create and store the embeddings into vectore store */
        const embeddings = loadEmbeddings();

        const store = await loadMongoDBStore({
            embeddings
        })

        const vectorestore = store.vectorestore;
        if ('mongoDbClient' in store) {
            mongoDBClient = store.mongoDbClient as MongoClient;
        }

        await vectorestore.addDocuments(splitDocs)

    } catch (error) {
        console.log('error:', error)
        return NextResponse.json({ error: 'Failed'})
    } finally {
        if(mongoDBClient) {
            await mongoDBClient.close()
        }
    }

    return NextResponse.json({
        text: 'Successfull',
        id: namespace
    })
}