"use server";

import { redirect } from "next/navigation";
import { clearSession, getSession, setSession } from "@/lib/auth/session";
import { createPickupRequest } from "@/lib/tracking/createPickupRequest";
import { buildCreatePickupRequestPayload } from "@/lib/tracking/createPickupRequestPayload";
import type { AuthActionState, PickupRequestCreateActionState } from "@/lib/auth/types";
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

export async function createPickupRequestAction(
  _previousState: PickupRequestCreateActionState,
  formData: FormData
): Promise<PickupRequestCreateActionState> {
  const session = await getSession();
  if (!session) {
    return {
      error: "You need an active session before creating a pickup request."
    };
  }

  const description = readString(formData, "description");
  const pickupWindowDate = readString(formData, "pickupWindowDate");
  const pickupWindowStartTime = readString(formData, "pickupWindowStartTime");
  const pickupWindowEndTime = readString(formData, "pickupWindowEndTime");
  const street = readString(formData, "street");
  const city = readString(formData, "city");
  const postalCode = readString(formData, "postalCode");
  const floor = readString(formData, "floor");
  const accessNotes = readString(formData, "accessNotes");
  const itemCategory = readString(formData, "itemCategory");
  const itemDescription = readString(formData, "itemDescription");
  const itemEstimatedSize = readString(formData, "itemEstimatedSize");
  const hasElevator = formData.get("hasElevator") === "on";

  if (
    !description ||
    !pickupWindowDate ||
    !pickupWindowStartTime ||
    !pickupWindowEndTime ||
    !street ||
    !city ||
    !postalCode ||
    !itemCategory ||
    !itemDescription ||
    !itemEstimatedSize
  ) {
    return {
      error: "Complete the required request, address and item fields before submitting."
    };
  }

  const result = await createPickupRequest(
    session.accessToken,
    buildCreatePickupRequestPayload({
      description,
      pickupWindowDate,
      pickupWindowStartTime,
      pickupWindowEndTime,
      street,
      city,
      postalCode,
      floor,
      hasElevator,
      accessNotes,
      itemCategory,
      itemDescription,
      itemEstimatedSize
    })
  );

  if (!result.ok) {
    return {
      error: result.error
    };
  }

  redirect(`/tracking/${result.data.id}`);
}
