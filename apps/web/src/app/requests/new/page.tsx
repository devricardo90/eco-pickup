import { PickupRequestForm } from "@/components/pickup-request-form";
import { ui } from "@/components/ui-primitives";
import { createPickupRequestAction } from "@/lib/auth/actions";
import { requireSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function NewPickupRequestPage() {
  await requireSession();

  return (
    <main className={ui.pageShell}>
      <div className={ui.container}>
        <PickupRequestForm action={createPickupRequestAction} mode="create" />
      </div>
    </main>
  );
}
