import type { NextAuthConfig } from "next-auth";

// Phần cấu hình "nhẹ": không bcrypt, không đọc file, nên Middleware (Edge runtime) import được.
// Provider có truy cập dữ liệu được thêm trong auth.ts.
export const authConfig = {
  pages: { signIn: "/login" },
  // Chạy bằng `next start` (không phải Vercel) cần tin header Host; app chỉ chạy sau một host đã biết.
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    // Chỉ lúc đăng nhập mới có `user`: chép id và role vào token (cookie đã ký).
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    // Quyết định session.user mà Server/Client Component nhìn thấy.
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
