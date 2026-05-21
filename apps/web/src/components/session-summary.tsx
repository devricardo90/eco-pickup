import type { AuthSession } from "@/lib/auth/types";
import { ui } from "@/components/ui-primitives";

type SessionSummaryProps = {
  session: AuthSession | null;
};

export function SessionSummary({ session }: SessionSummaryProps) {
  return (
    <article className={ui.surface}>
      <h2 className="text-sm font-semibold uppercase text-slate-600">
        Your account
      </h2>

      {session ? (
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <p>
            Signed in as <span className="font-semibold text-slate-950">{session.user.email}</span>
          </p>
          <p className="text-xs font-semibold uppercase text-slate-500">Account type: {session.user.role}</p>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-700">
          You are not signed in. Sign in to manage your requests and track collections.
        </p>
      )}
    </article>
  );
}
