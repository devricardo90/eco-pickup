import Link from "next/link";
import { ItemPhotoUploadForm } from "@/components/item-photo-upload-form";
import { PickupRequestExecutionCard } from "@/components/pickup-request-execution-card";
import { PickupRequestLifecycleCard } from "@/components/pickup-request-lifecycle-card";
import { PickupRequestMetadata } from "@/components/pickup-request-metadata";
import { PickupRequestPaymentCard } from "@/components/pickup-request-payment-card";
import { PickupRequestPricingCard } from "@/components/pickup-request-pricing-card";
import { PickupRequestSchedulingCard } from "@/components/pickup-request-scheduling-card";
import { PickupRequestStatusCard } from "@/components/pickup-request-status-card";
import { PickupRequestSubmitForm } from "@/components/pickup-request-submit-form";
import { PickupRequestSummary } from "@/components/pickup-request-summary";
import { PickupRequestTimeline } from "@/components/pickup-request-timeline";
import { PickupRequestTrackingState } from "@/components/pickup-request-tracking-state";
import { ui } from "@/components/ui-primitives";
import { createPaymentSessionAction, submitPickupRequestAction, uploadItemPhotoAction } from "@/lib/auth/actions";
import { requireSession } from "@/lib/auth/session";
import { getPickupRequestDetail } from "@/lib/tracking/getPickupRequestDetail";
import { getPickupRequestHistory } from "@/lib/tracking/getPickupRequestHistory";
import { isPickupRequestEditable, isPickupRequestPhotoUploadAllowed } from "@/lib/tracking/isPickupRequestEditable";
import {
  mapPickupRequestExecutionToUi,
  mapPickupRequestLifecycleToUi,
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
      <main className={ui.pageShell}>
        <div className={ui.container}>
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
  const execution = scope === "owner" ? mapPickupRequestExecutionToUi(detailResult.data) : null;
  const lifecycle = scope === "owner" ? mapPickupRequestLifecycleToUi(detailResult.data) : null;
  const canEdit = scope === "owner" && isPickupRequestEditable(detailResult.data.status);
  const canUploadPhotos = scope === "owner" && isPickupRequestPhotoUploadAllowed(detailResult.data.status);
  const submitAction = scope === "owner" ? submitPickupRequestAction.bind(null, requestId) : null;
  const paymentAction = scope === "owner" ? createPaymentSessionAction.bind(null, requestId) : null;

  return (
    <main className={ui.pageShell}>
      <div className={ui.container}>
        <section className={ui.heroPanel}>
          <span className={ui.eyebrow}>
            {copy.badge}
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{copy.description}</p>
          {scope === "owner" ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {canEdit ? (
                <>
                  <Link
                    className={ui.primaryButton}
                    href={`/tracking/${requestId}/edit`}
                  >
                    Edit request
                  </Link>
                  {submitAction ? <PickupRequestSubmitForm action={submitAction} /> : null}
                </>
              ) : (
                <p className={ui.noticeWarning}>
                  This request has already been submitted or entered operational review. Editing is now locked.
                </p>
              )}
            </div>
          ) : null}
        </section>

        {notice ? (
          <section className={ui.noticeSuccess}>
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

        {canUploadPhotos && detailResult.data.items.length > 0 ? (
          <section className={ui.surface}>
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">Item photos</h2>
            <p className="mt-1 text-sm text-slate-600">
              Attach photos to help the team assess each item. Up to 5 photos per item — JPEG, PNG or WebP, max 10 MB each.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {detailResult.data.items.map((item) => {
                const boundAction = uploadItemPhotoAction.bind(null, requestId, item.id);
                return (
                  <ItemPhotoUploadForm
                    action={boundAction}
                    category={item.category}
                    key={item.id}
                    photoCount={item.photos.length}
                  />
                );
              })}
            </div>
          </section>
        ) : null}

        {pricing ? <PickupRequestPricingCard pricing={pricing} /> : null}

        {payment ? <PickupRequestPaymentCard action={paymentAction} payment={payment} /> : null}

        {scheduling ? <PickupRequestSchedulingCard scheduling={scheduling} /> : null}

        {execution ? <PickupRequestExecutionCard execution={execution} /> : null}

        {lifecycle ? <PickupRequestLifecycleCard lifecycle={lifecycle} /> : null}

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
