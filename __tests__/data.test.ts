import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SEED_DIR = path.join(__dirname, "..", "data");

let tmpDir: string;
let data: typeof import("@/lib/data");

beforeEach(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "deadline-hub-"));
  fs.cpSync(SEED_DIR, tmpDir, { recursive: true });
  process.env.DATA_DIR = tmpDir;
  jest.resetModules();
  data = await import("@/lib/data");
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  delete process.env.DATA_DIR;
});

describe("đọc dữ liệu", () => {
  test("có 4 môn học", async () => {
    expect(await data.getSubjects()).toHaveLength(4);
  });

  test("có 12 deadline, sắp theo hạn tăng dần", async () => {
    const deadlines = await data.getDeadlines();
    expect(deadlines).toHaveLength(12);
    const times = deadlines.map((d) => new Date(d.dueAt).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  test("getDeadline trả đúng deadline theo id", async () => {
    expect((await data.getDeadline("1"))?.id).toBe("1");
  });

  test("getDeadline trả null với id không tồn tại hoặc sai định dạng", async () => {
    expect(await data.getDeadline("999")).toBeNull();
    expect(await data.getDeadline("abc")).toBeNull();
  });

  test("getDeadlinesBySubject chỉ trả deadline của môn đó", async () => {
    const [subject] = await data.getSubjects();
    const list = await data.getDeadlinesBySubject(subject.slug);
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((d) => d.subjectSlug === subject.slug)).toBe(true);
  });

  test("findUserByEmail không phân biệt hoa thường", async () => {
    expect((await data.findUserByEmail("ADMIN@ptit.edu.vn"))?.role).toBe("admin");
    expect((await data.findUserByEmail("sv@ptit.edu.vn"))?.role).toBe("user");
    expect(await data.findUserByEmail("ai@ptit.edu.vn")).toBeNull();
  });
});

describe("ghi dữ liệu", () => {
  test("createDeadline cấp id kế tiếp và lưu lại được", async () => {
    const created = await data.createDeadline({
      subjectSlug: "lap-trinh-web-nang-cao",
      title: "Bài mới",
      description: "",
      type: "assignment",
      dueAt: "2026-12-01T23:59:00+07:00",
    });
    expect(created.id).toBe("13");
    expect(await data.getDeadline("13")).not.toBeNull();
  });

  test("setCompleted bật rồi tắt trạng thái đã xong", async () => {
    await data.setCompleted("u-sv", "2", true);
    expect(await data.getCompletedIds("u-sv")).toContain("2");
    await data.setCompleted("u-sv", "2", false);
    expect(await data.getCompletedIds("u-sv")).not.toContain("2");
  });

  test("setCompleted từ chối deadline không tồn tại", async () => {
    await expect(data.setCompleted("u-sv", "999", true)).rejects.toThrow("DEADLINE_NOT_FOUND");
  });

  test("deleteDeadline xoá deadline và gỡ khỏi danh sách đã xong", async () => {
    await data.setCompleted("u-sv", "2", true);
    expect(await data.deleteDeadline("2")).toBe(true);
    expect(await data.getDeadline("2")).toBeNull();
    expect(await data.getCompletedIds("u-sv")).not.toContain("2");
    expect(await data.deleteDeadline("2")).toBe(false);
  });
});
