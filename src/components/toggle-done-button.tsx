"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { toggleDoneAction } from "@/actions/deadlines";
import { Button } from "@/components/ui/button";

export function ToggleDoneButton({ id, done, title }: { id: string; done: boolean; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("done", String(!done));
    startTransition(async () => {
      const result = await toggleDoneAction(formData);
      if (result.ok) toast.success(result.message);
      else toast.error(result.error);
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={done ? "outline" : "default"}
      onClick={handleClick}
      disabled={pending}
      className="self-end max-sm:h-10 max-sm:px-4"
      aria-label={`${done ? "Bỏ đánh dấu" : "Đánh dấu đã xong"}: ${title}`}
    >
      {pending ? "Đang lưu…" : done ? "Bỏ đánh dấu" : "Đánh dấu đã xong"}
    </Button>
  );
}
