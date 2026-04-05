import { PickupRequestListPage } from "@/features/tracking/pickup-request-list-page";

export const dynamic = "force-dynamic";

export default function RequestsPage() {
  return <PickupRequestListPage scope="owner" />;
}
