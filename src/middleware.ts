import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import { can, roleOf } from "./lib/permissions";

// Lớp bảo vệ thứ nhất, chạy ở Edge trước khi render. Chỉ đọc phiên từ cookie JWT.
// Trang /admin và mọi Server Action vẫn tự kiểm tra lại quyền (xem lib/guards.ts).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname, search } = req.nextUrl;

  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && !can(roleOf(req.auth), "deadline:create")) {
    return NextResponse.redirect(new URL("/403", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
