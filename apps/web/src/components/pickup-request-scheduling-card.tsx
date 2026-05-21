import { ui } from "@/components/ui-primitives";
import type { PickupRequestSchedulingUi } from "@/lib/tracking/types";

type PickupRequestSchedulingCardProps = {
  scheduling: PickupRequestSchedulingUi;
};

const toneClassNames: Record<PickupRequestSchedulingUi["tone"], string> = {
  paid: "border-slate-200 bg-white",
  scheduled: "border-emerald-200 bg-emerald-50/80"
};

export function PickupRequestSchedulingCard({ scheduling }: PickupRequestSchedulingCardProps) {
  return (
    <section className={`rounded-xl border p-6 shadow-[var(--shadow-sm)] ${toneClassNames[scheduling.tone]}`}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{scheduling.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">{scheduling.description}</p>

      {scheduling.confirmedWindowLabel ? (
        <div className={ui.surfaceTight}>
          <p className={ui.metricLabel}>Confirmed pickup window</p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{scheduling.confirmedWindowLabel}</p>
        </div>
      ) : null}
    </section>
  );
}
