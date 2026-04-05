"use server";

import { redirect } from "next/navigation";
import { clearSession, setSession } from "@/lib/auth/session";
import type { AuthActionState } from "@/lib/auth/types";
import { loginWithApi, registerWithApi } from "@/lib/auth/api";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    return {
      error: "Email and password are required."
    };
  }

  try {
    const result = await loginWithApi(email, password);

    if (!result.ok) {
      return {
        error: result.error
      };
    }

    await setSession(result.session);
  } catch {
    return {
      error: "Could not complete login right now."
    };
  }

  redirect("/");
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    return {
      error: "Email and password are required."
    };
  }

  try {
    const result = await registerWithApi(email, password);

    if (!result.ok) {
      return {
        error: result.error
      };
    }
  } catch {
    return {
      error: "Could not complete registration right now."
    };
  }

  redirect(`/auth/login?registered=${encodeURIComponent(email)}`);
}

export async function logoutAction() {
  await clearSession();
  redirect("/auth/login");
}
