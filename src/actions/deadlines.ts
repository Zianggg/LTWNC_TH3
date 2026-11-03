"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { FORBIDDEN_MESSAGE, denyUnless, type ActionResult } from "@/lib/action-guard";
import { createDeadline, deleteDeadline, getSubject, setCompleted } from "@/lib/data";
import { createDeadlineSchema, deadlineIdSchema, toggleDoneSchema } from "@/lib/schemas";

// Server Action là endpoint công khai: ai có action id cũng gọi được, không cần qua giao diện.
// Vì vậy MỌI action đều tự làm đủ 3 bước: kiểm tra phiên + quyền → kiểm tra dữ liệu → mới ghi.

/** Làm mới mọi trang hiển thị danh sách deadline sau khi admin thêm/xoá.
 *  Pattern có segment động phải ghi cả route group, ví dụ "/(public)/deadlines/[id]". */
function revalidateDeadlinePages() {
  revalidatePath("/");
  revalidatePath("/deadlines");
  revalidatePath("/(public)/deadlines/[id]", "layout"); // gồm cả opengraph-image
  revalidatePath("/(public)/subjects/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/(app)/dashboard", "layout");
}

export async function toggleDoneAction(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || denyUnless(session, "deadline:complete")) return { ok: false, error: FORBIDDEN_MESSAGE };

  const parsed = toggleDoneSchema.safeParse({ id: formData.get("id"), done: formData.get("done") });
  if (!parsed.success) return { ok: false, error: "Dữ liệu không hợp lệ." };

  try {
    await setCompleted(session.user.id, parsed.data.id, parsed.data.done);
  } catch {
    return { ok: false, error: "Deadline này không còn tồn tại." };
  }
  revalidatePath("/(app)/dashboard", "layout");
  return { ok: true, message: parsed.data.done ? "Đã đánh dấu là xong." : "Đã bỏ đánh dấu." };
}

export async function createDeadlineAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const denied = denyUnless(await auth(), "deadline:create");
  if (denied) return denied;

  const values = {
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    type: formData.get("type")?.toString() ?? "",
    subjectSlug: formData.get("subjectSlug")?.toString() ?? "",
    dueAt: formData.get("dueAt")?.toString() ?? "",
  };
  const parsed = createDeadlineSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Kiểm tra lại các ô được đánh dấu.", fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }
  if (!(await getSubject(parsed.data.subjectSlug))) {
    return { ok: false, error: "Kiểm tra lại các ô được đánh dấu.", fieldErrors: { subjectSlug: ["Môn học không tồn tại"] }, values };
  }

  const created = await createDeadline(parsed.data);
  revalidateDeadlinePages();
  return { ok: true, message: `Đã thêm deadline #${created.id}.` };
}

export async function deleteDeadlineAction(formData: FormData): Promise<ActionResult> {
  const denied = denyUnless(await auth(), "deadline:delete");
  if (denied) return denied;

  const parsed = deadlineIdSchema.safeParse(formData.get("id"));
  if (!parsed.success) return { ok: false, error: "Id deadline không hợp lệ." };

  if (!(await deleteDeadline(parsed.data))) return { ok: false, error: "Deadline này đã bị xoá trước đó." };
  revalidateDeadlinePages();
  return { ok: true, message: `Đã xoá deadline #${parsed.data}.` };
}
