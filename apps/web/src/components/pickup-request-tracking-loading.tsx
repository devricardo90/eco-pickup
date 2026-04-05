export function PickupRequestTrackingLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="h-40 animate-pulse rounded-[1.75rem] border border-white/60 bg-white/70" />
        <div className="h-72 animate-pulse rounded-[1.75rem] border border-slate-200 bg-slate-950/85" />
      </div>
    </main>
  );
}
