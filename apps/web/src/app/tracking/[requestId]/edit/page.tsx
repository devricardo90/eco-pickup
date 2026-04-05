import { PickupRequestEditPage } from "@/features/tracking/pickup-request-edit-page";

export const dynamic = "force-dynamic";

export default async function EditTrackingPage({
  params
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  return <PickupRequestEditPage requestId={requestId} />;
}
