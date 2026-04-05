import type { AuthTokenResult, AuthenticatedUser } from "@/lib/auth/types";

const apiBaseUrl = process.env.ECOPICKUP_API_BASE_URL;

function requireApiBaseUrl() {
  if (!apiBaseUrl) {
    throw new Error("ECOPICKUP_API_BASE_URL is required to enable frontend auth.");
  }

  return apiBaseUrl;
}

export async function loginWithApi(email: string, password: string) {
  const response = await fetch(`${requireApiBaseUrl()}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });

  if (!response.ok) {
    return {
      ok: false as const,
      error:
        response.status === 401
          ? "Invalid email or password."
          : "Could not complete login right now."
    };
  }

  const session = (await response.json()) as AuthTokenResult;

  return {
    ok: true as const,
    session: {
      accessToken: session.accessToken,
      tokenType: session.tokenType,
      expiresAtUtc: session.expiresAtUtc,
      user: session.user
    }
  };
}

export async function registerWithApi(email: string, password: string) {
  const response = await fetch(`${requireApiBaseUrl()}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });

  if (!response.ok) {
    return {
      ok: false as const,
      error:
        response.status === 409
          ? "This email is already registered."
          : "Could not complete registration right now."
    };
  }

  const user = (await response.json()) as AuthenticatedUser;

  return {
    ok: true as const,
    user
  };
}

export async function getCurrentUserFromApi(accessToken: string) {
  const response = await fetch(`${requireApiBaseUrl()}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AuthenticatedUser;
}
