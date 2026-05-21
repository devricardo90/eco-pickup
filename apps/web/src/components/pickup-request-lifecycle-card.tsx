import type { PickupRequestLifecycleUi } from "@/lib/tracking/types";

type PickupRequestLifecycleCardProps = {
  lifecycle: PickupRequestLifecycleUi;
};

const toneClassNames: Record<PickupRequestLifecycleUi["tone"], string> = {
  completed: "border-emerald-200 bg-emerald-50/80",
  cancelled: "border-slate-200 bg-white",
  rejected: "border-rose-200 bg-rose-50/80"
};

export function PickupRequestLifecycleCard({ lifecycle }: PickupRequestLifecycleCardProps) {
  return (
    <section className={`rounded-xl border p-6 shadow-[var(--shadow-sm)] ${toneClassNames[lifecycle.tone]}`}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{lifecycle.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">{lifecycle.description}</p>
    </section>
  );
}
