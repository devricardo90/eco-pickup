# EcoPickup - Deploy Target Decision

## Contexto

Slice: `EPIC-014D - Deploy Target Decision`

Data: 2026-04-12

Objetivo: definir a estrategia e os alvos de deploy para API, web, banco, storage, secrets e logs, sem provisionar recursos, sem criar staging, sem alterar codigo/configuracao e sem deploy real.

## Estado de entrada

Base considerada:

- `EPIC-014A` confirmou readiness parcial e lacunas de staging/deploy.
- `EPIC-014B` definiu contrato de runtime local/staging/producao.
- `EPIC-014C` validou stack local com Postgres, MinIO, API, web e integracao basica.

Restricoes relevantes:

- API e ASP.NET Core .NET 8.
- Web e Next.js.
- Banco e PostgreSQL.
- Storage deve ser S3-compatible.
- Projeto ainda nao tem Dockerfile de API ou web.
- Staging ainda nao existe.
- CI/CD ainda nao existe.
- Deploy real esta fora do escopo desta slice.

## Criterios de decisao

Prioridade para o MVP:

1. baixo custo operacional
2. caminho claro para staging
3. suporte bom a .NET/containers
4. suporte bom a Next.js
5. PostgreSQL gerenciado com backup/restore
6. S3-compatible storage
7. secrets por ambiente
8. logs suficientes para troubleshooting inicial
9. menor quantidade de pecas customizadas

## Opcoes avaliadas por camada

### API

#### Render Web Service

Prós:

- suporta web services publicos com URL propria
- suporta Docker-based deploys
- possui env vars, secret files e environment groups
- possui logs no dashboard e log streams em planos superiores
- integra bem com Render Postgres via rede interna

Contras:

- requer Dockerfile ou decisao de runtime/build adequada para .NET
- introduz dependencia de plataforma PaaS externa
- logs e observabilidade avancada dependem de plano/provedor externo

#### Azure App Service

Prós:

- suporte nativo forte para ASP.NET Core
- app settings viram variaveis de ambiente
- logging integrado para ASP.NET Core
- bom caminho enterprise

Contras:

- maior custo operacional inicial
- mais superficie de configuracao
- storage S3-compatible nao e o caminho natural no ecossistema Azure
- pode ser pesado para o MVP atual

#### Railway

Prós:

- fluxo simples de projeto e servicos
- Postgres e variaveis integradas
- logs acessiveis no dashboard

Contras:

- menor separacao formal entre decisao de hosting e operacao de producao
- maturidade operacional para producao precisa ser validada por plano e necessidades
- pode incentivar provisionamento rapido demais antes de smoke/rollback

#### Fly.io

Prós:

- bom modelo para apps containerizados
- secrets em vault e variaveis de runtime
- opcoes de deploy proximas ao runtime

Contras:

- exige mais operacao de containers/regioes
- historico de Postgres unmanaged exige cuidado; managed Postgres existe, mas adiciona decisao especifica
- maior carga operacional que Render para este MVP

### Web

#### Vercel

Prós:

- caminho mais direto para Next.js
- deploy de Next.js e zero-config em muitos casos
- preview URLs por PR
- environment variables por ambiente
- runtime logs no dashboard

Contras:

- web fica separada da plataforma da API
- logs ficam divididos entre Vercel e a plataforma da API
- exige cuidado com `ECOPICKUP_API_BASE_URL` por ambiente

#### Render Web Service / Static Site

Prós:

- poderia concentrar web e API na mesma plataforma
- reduz quantidade de fornecedores

Contras:

- Next.js com server actions/session e runtime Node tende a ser mais natural no Vercel
- pode exigir mais configuracao manual de build/runtime

#### Railway

Prós:

- simples para apps Node
- pode hospedar web e API juntas com banco no mesmo projeto

Contras:

- menos especializado para Next.js que Vercel
- exige validacao de build/runtime para Next.js 16 e Node baseline

### Banco

#### Render Postgres

Prós:

- PostgreSQL gerenciado
- conexao interna com servicos Render na mesma regiao
- paid plans com point-in-time recovery e logical exports
- metricas e logs no dashboard
- reduz latencia e complexidade se API ficar no Render

Contras:

- acopla banco ao fornecedor da API
- free tier nao deve ser tratado como producao
- restore/backup dependem de plano

#### Neon

Prós:

- Postgres gerenciado com connection pooling
- bom para ambientes preview/branching
- encaixa bem com plataformas serverless

Contras:

- adiciona mais um fornecedor
- API proposta nao e serverless; pooling e branching nao sao prioridade imediata

#### Supabase Postgres

Prós:

- Postgres gerenciado com backups e pooler
- console operacional maduro

Contras:

- adiciona funcionalidades que o MVP nao usa agora
- pode virar plataforma de produto alem de banco sem necessidade

### Storage S3-compatible

#### Cloudflare R2

Prós:

- S3-compatible
- direcao ja registrada na media foundation
- sem egress fees
- suporta credenciais S3 API
- MinIO local preserva contrato compativel

Contras:

- precisa confirmar parametros finais: endpoint, region, force path style e bucket por ambiente
- precisa definir politica privada, lifecycle e backup/retencao

#### AWS S3

Prós:

- padrao de mercado
- integracao ampla com SDKs e IAM

Contras:

- egress e precificacao podem ser menos previsiveis
- introduz AWS apenas para storage se o resto ficar fora da AWS

#### Backblaze B2 S3-compatible

Prós:

- S3-compatible
- custo potencialmente competitivo

Contras:

- decisao nova sem alinhamento previo na arquitetura
- menos aderente ao documento de media foundation atual

### Secrets

#### Render Environment Groups + Vercel Environment Variables + Cloudflare R2 API Tokens

Prós:

- usa mecanismos nativos dos alvos recomendados
- suficiente para MVP/staging inicial
- evita introduzir vault dedicado cedo demais

Contras:

- secrets ficam distribuidos entre plataformas
- exige disciplina de matriz de env por ambiente

#### Dedicated secret manager externo

Prós:

- centraliza secrets
- melhor governanca futura

Contras:

- adiciona ferramenta e custo operacional antes da necessidade real

### Logs / Observabilidade minima

#### Render logs + Vercel runtime logs

Prós:

- disponivel sem instrumentacao tecnica adicional
- suficiente para primeira validacao de staging
- preserva boundary de nao implementar observabilidade ainda

Contras:

- logs ficam divididos
- retencao e filtros dependem de plano
- nao resolve tracing ou metricas customizadas

#### Better Stack / Datadog / Sentry desde o primeiro deploy

Prós:

- melhor centralizacao e alerta
- caminho mais forte para producao

Contras:

- adiciona integracao e custo operacional
- esta alem da necessidade da primeira decisao de target

## Recomendacao final

### API

Recomendado: Render Web Service com Docker.

Racional:

- reduz carga operacional para a API .NET
- permite deploy containerizado previsivel
- conversa bem com Render Postgres por conexao interna
- tem env vars/secrets/logs suficientes para staging inicial

Implicacao futura:

- sera necessario criar Dockerfile da API em slice tecnica futura, nao nesta.

### Web

Recomendado: Vercel para Next.js.

Racional:

- e o caminho mais aderente ao app web atual
- reduz configuracao de Next.js
- oferece preview URLs e logs de runtime
- so exige configurar `ECOPICKUP_API_BASE_URL` por ambiente

### Banco

Recomendado: Render Postgres no mesmo projeto/regiao da API.

Racional:

- reduz latencia e complexidade operacional
- oferece conexao interna para a API
- paid plans oferecem point-in-time recovery/logical exports
- simplifica primeira versao de staging

### Storage

Recomendado: Cloudflare R2.

Racional:

- ja e a decisao documental da media foundation
- preserva contrato S3-compatible
- MinIO local continua equivalente operacional
- egress previsivel para fotos do MVP

### Secrets

Recomendado: mecanismos nativos por plataforma na fase inicial.

- Render Environment Groups para API e banco.
- Vercel Environment Variables para web.
- Cloudflare R2 API tokens para storage.

Racional:

- suficiente para MVP/staging
- menor custo operacional
- nao introduz vault dedicado prematuramente

### Logs / observabilidade minima

Recomendado: logs nativos das plataformas no primeiro staging.

- Render dashboard logs para API.
- Vercel runtime logs para web.
- Render Postgres metrics/logs para banco.

Racional:

- atende troubleshooting inicial
- evita integrar observabilidade antes do primeiro staging
- permite evoluir depois para log drain/Better Stack/Sentry se houver necessidade real

## Stack recomendada para staging inicial

```txt
Web: Vercel
API: Render Web Service, Docker-based
Database: Render Postgres, mesma regiao da API
Storage: Cloudflare R2
Secrets: Render Environment Groups + Vercel Environment Variables + Cloudflare R2 tokens
Logs: Render logs + Vercel runtime logs
```

## Trade-offs principais

### Beneficios

- reduz complexidade operacional do backend
- usa Vercel no ponto em que ele e mais forte: Next.js
- mantem storage aderente a decisao S3-compatible existente
- evita AWS/Azure full-stack antes da necessidade real
- permite staging controlado sem redesenhar arquitetura

### Custos

- stack fica multi-plataforma
- logs e secrets ficam distribuidos
- precisa coordenar URLs e CORS/cookies/session entre web e API
- API precisara de Dockerfile
- migrations de banco ainda precisam de plano formal

## Riscos e pendencias

### Alto

- Criar Dockerfile da API sem alterar comportamento runtime.
- Definir politica de migrations para staging.
- Definir secrets reais por ambiente sem versionar valores.
- Confirmar configuracao HTTPS/cookies/session entre Vercel e Render.

### Medio

- Confirmar Node `24.14.1` no build da web.
- Definir se web e API ficarao em subdominios separados, por exemplo `app.ecopickup...` e `api.ecopickup...`.
- Confirmar parametros R2: endpoint, region `auto` ou equivalente, `ForcePathStyle`, buckets por ambiente.
- Definir retencao minima de logs no plano escolhido.

### Baixo

- Decidir se staging usara dominios customizados ou URLs geradas inicialmente.
- Decidir nomenclatura de servicos e ambientes.
- Decidir se preview environments entram agora ou depois.

## Decisoes pendentes

- Regiao do Render para API e banco.
- Plano inicial do Render Postgres.
- Plano inicial do Render Web Service.
- Plano Vercel.
- Nome dos buckets R2 por ambiente.
- Politica de migrations.
- Politica de rollback.
- Checklist de smoke test.
- Estrategia de pagamento real ou sandbox.

## Proxima slice recomendada

`EPIC-014E - Staging Deployment Plan / Smoke and Rollback`

Objetivo sugerido: transformar a decisao de targets em plano de staging, smoke test e rollback antes de qualquer provisionamento.

Escopo sugerido:

- definir topologia de staging
- definir URLs esperadas
- definir matriz final de env vars para staging
- definir plano de migrations para primeiro deploy
- definir checklist de smoke test
- definir rollback inicial
- registrar gates antes de provisionar recursos

Fora de escopo sugerido:

- provisionar recursos
- criar Dockerfile
- alterar codigo
- criar CI/CD
- executar deploy

## Fontes oficiais consultadas

- Render Web Services: https://render.com/docs/web-services
- Render Docker: https://render.com/docs/docker
- Render Environment Variables and Secrets: https://render.com/docs/configure-environment-variables
- Render Postgres: https://render.com/docs/postgresql
- Render Postgres Backups: https://render.com/docs/postgresql-backups
- Render Logs: https://render.com/docs/logging
- Vercel Next.js: https://vercel.com/docs/frameworks/nextjs
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Vercel Runtime Logs: https://vercel.com/docs/runtime-logs
- Cloudflare R2 S3 API: https://developers.cloudflare.com/r2/get-started/s3/
- Cloudflare R2 product docs: https://www.cloudflare.com/developer-platform/products/r2/

## Boundary

Esta slice nao provisionou recursos, nao criou staging, nao alterou codigo, nao alterou Docker, nao alterou CI/CD, nao alterou runtime/envs, nao implementou observabilidade, nao fez deploy e nao fez commit.
