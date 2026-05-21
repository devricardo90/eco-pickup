import Link from "next/link";
import { statusBadgeClassName, ui } from "@/components/ui-primitives";
import type { PickupRequestListCardUi } from "@/lib/tracking/types";

type PickupRequestListCardProps = {
  item: PickupRequestListCardUi;
};

export function PickupRequestListCard({ item }: PickupRequestListCardProps) {
  return (
    <Link
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[var(--shadow-md)]"
      href={item.href}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className={ui.metricLabel}>
            Pickup request
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{item.title}</h2>
          <p className="text-sm text-slate-600">{item.itemSummary}</p>
        </div>
        <span className={`w-fit rounded-full border px-3 py-1.5 text-sm font-semibold ${statusBadgeClassName(item.statusLabel)}`}>
          {item.statusLabel}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div>
          <p className={ui.metricLabel}>Reference</p>
          <p className={`${ui.metricValue} break-all`}>{item.id}</p>
        </div>
        <div>
          <p className={ui.metricLabel}>Created</p>
          <p className={ui.metricValue}>{item.createdLabel}</p>
        </div>
        <div>
          <p className={ui.metricLabel}>Requested window</p>
          <p className={ui.metricValue}>{item.pickupWindowLabel}</p>
        </div>
        <div>
          <p className={ui.metricLabel}>Quote</p>
          <p className={ui.metricValue}>{item.priceSummary ?? "Not quoted yet"}</p>
        </div>
      </div>
    </Link>
  );
}
