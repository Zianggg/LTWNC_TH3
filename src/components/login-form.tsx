"use client";

import { useActionState } from "react";
import { githubLoginAction, loginAction, type LoginState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ callbackUrl, githubEnabled }: { callbackUrl: string; githubEnabled: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="ten@ptit.edu.vn" defaultValue={state.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required minLength={6} />
        </div>
        {state.error && (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Đang đăng nhập…" : "Đăng nhập"}
        </Button>
      </form>

      {githubEnabled && (
        <form action={githubLoginAction} className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">hoặc</p>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <Button type="submit" variant="outline" className="w-full">
            Đăng nhập với GitHub
          </Button>
        </form>
      )}
    </div>
  );
}
