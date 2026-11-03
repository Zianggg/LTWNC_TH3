"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Sáng/tối theo cài đặt máy, người dùng chọn lại được; lựa chọn lưu ở localStorage.
    // Đổi bằng class trên <html> nên trang SSG/ISR không phải render lại.
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>
        {children}
        <Toaster position="bottom-right" richColors />
      </SessionProvider>
    </ThemeProvider>
  );
}
