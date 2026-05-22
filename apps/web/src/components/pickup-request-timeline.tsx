import { ui } from "@/components/ui-primitives";
import type { TimelineUiEvent } from "@/lib/tracking/types";

type PickupRequestTimelineProps = {
  events: TimelineUiEvent[];
};

export function PickupRequestTimeline({ events }: PickupRequestTimelineProps) {
  if (events.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 shadow-[var(--shadow-xs)]">
        <h2 className="text-lg font-semibold text-slate-950">Timeline</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Still no history is available for this pickup request.
        </p>
      </section>
    );
  }

  return (
    <section className={ui.surface}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">Timeline</h2>
      <ol className="mt-6 space-y-3">
        {events.map((event) => (
          <li
            className="rounded-xl border border-slate-100 bg-slate-50/80 p-5"
            key={event.id}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-base font-semibold text-slate-950">{event.title}</span>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${
                      event.isSystemEvent
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {event.actorLabel}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{event.transitionLabel}</p>
                {event.note ? (
                  <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                    {event.note}
                  </p>
                ) : null}
              </div>
              <p className="shrink-0 text-sm font-medium text-slate-400">{event.createdLabel}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
