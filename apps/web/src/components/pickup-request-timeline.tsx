import type { TimelineUiEvent } from "@/lib/tracking/types";

type PickupRequestTimelineProps = {
  events: TimelineUiEvent[];
};

export function PickupRequestTimeline({ events }: PickupRequestTimelineProps) {
  if (events.length === 0) {
    return (
      <section className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/75 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
        <h2 className="text-lg font-semibold text-slate-950">Timeline</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Still no history is available for this pickup request.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-slate-50 shadow-[0_18px_48px_rgba(15,23,42,0.18)]">
      <h2 className="text-lg font-semibold tracking-tight">Timeline</h2>
      <ol className="mt-6 space-y-4">
        {events.map((event) => (
          <li
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
            key={event.id}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-semibold text-white">{event.title}</span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                      event.isSystemEvent
                        ? "bg-amber-300/15 text-amber-100"
                        : "bg-emerald-300/15 text-emerald-100"
                    }`}
                  >
                    {event.actorLabel}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{event.transitionLabel}</p>
                {event.note ? (
                  <p className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm leading-6 text-slate-200">
                    {event.note}
                  </p>
                ) : null}
              </div>
              <p className="text-sm font-medium text-slate-300">{event.createdLabel}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
