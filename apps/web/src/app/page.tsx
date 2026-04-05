export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(55,94,47,0.12)] backdrop-blur">
          <span className="inline-flex rounded-full border border-emerald-900/10 bg-emerald-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-950">
            Frontend Foundation
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance">
            EcoPickup web bootstrap is stable and intentionally feature-free.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
            This app now keeps the foundation stable while opening the first real read-only
            product surface: pickup request tracking and timeline visibility.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-6 text-slate-50 shadow-[0_18px_48px_rgba(15,23,42,0.18)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Included now
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
              <li>Next.js 16 App Router foundation</li>
              <li>TypeScript baseline</li>
              <li>Tailwind CSS baseline</li>
              <li>Read-only owner/admin tracking routes backed by the API history endpoints</li>
            </ul>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              Explicitly out of scope
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>Login and session handling in the frontend</li>
              <li>Any operational mutation buttons or retry flows</li>
              <li>Realtime polling, websockets and notifications</li>
              <li>Scheduling, pricing or payment editing from the web app</li>
            </ul>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-emerald-950/10 bg-emerald-50/80 p-6 shadow-[0_18px_48px_rgba(16,85,54,0.08)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-900">
              Tracking surfaces
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-950">
              <li>
                Owner route: <code>/tracking/[requestId]</code>
              </li>
              <li>
                Admin route: <code>/admin/tracking/[requestId]</code>
              </li>
              <li>Both routes stay read-only and reuse the same timeline components.</li>
            </ul>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Required configuration
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>
                <code>ECOPICKUP_API_BASE_URL</code>
              </li>
              <li>
                <code>ECOPICKUP_WEB_OWNER_ACCESS_TOKEN</code>
              </li>
              <li>
                <code>ECOPICKUP_WEB_ADMIN_ACCESS_TOKEN</code>
              </li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
