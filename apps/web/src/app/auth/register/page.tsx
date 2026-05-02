import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { registerAction } from "@/lib/auth/actions";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AuthForm
          action={registerAction}
          description="Create your EcoPickup account to start requesting sustainable collections for your items today."
          submitLabel="Register"
          title="Create an EcoPickup account"
        />

        <p className="text-sm text-slate-700">
          Already registered?{" "}
          <Link className="font-semibold text-emerald-900 underline decoration-emerald-900/30 underline-offset-4" href="/auth/login">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}
