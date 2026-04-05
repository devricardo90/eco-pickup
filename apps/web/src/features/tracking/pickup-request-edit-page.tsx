import { PickupRequestForm } from "@/components/pickup-request-form";
import { PickupRequestTrackingState } from "@/components/pickup-request-tracking-state";
import { updatePickupRequestAction } from "@/lib/auth/actions";
import { requireSession } from "@/lib/auth/session";
import { getPickupRequestDetail } from "@/lib/tracking/getPickupRequestDetail";
import { isPickupRequestEditable } from "@/lib/tracking/isPickupRequestEditable";

type PickupRequestEditPageProps = {
  requestId: string;
};

function toDateInputValue(value: string) {
  return value.slice(0, 10);
}

function toTimeInputValue(value: string) {
  return value.slice(11, 16);
}

export async function PickupRequestEditPage({ requestId }: PickupRequestEditPageProps) {
  const session = await requireSession();
  const detailResult = await getPickupRequestDetail(requestId, "owner", session.accessToken);

  if (!detailResult.ok) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <PickupRequestTrackingState
            title={detailResult.kind === "not-found" ? "Pickup request not found" : "Could not load pickup request"}
            message={detailResult.message}
            tone={detailResult.kind === "request" ? "error" : "info"}
          />
        </div>
      </main>
    );
  }

  if (!isPickupRequestEditable(detailResult.data.status)) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <PickupRequestTrackingState
            title="Editing unavailable"
            message="This request has already entered operational flow. Editing is only available while the request remains in draft."
            tone="info"
          />
        </div>
      </main>
    );
  }

  const action = updatePickupRequestAction.bind(null, requestId);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <PickupRequestForm
          action={action}
          initialValues={{
            description: detailResult.data.description,
            pickupWindowDate: toDateInputValue(detailResult.data.pickupWindowStartUtc),
            pickupWindowStartTime: toTimeInputValue(detailResult.data.pickupWindowStartUtc),
            pickupWindowEndTime: toTimeInputValue(detailResult.data.pickupWindowEndUtc),
            street: detailResult.data.address.street,
            city: detailResult.data.address.city,
            postalCode: detailResult.data.address.postalCode,
            floor: detailResult.data.address.floor ?? "",
            hasElevator: detailResult.data.address.hasElevator,
            accessNotes: detailResult.data.address.accessNotes ?? "",
            items: detailResult.data.items.map((item) => ({
              category: item.category,
              description: item.description,
              estimatedSize: item.estimatedSize
            }))
          }}
          mode="edit"
        />
      </div>
    </main>
  );
}
