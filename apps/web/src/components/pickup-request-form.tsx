"use client";

import { useActionState, useState } from "react";
import type { PickupRequestFormActionState, PickupRequestFormValues } from "@/lib/auth/types";

type PickupRequestFormProps = {
  action: (state: PickupRequestFormActionState, formData: FormData) => Promise<PickupRequestFormActionState>;
  initialValues?: PickupRequestFormValues;
  mode: "create" | "edit";
};

const initialState: PickupRequestFormActionState = {};

const defaultValues: PickupRequestFormValues = {
  description: "",
  pickupWindowDate: "",
  pickupWindowStartTime: "",
  pickupWindowEndTime: "",
  street: "",
  city: "",
  postalCode: "",
  floor: "",
  hasElevator: true,
  accessNotes: "",
  items: [
    {
      category: "",
      description: "",
      estimatedSize: "medium"
    }
  ]
};

export function PickupRequestForm({
  action,
  initialValues = defaultValues,
  mode
}: PickupRequestFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [items, setItems] = useState(initialValues.items);
  const isEdit = mode === "edit";

  function updateItem(index: number, field: "category" | "description" | "estimatedSize", value: string) {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      {
        category: "",
        description: "",
        estimatedSize: "medium"
      }
    ]);
  }

  function removeItem(index: number) {
    setItems((currentItems) => currentItems.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(55,94,47,0.12)] backdrop-blur">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
        {isEdit ? "Edit pickup request" : "Create a pickup request"}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
        {isEdit
          ? "Update the initial pickup request while it is still in draft. Save keeps it in draft; submit sends it to operational review and locks editing."
          : "Capture the initial pickup request with items, address and preferred pickup window. You can save it as draft first or submit it when it is ready for review."}
      </p>

      <form action={formAction} className="mt-8 grid gap-8">
        <section className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Request description</span>
              <textarea
                className="min-h-28 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
                defaultValue={initialValues.description}
                name="description"
                placeholder="Describe what needs to be collected and any relevant context."
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Pickup date</span>
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
              defaultValue={initialValues.pickupWindowDate}
              name="pickupWindowDate"
              required
              type="date"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Window start</span>
              <input
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
                defaultValue={initialValues.pickupWindowStartTime}
                name="pickupWindowStartTime"
                required
                type="time"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Window end</span>
              <input
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
                defaultValue={initialValues.pickupWindowEndTime}
                name="pickupWindowEndTime"
                required
                type="time"
              />
            </label>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Street</span>
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
              defaultValue={initialValues.street}
              name="street"
              required
              type="text"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">City</span>
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
              defaultValue={initialValues.city}
              name="city"
              required
              type="text"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Postal code</span>
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
              defaultValue={initialValues.postalCode}
              name="postalCode"
              required
              type="text"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Floor</span>
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
              defaultValue={initialValues.floor}
              name="floor"
              type="text"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800">
            <input className="h-4 w-4" defaultChecked={initialValues.hasElevator} name="hasElevator" type="checkbox" />
            Elevator available
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Access notes</span>
            <textarea
              className="min-h-24 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
              defaultValue={initialValues.accessNotes}
              name="accessNotes"
              placeholder="Door code, intercom notes or other relevant access details."
            />
          </label>
        </section>

        <section className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">Items</h2>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Add every item that should be part of the request. Photos remain outside this slice.
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-700/20 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
              onClick={addItem}
              type="button"
            >
              Add item
            </button>
          </div>

          <div className="grid gap-5">
            {items.map((item, index) => (
              <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5" key={`item-${index}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Item {index + 1}
                  </h3>
                  {items.length > 1 ? (
                    <button
                      className="text-sm font-semibold text-rose-700 transition hover:text-rose-800"
                      onClick={() => removeItem(index)}
                      type="button"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Item category</span>
                    <input
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
                      name="itemCategory[]"
                      onChange={(event) => updateItem(index, "category", event.target.value)}
                      placeholder="sofa, wardrobe, table"
                      required
                      type="text"
                      value={item.category}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Estimated size</span>
                    <select
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
                      name="itemEstimatedSize[]"
                      onChange={(event) => updateItem(index, "estimatedSize", event.target.value)}
                      value={item.estimatedSize}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">Item description</span>
                    <textarea
                      className="min-h-24 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600"
                      name="itemDescription[]"
                      onChange={(event) => updateItem(index, "description", event.target.value)}
                      placeholder="Describe the item's condition and the pickup context."
                      required
                      value={item.description}
                    />
                  </label>
                </div>
              </section>
            ))}
          </div>
        </section>

        {state.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
            name="intent"
            type="submit"
            value="save"
          >
            {isPending ? "Saving..." : isEdit ? "Save draft changes" : "Save draft"}
          </button>
          <button
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
            name="intent"
            type="submit"
            value="submit"
          >
            {isPending ? "Submitting..." : isEdit ? "Save and submit request" : "Create and submit request"}
          </button>
        </div>
      </form>
    </section>
  );
}
