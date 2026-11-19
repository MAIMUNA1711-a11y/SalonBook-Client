import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient, ObjectId } from "mongodb";

const globalForMongo = globalThis as unknown as { _mongo?: MongoClient };
const client = globalForMongo._mongo ?? new MongoClient(process.env.MONGODB_URI as string);
if (process.env.NODE_ENV !== "production") globalForMongo._mongo = client;
const db = client.db(process.env.MONGODB_DB || "salonbook");

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: {
   google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
   },
  },
  user: {
    modelName: "users",
    additionalFields: {
      // input:false => can NEVER be set by a client request (sign-up or update-user)
      role: { type: "string", defaultValue: "customer", input: false },
      isBlocked: { type: "boolean", defaultValue: false, input: false },
      phone: { type: "string", required: false, input: true },
    },
  },
  plugins: [jwt()], // issues JWTs verified by the Express API through /api/auth/jwks
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = (ctx.body as { password?: string })?.password ?? "";
        if (!PASSWORD_RULE.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password needs at least 6 characters, one uppercase and one lowercase letter",
          });
        }
      }
    }),
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Blocked users cannot start a session
          const id = (session as { userId: string }).userId;
          const user = await db
            .collection("users")
            .findOne(ObjectId.isValid(id) ? { _id: new ObjectId(id) } : ({ id } as never));
          if (user?.isBlocked) {
            throw new APIError("FORBIDDEN", { message: "Your account has been blocked. Please contact support." });
          }
          return { data: session };
        },
      },
    },
  },
});
