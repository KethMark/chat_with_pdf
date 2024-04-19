import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NEXT_SECRET_BYTESCALE_API_KEY: z.string().min(1),
        GROQ_API_KEY: z.string().min(1),
        CLERK_SECRET_KEY: z.string().min(1),
        DATABASE_URL: z.string().url(),
        DATABASE_URL_UNPOOLED: z.string().url(),
        MONGODB_ATLAS_URI: z.string().min(1),
        MONGODB_ATLAS_DB_NAME: z.string().min(1),
        MONGODB_ATLAS_COLLECTION_NAME: z.string().min(1),
        MONGODB_ATLAS_INDEX_NAME: z.string().min(1)
    },
    client: {
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
        NEXT_PUBLIC_BYTESCALE_API_KEY: z.string().min(1),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
        NEXT_PUBLIC_VECTORSTORE: z.string().min(1),
    },
    runtimeEnv: {
        MONGODB_ATLAS_INDEX_NAME: process.env.MONGODB_ATLAS_INDEX_NAME,
        MONGODB_ATLAS_COLLECTION_NAME: process.env.MONGODB_ATLAS_COLLECTION_NAME,
        MONGODB_ATLAS_DB_NAME: process.env.MONGODB_ATLAS_DB_NAME,
        MONGODB_ATLAS_URI: process.env.MONGODB_ATLAS_URI,
        NEXT_PUBLIC_VECTORSTORE: process.env.NEXT_PUBLIC_VECTORSTORE,
        DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
        DATABASE_URL: process.env.DATABASE_URL,
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        GROQ_API_KEY: process.env.GROQ_API_KEY,
        NEXT_SECRET_BYTESCALE_API_KEY: process.env.NEXT_SECRET_BYTESCALE_API_KEY,
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
        NEXT_PUBLIC_BYTESCALE_API_KEY: process.env.NEXT_PUBLIC_BYTESCALE_API_KEY,
    }
})