import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { ui } from "@/components/ui-primitives";
import { loginAction } from "@/lib/auth/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; registered?: string }>;
}) {
  const { error, registered } = await searchParams;

  return (
    <main className={ui.pageShell}>
      <div className={ui.narrowContainer}>
        <AuthForm
          action={loginAction}
          description="Sign in to manage pickup requests and follow every status update from your dashboard."
          submitLabel="Sign in"
          title="Sign in to EcoPickup"
        />

        {registered ? (
          <section className={ui.noticeSuccess}>
            Registration completed for <span className="font-semibold">{registered}</span>. You can sign in now.
          </section>
        ) : null}

        {error === "forbidden" ? (
          <section className={ui.noticeWarning}>
            Your current account is not allowed to access the requested admin surface.
          </section>
        ) : null}

        <p className="text-sm text-slate-700">
          Need an account?{" "}
          <Link className={ui.link} href="/auth/register">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
