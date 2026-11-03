import fs from "node:fs";
import os from "node:os";
import path from "node:path";

let tmpDir: string;
let helpers: typeof import("@/lib/auth-helpers");

beforeEach(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "deadline-hub-auth-"));
  fs.cpSync(path.join(__dirname, "..", "data"), tmpDir, { recursive: true });
  process.env.DATA_DIR = tmpDir;
  jest.resetModules();
  helpers = await import("@/lib/auth-helpers");
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  delete process.env.DATA_DIR;
});

describe("verifyCredentials", () => {
  test("đúng tài khoản admin thì trả user có role admin, không lộ mật khẩu băm", async () => {
    const user = await helpers.verifyCredentials("admin@ptit.edu.vn", "admin123");
    expect(user).toEqual({ id: "u-admin", name: "Nguyễn Minh Anh", email: "admin@ptit.edu.vn", role: "admin" });
  });

  test("đúng tài khoản sinh viên thì role user", async () => {
    expect((await helpers.verifyCredentials("sv@ptit.edu.vn", "sv123456"))?.role).toBe("user");
  });

  test("sai mật khẩu trả null", async () => {
    expect(await helpers.verifyCredentials("sv@ptit.edu.vn", "sai123456")).toBeNull();
  });

  test("email không tồn tại trả null", async () => {
    expect(await helpers.verifyCredentials("ai@ptit.edu.vn", "sv123456")).toBeNull();
  });

  test("dữ liệu sai kiểu trả null thay vì ném lỗi", async () => {
    expect(await helpers.verifyCredentials(123, "admin123")).toBeNull();
    expect(await helpers.verifyCredentials("admin@ptit.edu.vn", undefined)).toBeNull();
  });
});

describe("safeCallbackUrl", () => {
  test("giữ đường dẫn nội bộ", () => {
    expect(helpers.safeCallbackUrl("/admin")).toBe("/admin");
    expect(helpers.safeCallbackUrl("/dashboard/done?x=1")).toBe("/dashboard/done?x=1");
  });

  test.each(["//evil.com", "https://evil.com", "/\\evil.com", "javascript:alert(1)", "", null, undefined])(
    "chặn %p và quay về /dashboard",
    (raw) => {
      expect(helpers.safeCallbackUrl(raw)).toBe("/dashboard");
    },
  );
});
