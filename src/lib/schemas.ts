import { z } from "zod";

// Mọi dữ liệu từ form đều đi qua các schema này trước khi chạm tới dữ liệu.

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(100),
});

const DEADLINE_TYPES = ["assignment", "quiz", "project", "exam"] as const;

/** Id deadline là chuỗi số ("1", "13"): chặn luôn các giá trị lạ như "../x". */
export const deadlineIdSchema = z.string().regex(/^\d+$/, "Id deadline không hợp lệ");

/** "2026-12-01T23:59" (từ <input type="datetime-local">, hiểu là giờ Việt Nam) → "2026-12-01T23:59:00+07:00" */
const vnDateTime = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Ngày hạn không hợp lệ")
  .refine((value) => {
    const [y, m, d, h, mi] = value.split(/[-T:]/).map(Number);
    const date = new Date(Date.UTC(y, m - 1, d, h, mi));
    // Date tự "tràn" ngày sai (31/02 → 03/03), nên so lại từng thành phần.
    return (
      date.getUTCFullYear() === y &&
      date.getUTCMonth() === m - 1 &&
      date.getUTCDate() === d &&
      date.getUTCHours() === h &&
      date.getUTCMinutes() === mi
    );
  }, "Ngày hạn không hợp lệ")
  .transform((value) => `${value}:00+07:00`);

export const createDeadlineSchema = z.object({
  title: z.string().trim().min(3, "Tiêu đề cần ít nhất 3 ký tự").max(120, "Tiêu đề tối đa 120 ký tự"),
  description: z.string().trim().max(1000, "Mô tả tối đa 1000 ký tự"),
  type: z.enum(DEADLINE_TYPES, { message: "Chọn loại deadline" }),
  subjectSlug: z.string().trim().min(1, "Chọn môn học"),
  dueAt: vnDateTime,
});

export const toggleDoneSchema = z.object({
  id: deadlineIdSchema,
  done: z.enum(["true", "false"]).transform((value) => value === "true"),
});
