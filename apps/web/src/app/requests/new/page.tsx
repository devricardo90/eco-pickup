import { PickupRequestForm } from "@/components/pickup-request-form";
import { createPickupRequestAction } from "@/lib/auth/actions";
import { requireSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function NewPickupRequestPage() {
  await requireSession();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <PickupRequestForm action={createPickupRequestAction} mode="create" />
      </div>
    </main>
  );
}
