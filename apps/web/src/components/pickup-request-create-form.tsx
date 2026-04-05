"use client";

import { useActionState } from "react";
import { createPickupRequestAction } from "@/lib/auth/actions";
import type { PickupRequestCreateActionState } from "@/lib/auth/types";

const initialState: PickupRequestCreateActionState = {};

export function PickupRequestCreateForm() {
  const [state, formAction, isPending] = useActionState(createPickupRequestAction, initialState);

  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(55,94,47,0.12)] backdrop-blur">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Create a pickup request</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
        Capture the initial pickup request with one item, address and preferred pickup window. Pricing, scheduling,
        payment and admin actions remain separate slices.
      </p>

      <form action={formAction} className="mt-8 grid gap-8">
        <section className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Request description</span>
              <textarea
                className="min-h-28 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
                name="description"
                placeholder="Describe what needs to be collected and any relevant context."
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Pickup date</span>
            <input className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600" name="pickupWindowDate" required type="date" />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Window start</span>
              <input className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600" name="pickupWindowStartTime" required type="time" />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Window end</span>
              <input className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600" name="pickupWindowEndTime" required type="time" />
            </label>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Street</span>
            <input className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600" name="street" required type="text" />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">City</span>
            <input className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600" name="city" required type="text" />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Postal code</span>
            <input className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600" name="postalCode" required type="text" />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Floor</span>
            <input className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600" name="floor" type="text" />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800">
            <input className="h-4 w-4" defaultChecked name="hasElevator" type="checkbox" />
            Elevator available
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Access notes</span>
            <textarea
              className="min-h-24 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
              name="accessNotes"
              placeholder="Door code, intercom notes or other relevant access details."
            />
          </label>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Item category</span>
            <input className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600" name="itemCategory" placeholder="sofa, wardrobe, table" required type="text" />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Estimated size</span>
            <select className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600" defaultValue="medium" name="itemEstimatedSize">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Item description</span>
            <textarea
              className="min-h-24 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
              name="itemDescription"
              placeholder="Describe the item's condition and the pickup context."
              required
            />
          </label>
        </section>

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
          {isPending ? "Creating..." : "Create pickup request"}
        </button>
      </form>
    </section>
  );
}
