import { PickupRequestListCard } from "@/components/pickup-request-list-card";
import type { PickupRequestListCardUi } from "@/lib/tracking/types";

type PickupRequestListProps = {
  items: PickupRequestListCardUi[];
  emptyTitle: string;
  emptyMessage: string;
};

export function PickupRequestList({ items, emptyTitle, emptyMessage }: PickupRequestListProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 shadow-[var(--shadow-xs)]">
        <h2 className="text-lg font-semibold text-slate-950">{emptyTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {items.map((item) => (
        <PickupRequestListCard item={item} key={item.id} />
      ))}
    </section>
  );
}
