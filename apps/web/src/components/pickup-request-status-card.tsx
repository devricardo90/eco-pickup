type PickupRequestStatusCardProps = {
  requestId: string;
  currentStatus: string;
  lastUpdatedLabel: string;
  totalEvents: number;
};

export function PickupRequestStatusCard({
  requestId,
  currentStatus,
  lastUpdatedLabel,
  totalEvents
}: PickupRequestStatusCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-emerald-950/10 bg-white/90 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <span className="inline-flex rounded-full border border-emerald-900/10 bg-emerald-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-950">
        Current status
      </span>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Pickup request
          </p>
          <p className="mt-2 break-all text-sm text-slate-700">{requestId}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Status
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{currentStatus}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Last update
          </p>
          <p className="mt-2 text-sm text-slate-700">{lastUpdatedLabel}</p>
          <p className="mt-1 text-xs text-slate-500">{totalEvents} timeline event(s)</p>
        </div>
      </div>
    </section>
  );
}
