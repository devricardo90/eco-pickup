import { PickupRequestDetailPage } from "@/features/tracking/pickup-request-detail-page";
import { getTrackingNotice } from "@/lib/tracking/getTrackingNotice";

export const dynamic = "force-dynamic";

export default async function TrackingPage({
  params,
  searchParams
}: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{ saved?: string; submitted?: string; submitFailed?: string }>;
}) {
  const { requestId } = await params;
  const search = await searchParams;
  return (
    <PickupRequestDetailPage
      notice={getTrackingNotice(search)}
      requestId={requestId}
      scope="owner"
    />
  );
}
