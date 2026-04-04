# EcoPickup - Monorepo Foundation Decision

## 1. Objetivo

Este documento define a foundation tecnica inicial do monorepo do EcoPickup.

A meta desta fase nao e implementar features de produto.
A meta e estabelecer a base estrutural, operacional e de convencoes do repositorio para permitir evolucao segura nas proximas epicas.

---

## 2. Escopo desta decisao

Este documento cobre:

- ferramenta de workspace/monorepo
- convencoes de raiz
- bootstrap de `apps/api` e `apps/web`
- boundaries de `packages/contracts` e `packages/ui`
- estrategia de ambiente local
- workflow de desenvolvimento local

Este documento nao cobre ainda:

- implementacao de dominio
- autenticacao funcional
- modelagem final do banco
- fluxos de produto
- integracao de pagamento
- upload real de imagens

---

## 3. Decisao de workspace tool

### Decisao

Usar **pnpm workspaces** como base do monorepo.

### Motivos

- leve e direto
- bom para monorepo
- instalacao rapida
- workspace management simples
- encaixa bem com frontend moderno
- nao forca complexidade desnecessaria agora

### Decisao complementar

**Nao adotar Turborepo no primeiro bootstrap.**

### Motivo

O projeto esta em foundation.
Neste momento, o objetivo e:

- clareza estrutural
- bootstrap previsivel
- menor superficie de complexidade

Turborepo pode ser adicionado depois, se houver necessidade real de:

- caching avancado
- pipelines de workspace
- otimizacao de CI em escala

---

## 4. Estrutura inicial aprovada

```txt
eco-pickup/
  apps/
    api/
    web/
  packages/
    contracts/
    ui/
  docs/
    product/
    architecture/
    rules/
    ops/
  .editorconfig
  .gitattributes
  .gitignore
  .npmrc
  package.json
  pnpm-workspace.yaml
  README.md
  AGENTS.md
```

---

## 5. Convencoes de raiz

### 5.1. package.json da raiz

A raiz deve existir como workspace root e centralizar scripts agregadores.

Objetivos:

- padronizar comandos
- facilitar onboarding
- servir como entrypoint operacional

Scripts iniciais esperados:

- install
- dev
- build
- lint
- typecheck
- format

Mesmo que alguns scripts sejam placeholders no comeco, a intencao da raiz deve ficar clara.

### 5.2. pnpm-workspace.yaml

Deve registrar:

- `apps/*`
- `packages/*`

### 5.3. .editorconfig

Deve padronizar:

- utf-8
- final newline
- spaces
- indentation coerente
- trailing whitespace control

### 5.4. .gitattributes

Deve reduzir inconsistencias de line endings entre Windows e outros ambientes.

### 5.5. .gitignore

Deve cobrir no minimo:

- node_modules
- dist
- .next
- logs
- env files sensiveis
- artifacts locais
- outputs de build
- bin/
- obj/

### 5.6. .npmrc

Pode ser usado para padronizacoes simples do workspace, caso necessario.

---

## 6. Decisao para apps

### 6.1. apps/api

Direcao:

Aplicacao backend em ASP.NET Core com .NET 8.

Regra:

O bootstrap inicial da API deve:

- criar projeto base
- subir localmente
- expor health endpoint
- expor Swagger/OpenAPI
- nao implementar feature de produto ainda

Nesta fase, a API nao deve:

- conter logica de dominio do EcoPickup
- conter autenticacao funcional completa
- conter endpoints de negocio do MVP

Objetivo do bootstrap:

Preparar a base para EPIC-004 sem contaminar a foundation com escopo de feature.

### 6.2. apps/web

Direcao:

Aplicacao web em Next.js com TypeScript.

Regra:

O bootstrap inicial da web deve:

- criar projeto base
- subir localmente
- incluir estrutura minima
- preparar Tailwind
- preparar App Router

Nesta fase, a web nao deve:

- implementar fluxo do usuario
- implementar admin funcional
- implementar tela de negocio real

Objetivo do bootstrap:

Preparar base para EPIC-005 com convencoes estaveis.

---

## 7. Decisao para packages

### 7.1. packages/contracts

Objetivo:

Reservado para contratos compartilhados.

Uso futuro esperado:

- enums compartilhados
- tipos de request/response quando fizer sentido
- contratos transversais
- payload references

Regra nesta fase:

Pode nascer apenas com estrutura minima e README interno.
Nao precisa ter contratos de negocio ja implementados.

### 7.2. packages/ui

Objetivo:

Reservado para componentes e primitives compartilhaveis.

Uso futuro esperado:

- componentes basicos
- tokens visuais
- padroes reutilizaveis
- primitives transversais

Regra nesta fase:

Pode nascer apenas com estrutura minima e README interno.
Nao precisa ter design system implementado agora.

---

## 8. Estrategia de ambientes

### 8.1. Principio

Ambiente local primeiro.
Nada de inventar staging cedo demais sem a base local estar solida.

### 8.2. Regras

- cada app deve suportar execucao local
- variaveis devem ser documentadas
- secrets reais nao entram no repositorio
- arquivos exemplo devem existir quando necessario

### 8.3. Arquivos esperados depois

- `.env.example`
- `.env.local` fora de versionamento quando aplicavel

---

## 9. Estrategia de banco e infraestrutura local

### Decisao

Preparar o projeto para usar PostgreSQL via Docker.

### Regra

Nesta fase, pode existir apenas a convencao e o espaco para dockerizacao.
A subida completa do banco pode acontecer na epica apropriada.

### Motivo

A foundation do monorepo nao precisa antecipar toda a persistencia.
Precisa apenas evitar decisoes incompativeis com ela.

---

## 10. Workflow de desenvolvimento local

### 10.1. Principio

O workflow local deve ser simples, previsivel e documentado.

### 10.2. Objetivo inicial

Permitir que um desenvolvedor:

- instale dependencias do workspace
- suba a web localmente
- suba a API localmente
- entenda rapidamente a estrutura do repo

### 10.3. Scripts de raiz esperados

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`

Os detalhes desses scripts podem evoluir conforme apps reais forem criadas.

---

## 11. Regras de boundary

### 11.1. apps nao devem depender entre si diretamente

- web nao importa codigo interno de api
- comunicacao entre apps ocorre por HTTP/API, nao por import interno

### 11.2. packages devem ser explicitos

- contracts e ui so devem existir se tiverem papel claro
- evitar criar package magico sem responsabilidade definida

### 11.3. Shared nao deve virar lixeira

Codigo compartilhado so entra em package quando houver motivacao real e fronteira clara.

---

## 12. Regras de bootstrap

Ao abrir a EPIC-003, o bootstrap deve seguir esta ordem:

1. criar arquivos de raiz do workspace
2. registrar `pnpm-workspace.yaml`
3. criar `apps/api`
4. criar `apps/web`
5. criar `packages/contracts`
6. criar `packages/ui`
7. validar estrutura
8. validar que nenhuma feature foi implementada

---

## 13. Criterios de aceite da foundation do monorepo

A EPIC-003 pode ser considerada corretamente aberta e concluida quando:

- estrutura de workspace existir
- convencoes de raiz existirem
- `apps/api` existir com bootstrap base
- `apps/web` existir com bootstrap base
- `packages/contracts` existir com boundary clara
- `packages/ui` existir com boundary clara
- scripts iniciais do workspace existirem
- documentacao impactada estiver atualizada
- nenhuma feature de produto tiver sido implementada

---

## 14. Riscos conhecidos

- adicionar complexidade cedo demais
- misturar foundation com feature
- criar packages sem necessidade real
- deixar scripts de raiz confusos
- gerar acoplamento indevido entre apps

---

## 15. Decisao final desta fase

A foundation tecnica do monorepo do EcoPickup deve comecar com:

- pnpm workspaces
- `apps/api` em ASP.NET Core .NET 8
- `apps/web` em Next.js + TypeScript
- `packages/contracts`
- `packages/ui`
- convencoes de raiz enxutas
- workflow local simples
- sem feature de produto nesta fase

---

## 16. Version Pinning Baseline

Baseline aprovada para reduzir incompatibilidades nas proximas epicas:

### Workspace / frontend

- Node.js `24.14.1`
- pnpm `10.26.0`
- Next.js `16.2.2`
- eslint-config-next `16.2.2`
- React `19.2.0`
- react-dom `19.2.0`
- Tailwind CSS `4.2.2`

### Backend / API

- .NET SDK `8.0.408`
- Target Framework `net8.0`
- Swashbuckle.AspNetCore `9.0.6`
- Scalar.AspNetCore `2.13.19`
- Scalar.AspNetCore.Swashbuckle `2.9.0`
- Microsoft.EntityFrameworkCore `8.0.25`
- Microsoft.EntityFrameworkCore.Design `8.0.25`
- Npgsql.EntityFrameworkCore.PostgreSQL `8.0.11`

### Database

- PostgreSQL `16.13`

Regra:

- manter Swagger funcional
- adicionar Scalar por cima da base de Swashbuckle
- nao adotar `Microsoft.AspNetCore.OpenApi` como base principal da API nesta fase
