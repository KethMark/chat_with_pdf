import { MongoClient } from "mongodb"
import { Embeddings } from "@langchain/core/embeddings"
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { env } from "./env";

export async function loadMongoDBStore({
  embeddings
}: {
  embeddings: Embeddings
}) {
  const mongoDBClient = new MongoClient(env.MONGODB_ATLAS_URI ?? '')

  await mongoDBClient.connect();

  const dbName = env.MONGODB_ATLAS_DB_NAME ?? '';
  const collectionName = env.MONGODB_ATLAS_COLLECTION_NAME ?? ''
  const collection = mongoDBClient.db(dbName).collection(collectionName);

  const vectorestore = new MongoDBAtlasVectorSearch(embeddings, {
    indexName: env.MONGODB_ATLAS_INDEX_NAME ?? 'vector_index',
    collection
  });

  return {
    vectorestore,
    mongoDBClient
  }
}
