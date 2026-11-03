"use client";

import { Button } from "@/components/ui/button";

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl py-24" role="alert">
      <h1 className="text-2xl font-bold tracking-tight">Không tải được dữ liệu deadline</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Máy chủ gặp lỗi khi đọc dữ liệu. Thử tải lại; nếu vẫn lỗi, báo lớp trưởng kèm mã bên dưới.
      </p>
      {error.digest && <p className="mt-2 text-sm text-muted-foreground">Mã lỗi: {error.digest}</p>}
      <Button className="mt-6" onClick={reset}>
        Thử lại
      </Button>
    </div>
  );
}
