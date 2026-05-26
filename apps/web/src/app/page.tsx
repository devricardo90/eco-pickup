import Link from "next/link";
import { LogoutForm } from "@/components/logout-form";
import { SessionSummary } from "@/components/session-summary";
import { ui } from "@/components/ui-primitives";
import { getSession } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <>
      {/* Site header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-4 sm:px-6">
          <a className="flex items-center gap-2.5" href="/">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700">
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              </svg>
            </span>
            <span className="text-sm font-bold tracking-tight text-slate-950">EcoPickup</span>
          </a>
          <nav className="flex items-center gap-1 sm:gap-2">
            {session ? (
              <>
                <Link
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  href="/requests"
                >
                  My requests
                </Link>
                {session.user.role === "ADMIN" ? (
                  <Link
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    href="/admin/requests"
                  >
                    Admin
                  </Link>
                ) : null}
              </>
            ) : (
              <>
                <Link
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  href="/auth/login"
                >
                  Sign in
                </Link>
                <Link className={ui.primaryButton} href="/auth/register">
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className={ui.pageShell}>
        <div className={ui.container}>
          {/* Hero */}
          <section className={ui.heroPanel}>
            {/* Decorative background accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-slate-100/80 blur-2xl"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className={ui.eyebrow}>Sustainable pickup service</span>
                <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
                  Furniture and bulky-item collection with clear status tracking.
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
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

              {/* Timeline preview widget — single surface, real vertical timeline */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950">Request timeline</p>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-900">
                    Under review
                  </span>
                </div>
                <ol className="relative mt-5 pl-5">
                  {/* vertical connecting line */}
                  <div
                    aria-hidden="true"
                    className="absolute left-[9px] top-3 h-[calc(100%-1.5rem)] w-px bg-slate-200"
                  />
                  {(
                    [
                      { label: "Request submitted", note: "Received and logged.", state: "done" },
                      { label: "Operational review", note: "Currently in progress.", state: "active" },
                      { label: "Pickup scheduling", note: "Pending prior steps.", state: "pending" },
                    ] as const
                  ).map(({ label, note, state }) => (
                    <li className="relative mb-5 last:mb-0" key={label}>
                      <span
                        className={`absolute -left-5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white ${
                          state === "done"
                            ? "bg-emerald-600"
                            : state === "active"
                              ? "bg-sky-500"
                              : "bg-slate-300"
                        }`}
                        aria-hidden="true"
                      />
                      <p
                        className={`text-sm font-semibold leading-tight ${
                          state === "done"
                            ? "text-slate-900"
                            : state === "active"
                              ? "text-sky-800"
                              : "text-slate-400"
                        }`}
                      >
                        {label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{note}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-500">
              How it works
            </p>
            <div className="grid overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100/80 shadow-[var(--shadow-xs)] gap-px md:grid-cols-3">
              {(
                [
                  {
                    n: "1",
                    title: "Request",
                    body: "Describe the items, address, access notes, and preferred collection window.",
                  },
                  {
                    n: "2",
                    title: "Review",
                    body: "The request moves through review, quote, payment, and scheduling states.",
                  },
                  {
                    n: "3",
                    title: "Track",
                    body: "Follow status changes and operational notes from the authenticated detail page.",
                  },
                ] as const
              ).map(({ n, title, body }) => (
                <div className="bg-white p-6 sm:p-8" key={n}>
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-bold text-emerald-800">
                    {n}
                  </div>
                  <h3 className="text-base font-semibold text-slate-950">
                    {n}. {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why EcoPickup + Session */}
          <section className="grid gap-6 md:grid-cols-2">
            <article className={ui.surface}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
                Why use EcoPickup?
              </h2>
              <ul className="mt-5 space-y-5 text-sm leading-6 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg aria-hidden="true" className="h-3.5 w-3.5 text-emerald-700" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>
                    <strong className="text-slate-900">Transparency:</strong> Track every stage of your request in real time.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg aria-hidden="true" className="h-3.5 w-3.5 text-emerald-700" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>
                    <strong className="text-slate-900">Convenience:</strong> Request a collection with the details the team needs.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg aria-hidden="true" className="h-3.5 w-3.5 text-emerald-700" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>
                    <strong className="text-slate-900">Sustainability:</strong> Keep reusable items moving toward better destinations.
                  </span>
                </li>
              </ul>
            </article>

            <SessionSummary session={session} />
          </section>
        </div>
      </main>
    </>
  );
}
