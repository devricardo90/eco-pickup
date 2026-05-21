import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { ui } from "@/components/ui-primitives";
import { registerAction } from "@/lib/auth/actions";

export default function RegisterPage() {
  return (
    <main className={ui.pageShell}>
      <div className={ui.narrowContainer}>
        <AuthForm
          action={registerAction}
          description="Create an account to request collections, review details, and track status changes from one dashboard."
          submitLabel="Register"
          title="Create an EcoPickup account"
        />

        <p className="text-sm text-slate-700">
          Already registered?{" "}
          <Link className={ui.link} href="/auth/login">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}
