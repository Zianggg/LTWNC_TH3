import { can, roleOf, type Action, type PermissionRole } from "@/lib/permissions";

// Bảng phân quyền đúng theo đề bài: [vai trò, hành động, được phép?]
const matrix: [PermissionRole, Action, boolean][] = [
  ["guest", "deadline:read", true],
  ["guest", "deadline:complete", false],
  ["guest", "deadline:create", false],
  ["guest", "deadline:delete", false],
  ["user", "deadline:read", true],
  ["user", "deadline:complete", true],
  ["user", "deadline:create", false],
  ["user", "deadline:delete", false],
  ["admin", "deadline:read", true],
  ["admin", "deadline:complete", true],
  ["admin", "deadline:create", true],
  ["admin", "deadline:delete", true],
];

describe("can(role, action)", () => {
  test.each(matrix)("%s → %s = %s", (role, action, expected) => {
    expect(can(role, action)).toBe(expected);
  });
});

describe("roleOf(session)", () => {
  test("chưa đăng nhập là guest", () => {
    expect(roleOf(null)).toBe("guest");
    expect(roleOf({})).toBe("guest");
  });

  test("lấy vai trò từ session", () => {
    expect(roleOf({ user: { role: "admin" } })).toBe("admin");
    expect(roleOf({ user: { role: "user" } })).toBe("user");
  });
});
