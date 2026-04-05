import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { loginAction } from "@/lib/auth/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; registered?: string }>;
}) {
  const { error, registered } = await searchParams;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AuthForm
          action={loginAction}
          description="Start a real web session backed by the existing EcoPickup auth endpoints. Tracking pages will use this authenticated context instead of env tokens."
          submitLabel="Sign in"
          title="Sign in to EcoPickup"
        />

        {registered ? (
          <section className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950 shadow-[0_18px_48px_rgba(16,85,54,0.08)]">
            Registration completed for <span className="font-semibold">{registered}</span>. You can sign in now.
          </section>
        ) : null}

        {error === "forbidden" ? (
          <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950 shadow-[0_18px_48px_rgba(120,53,15,0.08)]">
            Your current account is not allowed to access the requested admin surface.
          </section>
        ) : null}

        <p className="text-sm text-slate-700">
          Need an account?{" "}
          <Link className="font-semibold text-emerald-900 underline decoration-emerald-900/30 underline-offset-4" href="/auth/register">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
