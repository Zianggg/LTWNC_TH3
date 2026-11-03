import { SiteHeader } from "@/components/header/site-header";
import { UserMenu } from "@/components/header/user-menu";

// Khung cho khu vực cần đăng nhập (/dashboard, /admin): rộng hơn, không có footer công khai.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader userMenu={<UserMenu />} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </>
  );
}
