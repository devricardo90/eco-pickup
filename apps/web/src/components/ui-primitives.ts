export const ui = {
  pageShell: "min-h-screen bg-[var(--page-bg)] px-4 py-8 text-slate-950 sm:px-6 sm:py-10",
  container: "mx-auto flex w-full max-w-[1120px] flex-col gap-6",
  narrowContainer: "mx-auto flex w-full max-w-[760px] flex-col gap-5",
  heroPanel:
    "rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-md)] sm:p-8 lg:p-10",
  surface:
    "rounded-xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6",
  surfaceTight:
    "rounded-lg border border-slate-200 bg-white p-4 shadow-[var(--shadow-xs)]",
  mutedSurface:
    "rounded-lg border border-slate-200 bg-slate-50 p-4",
  eyebrow:
    "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase text-emerald-900",
  label: "text-sm font-semibold text-slate-700",
  field:
    "rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100",
  textarea:
    "min-h-28 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100",
  primaryButton:
    "inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-xs)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70",
  accentButton:
    "inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-xs)] transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70",
  secondaryButton:
    "inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70",
  softButton:
    "inline-flex min-h-10 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70",
  dangerButton:
    "inline-flex min-h-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70",
  link:
    "font-semibold text-emerald-900 underline decoration-emerald-900/30 underline-offset-4 hover:text-emerald-700",
  metricLabel: "text-xs font-semibold uppercase text-slate-500",
  metricValue: "mt-1.5 text-sm leading-6 text-slate-800",
  noticeSuccess:
    "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 shadow-[var(--shadow-xs)]",
  noticeWarning:
    "rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-[var(--shadow-xs)]",
  noticeError:
    "rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-950 shadow-[var(--shadow-xs)]"
};

export function statusBadgeClassName(statusLabel?: string) {
  const normalized = statusLabel?.toLowerCase() ?? "";

  if (normalized.includes("payment") || normalized.includes("scheduled")) {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  if (normalized.includes("transit") || normalized.includes("review") || normalized.includes("quoted")) {
    return "border-sky-200 bg-sky-50 text-sky-900";
  }

  if (normalized.includes("cancel") || normalized.includes("reject")) {
    return "border-rose-200 bg-rose-50 text-rose-900";
  }

  if (normalized.includes("complete") || normalized.includes("collected") || normalized.includes("paid")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }

  return "border-slate-200 bg-slate-50 text-slate-800";
}
