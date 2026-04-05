# apps/web

Aplicacao web atual do MVP do EcoPickup.

## Objetivo atual

Consolidar as superfices owner/admin ja entregues sem abrir novas frentes funcionais antes da retomada operacional.

## Estrutura interna aprovada

```txt
src/
  app/
  components/
  features/
  hooks/
  lib/
```

## Convencoes

- `src/app`
  - App Router, layouts globais e placeholders de rotas.
- `src/components`
  - componentes locais reutilizaveis da web.
- `src/features`
  - modulos por feature quando as epicas de produto forem abertas.
- `src/hooks`
  - hooks locais da aplicacao web.
- `src/lib`
  - utilitarios e integracoes locais sem acoplamento com UI.

## Escopo atual do MVP web

- estrutura inicial Next.js consolidada
- TypeScript validado
- App Router validado
- Tailwind validado
- layout e pagina base
- superficie autenticada de criacao para owner em `/requests/new`
- superficie autenticada de edicao owner em `/tracking/[requestId]/edit` enquanto a request estiver em `draft`
- dashboard autenticado de owner em `/requests`
- dashboard autenticado de admin em `/admin/requests`
- superficie autenticada de detail/tracking para owner em `/tracking/[requestId]`
- superficie autenticada de detail/tracking para admin em `/admin/tracking/[requestId]`
- componentes compartilhados para resumo, status atual, metadados, timeline e estados de tela
- card owner de pricing/quote visibility para `under_review`, `quoted` e `awaiting_payment`
- card owner de payment surface para `awaiting_payment` e `paid`
- card owner de scheduling visibility para o intervalo pos-pagamento e para `scheduled`
- card owner de execution messaging para `in_transit` e `collected`
- card owner de lifecycle closure para `completed`, `cancelled` e `rejected`
- servicos de leitura dos endpoints de list, detail e history
- submit autenticado de criacao via `POST /api/v1/pickup-requests`
- submit autenticado de edicao via `PUT /api/v1/pickup-requests/{id}`
- submit autenticado de envio via `PATCH /api/v1/pickup-requests/{id}/submit`
- formulario compartilhado de create/edit com UX de multiplos itens
- testes focados em sessao, editabilidade e mapeamentos semanticos
- auth/session foundation com login, register, logout e cookie HTTP-only de sessao

## Fluxo owner atualmente documentado

- login e register na web
- dashboard em `/requests`
- create em `/requests/new`
- edit apenas em `draft` por `/tracking/[requestId]/edit`
- submit explicito para `submitted`
- detail/tracking em `/tracking/[requestId]`
- quote visibility, payment start, scheduling visibility e lifecycle messaging sem novas mutacoes alem das ja existentes

## Fluxo admin atualmente documentado

- dashboard em `/admin/requests`
- detail/tracking em `/admin/tracking/[requestId]`
- leitura protegida por role `ADMIN`
- sem execution controls administrativos na web atual

## Fora de escopo nesta etapa

- novas funcionalidades
- novas mutacoes operacionais
- novos contratos backend
- polling, notificacoes e realtime
- execution controls administrativos completos
- redesign amplo

## Configuracao para tracking e auth

Para habilitar a leitura real do backend no frontend:

- definir `ECOPICKUP_API_BASE_URL`

As rotas de tracking agora usam a sessao autenticada da web. Nao dependem mais de tokens manuais por env.

Regra atual de edicao:

- owner pode editar apenas requests em `draft`
- quando a request entra em `under_review` ou em qualquer estado operacional posterior, a edicao e bloqueada

Semantica atual de envio:

- create e edit podem salvar como `draft`
- owner envia a request por uma transicao explicita para `submitted`
- depois de `submitted`, a request deixa de ser editavel
