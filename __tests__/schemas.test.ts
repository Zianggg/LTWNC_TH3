import { createDeadlineSchema, deadlineIdSchema, toggleDoneSchema } from "@/lib/schemas";

const valid = {
  title: "  Bài tập 5: Server Actions  ",
  description: "Viết 3 Server Action có kiểm tra quyền.",
  type: "assignment",
  subjectSlug: "lap-trinh-web-nang-cao",
  dueAt: "2026-12-01T23:59", // giá trị của <input type="datetime-local">
};

describe("createDeadlineSchema", () => {
  test("dữ liệu hợp lệ: cắt khoảng trắng và đổi hạn sang ISO giờ Việt Nam", () => {
    const result = createDeadlineSchema.parse(valid);
    expect(result.title).toBe("Bài tập 5: Server Actions");
    expect(result.dueAt).toBe("2026-12-01T23:59:00+07:00");
  });

  test("mô tả để trống vẫn hợp lệ", () => {
    expect(createDeadlineSchema.safeParse({ ...valid, description: "" }).success).toBe(true);
  });

  test("tiêu đề chỉ có khoảng trắng bị từ chối", () => {
    const result = createDeadlineSchema.safeParse({ ...valid, title: "   " });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.title?.[0]).toMatch(/Tiêu đề/);
  });

  test("ngày hạn sai định dạng bị từ chối", () => {
    expect(createDeadlineSchema.safeParse({ ...valid, dueAt: "abc" }).success).toBe(false);
    expect(createDeadlineSchema.safeParse({ ...valid, dueAt: "2026-13-45T25:00" }).success).toBe(false);
  });

  test("loại deadline không nằm trong danh sách bị từ chối", () => {
    expect(createDeadlineSchema.safeParse({ ...valid, type: "party" }).success).toBe(false);
  });

  test("thiếu môn học bị từ chối", () => {
    expect(createDeadlineSchema.safeParse({ ...valid, subjectSlug: "" }).success).toBe(false);
  });
});

describe("deadlineIdSchema", () => {
  test("chỉ nhận chuỗi số", () => {
    expect(deadlineIdSchema.safeParse("1").success).toBe(true);
    expect(deadlineIdSchema.safeParse("abc").success).toBe(false);
    expect(deadlineIdSchema.safeParse("../x").success).toBe(false);
    expect(deadlineIdSchema.safeParse(null).success).toBe(false);
  });
});

describe("toggleDoneSchema", () => {
  test("chuyển chuỗi 'true'/'false' thành boolean", () => {
    expect(toggleDoneSchema.parse({ id: "3", done: "true" })).toEqual({ id: "3", done: true });
    expect(toggleDoneSchema.parse({ id: "3", done: "false" })).toEqual({ id: "3", done: false });
  });

  test("giá trị done lạ bị từ chối", () => {
    expect(toggleDoneSchema.safeParse({ id: "3", done: "yes" }).success).toBe(false);
  });
});
