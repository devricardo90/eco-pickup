import Link from "next/link";
import { LogoutForm } from "@/components/logout-form";
import { SessionSummary } from "@/components/session-summary";
import { getSession } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getSession();

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
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {session ? (
              <>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href="/requests"
                >
                  Open owner dashboard
                </Link>
                {session.user.role === "ADMIN" ? (
                  <Link
                    className="inline-flex items-center justify-center rounded-2xl border border-emerald-900/15 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:border-emerald-900/30"
                    href="/admin/requests"
                  >
                    Open admin dashboard
                  </Link>
                ) : null}
                <LogoutForm />
              </>
            ) : (
              <>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href="/auth/login"
                >
                  Sign in
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                  href="/auth/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
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
              <li>Authenticated owner/admin list dashboards backed by existing list endpoints</li>
              <li>Authenticated owner/admin detail surfaces composed from existing detail + history endpoints</li>
              <li>Frontend auth/session foundation backed by JWT login and HTTP-only cookies</li>
            </ul>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              Explicitly out of scope
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>Any operational mutation buttons or retry flows</li>
              <li>Realtime polling, websockets and notifications</li>
              <li>Scheduling, pricing or payment editing from the web app</li>
            </ul>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-emerald-950/10 bg-emerald-50/80 p-6 shadow-[0_18px_48px_rgba(16,85,54,0.08)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-900">
              Authenticated surfaces
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-950">
              <li>
                Owner dashboard: <code>/requests</code>
              </li>
              <li>
                Admin dashboard: <code>/admin/requests</code>
              </li>
              <li>
                Owner route: <code>/tracking/[requestId]</code>
              </li>
              <li>
                Admin route: <code>/admin/tracking/[requestId]</code>
              </li>
              <li>Dashboard and detail stay read-only and link into the same shared composition.</li>
            </ul>
          </article>

          <SessionSummary session={session} />
        </section>
      </div>
    </main>
  );
}
