import Link from "next/link";
import { PickupRequestMetadata } from "@/components/pickup-request-metadata";
import { PickupRequestPaymentCard } from "@/components/pickup-request-payment-card";
import { PickupRequestPricingCard } from "@/components/pickup-request-pricing-card";
import { PickupRequestSchedulingCard } from "@/components/pickup-request-scheduling-card";
import { PickupRequestStatusCard } from "@/components/pickup-request-status-card";
import { PickupRequestSubmitForm } from "@/components/pickup-request-submit-form";
import { PickupRequestSummary } from "@/components/pickup-request-summary";
import { PickupRequestTimeline } from "@/components/pickup-request-timeline";
import { PickupRequestTrackingState } from "@/components/pickup-request-tracking-state";
import { createPaymentSessionAction, submitPickupRequestAction } from "@/lib/auth/actions";
import { requireSession } from "@/lib/auth/session";
import { getPickupRequestDetail } from "@/lib/tracking/getPickupRequestDetail";
import { getPickupRequestHistory } from "@/lib/tracking/getPickupRequestHistory";
import { isPickupRequestEditable } from "@/lib/tracking/isPickupRequestEditable";
import {
  mapPickupRequestMetadataToUi,
  mapPickupRequestPaymentToUi,
  mapPickupRequestPricingToUi,
  mapPickupRequestSchedulingToUi,
  mapPickupRequestSummaryToUi
} from "@/lib/tracking/mapPickupRequestDetailToUi";
import { mapStatusLabel, mapTimelineEventToUi } from "@/lib/tracking/mapTimelineEventToUi";
import type { HistoryScope } from "@/lib/tracking/types";

type PickupRequestDetailPageProps = {
  requestId: string;
  scope: HistoryScope;
  notice?: string | null;
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

export async function PickupRequestDetailPage({ requestId, scope, notice }: PickupRequestDetailPageProps) {
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
  const pricing = scope === "owner" ? mapPickupRequestPricingToUi(detailResult.data) : null;
  const payment = scope === "owner" ? mapPickupRequestPaymentToUi(detailResult.data) : null;
  const scheduling = scope === "owner" ? mapPickupRequestSchedulingToUi(detailResult.data) : null;
  const canEdit = scope === "owner" && isPickupRequestEditable(detailResult.data.status);
  const submitAction = scope === "owner" ? submitPickupRequestAction.bind(null, requestId) : null;
  const paymentAction = scope === "owner" ? createPaymentSessionAction.bind(null, requestId) : null;

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
          {scope === "owner" ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {canEdit ? (
                <>
                  <Link
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href={`/tracking/${requestId}/edit`}
                  >
                    Edit request
                  </Link>
                  {submitAction ? <PickupRequestSubmitForm action={submitAction} /> : null}
                </>
              ) : (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  This request has already been submitted or entered operational review. Editing is now locked.
                </p>
              )}
            </div>
          ) : null}
        </section>

        {notice ? (
          <section className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-950 shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
            {notice}
          </section>
        ) : null}

        <PickupRequestSummary summary={summary} />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PickupRequestMetadata entries={metadataEntries} />
          <PickupRequestStatusCard
            currentStatus={mapStatusLabel(detailResult.data.status)}
            lastUpdatedLabel={lastUpdatedLabel}
            totalEvents={historyResult.ok ? historyResult.data.events.length : 0}
          />
        </div>

        {pricing ? <PickupRequestPricingCard pricing={pricing} /> : null}

        {payment ? <PickupRequestPaymentCard action={paymentAction} payment={payment} /> : null}

        {scheduling ? <PickupRequestSchedulingCard scheduling={scheduling} /> : null}

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
