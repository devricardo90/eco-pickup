import { logoutAction } from "@/lib/auth/actions";

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <button
        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
        type="submit"
      >
        Sign out
      </button>
    </form>
  );
}
