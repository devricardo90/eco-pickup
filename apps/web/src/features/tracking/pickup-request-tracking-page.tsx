import { PickupRequestStatusCard } from "@/components/pickup-request-status-card";
import { PickupRequestTimeline } from "@/components/pickup-request-timeline";
import { PickupRequestTrackingState } from "@/components/pickup-request-tracking-state";
import { getPickupRequestHistory } from "@/lib/tracking/getPickupRequestHistory";
import { mapStatusLabel, mapTimelineEventToUi } from "@/lib/tracking/mapTimelineEventToUi";
import type { HistoryScope } from "@/lib/tracking/types";

type PickupRequestTrackingPageProps = {
  requestId: string;
  scope: HistoryScope;
};

const scopeCopy: Record<HistoryScope, { badge: string; title: string; description: string }> = {
  owner: {
    badge: "Owner tracking",
    title: "Pickup request tracking",
    description:
      "Follow the current request status and the timeline of relevant operational events without opening new actions."
  },
  admin: {
    badge: "Admin tracking",
    title: "Operational request timeline",
    description:
      "Review the same persisted history from the administrative perspective, still as a read-only tracking surface."
  }
};

export async function PickupRequestTrackingPage({
  requestId,
  scope
}: PickupRequestTrackingPageProps) {
  const historyResult = await getPickupRequestHistory(requestId, scope);
  const copy = scopeCopy[scope];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(55,94,47,0.12)] backdrop-blur">
          <span className="inline-flex rounded-full border border-emerald-900/10 bg-emerald-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-950">
            {copy.badge}
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-slate-950">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{copy.description}</p>
        </section>

        {!historyResult.ok ? (
          <PickupRequestTrackingState
            title={
              historyResult.kind === "not-found"
                ? "Tracking history not found"
                : historyResult.kind === "configuration"
                  ? "Tracking is not configured"
                  : "Could not load tracking history"
            }
            message={historyResult.message}
            tone={historyResult.kind === "request" ? "error" : "info"}
          />
        ) : (
          <>
            <PickupRequestStatusCard
              requestId={historyResult.data.pickupRequestId}
              currentStatus={mapStatusLabel(historyResult.data.currentStatus)}
              lastUpdatedLabel={
                historyResult.data.events.length > 0
                  ? mapTimelineEventToUi(historyResult.data.events[historyResult.data.events.length - 1], scope)
                      .createdLabel
                  : "No updates yet"
              }
              totalEvents={historyResult.data.events.length}
            />
            <PickupRequestTimeline
              events={historyResult.data.events.map((event) => mapTimelineEventToUi(event, scope))}
            />
          </>
        )}
      </div>
    </main>
  );
}
