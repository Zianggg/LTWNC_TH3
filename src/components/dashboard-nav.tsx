"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
}

// Tô sáng mục ứng với trang đang mở; cần usePathname nên là Client Component.
export function DashboardNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Bảng điều khiển">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-10 items-center justify-between gap-3 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors lg:min-h-9",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.label}
                <PendingDot />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Dashboard là SSR: trong lúc chờ server, mục vừa bấm hiện chấm báo đang tải ngay lập tức
// thay vì để cả vùng nội dung nhảy sang khung chờ.
function PendingDot() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={cn("size-1.5 rounded-full bg-current transition-opacity", pending ? "opacity-70 motion-safe:animate-pulse" : "opacity-0")}
    />
  );
}
