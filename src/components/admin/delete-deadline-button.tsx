"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteDeadlineAction } from "@/actions/deadlines";
import { Button } from "@/components/ui/button";

export function DeleteDeadlineButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Xoá deadline “${title}”? Trang công khai sẽ không còn deadline này.`)) return;
    const formData = new FormData();
    formData.set("id", id);
    startTransition(async () => {
      const result = await deleteDeadlineAction(formData);
      if (result.ok) toast.success(result.message);
      else toast.error(result.error);
    });
  }

  return (
    <Button type="button" size="sm" variant="ghost" onClick={handleClick} disabled={pending} className="text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label={`Xoá deadline ${title}`}>
      {pending ? "Đang xoá…" : "Xoá"}
    </Button>
  );
}
