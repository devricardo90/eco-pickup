import { ui } from "@/components/ui-primitives";
import type { PickupRequestMetadataEntry } from "@/lib/tracking/types";

type PickupRequestMetadataProps = {
  entries: PickupRequestMetadataEntry[];
};

export function PickupRequestMetadata({ entries }: PickupRequestMetadataProps) {
  return (
    <section className={ui.surface}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">Request details</h2>
      <dl className="mt-6 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <div
            className={ui.mutedSurface}
            key={`${entry.label}:${entry.value}`}
          >
            <dt className={ui.metricLabel}>
              {entry.label}
            </dt>
            <dd className={ui.metricValue}>{entry.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
