import { ui } from "@/components/ui-primitives";
import type { PickupRequestPricingUi } from "@/lib/tracking/types";

type PickupRequestPricingCardProps = {
  pricing: PickupRequestPricingUi;
};

const toneClassNames: Record<PickupRequestPricingUi["tone"], string> = {
  pending: "border-slate-200 bg-white",
  quoted: "border-sky-200 bg-sky-50/70",
  awaiting_payment: "border-amber-200 bg-amber-50/80",
  paid: "border-emerald-200 bg-emerald-50/80"
};

export function PickupRequestPricingCard({ pricing }: PickupRequestPricingCardProps) {
  return (
    <section className={`rounded-xl border p-6 shadow-[var(--shadow-sm)] ${toneClassNames[pricing.tone]}`}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{pricing.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">{pricing.description}</p>

      {pricing.totalLabel ? (
        <div className={ui.surfaceTight}>
          <p className={ui.metricLabel}>Current total</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{pricing.totalLabel}</p>
        </div>
      ) : null}

      {pricing.breakdown.length > 0 ? (
        <dl className="mt-6 grid gap-3">
          {pricing.breakdown.map((entry) => (
            <div
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3"
              key={`${entry.label}:${entry.value}`}
            >
              <dt className="text-sm text-slate-600">{entry.label}</dt>
              <dd className="text-sm font-semibold text-slate-950">{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
