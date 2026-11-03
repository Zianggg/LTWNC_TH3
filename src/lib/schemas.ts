import { z } from "zod";

// Mọi dữ liệu từ form đều đi qua các schema này trước khi chạm tới dữ liệu.

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(100),
});
