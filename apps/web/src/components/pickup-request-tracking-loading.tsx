import { ui } from "@/components/ui-primitives";

export function PickupRequestTrackingLoading() {
  return (
    <main className={ui.pageShell}>
      <div className={ui.container}>
        <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white" />
        <div className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white" />
        <div className="h-72 animate-pulse rounded-xl border border-slate-800 bg-slate-950/85" />
      </div>
    </main>
  );
}
