"use client";

import { useActionState } from "react";
import { ui } from "@/components/ui-primitives";
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
        <p className={ui.noticeError}>
          {state.error}
        </p>
      ) : null}
      <button
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-xs)] transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Opening checkout..." : label}
      </button>
    </form>
  );
}
