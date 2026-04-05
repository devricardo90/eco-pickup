import type { PickupRequestSummaryUi } from "@/lib/tracking/types";

type PickupRequestSummaryProps = {
  summary: PickupRequestSummaryUi;
};

export function PickupRequestSummary({ summary }: PickupRequestSummaryProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Pickup request
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{summary.headline}</h2>
          <p className="text-sm text-slate-600">{summary.itemSummary}</p>
        </div>
        <div className="rounded-[1.5rem] border border-emerald-900/10 bg-emerald-50 px-5 py-4 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
            Current status
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-950">{summary.currentStatus}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reference</p>
          <p className="mt-2 break-all text-sm text-slate-700">{summary.requestId}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Created</p>
          <p className="mt-2 text-sm text-slate-700">{summary.createdLabel}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Last update</p>
          <p className="mt-2 text-sm text-slate-700">{summary.lastUpdatedLabel}</p>
        </div>
      </div>
    </section>
  );
}
