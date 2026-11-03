import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { verifyCredentials } from "./lib/auth-helpers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      authorize: (credentials) => verifyCredentials(credentials?.email, credentials?.password),
    }),
  ],
});
