import Link from "next/link";
import { PickupRequestList } from "@/components/pickup-request-list";
import { PickupRequestTrackingState } from "@/components/pickup-request-tracking-state";
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
      "Review your active and historical pickup requests, then open the authenticated detail surface for status, metadata and timeline.",
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
            <div className="mt-6">
              <Link
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
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
