import { denyUnless, FORBIDDEN_MESSAGE } from "@/lib/action-guard";

describe("denyUnless(session, action)", () => {
  test("khách chưa đăng nhập bị từ chối mọi thao tác ghi", () => {
    expect(denyUnless(null, "deadline:complete")).toEqual({ ok: false, error: FORBIDDEN_MESSAGE });
  });

  test("sinh viên được đánh dấu xong nhưng không được xoá", () => {
    const sv = { user: { id: "u-sv", role: "user" as const } };
    expect(denyUnless(sv, "deadline:complete")).toBeNull();
    expect(denyUnless(sv, "deadline:delete")).toEqual({ ok: false, error: FORBIDDEN_MESSAGE });
    expect(denyUnless(sv, "deadline:create")).toEqual({ ok: false, error: FORBIDDEN_MESSAGE });
  });

  test("admin được thêm và xoá", () => {
    const admin = { user: { id: "u-admin", role: "admin" as const } };
    expect(denyUnless(admin, "deadline:create")).toBeNull();
    expect(denyUnless(admin, "deadline:delete")).toBeNull();
  });
});
