import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/deadlines", label: "Deadline" },
  { href: "/#mon-hoc", label: "Môn học" },
];

const navLink =
  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring";

export function SiteHeader({ userMenu }: { userMenu?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <a
        href="#noi-dung"
        className="sr-only rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2"
      >
        Bỏ qua tới nội dung
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight" aria-label="Deadline Hub, trang chủ">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-primary-foreground" aria-hidden="true">
            DH
          </span>
          <span className="hidden whitespace-nowrap min-[420px]:inline" aria-hidden="true">
            Deadline Hub
          </span>
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={navLink}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <div className="min-w-0">{userMenu}</div>
        </div>
      </div>
      {/* Dưới 640px menu chính chuyển xuống một hàng riêng thay vì biến mất. */}
      <nav aria-label="Điều hướng chính" className="border-t sm:hidden">
        <ul className="mx-auto flex max-w-6xl gap-1 px-2">
          {[...NAV, { href: "/dashboard", label: "Bảng của tôi" }].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`${navLink} inline-flex min-h-11 items-center`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
