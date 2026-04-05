import { PickupRequestDetailPage } from "@/features/tracking/pickup-request-detail-page";

export const dynamic = "force-dynamic";

export default async function TrackingPage({
  params,
  searchParams
}: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{ saved?: string; submitted?: string }>;
}) {
  const { requestId } = await params;
  const { saved, submitted } = await searchParams;
  return (
    <PickupRequestDetailPage
      notice={
        submitted === "1"
          ? "Pickup request submitted successfully."
          : saved === "1"
            ? "Pickup request saved as draft."
            : null
      }
      requestId={requestId}
      scope="owner"
    />
  );
}
