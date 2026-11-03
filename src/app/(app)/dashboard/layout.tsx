import { auth } from "@/auth";
import { DashboardNav, type NavItem } from "@/components/dashboard-nav";
import { can, roleOf } from "@/lib/permissions";

// Layout lồng nhau: sidebar giữ nguyên khi chuyển giữa các trang con của /dashboard.
// Layout chỉ dùng phiên để dựng menu; việc chặn truy cập nằm ở từng page.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const items: NavItem[] = [
    { href: "/dashboard", label: "Tổng quan" },
    { href: "/dashboard/done", label: "Đã hoàn thành" },
  ];
  if (can(roleOf(session), "deadline:create")) items.push({ href: "/admin", label: "Quản trị deadline" });

  return (
    <div className="grid gap-8 lg:grid-cols-[13rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <DashboardNav items={items} />
      </aside>
      <main id="noi-dung" className="min-w-0">
        {children}
      </main>
    </div>
  );
}
