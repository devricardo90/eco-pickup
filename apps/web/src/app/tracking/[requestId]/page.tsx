import { PickupRequestDetailPage } from "@/features/tracking/pickup-request-detail-page";

export const dynamic = "force-dynamic";

export default async function TrackingPage({
  params,
  searchParams
}: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{ updated?: string }>;
}) {
  const { requestId } = await params;
  const { updated } = await searchParams;
  return (
    <PickupRequestDetailPage
      notice={updated === "1" ? "Pickup request updated successfully." : null}
      requestId={requestId}
      scope="owner"
    />
  );
}
