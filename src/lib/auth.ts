import { betterAuth, type User } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { sendEmail } from "./email";

const uri = process.env.BETTER_AUTH_DB_URI;

if (!uri) {
  throw new Error("BETTER_AUTH_DB_URI is not configured");
}


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
    requireEmailVerification: true,
  },
  emailVerification: {
    // BetterAuth calls this when it needs to send a verification link.
    sendVerificationEmail: async ({ user, url }: { user: User; url: string }) => {
      try {
        await sendEmail({
          to: user.email,
          subject: "Verify your email",
          text: `Click this link to verify your email: ${url}`,
        });
      } catch (error) {
        // A mail failure must not break registration or sign-in.
        console.error("Could not send verification email:", error);
      }
    },
    sendOnSignIn: true,
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
