"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { can } from "@/lib/permissions";
import type { Role } from "@/lib/types";

const ROLE_LABELS: Record<Role, string> = { admin: "Lớp trưởng", user: "Sinh viên" };

// Đọc phiên ở client để header không biến trang SSG/ISR thành dynamic.
export function UserMenu() {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();

  // Đăng nhập/đăng xuất bằng Server Action chỉ chuyển trang phía client,
  // nên hỏi lại phiên mỗi khi đổi đường dẫn để header không hiện trạng thái cũ.
  useEffect(() => {
    void update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (status === "loading") {
    return <div className="h-9 w-40 animate-pulse rounded-md bg-muted" aria-hidden="true" />;
  }

  if (!session) {
    const callbackUrl = pathname === "/login" ? "/dashboard" : pathname;
    return (
      <Button asChild size="sm">
        <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Đăng nhập</Link>
      </Button>
    );
  }

  const { name, role } = session.user;
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right leading-tight sm:block">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>
      </div>
      <Button asChild size="sm" variant="ghost">
        <Link href="/dashboard">Bảng của tôi</Link>
      </Button>
      {can(role, "deadline:create") && (
        <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
          <Link href="/admin">Quản trị</Link>
        </Button>
      )}
      <form
        action={async () => {
          await logoutAction();
          window.location.assign("/");
        }}
      >
        <Button type="submit" size="sm" variant="outline">
          Đăng xuất
        </Button>
      </form>
    </div>
  );
}
