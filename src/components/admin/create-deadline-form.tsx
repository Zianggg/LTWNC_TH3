"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createDeadlineAction } from "@/actions/deadlines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-guard";
import { DEADLINE_TYPE_LABELS, type DeadlineType } from "@/lib/types";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring aria-invalid:border-destructive";

export function CreateDeadlineForm({ subjects }: { subjects: { slug: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createDeadlineAction, null);
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const values = state && !state.ok ? state.values ?? {} : {};

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message);
    } else if (!state.fieldErrors) {
      toast.error(state.error);
    }
  }, [state]);

  const fieldError = (name: string) =>
    errors[name]?.[0] ? (
      <p id={`${name}-error`} className="text-sm text-destructive">
        {errors[name]![0]}
      </p>
    ) : null;

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="title">Tiêu đề</Label>
        <Input id="title" name="title" required maxLength={120} aria-invalid={!!errors.title} aria-describedby="title-error" placeholder="Bài tập 5: Server Actions" defaultValue={values.title} />
        {fieldError("title")}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subjectSlug">Môn học</Label>
        <select id="subjectSlug" name="subjectSlug" required defaultValue={values.subjectSlug ?? ""} className={selectClass} aria-invalid={!!errors.subjectSlug} aria-describedby="subjectSlug-error">
          <option value="" disabled>
            Chọn môn
          </option>
          {subjects.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        {fieldError("subjectSlug")}
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Loại</Label>
        <select id="type" name="type" required defaultValue={values.type || "assignment"} className={selectClass} aria-invalid={!!errors.type} aria-describedby="type-error">
          {(Object.keys(DEADLINE_TYPE_LABELS) as DeadlineType[]).map((type) => (
            <option key={type} value={type}>
              {DEADLINE_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        {fieldError("type")}
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueAt">Hạn nộp (giờ Việt Nam)</Label>
        <Input id="dueAt" name="dueAt" type="datetime-local" required aria-invalid={!!errors.dueAt} aria-describedby="dueAt-error" defaultValue={values.dueAt} />
        {fieldError("dueAt")}
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea id="description" name="description" rows={3} maxLength={1000} aria-invalid={!!errors.description} aria-describedby="description-error" placeholder="Yêu cầu nộp bài, hình thức, ghi chú…" defaultValue={values.description} />
        {fieldError("description")}
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Đang thêm…" : "Thêm deadline"}
        </Button>
        {state && !state.ok && state.fieldErrors && <p className="text-sm text-destructive">{state.error}</p>}
      </div>
    </form>
  );
}
