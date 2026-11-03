"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { safeCallbackUrl } from "@/lib/auth-helpers";

export interface LoginState {
  error?: string;
  /** Email vừa nhập, để form không bị xoá trắng sau khi báo lỗi. */
  email?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: safeCallbackUrl(formData.get("callbackUrl")?.toString()),
    });
    return {};
  } catch (error) {
    // Đăng nhập thành công cũng "ném" lỗi redirect của Next: phải ném lại để chuyển trang.
    if (error instanceof AuthError) {
      return { error: "Email hoặc mật khẩu không đúng.", email: formData.get("email")?.toString() };
    }
    throw error;
  }
}

// Chỉ xoá cookie phiên; client tự tải lại trang để SessionProvider không giữ phiên cũ.
export async function logoutAction(): Promise<void> {
  await signOut({ redirect: false });
}
