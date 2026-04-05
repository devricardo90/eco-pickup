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
      <section className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/75 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
        <h2 className="text-lg font-semibold text-slate-950">{emptyTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {items.map((item) => (
        <PickupRequestListCard item={item} key={item.id} />
      ))}
    </section>
  );
}
