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
    <section className={`rounded-[1.75rem] border p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] ${toneClassNames[scheduling.tone]}`}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{scheduling.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">{scheduling.description}</p>

      {scheduling.confirmedWindowLabel ? (
        <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-white/90 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Confirmed pickup window</p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{scheduling.confirmedWindowLabel}</p>
        </div>
      ) : null}
    </section>
  );
}
