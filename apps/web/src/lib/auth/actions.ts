"use server";

import { redirect } from "next/navigation";
import { clearSession, getSession, setSession } from "@/lib/auth/session";
import { createPickupRequest } from "@/lib/tracking/createPickupRequest";
import { submitPickupRequest } from "@/lib/tracking/submitPickupRequest";
import { updatePickupRequest } from "@/lib/tracking/updatePickupRequest";
import { buildPickupRequestPayload } from "@/lib/tracking/createPickupRequestPayload";
import type { AuthActionState, PickupRequestFormActionState } from "@/lib/auth/types";
import { loginWithApi, registerWithApi } from "@/lib/auth/api";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readStringList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim());
}

function readPickupRequestForm(formData: FormData) {
  const itemCategories = readStringList(formData, "itemCategory[]");
  const itemDescriptions = readStringList(formData, "itemDescription[]");
  const itemEstimatedSizes = readStringList(formData, "itemEstimatedSize[]");

  return {
    description: readString(formData, "description"),
    pickupWindowDate: readString(formData, "pickupWindowDate"),
    pickupWindowStartTime: readString(formData, "pickupWindowStartTime"),
    pickupWindowEndTime: readString(formData, "pickupWindowEndTime"),
    street: readString(formData, "street"),
    city: readString(formData, "city"),
    postalCode: readString(formData, "postalCode"),
    floor: readString(formData, "floor"),
    accessNotes: readString(formData, "accessNotes"),
    hasElevator: formData.get("hasElevator") === "on",
    items: itemCategories.map((category, index) => ({
      category,
      description: itemDescriptions[index] ?? "",
      estimatedSize: itemEstimatedSizes[index] ?? ""
    }))
  };
}

function validatePickupRequestForm(input: ReturnType<typeof readPickupRequestForm>) {
  if (
    !input.description ||
    !input.pickupWindowDate ||
    !input.pickupWindowStartTime ||
    !input.pickupWindowEndTime ||
    !input.street ||
    !input.city ||
    !input.postalCode ||
    input.items.length === 0 ||
    input.items.some((item) => !item.category || !item.description || !item.estimatedSize)
  ) {
    return "Complete the required request, address and item fields before submitting.";
  }

  return null;
}

function readIntent(formData: FormData) {
  const intent = readString(formData, "intent");
  return intent === "submit" ? "submit" : "save";
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
  _previousState: PickupRequestFormActionState,
  formData: FormData
): Promise<PickupRequestFormActionState> {
  const session = await getSession();
  if (!session) {
    return {
      error: "You need an active session before creating a pickup request."
    };
  }

  const input = readPickupRequestForm(formData);
  const intent = readIntent(formData);
  const validationError = validatePickupRequestForm(input);
  if (validationError) {
    return {
      error: validationError
    };
  }

  const result = await createPickupRequest(
    session.accessToken,
    buildPickupRequestPayload(input)
  );

  if (!result.ok) {
    return {
      error: result.error
    };
  }

  if (intent === "submit") {
    const submitResult = await submitPickupRequest(result.data.id, session.accessToken);

    if (!submitResult.ok) {
      return {
        error: submitResult.error
      };
    }

    redirect(`/tracking/${submitResult.data.id}?submitted=1`);
  }

  redirect(`/tracking/${result.data.id}?saved=1`);
}

export async function updatePickupRequestAction(
  requestId: string,
  _previousState: PickupRequestFormActionState,
  formData: FormData
): Promise<PickupRequestFormActionState> {
  const session = await getSession();
  if (!session) {
    return {
      error: "You need an active session before editing a pickup request."
    };
  }

  const input = readPickupRequestForm(formData);
  const intent = readIntent(formData);
  const validationError = validatePickupRequestForm(input);
  if (validationError) {
    return {
      error: validationError
    };
  }

  const result = await updatePickupRequest(requestId, session.accessToken, buildPickupRequestPayload(input));

  if (!result.ok) {
    return {
      error: result.error
    };
  }

  if (intent === "submit") {
    const submitResult = await submitPickupRequest(result.data.id, session.accessToken);

    if (!submitResult.ok) {
      return {
        error: submitResult.error
      };
    }

    redirect(`/tracking/${submitResult.data.id}?submitted=1`);
  }

  redirect(`/tracking/${result.data.id}?saved=1`);
}

export async function submitPickupRequestAction(
  requestId: string,
  _previousState: PickupRequestFormActionState,
  _formData: FormData
): Promise<PickupRequestFormActionState> {
  const session = await getSession();
  if (!session) {
    return {
      error: "You need an active session before submitting a pickup request."
    };
  }

  const result = await submitPickupRequest(requestId, session.accessToken);
  if (!result.ok) {
    return {
      error: result.error
    };
  }

  redirect(`/tracking/${result.data.id}?submitted=1`);
}
