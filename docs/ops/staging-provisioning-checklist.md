# EcoPickup - Staging Provisioning Checklist

## Contexto

Slice: `EPIC-014H - Staging Provisioning Checklist`

Data: 2026-04-12

Objetivo: preparar o checklist operacional completo para provisionamento de staging, garantindo que pre-condicoes, contas, servicos, secrets, URLs, banco, storage, logs e ordem de execucao estejam definidos antes de criar qualquer recurso externo.

## Estado de entrada

Base considerada:

- `EPIC-014D` definiu a stack alvo: Vercel, Render Web Service, Render Postgres, Cloudflare R2 e logs nativos.
- `EPIC-014E` definiu plano de staging, smoke test e rollback.
- `EPIC-014F` criou e validou o Docker artifact da API.
- `EPIC-014G` definiu migration manual controlada para o primeiro staging.

Boundary desta slice:

- nao provisionar recursos reais
- nao criar staging
- nao criar secrets reais
- nao alterar codigo
- nao alterar Docker, runtime, CI/CD ou envs
- nao executar migrations
- nao fazer deploy

## Naming convention

Convenção proposta para staging:

```txt
Environment: staging
Project prefix: ecopickup
Resource suffix: stg
Separator: hyphen
```

Nomes operacionais esperados:

```txt
Render project/workspace: ecopickup-stg
Render API service: ecopickup-api-stg
Render Postgres database: ecopickup-postgres-stg
Render Environment Group: ecopickup-api-stg-env
Vercel project: ecopickup-web
Vercel environment: Preview or custom staging environment
Cloudflare R2 bucket: ecopickup-media-stg
Cloudflare R2 token label: ecopickup-r2-stg-api-token
```

URL placeholders:

```txt
API public URL: https://ecopickup-api-stg.onrender.com
Web public URL: Vercel generated preview/staging URL until custom domain is approved
Health URL: https://ecopickup-api-stg.onrender.com/health
```

Custom domains stay out of first provisioning unless explicitly approved:

```txt
api-stg.<domain>
app-stg.<domain>
```

## Checklist por camada

### Web

Target:

- Vercel

Pre-condicoes:

- conta/team Vercel definida
- acesso ao repositorio confirmado
- branch ou fluxo de deployment definido
- Node/build baseline confirmada antes do deploy
- API staging URL conhecida ou placeholder aceito

Configuracao esperada:

- project name: `ecopickup-web`
- root directory: `apps/web`
- framework: Next.js
- environment: Preview ou custom staging
- production deploy desabilitado para esta etapa, se possivel

Env vars sem valores reais:

```txt
ECOPICKUP_API_BASE_URL
ECOPICKUP_WEB_PUBLIC_URL
```

Evidencias futuras:

- projeto Vercel criado
- env vars de staging preenchidas
- URL staging registrada
- build log acessivel
- deployment nao promovido a producao

### API

Target:

- Render Web Service com Docker

Pre-condicoes:

- conta/workspace Render definido
- acesso ao repositorio ou registry definido
- Docker artifact da `EPIC-014F` disponivel no commit candidato
- Render region escolhida
- Render Postgres staging criado antes da API receber connection string definitiva
- migration strategy da `EPIC-014G` aceita

Configuracao esperada:

- service name: `ecopickup-api-stg`
- service type: Web Service
- runtime/deploy: Dockerfile em `apps/api/Dockerfile`
- public port: valor fornecido por `PORT`
- health check path: `/health`
- environment group: `ecopickup-api-stg-env`
- auto-deploy: desabilitar no primeiro staging, salvo decisao explicita

Env vars sem valores reais:

```txt
ASPNETCORE_ENVIRONMENT=Staging
AllowedHosts
ConnectionStrings__Database
Jwt__Issuer
Jwt__Audience
Jwt__SigningKey
Jwt__AccessTokenLifetimeMinutes
ObjectStorage__ServiceUrl
ObjectStorage__BucketName
ObjectStorage__AccessKey
ObjectStorage__SecretKey
ObjectStorage__Region
ObjectStorage__ForcePathStyle
ObjectStorage__AutoCreateBucket=false
Payments__ProviderName
Payments__CheckoutBaseUrl
Payments__WebhookSecret
Persistence__ApplyMigrationsOnStartup=false
Logging__LogLevel__Default
Logging__LogLevel__Microsoft.AspNetCore
```

Evidencias futuras:

- service criado
- env group associado
- health check configurado
- URL `onrender.com` registrada
- logs acessiveis
- deploy inicial somente apos banco/storage/secrets/migrations estarem prontos

### Banco

Target:

- Render Postgres

Pre-condicoes:

- workspace Render definido
- region escolhida igual a API quando possivel
- plano aprovado com billing owner
- estrategia de backup/PITR confirmada
- migration strategy aceita

Configuracao esperada:

- database name: `ecopickup-postgres-stg`
- PostgreSQL: versao gerenciada pelo Render, compativel com o runtime atual
- region: mesma da API
- connection: internal URL para API quando API e banco estiverem no mesmo account/region
- external URL: usar apenas para operacao controlada de migration

Plano minimo recomendado:

- banco pago para obter recovery/backup operacional
- evitar free database como staging duravel, porque free database pode expirar e nao deve sustentar validacao operacional continua

Evidencias futuras:

- banco criado
- internal database URL disponivel para a API
- external database URL acessivel apenas para operador autorizado de migration
- backup/PITR ou export strategy confirmada

### Storage

Target:

- Cloudflare R2

Pre-condicoes:

- conta Cloudflare definida
- billing/limites aceitos
- bucket name confirmado
- token dedicado de staging aprovado
- politica privada do bucket definida

Configuracao esperada:

- bucket: `ecopickup-media-stg`
- storage class: Standard no primeiro staging
- public access: disabled by default
- object lifecycle: pendente de decisao
- CORS: configurar somente se o fluxo exigir acesso direto do browser; upload atual via API nao deve exigir bucket publico

Env vars sem valores reais:

```txt
ObjectStorage__ServiceUrl
ObjectStorage__BucketName=ecopickup-media-stg
ObjectStorage__AccessKey
ObjectStorage__SecretKey
ObjectStorage__Region
ObjectStorage__ForcePathStyle
ObjectStorage__AutoCreateBucket=false
```

Evidencias futuras:

- bucket criado
- token/API key criado com escopo minimo
- endpoint S3-compatible registrado
- upload/leitura validados no smoke quando o fluxo for testado

### Secrets

Targets:

- Render Environment Group
- Vercel Environment Variables
- Cloudflare R2 API tokens

Pre-condicoes:

- owner de secrets definido
- acesso administrativo limitado
- nenhum secret real salvo no repositorio
- nomes canonicos conferidos com `docs/ops/runtime-environment-contract.md`

Render secrets:

```txt
ConnectionStrings__Database
Jwt__SigningKey
ObjectStorage__AccessKey
ObjectStorage__SecretKey
Payments__WebhookSecret
```

Render non-secret envs:

```txt
ASPNETCORE_ENVIRONMENT
AllowedHosts
Jwt__Issuer
Jwt__Audience
Jwt__AccessTokenLifetimeMinutes
ObjectStorage__ServiceUrl
ObjectStorage__BucketName
ObjectStorage__Region
ObjectStorage__ForcePathStyle
ObjectStorage__AutoCreateBucket
Payments__ProviderName
Payments__CheckoutBaseUrl
Persistence__ApplyMigrationsOnStartup
Logging__LogLevel__Default
Logging__LogLevel__Microsoft.AspNetCore
```

Vercel envs:

```txt
ECOPICKUP_API_BASE_URL
ECOPICKUP_WEB_PUBLIC_URL
```

Secrets rules:

- usar valores exclusivos de staging
- nao reutilizar secrets locais
- nao reutilizar secrets de producao
- nao colar valores reais em docs, issues ou commits
- rotacionar se algum valor vazar durante setup

### Logs

Targets:

- Render logs para API
- Render Postgres metrics/logs para banco
- Vercel runtime logs para web

Pre-condicoes:

- acesso aos dashboards definido
- responsavel por smoke/log review definido
- retencao minima entendida de acordo com plano

Checks esperados:

- API registra startup
- API registra request de `/health`
- Vercel registra acesso a rotas principais
- logs nao exibem connection strings, JWTs, R2 keys ou webhook secrets

## O que precisa existir antes do primeiro provisioning

Obrigatorio:

- owner de billing para Render, Vercel e Cloudflare
- acesso administrativo controlado a cada plataforma
- repositorio acessivel pela plataforma escolhida ou registry definido
- branch/commit candidato definido
- decisao de region Render
- decisao de plano Render Web Service
- decisao de plano Render Postgres
- decisao de Vercel environment: Preview ou custom staging
- decisao de bucket R2 e token dedicado
- matriz de env vars revisada
- politica de migration aceita
- responsavel pelo smoke test definido

Nao obrigatorio para primeiro provisioning:

- dominio customizado
- CI/CD completo
- observabilidade externa
- preview environments completos
- payment real em producao

## Ordem segura de provisionamento futuro

1. Confirmar owner de billing e acessos nas plataformas.
2. Confirmar region e planos.
3. Confirmar naming final dos recursos.
4. Criar bucket R2 staging.
5. Criar token R2 staging com escopo minimo.
6. Criar Render Postgres staging.
7. Capturar internal/external database URLs sem versionar valores.
8. Criar Render Environment Group.
9. Preencher env vars/secrets da API sem deploy funcional ainda.
10. Criar Render Web Service da API com Docker artifact.
11. Manter `Persistence__ApplyMigrationsOnStartup=false`.
12. Executar migration manual controlada conforme `docs/ops/staging-migration-strategy.md`.
13. Validar schema.
14. Executar primeiro deploy da API.
15. Validar `/health`.
16. Criar/configurar Vercel project/environment.
17. Preencher `ECOPICKUP_API_BASE_URL`.
18. Executar deploy da web.
19. Executar smoke test completo.
20. Revisar logs e registrar evidencias.

## Pendencias e bloqueios

### Bloqueios antes de provisionar

- owner de billing ainda nao registrado
- conta/workspace Render nao confirmada
- conta/team Vercel nao confirmada
- conta Cloudflare nao confirmada
- region Render nao escolhida
- planos pagos/minimos nao aprovados
- dominio customizado ainda nao decidido

### Pendencias operacionais

- decidir se Vercel usara Preview ou custom staging environment
- decidir se API usara Git-backed Docker build ou imagem prebuilt em registry
- definir se auto-deploy fica desligado no primeiro staging
- definir seed/admin para smoke
- definir payment provider de staging/sandbox
- confirmar parametros R2: endpoint, region e force path style
- definir retencao/lifecycle de objetos no bucket staging

## Decisoes ainda abertas

1. Region Render para API e banco.
2. Plano Render Web Service.
3. Plano Render Postgres.
4. Workspace/team Vercel.
5. Environment Vercel: Preview ou custom staging.
6. Cloudflare account/bucket owner.
7. Dominio customizado agora ou apenas URL gerada.
8. Payment provider de staging.
9. Usuario/admin seed para smoke.
10. Registry externo ou build Docker direto pelo Render.

## Proxima slice recomendada

`EPIC-014I - Staging Provisioning Execution`

Objetivo sugerido: criar os recursos reais de staging na ordem aprovada, registrar evidencias e parar antes de deploy funcional se qualquer pre-condicao falhar.

Condicao para iniciar:

- decisoes abertas da `EPIC-014H` fechadas pelo responsavel do projeto
- autorizacao explicita para provisionar recursos externos e potencialmente gerar custos

## Fontes oficiais consultadas

- Render Web Services: https://render.com/docs/web-services
- Render Service Types: https://render.com/docs/service-types
- Render Postgres: https://render.com/docs/postgresql
- Render Postgres flexible plans: https://render.com/docs/postgresql-refresh
- Render Postgres backups: https://render.com/docs/postgresql-backups
- Render database internal/external connections: https://render.com/docs/databases
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/

## Boundary

Esta slice nao provisionou recursos reais, nao criou staging, nao criou secrets reais, nao alterou codigo, nao alterou Docker, runtime, CI/CD ou envs, nao executou migrations, nao fez deploy e nao fez commit.
