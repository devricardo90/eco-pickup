import type { PickupRequestMetadataEntry } from "@/lib/tracking/types";

type PickupRequestMetadataProps = {
  entries: PickupRequestMetadataEntry[];
};

export function PickupRequestMetadata({ entries }: PickupRequestMetadataProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">Request details</h2>
      <dl className="mt-6 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <div
            className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
            key={`${entry.label}:${entry.value}`}
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {entry.label}
            </dt>
            <dd className="mt-2 text-sm leading-6 text-slate-800">{entry.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
