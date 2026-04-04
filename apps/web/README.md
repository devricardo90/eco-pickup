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

## Escopo entregue nesta foundation

- estrutura inicial Next.js consolidada
- TypeScript validado
- App Router validado
- Tailwind validado
- layout e pagina placeholder de foundation

## Fora de escopo nesta fase

- fluxo de usuario
- login
- dashboard real
- painel admin funcional
- telas de negocio do EcoPickup
- integracao com API real
- estado de produto
- formularios reais do MVP
