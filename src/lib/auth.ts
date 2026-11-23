import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.BETTER_AUTH_DB_URI;

if (!uri) {
  throw new Error("BETTER_AUTH_DB_URI is not configured");
}

/**
 * A serverless instance is reused between requests. Opening a brand new
 * MongoClient on every module evaluation (which also happened on every
 * middleware/static-asset request) exhausts the Atlas connection pool and
 * leaves the topology closed — surfaced on Vercel as
 * MongoServerSelectionError followed by MongoTopologyClosedError and an
 * "Internal Server Error" on every dashboard page.
 *
 * Keep exactly one connected client per instance and reuse it. If a cold
 * start fails to connect, drop the cached promise so the next invocation
 * can try again instead of reusing a dead topology.
 */
const globalForAuth = globalThis as unknown as {
  authMongoClientPromise?: Promise<MongoClient>;
};

const connect = () => {
  const promise = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
  })
    .connect()
    .catch((error) => {
      globalForAuth.authMongoClientPromise = undefined;
      console.error("MongoDB connection failed:", error);
      throw error;
    });

  globalForAuth.authMongoClientPromise = promise;
  return promise;
};

const client = await (globalForAuth.authMongoClientPromise ?? connect());

const db = client.db("equipment_rental_platform");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["Customer", "Owner", "Admin"] as const,
        required: false,
        defaultValue: "Customer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET as string,
    },
  },
});
