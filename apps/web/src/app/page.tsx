import Link from "next/link";
import { LogoutForm } from "@/components/logout-form";
import { SessionSummary } from "@/components/session-summary";
import { getSession } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f7ee,_#e2ecd6_45%,_#d3dfc8_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(55,94,47,0.12)] backdrop-blur sm:p-12">
          <span className="inline-flex rounded-full border border-emerald-900/10 bg-emerald-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-950">
            Coleta Sustentável
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 text-balance sm:text-5xl">
            Sua solução para descartes conscientes e sustentáveis.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            O EcoPickup conecta você a serviços de coleta para reciclagem e reaproveitamento de itens de forma simples, transparente e eficiente.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {session ? (
              <>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-slate-800"
                  href="/requests/new"
                >
                  Solicitar coleta
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-900/15 bg-emerald-50 px-6 py-3 text-base font-semibold text-emerald-950 transition hover:border-emerald-900/30"
                  href="/requests"
                >
                  Minhas solicitações
                </Link>
                {session.user.role === "ADMIN" ? (
                  <Link
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-slate-400"
                    href="/admin/requests"
                  >
                    Painel Admin
                  </Link>
                ) : null}
                <div className="ml-2">
                  <LogoutForm />
                </div>
              </>
            ) : (
              <>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-slate-800"
                  href="/auth/register"
                >
                  Começar agora
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                  href="/auth/login"
                >
                  Entrar
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/50 bg-white/40 p-8 backdrop-blur">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">1</div>
            <h3 className="text-xl font-semibold text-slate-950">Solicite</h3>
            <p className="mt-2 text-slate-600">
              Descreva os itens que deseja descartar e informe o local de coleta de forma rápida.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/50 bg-white/40 p-8 backdrop-blur">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">2</div>
            <h3 className="text-xl font-semibold text-slate-950">Avaliação</h3>
            <p className="mt-2 text-slate-600">
              Nossa equipe avalia sua solicitação, define o orçamento e agenda a melhor data para você.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/50 bg-white/40 p-8 backdrop-blur">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">3</div>
            <h3 className="text-xl font-semibold text-slate-950">Acompanhe</h3>
            <p className="mt-2 text-slate-600">
              Veja o progresso em tempo real através de uma linha do tempo transparente até a conclusão.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Por que usar o EcoPickup?
            </h2>
            <ul className="mt-6 space-y-4 text-base leading-7 text-slate-200">
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Transparência:</strong> Acompanhe cada etapa do seu pedido em tempo real.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Conveniência:</strong> Agende a coleta no horário que for melhor para você.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Sustentabilidade:</strong> Garanta que seus itens tenham o destino correto e sustentável.</span>
              </li>
            </ul>
          </article>

          <SessionSummary session={session} />
        </section>
      </div>
    </main>
  );
}
