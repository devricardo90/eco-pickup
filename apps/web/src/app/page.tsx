import Link from "next/link";
import { LogoutForm } from "@/components/logout-form";
import { SessionSummary } from "@/components/session-summary";
import { ui } from "@/components/ui-primitives";
import { getSession } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className={ui.pageShell}>
      <div className={ui.container}>
        <section className={`${ui.heroPanel} overflow-hidden`}>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <span className={ui.eyebrow}>Sustainable pickup service</span>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Furniture and bulky-item collection with clear status tracking.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                EcoPickup helps customers request collections, follow review steps, and track each pickup through a simple authenticated timeline.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {session ? (
                  <>
                    <Link className={ui.primaryButton} href="/requests/new">
                      Request collection
                    </Link>
                    <Link className={ui.softButton} href="/requests">
                      My requests
                    </Link>
                    {session.user.role === "ADMIN" ? (
                      <Link className={ui.secondaryButton} href="/admin/requests">
                        Admin dashboard
                      </Link>
                    ) : null}
                    <LogoutForm />
                  </>
                ) : (
                  <>
                    <Link className={ui.primaryButton} href="/auth/register">
                      Get started
                    </Link>
                    <Link className={ui.secondaryButton} href="/auth/login">
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-[var(--shadow-xs)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950">Request timeline</p>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-900">
                    Under review
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {["Request submitted", "Operational review", "Pickup scheduling"].map((step, index) => (
                    <div className="flex gap-3" key={step}>
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{step}</p>
                        <p className="text-xs leading-5 text-slate-500">
                          {index === 2 ? "Next update appears here." : "Visible to the customer."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className={ui.surface}>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-sm font-semibold text-white">1</div>
            <h3 className="text-xl font-semibold text-slate-950">Request</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Describe the items, address, access notes, and preferred collection window.
            </p>
          </div>
          <div className={ui.surface}>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-sm font-semibold text-white">2</div>
            <h3 className="text-xl font-semibold text-slate-950">Review</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The request moves through review, quote, payment, and scheduling states.
            </p>
          </div>
          <div className={ui.surface}>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-sm font-semibold text-white">3</div>
            <h3 className="text-xl font-semibold text-slate-950">Track</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Follow status changes and operational notes from the authenticated detail page.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-slate-50 shadow-[var(--shadow-md)]">
            <h2 className="text-sm font-semibold uppercase text-emerald-300">
              Why use EcoPickup?
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-200">
              <li className="flex gap-3">
                <span className="font-semibold text-emerald-300">OK</span>
                <span><strong>Transparency:</strong> Track every stage of your request in real time.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-emerald-300">OK</span>
                <span><strong>Convenience:</strong> Request a collection with the details the team needs.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-emerald-300">OK</span>
                <span><strong>Sustainability:</strong> Keep reusable items moving toward better destinations.</span>
              </li>
            </ul>
          </article>

          <SessionSummary session={session} />
        </section>
      </div>
    </main>
  );
}
