import type { Role } from "./types";

// Ma trận phân quyền DUY NHẤT của ứng dụng. Middleware, page và Server Action
// đều hỏi can(); đổi chính sách chỉ cần sửa file này.
// File không import gì ngoài kiểu nên dùng được cả ở Edge runtime (Middleware).

export type PermissionRole = "guest" | Role;

export type Action =
  | "deadline:read"
  | "deadline:complete"
  | "deadline:create"
  | "deadline:delete";

const userActions: readonly Action[] = ["deadline:read", "deadline:complete"];

export const PERMISSIONS: Record<PermissionRole, readonly Action[]> = {
  guest: ["deadline:read"],
  user: userActions,
  admin: [...userActions, "deadline:create", "deadline:delete"],
};

export function can(role: PermissionRole, action: Action): boolean {
  return PERMISSIONS[role].includes(action);
}

export function roleOf(session: { user?: { role?: Role } } | null | undefined): PermissionRole {
  return session?.user?.role ?? "guest";
}
