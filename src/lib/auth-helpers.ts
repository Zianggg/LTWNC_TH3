import "server-only";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "./data";
import { loginSchema } from "./schemas";
import type { Role } from "./types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/** Kiểm tra email + mật khẩu; mọi trường hợp sai (kể cả dữ liệu sai kiểu) đều trả null. */
export async function verifyCredentials(email: unknown, password: unknown): Promise<AuthUser | null> {
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) return null;

  const user = await findUserByEmail(parsed.data.email);
  if (!user) return null;
  if (!(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

const FALLBACK = "/dashboard";

/** Chỉ cho phép quay lại đường dẫn nội bộ, tránh open redirect qua ?callbackUrl=. */
export function safeCallbackUrl(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/")) return FALLBACK;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return FALLBACK;
  return raw;
}
