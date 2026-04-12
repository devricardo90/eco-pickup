# EcoPickup - Infra / Deploy Readiness Assessment

## Contexto

Slice: `EPIC-014A - Infra / Deploy Readiness Assessment`

Data: 2026-04-12

Objetivo: mapear a prontidao de infraestrutura, deploy e observabilidade do MVP atual antes de qualquer deploy real ou mudanca tecnica.

## Resultado executivo

O MVP esta pronto para iniciar a frente de deploy de forma controlada, mas ainda nao esta pronto para deploy real.

Readiness atual:

- base local de banco existe via Docker Compose
- base local de storage existe via Docker Compose com MinIO
- API possui `/health`
- API possui logging em console
- web possui build Next.js e depende de `ECOPICKUP_API_BASE_URL`
- baseline de versoes esta documentada
- nao ha Dockerfile de API ou web
- nao ha staging definido
- nao ha pipeline CI/CD definido
- nao ha contrato completo de variaveis de ambiente por ambiente
- nao ha plano de smoke test formal
- nao ha plano de rollback formal
- observabilidade ainda esta no nivel minimo local

## Inventario de readiness atual

### Local development

Status: parcialmente pronto.

Evidencias:

- `docker/compose.yaml` sobe PostgreSQL `16.13`
- `docker/compose.yaml` sobe MinIO
- `.env.example` documenta variaveis locais de Postgres, MinIO, payment fake e API base URL
- `apps/api/src/EcoPickup.Api/appsettings.Development.json` define valores locais de API, banco, storage e payment
- `apps/web/README.md` documenta `ECOPICKUP_API_BASE_URL`
- `docs/architecture/system-design.md` documenta Node, pnpm, .NET, PostgreSQL e principais dependencias

Lacunas:

- nao ha passo operacional unico documentado para subir banco, storage, API e web juntos
- `.env.example` nao cobre todas as chaves runtime da API no formato esperado por ambiente hospedado
- API e web ainda nao possuem Dockerfile proprio

### Staging

Status: nao definido.

Lacunas:

- ambiente staging nao existe documentalmente
- dominio, TLS, URLs publicas e politica de secrets nao estao definidos
- banco gerenciado ou estrategia de PostgreSQL em staging nao esta definida
- bucket/storage de staging nao esta definido
- provider real de payment para staging nao esta definido

### Deploy

Status: nao pronto para execucao real.

Lacunas:

- plataforma de deploy nao escolhida
- estrategia de build/publicacao da API nao documentada
- estrategia de build/publicacao da web nao documentada
- migracoes de banco em deploy nao possuem procedimento formal
- nao ha pipeline CI/CD
- nao ha gates de deploy definidos alem dos gates gerais do projeto

### Smoke test

Status: nao formalizado.

Base existente:

- API possui endpoint `/health`
- web possui superficies owner/admin autenticadas ja entregues

Lacunas:

- checklist de smoke test nao existe
- usuarios seed/admin para smoke nao estao definidos
- fluxo minimo pos-deploy nao esta definido
- criterio de sucesso/falha por endpoint e tela nao esta registrado

### Observabilidade

Status: minimo local.

Base existente:

- API usa console logging
- API possui health check
- system design exige logs estruturados, health check e troubleshoot de lifecycle/payment

Lacunas:

- destino de logs em staging/producao nao definido
- metricas minimas nao definidas
- tracing/correlation id nao definido
- alertas nao definidos
- dashboard ou procedimento de troubleshooting nao definido

### Rollback

Status: nao definido.

Lacunas:

- rollback de API/web nao documentado
- rollback de migrations nao documentado
- estrategia para falha em payment webhook ou storage nao documentada
- criterio de abortar deploy nao definido

## Variaveis de ambiente mapeadas

### Raiz / Docker local

Variaveis em `.env.example` e `docker/compose.yaml`:

- `ECOPICKUP_POSTGRES_DB`
- `ECOPICKUP_POSTGRES_USER`
- `ECOPICKUP_POSTGRES_PASSWORD`
- `ECOPICKUP_POSTGRES_PORT`
- `ECOPICKUP_MINIO_ROOT_USER`
- `ECOPICKUP_MINIO_ROOT_PASSWORD`
- `ECOPICKUP_MINIO_API_PORT`
- `ECOPICKUP_MINIO_CONSOLE_PORT`
- `ECOPICKUP_PAYMENT_PROVIDER`
- `ECOPICKUP_PAYMENT_CHECKOUT_BASE_URL`
- `ECOPICKUP_PAYMENT_WEBHOOK_SECRET`
- `ECOPICKUP_API_BASE_URL`

### API runtime

Chaves configuradas em `appsettings.json` / `appsettings.Development.json` que precisam de contrato por ambiente:

- `ConnectionStrings:Database`
- `Jwt:Issuer`
- `Jwt:Audience`
- `Jwt:SigningKey`
- `Jwt:AccessTokenLifetimeMinutes`
- `ObjectStorage:ServiceUrl`
- `ObjectStorage:BucketName`
- `ObjectStorage:AccessKey`
- `ObjectStorage:SecretKey`
- `ObjectStorage:Region`
- `ObjectStorage:ForcePathStyle`
- `ObjectStorage:AutoCreateBucket`
- `Payments:ProviderName`
- `Payments:CheckoutBaseUrl`
- `Payments:WebhookSecret`
- `Persistence:ApplyMigrationsOnStartup`
- `Logging:LogLevel:Default`
- `Logging:LogLevel:Microsoft.AspNetCore`
- `AllowedHosts`
- `ASPNETCORE_ENVIRONMENT`

Observacao operacional:

Para ambiente hospedado em ASP.NET Core, essas chaves normalmente precisam ser documentadas tambem no formato de variavel de ambiente com separador `__`, por exemplo `ConnectionStrings__Database`. Esse contrato ainda nao esta documentado oficialmente.

### Web runtime

Variavel documentada:

- `ECOPICKUP_API_BASE_URL`

Lacunas:

- origem publica da web nao esta documentada
- politica de cookies/session em ambiente HTTPS nao esta documentada
- variaveis futuras de URL publica/callback de payment nao estao definidas

## Dependencias externas mapeadas

### Obrigatorias para local

- Docker / Docker Compose
- PostgreSQL `16.13`
- MinIO
- Node.js `24.14.1`
- pnpm `10.26.0`
- .NET SDK `8.0.408`

### Obrigatorias para staging/deploy

- plataforma de hosting para API
- plataforma de hosting para web
- PostgreSQL gerenciado ou equivalente operacional
- storage S3-compatible; decisao documental atual aponta Cloudflare R2
- provider de pagamento; implementacao atual usa `FakeCheckout`
- dominio e TLS
- gerenciador de secrets
- destino central de logs

## Riscos e lacunas classificados

### Alto

- Sem plataforma de deploy escolhida.
- Sem contrato completo de variaveis por ambiente.
- Segredos e valores de desenvolvimento ainda aparecem em `appsettings*.json`; antes de deploy real, secrets reais devem ficar fora do repositorio.
- Sem plano de migrations para deploy.
- Sem rollback documentado.

### Medio

- Docker Compose cobre apenas Postgres e MinIO, nao API/web.
- Observabilidade ainda limitada a console logging e `/health`.
- Payment ainda usa provider fake; decisao de provider real/staging esta pendente.
- Smoke test nao esta formalizado.
- Storage de producao aponta Cloudflare R2, mas bucket, credenciais e politica operacional nao estao definidos.

### Baixo

- README da web menciona `ECOPICKUP_API_BASE_URL`, mas nao ha matriz completa de ambiente.
- `AllowedHosts` esta amplo no appsettings base e precisa ser revisado antes de producao.
- Root scripts existem, mas nao representam pipeline de deploy.

## Ordem segura das proximas slices da EPIC-014

1. `EPIC-014B - Runtime Environment Contract`
   - formalizar matriz local/staging/producao de variaveis, secrets, URLs, ownership e defaults seguros.

2. `EPIC-014C - Local Full-Stack Runbook`
   - documentar o procedimento reproduzivel para subir Postgres, MinIO, API e web localmente e validar `/health`.

3. `EPIC-014D - Deploy Target Decision`
   - escolher plataforma de hosting para API, web, banco, storage e secrets, sem executar deploy ainda.

4. `EPIC-014E - Smoke Test and Rollback Plan`
   - definir checklist de smoke test e rollback antes do primeiro deploy real.

5. `EPIC-014F - Observability Baseline Plan`
   - definir logs, health, troubleshooting minimo, alertas iniciais e evidencias esperadas.

6. `EPIC-014G - First Staging Deploy`
   - executar deploy somente depois das slices anteriores estarem completas.

## Confirmacao de boundary

Esta slice nao executou deploy, nao criou staging, nao alterou Docker, CI/CD, runtime, infraestrutura ou codigo, nao implementou observabilidade, nao executou smoke test real e nao executou rollback.
