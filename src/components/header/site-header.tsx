import Link from "next/link";
import type { ReactNode } from "react";

const NAV = [
  { href: "/deadlines", label: "Deadline" },
  { href: "/#mon-hoc", label: "Môn học" },
];

export function SiteHeader({ userMenu }: { userMenu?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-primary-foreground" aria-hidden="true">
            DH
          </span>
          <span>Deadline Hub</span>
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto">{userMenu}</div>
      </div>
    </header>
  );
}
