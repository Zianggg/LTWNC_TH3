import Link from "next/link";
import { SiteHeader } from "@/components/header/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-col items-start px-4 py-24 sm:px-6">
        <p className="text-7xl font-bold tabular-nums text-muted-foreground/40">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Không tìm thấy trang này</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Deadline hoặc môn học bạn tìm không tồn tại, hoặc đã bị lớp trưởng xoá. Kiểm tra lại đường dẫn, hoặc xem danh sách đầy đủ.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href="/deadlines">Xem tất cả deadline</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
