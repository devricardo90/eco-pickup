# apps/web

Foundation estrutural da aplicacao web do EcoPickup.

## Objetivo desta fase

Consolidar a base do frontend em Next.js sem implementar features de produto.

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

## Escopo entregue nesta fase atual

- estrutura inicial Next.js consolidada
- TypeScript validado
- App Router validado
- Tailwind validado
- layout e pagina base
- dashboard autenticado de owner em `/requests`
- dashboard autenticado de admin em `/admin/requests`
- superficie autenticada de detail/tracking para owner em `/tracking/[requestId]`
- superficie autenticada de detail/tracking para admin em `/admin/tracking/[requestId]`
- componentes compartilhados para resumo, status atual, metadados, timeline e estados de tela
- servicos de leitura dos endpoints de list, detail e history
- testes focados no mapeamento semantico da timeline
- auth/session foundation com login, register, logout e cookie HTTP-only de sessao

## Fora de escopo nesta fase

- fluxo de usuario
- login
- dashboard real
- painel admin funcional
- telas de negocio do EcoPickup
- integracao com API real
- estado de produto
- formularios reais do MVP

## Configuracao para tracking e auth

Para habilitar a leitura real do backend no frontend:

- definir `ECOPICKUP_API_BASE_URL`

As rotas de tracking agora usam a sessao autenticada da web. Nao dependem mais de tokens manuais por env.
