import { PickupRequestDetailPage } from "@/features/tracking/pickup-request-detail-page";

export const dynamic = "force-dynamic";

export default async function AdminTrackingPage({
  params
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  return <PickupRequestDetailPage requestId={requestId} scope="admin" />;
}
