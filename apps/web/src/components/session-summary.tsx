import type { AuthSession } from "@/lib/auth/types";
import { ui } from "@/components/ui-primitives";

type SessionSummaryProps = {
  session: AuthSession | null;
};

export function SessionSummary({ session }: SessionSummaryProps) {
  return (
    <article className={ui.surface}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
          <svg aria-hidden="true" className="h-5 w-5 text-emerald-700" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </span>
        <h2 className="text-base font-semibold text-slate-950">
          Your account
        </h2>
      </div>

      {session ? (
        <div className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
          <p>
            Signed in as <span className="font-semibold text-slate-950">{session.user.email}</span>
          </p>
          <div className="flex items-center gap-2">
            <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p className="text-xs font-semibold text-slate-500">Account type: {session.user.role}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          You are not signed in. Sign in to manage your requests and track collections.
        </p>
      )}
    </article>
  );
}
