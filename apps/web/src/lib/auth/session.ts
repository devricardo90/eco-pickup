import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthSession } from "@/lib/auth/types";
import { isSessionExpired } from "@/lib/auth/session-utils";

const sessionCookieName = "ecopickup_session";

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(sessionCookieName)?.value;

  if (!rawValue) {
    return null;
  }

  try {
    const session = JSON.parse(rawValue) as AuthSession;
    if (!session.accessToken || !session.user?.role || isSessionExpired(session.expiresAtUtc)) {
      cookieStore.delete(sessionCookieName);
      return null;
    }

    return session;
  } catch {
    cookieStore.delete(sessionCookieName);
    return null;
  }
}

export async function setSession(session: AuthSession) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAtUtc)
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function requireSession(role?: string) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (role && session.user.role !== role) {
    redirect("/auth/login?error=forbidden");
  }

  return session;
}
