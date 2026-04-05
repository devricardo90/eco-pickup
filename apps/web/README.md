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
- superficie read-only de tracking para owner em `/tracking/[requestId]`
- superficie read-only de tracking para admin em `/admin/tracking/[requestId]`
- componentes compartilhados para status atual, timeline e estados de tela
- servico de leitura dos endpoints de history
- testes focados no mapeamento semantico da timeline

## Fora de escopo nesta fase

- fluxo de usuario
- login
- dashboard real
- painel admin funcional
- telas de negocio do EcoPickup
- integracao com API real
- estado de produto
- formularios reais do MVP

## Configuracao para tracking

Para habilitar a leitura real do backend no frontend:

- definir `ECOPICKUP_API_BASE_URL`
- definir `ECOPICKUP_WEB_OWNER_ACCESS_TOKEN`
- definir `ECOPICKUP_WEB_ADMIN_ACCESS_TOKEN`

Sem essas variaveis, as rotas de tracking continuam renderizando a superficie, mas mostram estado de configuracao pendente em vez de tentar mutacoes ou fallback ambiguo.
