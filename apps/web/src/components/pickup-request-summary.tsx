import { statusBadgeClassName, ui } from "@/components/ui-primitives";
import type { PickupRequestSummaryUi } from "@/lib/tracking/types";

type PickupRequestSummaryProps = {
  summary: PickupRequestSummaryUi;
};

export function PickupRequestSummary({ summary }: PickupRequestSummaryProps) {
  return (
    <section className={ui.surface}>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className={ui.metricLabel}>
            Pickup request
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{summary.headline}</h2>
          <p className="text-sm text-slate-600">{summary.itemSummary}</p>
        </div>
        <span className={`w-fit rounded-full border px-3 py-1.5 text-sm font-semibold ${statusBadgeClassName(summary.currentStatus)}`}>
          {summary.currentStatus}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <p className={ui.metricLabel}>Reference</p>
          <p className={`${ui.metricValue} break-all`}>{summary.requestId}</p>
        </div>
        <div>
          <p className={ui.metricLabel}>Created</p>
          <p className={ui.metricValue}>{summary.createdLabel}</p>
        </div>
        <div>
          <p className={ui.metricLabel}>Last update</p>
          <p className={ui.metricValue}>{summary.lastUpdatedLabel}</p>
        </div>
      </div>
    </section>
  );
}
