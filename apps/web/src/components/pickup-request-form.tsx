"use client";

import { useActionState, useState } from "react";
import { ui } from "@/components/ui-primitives";
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
    <section className={ui.heroPanel}>
      <span className={ui.eyebrow}>{isEdit ? "Draft request" : "New request"}</span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
        {isEdit ? "Edit pickup request" : "Create a pickup request"}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
        {isEdit
          ? "Update the initial pickup request while it is still in draft. Save keeps it in draft; submit sends it to operational review and locks editing."
          : "Capture the initial pickup request with items, address and preferred pickup window. You can save it as draft first or submit it when it is ready for review."}
      </p>

      <form action={formAction} className="mt-8 grid gap-8">
        <section className="grid gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="flex flex-col gap-2">
              <span className={ui.label}>Request description</span>
              <textarea
                className={ui.textarea}
                defaultValue={initialValues.description}
                name="description"
                placeholder="Describe what needs to be collected and any relevant context."
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className={ui.label}>Pickup date</span>
            <input
              className={ui.field}
              defaultValue={initialValues.pickupWindowDate}
              name="pickupWindowDate"
              required
              type="date"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={ui.label}>Window start</span>
              <input
                className={ui.field}
                defaultValue={initialValues.pickupWindowStartTime}
                name="pickupWindowStartTime"
                required
                type="time"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={ui.label}>Window end</span>
              <input
                className={ui.field}
                defaultValue={initialValues.pickupWindowEndTime}
                name="pickupWindowEndTime"
                required
                type="time"
              />
            </label>
          </div>
        </section>

        <section className="grid gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className={ui.label}>Street</span>
            <input
              className={ui.field}
              defaultValue={initialValues.street}
              name="street"
              required
              type="text"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={ui.label}>City</span>
            <input
              className={ui.field}
              defaultValue={initialValues.city}
              name="city"
              required
              type="text"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={ui.label}>Postal code</span>
            <input
              className={ui.field}
              defaultValue={initialValues.postalCode}
              name="postalCode"
              required
              type="text"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={ui.label}>Floor</span>
            <input
              className={ui.field}
              defaultValue={initialValues.floor}
              name="floor"
              type="text"
            />
          </label>

          <label className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800">
            <input className="h-4 w-4" defaultChecked={initialValues.hasElevator} name="hasElevator" type="checkbox" />
            Elevator available
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className={ui.label}>Access notes</span>
            <textarea
              className={ui.textarea}
              defaultValue={initialValues.accessNotes}
              name="accessNotes"
              placeholder="Door code, intercom notes or other relevant access details."
            />
          </label>
        </section>

        <section className="grid gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">Items</h2>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Add every item that should be part of the pickup request.
              </p>
            </div>
            <button
              className={ui.softButton}
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
                  <h3 className="text-sm font-semibold uppercase text-slate-600">
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
                    <span className={ui.label}>Item category</span>
                    <input
                      className={ui.field}
                      name="itemCategory[]"
                      onChange={(event) => updateItem(index, "category", event.target.value)}
                      placeholder="sofa, wardrobe, table"
                      required
                      type="text"
                      value={item.category}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className={ui.label}>Estimated size</span>
                    <select
                      className={ui.field}
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
                    <span className={ui.label}>Item description</span>
                    <textarea
                      className={ui.textarea}
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
          <p className={ui.noticeError}>
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            className={ui.secondaryButton}
            disabled={isPending}
            name="intent"
            type="submit"
            value="save"
          >
            {isPending ? "Saving..." : isEdit ? "Save draft changes" : "Save draft"}
          </button>
          <button
            className={ui.primaryButton}
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
