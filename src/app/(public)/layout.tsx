import { SiteHeader } from "@/components/header/site-header";
import { UserMenu } from "@/components/header/user-menu";
import { SiteFooter } from "@/components/site-footer";

// Layout của các trang công khai. Không đọc cookie/phiên ở đây để các trang con giữ được SSG/ISR.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader userMenu={<UserMenu />} />
      <main id="noi-dung" className="mx-auto max-w-6xl px-4 sm:px-6">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
