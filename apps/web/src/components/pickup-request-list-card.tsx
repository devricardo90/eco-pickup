import Link from "next/link";
import type { PickupRequestListCardUi } from "@/lib/tracking/types";

type PickupRequestListCardProps = {
  item: PickupRequestListCardUi;
};

export function PickupRequestListCard({ item }: PickupRequestListCardProps) {
  return (
    <Link
      className="block rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-emerald-900/20 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
      href={item.href}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Pickup request
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{item.title}</h2>
          <p className="text-sm text-slate-600">{item.itemSummary}</p>
        </div>
        <div className="rounded-[1.25rem] border border-emerald-900/10 bg-emerald-50 px-4 py-3 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">Status</p>
          <p className="mt-2 text-lg font-semibold text-emerald-950">{item.statusLabel}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reference</p>
          <p className="mt-2 break-all text-sm text-slate-700">{item.id}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Created</p>
          <p className="mt-2 text-sm text-slate-700">{item.createdLabel}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Requested window</p>
          <p className="mt-2 text-sm text-slate-700">{item.pickupWindowLabel}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Quote</p>
          <p className="mt-2 text-sm text-slate-700">{item.priceSummary ?? "Not quoted yet"}</p>
        </div>
      </div>
    </Link>
  );
}
