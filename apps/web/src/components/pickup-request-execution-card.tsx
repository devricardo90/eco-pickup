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
    <section className={`rounded-[1.75rem] border p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] ${toneClassNames[execution.tone]}`}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{execution.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">{execution.description}</p>

      {execution.highlightLabel ? (
        <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-white/90 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Operational window</p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{execution.highlightLabel}</p>
        </div>
      ) : null}
    </section>
  );
}
