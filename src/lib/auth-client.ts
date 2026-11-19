"use client";
import { createAuthClient } from "better-auth/react";
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: { type: "string", input: false },
        isBlocked: { type: "boolean", input: false },
        phone: { type: "string", required: false },
      },
    }),
  ],
});
