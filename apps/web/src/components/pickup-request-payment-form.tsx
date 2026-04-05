"use client";

import { useActionState } from "react";
import type { PickupRequestFormActionState } from "@/lib/auth/types";

type PickupRequestPaymentFormProps = {
  action: (state: PickupRequestFormActionState, formData: FormData) => Promise<PickupRequestFormActionState>;
  label: string;
};

const initialState: PickupRequestFormActionState = {};

export function PickupRequestPaymentForm({ action, label }: PickupRequestPaymentFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {state.error}
        </p>
      ) : null}
      <button
        className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Opening checkout..." : label}
      </button>
    </form>
  );
}
