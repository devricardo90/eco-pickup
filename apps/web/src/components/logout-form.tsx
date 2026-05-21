import { logoutAction } from "@/lib/auth/actions";
import { ui } from "@/components/ui-primitives";

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <button
        className={ui.secondaryButton}
        type="submit"
      >
        Sign out
      </button>
    </form>
  );
}
