"use client";

import { useActionState } from "react";
import { ui } from "@/components/ui-primitives";
import type { PickupRequestFormActionState } from "@/lib/auth/types";

type PickupRequestSubmitFormProps = {
  action: (state: PickupRequestFormActionState, formData: FormData) => Promise<PickupRequestFormActionState>;
};

const initialState: PickupRequestFormActionState = {};

export function PickupRequestSubmitForm({ action }: PickupRequestSubmitFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error ? (
        <p className={ui.noticeError}>
          {state.error}
        </p>
      ) : null}
      <button
        className={ui.accentButton}
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}
