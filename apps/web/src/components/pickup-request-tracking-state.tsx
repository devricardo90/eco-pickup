type PickupRequestTrackingStateProps = {
  title: string;
  message: string;
  tone?: "error" | "info";
};

export function PickupRequestTrackingState({
  title,
  message,
  tone = "info"
}: PickupRequestTrackingStateProps) {
  const toneClassName =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-950"
      : "border-slate-200 bg-white text-slate-950";

  return (
    <section className={`rounded-xl border p-6 shadow-[var(--shadow-xs)] ${toneClassName}`}>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6">{message}</p>
    </section>
  );
}
