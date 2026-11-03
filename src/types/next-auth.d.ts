import type { DefaultSession } from "next-auth";
import type { Role } from "@/lib/types";

// Mở rộng kiểu có sẵn của Auth.js để session.user có id và role (union, không phải string).
declare module "next-auth" {
  interface User {
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

// Auth.js v5 lấy kiểu JWT từ @auth/core; khai báo ở cả hai nơi để callback jwt/session đều thấy.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
