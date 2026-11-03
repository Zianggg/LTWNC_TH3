import "server-only";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { can, roleOf, type Action } from "./permissions";

// Kiểm tra quyền ngay trong page, không phụ thuộc Middleware (defense in depth).

export async function requireSession(callbackPath: string): Promise<Session> {
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  return session;
}

export async function requirePermission(action: Action, callbackPath: string): Promise<Session> {
  const session = await requireSession(callbackPath);
  if (!can(roleOf(session), action)) redirect("/403");
  return session;
}
