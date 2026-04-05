import { PickupRequestListPage } from "@/features/tracking/pickup-request-list-page";

export const dynamic = "force-dynamic";

export default function AdminRequestsPage() {
  return <PickupRequestListPage scope="admin" />;
}
