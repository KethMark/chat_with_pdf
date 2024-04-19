import { NextResponse } from "next/server"
import prisma from '@/lib/prisma'
import { getAuth } from '@clerk/nextjs/server'
import { MongoClient } from "mongodb"
import { env } from "@/lib/env"

interface DeleteFileParams {
    accountId: string;
    apiKey: string;
    querystring: {
        filePath: string
    }
}

async function deleteFile(params: DeleteFileParams) {
    const baseUrl = 'https://api.bytescale.com';
    const path = `/v2/accounts/${params.accountId}/files`;
    const entries = (obj: Record<string, unknown>) =>
      Object.entries(obj).filter(([, val]) => (val ?? null) !== null) as [
        string,
        string,
      ][];
    const query = entries(params.querystring ?? {})
      .flatMap(([k, v]) => (Array.isArray(v) ? v.map((v2) => [k, v2]) : [[k, v]]))
      .map((kv) => kv.join('='))
      .join('&');
    const response = await fetch(
      `${baseUrl}${path}${query.length > 0 ? '?' : ''}${query}`,
      {
        method: 'DELETE',
        headers: Object.fromEntries(
          entries({
            "Authorization": `Bearer ${params.apiKey}`,
          }) as [string, string][],
        ),
      },
    );
    if (Math.floor(response.status / 100) !== 2) {
      const result = await response.json();
      throw new Error(`Bytescale API Error: ${JSON.stringify(result)}`);
    }
  }

export async function DELETE(req: Request) {

    const{ id, fileUrl } = await req.json();

    const { userId } = getAuth(req as any)

    if(!userId) {
        return NextResponse.json({ error: "Waka maka loggedIn"})
    }

    const mongoDBClient = new MongoClient(env.MONGODB_ATLAS_URI ?? '')

    await mongoDBClient.connect();

    const dbName = env.MONGODB_ATLAS_DB_NAME ?? '';
    const collectionName = env.MONGODB_ATLAS_COLLECTION_NAME ?? ''
    const collection = mongoDBClient.db(dbName).collection(collectionName);

    try {
        const document = await prisma.document.findFirst({
            where: {
                id,
                userId
            }
        })

        if(!document) {
            return NextResponse.json({ error: 'Document not found'})
        }

        const pathWithAccId = fileUrl.replace('https://upcdn.io/', '');
        const accId = pathWithAccId.split('/')[0];
        const path = pathWithAccId.replace(`${accId}/raw`, '');

        deleteFile({
          accountId: accId,
          apiKey: !!env.NEXT_SECRET_BYTESCALE_API_KEY
            ? env.NEXT_SECRET_BYTESCALE_API_KEY
            : 'no api key found',
          querystring: {
            filePath: path,
          },
        }).then(
          () => console.log('Success.'),
        (error) => {
            console.error(error);
              return NextResponse.json({
              error: 'Could not delete document from cloud',
            });
          },
        )

        const result = await collection.deleteMany({ docstore_document_id: id})

        if (result.deletedCount === 1) {
          console.log('Document deleted successfully.');
        } else {
          console.log('No document matched the query. No documents deleted.');

        }
        await prisma.document.delete({
            where: {
                id
            }
        })

        return NextResponse.json({text: 'Document deleted successfully', id})
    } catch (error) {
        console.log('error', error)
        return NextResponse.json({ error: 'Failed to delete your data' })
    } finally {
        if(mongoDBClient) {
            await mongoDBClient.close()
        }
    }

}