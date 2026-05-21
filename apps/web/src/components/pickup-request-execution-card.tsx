import { ui } from "@/components/ui-primitives";
import type { PickupRequestExecutionUi } from "@/lib/tracking/types";

type PickupRequestExecutionCardProps = {
  execution: PickupRequestExecutionUi;
};

const toneClassNames: Record<PickupRequestExecutionUi["tone"], string> = {
  in_transit: "border-sky-200 bg-sky-50/80",
  collected: "border-emerald-200 bg-emerald-50/80",
  completed: "border-slate-200 bg-white"
};

export function PickupRequestExecutionCard({ execution }: PickupRequestExecutionCardProps) {
  return (
    <section className={`rounded-xl border p-6 shadow-[var(--shadow-sm)] ${toneClassNames[execution.tone]}`}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{execution.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">{execution.description}</p>

      {execution.highlightLabel ? (
        <div className={ui.surfaceTight}>
          <p className={ui.metricLabel}>Operational window</p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{execution.highlightLabel}</p>
        </div>
      ) : null}
    </section>
  );
}
