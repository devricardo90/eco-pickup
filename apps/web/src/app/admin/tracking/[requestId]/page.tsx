import { PickupRequestTrackingPage } from "@/features/tracking/pickup-request-tracking-page";

export const dynamic = "force-dynamic";

export default async function AdminTrackingPage({
  params
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  return <PickupRequestTrackingPage requestId={requestId} scope="admin" />;
}
