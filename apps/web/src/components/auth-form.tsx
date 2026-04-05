"use client";

import { useActionState } from "react";
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
    <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(55,94,47,0.12)] backdrop-blur">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-700">{description}</p>

      <form action={formAction} className="mt-8 flex max-w-xl flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <input
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
        </label>

        {state.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {state.error}
          </p>
        ) : null}

        <button
          className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Working..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
