import type { AuthSession } from "@/lib/auth/types";

type SessionSummaryProps = {
  session: AuthSession | null;
};

export function SessionSummary({ session }: SessionSummaryProps) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
        Session state
      </h2>

      {session ? (
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <p>
            Signed in as <span className="font-semibold text-slate-950">{session.user.email}</span>
          </p>
          <p>Role: {session.user.role}</p>
          <p>Session expires: {session.expiresAtUtc}</p>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-700">
          No active web session yet. Use the login surface to switch tracking from env tokens to a real authenticated context.
        </p>
      )}
    </article>
  );
}
