import type { Metadata } from "next";
import { githubEnabled } from "@/auth";
import { LoginForm } from "@/components/login-form";
import { safeCallbackUrl } from "@/lib/auth-helpers";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const callbackUrl = safeCallbackUrl((await searchParams).callbackUrl);

  return (
    <div className="mx-auto grid max-w-4xl gap-10 py-14 md:grid-cols-[1fr_1.1fr] md:items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Đăng nhập</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Sinh viên đăng nhập để đánh dấu bài đã nộp. Lớp trưởng đăng nhập để thêm và xoá deadline.
        </p>
        <div className="mt-8 rounded-lg border bg-card p-4 text-sm">
          <p className="font-semibold">Tài khoản dùng thử</p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="text-muted-foreground">Lớp trưởng</dt>
            <dd>admin@ptit.edu.vn / admin123</dd>
            <dt className="text-muted-foreground">Sinh viên</dt>
            <dd>sv@ptit.edu.vn / sv123456</dd>
          </dl>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6 sm:p-8">
        <LoginForm callbackUrl={callbackUrl} githubEnabled={githubEnabled} />
      </div>
    </div>
  );
}
