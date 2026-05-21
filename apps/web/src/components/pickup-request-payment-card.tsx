import { PickupRequestPaymentForm } from "@/components/pickup-request-payment-form";
import { ui } from "@/components/ui-primitives";
import type { PickupRequestFormActionState } from "@/lib/auth/types";
import type { PickupRequestPaymentUi } from "@/lib/tracking/types";

type PickupRequestPaymentCardProps = {
  payment: PickupRequestPaymentUi;
  action?: ((state: PickupRequestFormActionState, formData: FormData) => Promise<PickupRequestFormActionState>) | null;
};

const toneClassNames: Record<PickupRequestPaymentUi["tone"], string> = {
  awaiting_payment: "border-amber-200 bg-amber-50/80",
  paid: "border-emerald-200 bg-emerald-50/80"
};

export function PickupRequestPaymentCard({ payment, action }: PickupRequestPaymentCardProps) {
  return (
    <section className={`rounded-xl border p-6 shadow-[var(--shadow-sm)] ${toneClassNames[payment.tone]}`}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{payment.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">{payment.description}</p>

      {payment.amountLabel ? (
        <div className={ui.surfaceTight}>
          <p className={ui.metricLabel}>Payment amount</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{payment.amountLabel}</p>
        </div>
      ) : null}

      {payment.actionLabel && action ? (
        <div className="mt-6">
          <PickupRequestPaymentForm action={action} label={payment.actionLabel} />
        </div>
      ) : null}
    </section>
  );
}
