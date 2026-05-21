import Link from "next/link";
import { PickupRequestList } from "@/components/pickup-request-list";
import { PickupRequestTrackingState } from "@/components/pickup-request-tracking-state";
import { ui } from "@/components/ui-primitives";
import { requireSession } from "@/lib/auth/session";
import { getPickupRequestList } from "@/lib/tracking/getPickupRequestList";
import { mapPickupRequestListCardToUi } from "@/lib/tracking/mapPickupRequestDetailToUi";
import type { HistoryScope } from "@/lib/tracking/types";

type PickupRequestListPageProps = {
  scope: HistoryScope;
};

const scopeCopy: Record<
  HistoryScope,
  {
    badge: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyMessage: string;
  }
> = {
  owner: {
    badge: "Owner dashboard",
    title: "Your pickup requests",
    description:
      "Review active and historical pickup requests, then open each one for status, details, and timeline.",
    emptyTitle: "No pickup requests yet",
    emptyMessage: "Your requests will appear here as soon as the pickup flow starts creating authenticated requests."
  },
  admin: {
    badge: "Admin dashboard",
    title: "Operational pickup requests",
    description:
      "Review the current request queue and open the authenticated administrative detail surface without adding new operational mutations here.",
    emptyTitle: "No pickup requests available",
    emptyMessage: "The admin queue is empty right now."
  }
};

export async function PickupRequestListPage({ scope }: PickupRequestListPageProps) {
  const session = await requireSession(scope === "admin" ? "ADMIN" : undefined);
  const result = await getPickupRequestList(scope, session.accessToken);
  const copy = scopeCopy[scope];

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
            <div className="mt-6">
              <Link
                className={ui.primaryButton}
                href="/requests/new"
              >
                Create pickup request
              </Link>
            </div>
          ) : null}
        </section>

        {!result.ok ? (
          <PickupRequestTrackingState
            title="Could not load pickup requests"
            message={result.message}
            tone={result.kind === "request" ? "error" : "info"}
          />
        ) : (
          <PickupRequestList
            emptyMessage={copy.emptyMessage}
            emptyTitle={copy.emptyTitle}
            items={result.data.map((item) => mapPickupRequestListCardToUi(item, scope))}
          />
        )}
      </div>
    </main>
  );
}
