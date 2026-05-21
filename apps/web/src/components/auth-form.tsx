"use client";

import { useActionState } from "react";
import { ui } from "@/components/ui-primitives";
import type { AuthActionState } from "@/lib/auth/types";

type AuthFormProps = {
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  title: string;
  description: string;
  submitLabel: string;
};

const initialState: AuthActionState = {};

export function AuthForm({
  action,
  title,
  description,
  submitLabel
}: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <section className={ui.heroPanel}>
      <span className={ui.eyebrow}>Secure access</span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-700">{description}</p>

      <form action={formAction} className="mt-8 flex max-w-xl flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className={ui.label}>Email</span>
          <input
            className={ui.field}
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={ui.label}>Password</span>
          <input
            className={ui.field}
            name="password"
            placeholder="Enter your password"
            required
            type="password"
          />
        </label>

        {state.error ? (
          <p className={ui.noticeError}>
            {state.error}
          </p>
        ) : null}

        <button
          className={ui.primaryButton}
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Working..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
