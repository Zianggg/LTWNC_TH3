import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { authConfig } from "./auth.config";
import { verifyCredentials } from "./lib/auth-helpers";

/** Đăng nhập GitHub (điểm cộng) chỉ bật khi đã cấu hình AUTH_GITHUB_ID / AUTH_GITHUB_SECRET. */
export const githubEnabled = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);

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
    ...(githubEnabled
      ? [
          GitHub({
            // Tài khoản GitHub luôn là sinh viên; quyền admin chỉ dành cho tài khoản lớp trưởng.
            profile: (profile) => ({
              id: `github:${profile.id}`,
              name: profile.name ?? profile.login,
              email: profile.email,
              image: profile.avatar_url,
              role: "user" as const,
            }),
          }),
        ]
      : []),
  ],
});
