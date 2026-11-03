import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Không đủ quyền",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-xl py-24">
      <p className="text-7xl font-bold tabular-nums text-muted-foreground/80" aria-hidden="true">403</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Trang này chỉ dành cho lớp trưởng</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Tài khoản của bạn đang đăng nhập với vai trò sinh viên nên không thể thêm hoặc xoá deadline. Bạn vẫn đánh dấu bài đã nộp được trong bảng của mình.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/dashboard">Về bảng của tôi</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/deadlines">Xem deadline</Link>
        </Button>
      </div>
    </div>
  );
}
