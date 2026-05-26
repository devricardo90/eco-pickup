import Link from "next/link";
import { statusBadgeClassName, ui } from "@/components/ui-primitives";
import type { PickupRequestListCardUi } from "@/lib/tracking/types";

type PickupRequestListCardProps = {
  item: PickupRequestListCardUi;
};

export function PickupRequestListCard({ item }: PickupRequestListCardProps) {
  return (
    <Link
      className="group block rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-emerald-200/80 hover:shadow-[var(--shadow-md)]"
      href={item.href}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className={ui.metricLabel}>Pickup request</p>
          <h2 className="text-xl font-semibold leading-tight tracking-tight text-slate-950">{item.title}</h2>
          <p className="text-sm text-slate-500">{item.itemSummary}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className={`w-fit rounded-full border px-3 py-1.5 text-sm font-semibold ${statusBadgeClassName(item.statusLabel)}`}>
            {item.statusLabel}
          </span>
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-emerald-500"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-4">
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
