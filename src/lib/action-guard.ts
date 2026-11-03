import { can, roleOf, type Action } from "./permissions";
import type { Role } from "./types";

export type ActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
      /** Giá trị vừa gửi, để form hiện lại sau khi React tự reset form. */
      values?: Record<string, string>;
    };

export const FORBIDDEN_MESSAGE = "Bạn không có quyền thực hiện thao tác này.";

/** Trả lỗi nếu phiên không được phép làm `action`; null nghĩa là được phép. */
export function denyUnless(
  session: { user?: { id?: string; role?: Role } } | null,
  action: Action,
): Extract<ActionResult, { ok: false }> | null {
  if (!session?.user?.id || !can(roleOf(session), action)) {
    return { ok: false, error: FORBIDDEN_MESSAGE };
  }
  return null;
}
