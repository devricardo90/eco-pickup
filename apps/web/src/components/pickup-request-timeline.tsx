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
      <ol className="relative mt-6 pl-6">
        {/* vertical connecting line */}
        <div
          aria-hidden="true"
          className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-slate-200"
        />
        {events.map((event) => (
          <li className="relative mb-5 last:mb-0" key={event.id}>
            {/* dot */}
            <span
              aria-hidden="true"
              className={`absolute -left-6 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white ${
                event.isSystemEvent ? "bg-amber-400" : "bg-emerald-600"
              }`}
            />

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-[var(--shadow-xs)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-950">{event.title}</span>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        event.isSystemEvent
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-emerald-200 bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {event.actorLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{event.transitionLabel}</p>
                  {event.note ? (
                    <p className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-700">
                      {event.note}
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 text-xs font-medium text-slate-400">{event.createdLabel}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
