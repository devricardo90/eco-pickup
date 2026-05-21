import { statusBadgeClassName, ui } from "@/components/ui-primitives";

type PickupRequestStatusCardProps = {
  currentStatus: string;
  lastUpdatedLabel: string;
  totalEvents: number;
};

export function PickupRequestStatusCard({
  currentStatus,
  lastUpdatedLabel,
  totalEvents
}: PickupRequestStatusCardProps) {
  return (
    <section className={ui.surface}>
      <span className={ui.eyebrow}>
        Current status
      </span>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <p className={ui.metricLabel}>
            Status
          </p>
          <span className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${statusBadgeClassName(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>
        <div>
          <p className={ui.metricLabel}>
            Last update
          </p>
          <p className={ui.metricValue}>{lastUpdatedLabel}</p>
          <p className="mt-1 text-xs text-slate-500">{totalEvents} timeline event(s)</p>
        </div>
      </div>
    </section>
  );
}
