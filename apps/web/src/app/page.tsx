import Link from "next/link";
import { LogoutForm } from "@/components/logout-form";
import { SessionSummary } from "@/components/session-summary";
import { getSession } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(55,94,47,0.12)] backdrop-blur sm:p-12">
          <span className="inline-flex rounded-full border border-emerald-900/10 bg-emerald-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-950">
            Sustainable Collection
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 text-balance sm:text-5xl">
            Your solution for conscious and sustainable disposal.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            EcoPickup connects you with collection services for recycling and repurposing items in a simple, transparent, and efficient way.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {session ? (
              <>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-slate-800"
                  href="/requests/new"
                >
                  Request collection
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-900/15 bg-emerald-50 px-6 py-3 text-base font-semibold text-emerald-950 transition hover:border-emerald-900/30"
                  href="/requests"
                >
                  My requests
                </Link>
                {session.user.role === "ADMIN" ? (
                  <Link
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-slate-400"
                    href="/admin/requests"
                  >
                    Admin Dashboard
                  </Link>
                ) : null}
                <div className="ml-2">
                  <LogoutForm />
                </div>
              </>
            ) : (
              <>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-slate-800"
                  href="/auth/register"
                >
                  Get started
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                  href="/auth/login"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/50 bg-white/40 p-8 backdrop-blur">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">1</div>
            <h3 className="text-xl font-semibold text-slate-950">Request</h3>
            <p className="mt-2 text-slate-600">
              Describe the items you wish to dispose of and provide the collection location quickly.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/50 bg-white/40 p-8 backdrop-blur">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">2</div>
            <h3 className="text-xl font-semibold text-slate-950">Evaluation</h3>
            <p className="mt-2 text-slate-600">
              Our team evaluates your request, defines the pricing, and schedules the best date for you.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/50 bg-white/40 p-8 backdrop-blur">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">3</div>
            <h3 className="text-xl font-semibold text-slate-950">Track</h3>
            <p className="mt-2 text-slate-600">
              Follow the progress in real-time through a transparent timeline until completion.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Why use EcoPickup?
            </h2>
            <ul className="mt-6 space-y-4 text-base leading-7 text-slate-200">
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Transparency:</strong> Track every stage of your request in real-time.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Convenience:</strong> Schedule the collection at the time that works best for you.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Sustainability:</strong> Ensure your items have the correct and sustainable destination.</span>
              </li>
            </ul>
          </article>

          <SessionSummary session={session} />
        </section>
      </div>
    </main>
  );
}
