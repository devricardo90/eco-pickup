import { PickupRequestMetadata } from "@/components/pickup-request-metadata";
import { PickupRequestStatusCard } from "@/components/pickup-request-status-card";
import { PickupRequestSummary } from "@/components/pickup-request-summary";
import { PickupRequestTimeline } from "@/components/pickup-request-timeline";
import { PickupRequestTrackingState } from "@/components/pickup-request-tracking-state";
import { requireSession } from "@/lib/auth/session";
import { getPickupRequestDetail } from "@/lib/tracking/getPickupRequestDetail";
import { getPickupRequestHistory } from "@/lib/tracking/getPickupRequestHistory";
import {
  mapPickupRequestMetadataToUi,
  mapPickupRequestSummaryToUi
} from "@/lib/tracking/mapPickupRequestDetailToUi";
import { mapStatusLabel, mapTimelineEventToUi } from "@/lib/tracking/mapTimelineEventToUi";
import type { HistoryScope } from "@/lib/tracking/types";

type PickupRequestDetailPageProps = {
  requestId: string;
  scope: HistoryScope;
};

const scopeCopy: Record<HistoryScope, { badge: string; title: string; description: string }> = {
  owner: {
    badge: "Owner detail",
    title: "Pickup request detail",
    description:
      "Track the request through one authenticated surface with the current status, timeline and the most relevant request metadata."
  },
  admin: {
    badge: "Admin detail",
    title: "Operational pickup detail",
    description:
      "Review the same request composition from the administrative surface without opening new operational actions."
  }
};

export async function PickupRequestDetailPage({ requestId, scope }: PickupRequestDetailPageProps) {
  const session = await requireSession(scope === "admin" ? "ADMIN" : undefined);
  const [detailResult, historyResult] = await Promise.all([
    getPickupRequestDetail(requestId, scope, session.accessToken),
    getPickupRequestHistory(requestId, scope, session.accessToken)
  ]);
  const copy = scopeCopy[scope];

  if (!detailResult.ok) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <PickupRequestTrackingState
            title={detailResult.kind === "not-found" ? "Pickup request not found" : "Could not load pickup request"}
            message={detailResult.message}
            tone={detailResult.kind === "request" ? "error" : "info"}
          />
        </div>
      </main>
    );
  }

  const timelineEvents = historyResult.ok
    ? historyResult.data.events.map((event) => mapTimelineEventToUi(event, scope))
    : [];
  const lastUpdatedLabel = historyResult.ok && historyResult.data.events.length > 0
    ? mapTimelineEventToUi(historyResult.data.events[historyResult.data.events.length - 1], scope).createdLabel
    : "No updates yet";
  const summary = mapPickupRequestSummaryToUi(detailResult.data, lastUpdatedLabel);
  const metadataEntries = mapPickupRequestMetadataToUi(detailResult.data);

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

        <PickupRequestSummary summary={summary} />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PickupRequestMetadata entries={metadataEntries} />
          <PickupRequestStatusCard
            currentStatus={mapStatusLabel(detailResult.data.status)}
            lastUpdatedLabel={lastUpdatedLabel}
            totalEvents={historyResult.ok ? historyResult.data.events.length : 0}
          />
        </div>

        {historyResult.ok ? (
          <PickupRequestTimeline events={timelineEvents} />
        ) : (
          <PickupRequestTrackingState
            title={historyResult.kind === "not-found" ? "Timeline not found" : "Could not load timeline"}
            message={historyResult.message}
            tone={historyResult.kind === "request" ? "error" : "info"}
          />
        )}
      </div>
    </main>
  );
}
