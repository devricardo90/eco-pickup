# EcoPickup - Runtime Environment Contract

## Contexto

Slice: `EPIC-014B - Runtime Environment Contract`

Data: 2026-04-12

Objetivo: definir o contrato oficial de variaveis e configuracoes de runtime por ambiente para API e web, preparando staging/deploy futuro sem implementar infraestrutura e sem alterar codigo ou configuracoes tecnicas.

## Regras do contrato

- O backlog oficial continua sendo `docs/ops/backlog.md`.
- Este documento define o contrato operacional esperado; ele nao altera `.env.example`, `appsettings`, Docker, CI/CD ou runtime.
- Secrets reais nunca devem ser versionados.
- Defaults com credenciais fracas ou URLs locais sao permitidos apenas em ambiente local.
- Staging e producao devem usar secret manager ou mecanismo equivalente da plataforma escolhida.
- Para ASP.NET Core em runtime hospedado, o nome canonico de variavel deve usar `__` para seções, por exemplo `ConnectionStrings__Database`.

## Ambientes

### Local

Uso: desenvolvimento na maquina do projeto.

Status: parcialmente suportado hoje por `.env.example`, `docker/compose.yaml`, `appsettings.Development.json` e README da web.

Permite defaults locais para:

- PostgreSQL local
- MinIO local
- `FakeCheckout`
- JWT signing key de desenvolvimento
- logs em console

### Staging

Uso: validacao integrada antes de producao.

Status: contrato definido neste documento, ambiente ainda nao provisionado.

Nao permite:

- secrets versionados
- credenciais locais
- storage publico por padrao
- `AllowedHosts=*`
- payment webhook sem secret gerenciado

### Production

Uso: operacao real.

Status: contrato definido neste documento, ambiente ainda nao provisionado.

Nao permite:

- provider fake para payment, salvo decisao formal de sandbox sem dinheiro real
- secrets em repositorio
- bucket publico por padrao
- migrations automaticas sem decisao operacional explicita
- defaults locais

## Classificacao

Tipos usados na matriz:

- `required`: obrigatoria para o ambiente.
- `optional`: opcional ou ajustavel.
- `secret`: valor sensivel; deve vir de secret manager ou equivalente.
- `local-only`: default permitido apenas em ambiente local.
- `derived`: valor derivado de outro recurso provisionado.
- `pending`: valor depende de decisao futura.

## API - Banco

| Config key | Runtime env canonico | Local | Staging | Production | Classificacao | Observacoes |
|---|---|---|---|---|---|---|
| `ConnectionStrings:Database` | `ConnectionStrings__Database` | required, local-only | required, secret, derived | required, secret, derived | Banco | String de conexao do PostgreSQL. Em staging/producao deve vir do banco provisionado. |
| `Persistence:ApplyMigrationsOnStartup` | `Persistence__ApplyMigrationsOnStartup` | optional | required | required | Banco | Default local atual e `false`. Em staging/producao precisa de decisao formal antes de deploy. |

## API - Auth / JWT

| Config key | Runtime env canonico | Local | Staging | Production | Classificacao | Observacoes |
|---|---|---|---|---|---|---|
| `Jwt:Issuer` | `Jwt__Issuer` | required, local-only | required | required | Auth | Deve representar o emissor da API no ambiente. |
| `Jwt:Audience` | `Jwt__Audience` | required, local-only | required | required | Auth | Deve representar o consumidor esperado, hoje `EcoPickup.Web`. |
| `Jwt:SigningKey` | `Jwt__SigningKey` | required, secret, local-only | required, secret | required, secret | Auth | Minimo tecnico atual: 32 caracteres. Nao pode ser versionado em staging/producao. |
| `Jwt:AccessTokenLifetimeMinutes` | `Jwt__AccessTokenLifetimeMinutes` | optional | required | required | Auth | Default atual: 60. Producao pode exigir reducao posterior. |

## API - Storage

| Config key | Runtime env canonico | Local | Staging | Production | Classificacao | Observacoes |
|---|---|---|---|---|---|---|
| `ObjectStorage:ServiceUrl` | `ObjectStorage__ServiceUrl` | required, local-only | required, derived | required, derived | Storage | Local usa MinIO. Staging/producao devem apontar para provider S3-compatible. |
| `ObjectStorage:BucketName` | `ObjectStorage__BucketName` | required, local-only | required, derived | required, derived | Storage | Buckets devem ser separados por ambiente. |
| `ObjectStorage:AccessKey` | `ObjectStorage__AccessKey` | required, secret, local-only | required, secret | required, secret | Storage | Credencial do storage provider. |
| `ObjectStorage:SecretKey` | `ObjectStorage__SecretKey` | required, secret, local-only | required, secret | required, secret | Storage | Credencial do storage provider. |
| `ObjectStorage:Region` | `ObjectStorage__Region` | required | required, derived | required, derived | Storage | Local usa `us-east-1`. Para R2, confirmar valor esperado na slice de deploy target. |
| `ObjectStorage:ForcePathStyle` | `ObjectStorage__ForcePathStyle` | required, local-only | required | required | Storage | Local MinIO normalmente usa `true`. Provider real precisa confirmacao. |
| `ObjectStorage:AutoCreateBucket` | `ObjectStorage__AutoCreateBucket` | optional, local-only | required | required | Storage | Deve ser `false` em staging/producao salvo decisao formal contraria. |

## API - Payment

| Config key | Runtime env canonico | Local | Staging | Production | Classificacao | Observacoes |
|---|---|---|---|---|---|---|
| `Payments:ProviderName` | `Payments__ProviderName` | required, local-only | required, pending | required, pending | Payment | Local atual usa `FakeCheckout`. Provider real/staging esta pendente. |
| `Payments:CheckoutBaseUrl` | `Payments__CheckoutBaseUrl` | required, local-only | required, derived, pending | required, derived, pending | Payment | Deve apontar para checkout do provider escolhido. |
| `Payments:WebhookSecret` | `Payments__WebhookSecret` | required, secret, local-only | required, secret | required, secret | Payment | Usado no header `X-Payment-Webhook-Secret`. |

## API - Runtime / Hosting

| Config key | Runtime env canonico | Local | Staging | Production | Classificacao | Observacoes |
|---|---|---|---|---|---|---|
| `ASPNETCORE_ENVIRONMENT` | `ASPNETCORE_ENVIRONMENT` | required, local-only | required | required | Runtime | Local usa `Development`. Staging deve usar `Staging`; producao deve usar `Production`. |
| `AllowedHosts` | `AllowedHosts` | optional, local-only | required, derived | required, derived | Runtime | `*` e aceitavel apenas localmente. |
| API public URL | `ECOPICKUP_API_PUBLIC_URL` | optional | required, derived, pending | required, derived, pending | Runtime | Variavel operacional proposta para documentacao/runbooks; ainda nao e consumida pelo codigo. |

## API - Observabilidade Basica

| Config key | Runtime env canonico | Local | Staging | Production | Classificacao | Observacoes |
|---|---|---|---|---|---|---|
| `Logging:LogLevel:Default` | `Logging__LogLevel__Default` | optional | required | required | Observabilidade | Default atual: `Information`. |
| `Logging:LogLevel:Microsoft.AspNetCore` | `Logging__LogLevel__Microsoft.AspNetCore` | optional | required | required | Observabilidade | Default atual: `Warning`. |
| Log destination | `ECOPICKUP_LOG_DESTINATION` | optional | required, pending | required, pending | Observabilidade | Variavel operacional proposta; destino ainda nao escolhido. |
| Health endpoint URL | `ECOPICKUP_HEALTHCHECK_URL` | optional | required, derived | required, derived | Observabilidade | Variavel operacional proposta para smoke/monitoramento; endpoint tecnico atual e `/health`. |

## Web - API Integration

| Config key | Runtime env canonico | Local | Staging | Production | Classificacao | Observacoes |
|---|---|---|---|---|---|---|
| API base URL | `ECOPICKUP_API_BASE_URL` | required, local-only | required, derived | required, derived | Web/API | Unica variavel web atualmente consumida pelo codigo. Deve apontar para a API do mesmo ambiente. |
| Web public URL | `ECOPICKUP_WEB_PUBLIC_URL` | optional | required, derived, pending | required, derived, pending | Web | Variavel operacional proposta para runbooks, cookies, callbacks e smoke; ainda nao e consumida pelo codigo. |
| Node environment | `NODE_ENV` | derived | derived | derived | Web | Gerenciado pelo runtime/build do Next.js. Afeta cookie `secure` quando `production`. |

## Local-only Docker / Compose

| Config key | Runtime env canonico | Local | Staging | Production | Classificacao | Observacoes |
|---|---|---|---|---|---|---|
| Postgres database | `ECOPICKUP_POSTGRES_DB` | required, local-only | not used | not used | Banco local | Usado pelo Docker Compose local. |
| Postgres user | `ECOPICKUP_POSTGRES_USER` | required, local-only | not used | not used | Banco local | Usado pelo Docker Compose local. |
| Postgres password | `ECOPICKUP_POSTGRES_PASSWORD` | required, secret, local-only | not used | not used | Banco local | Usado pelo Docker Compose local. |
| Postgres port | `ECOPICKUP_POSTGRES_PORT` | optional, local-only | not used | not used | Banco local | Usado pelo Docker Compose local. |
| MinIO root user | `ECOPICKUP_MINIO_ROOT_USER` | required, secret, local-only | not used | not used | Storage local | Usado pelo Docker Compose local. |
| MinIO root password | `ECOPICKUP_MINIO_ROOT_PASSWORD` | required, secret, local-only | not used | not used | Storage local | Usado pelo Docker Compose local. |
| MinIO API port | `ECOPICKUP_MINIO_API_PORT` | optional, local-only | not used | not used | Storage local | Usado pelo Docker Compose local. |
| MinIO console port | `ECOPICKUP_MINIO_CONSOLE_PORT` | optional, local-only | not used | not used | Storage local | Usado pelo Docker Compose local. |
| Payment provider | `ECOPICKUP_PAYMENT_PROVIDER` | required, local-only | not canonical | not canonical | Payment local | Alias local existente; runtime API canonico e `Payments__ProviderName`. |
| Payment checkout URL | `ECOPICKUP_PAYMENT_CHECKOUT_BASE_URL` | required, local-only | not canonical | not canonical | Payment local | Alias local existente; runtime API canonico e `Payments__CheckoutBaseUrl`. |
| Payment webhook secret | `ECOPICKUP_PAYMENT_WEBHOOK_SECRET` | required, secret, local-only | not canonical | not canonical | Payment local | Alias local existente; runtime API canonico e `Payments__WebhookSecret`. |

## Matriz minima por ambiente

### Local

Obrigatorias:

- `ECOPICKUP_POSTGRES_DB`
- `ECOPICKUP_POSTGRES_USER`
- `ECOPICKUP_POSTGRES_PASSWORD`
- `ECOPICKUP_MINIO_ROOT_USER`
- `ECOPICKUP_MINIO_ROOT_PASSWORD`
- `ECOPICKUP_API_BASE_URL`
- `ConnectionStrings__Database` ou `appsettings.Development.json`
- `Jwt__Issuer` ou `appsettings.Development.json`
- `Jwt__Audience` ou `appsettings.Development.json`
- `Jwt__SigningKey` ou `appsettings.Development.json`
- `ObjectStorage__ServiceUrl` ou `appsettings.Development.json`
- `ObjectStorage__BucketName` ou `appsettings.Development.json`
- `ObjectStorage__AccessKey` ou `appsettings.Development.json`
- `ObjectStorage__SecretKey` ou `appsettings.Development.json`
- `Payments__ProviderName` ou `appsettings.Development.json`
- `Payments__CheckoutBaseUrl` ou `appsettings.Development.json`
- `Payments__WebhookSecret` ou `appsettings.Development.json`
- `ASPNETCORE_ENVIRONMENT=Development`

Opcionais:

- `ECOPICKUP_POSTGRES_PORT`
- `ECOPICKUP_MINIO_API_PORT`
- `ECOPICKUP_MINIO_CONSOLE_PORT`
- `Persistence__ApplyMigrationsOnStartup`
- `Logging__LogLevel__Default`
- `Logging__LogLevel__Microsoft.AspNetCore`

### Staging

Obrigatorias:

- `ConnectionStrings__Database`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__SigningKey`
- `Jwt__AccessTokenLifetimeMinutes`
- `ObjectStorage__ServiceUrl`
- `ObjectStorage__BucketName`
- `ObjectStorage__AccessKey`
- `ObjectStorage__SecretKey`
- `ObjectStorage__Region`
- `ObjectStorage__ForcePathStyle`
- `ObjectStorage__AutoCreateBucket`
- `Payments__ProviderName`
- `Payments__CheckoutBaseUrl`
- `Payments__WebhookSecret`
- `Persistence__ApplyMigrationsOnStartup`
- `ASPNETCORE_ENVIRONMENT=Staging`
- `AllowedHosts`
- `Logging__LogLevel__Default`
- `Logging__LogLevel__Microsoft.AspNetCore`
- `ECOPICKUP_API_BASE_URL`
- `ECOPICKUP_API_PUBLIC_URL`
- `ECOPICKUP_WEB_PUBLIC_URL`
- `ECOPICKUP_HEALTHCHECK_URL`
- `ECOPICKUP_LOG_DESTINATION`

Secrets:

- `ConnectionStrings__Database`
- `Jwt__SigningKey`
- `ObjectStorage__AccessKey`
- `ObjectStorage__SecretKey`
- `Payments__WebhookSecret`

Pendentes:

- plataforma de deploy
- provider de payment
- URLs publicas
- destino de logs
- politica de migrations
- valores de storage provider

### Production

Obrigatorias:

- todas as obrigatorias de staging, com valores isolados de producao

Secrets:

- todos os secrets de staging, com valores exclusivos de producao

Regras adicionais:

- nenhum default local
- nenhum segredo em arquivo versionado
- `AllowedHosts` restrito aos hosts reais
- `ObjectStorage__AutoCreateBucket=false`, salvo decisao operacional formal
- `Persistence__ApplyMigrationsOnStartup` definido por decisao de deploy, nao por conveniencia
- `Payments__ProviderName` nao deve ser `FakeCheckout` para cobranca real

## Decisoes pendentes

- Plataforma de hosting da API.
- Plataforma de hosting da web.
- Banco gerenciado para staging/producao.
- Provider de payment real ou sandbox.
- URLs publicas de API e web.
- Dominio e TLS.
- Secret manager.
- Destino central de logs.
- Politica de migrations em deploy.
- Politica de cookies/session para ambiente HTTPS.
- Confirmacao de parametros Cloudflare R2, incluindo `Region`, `ForcePathStyle` e bucket por ambiente.
- Se as variaveis operacionais propostas (`ECOPICKUP_API_PUBLIC_URL`, `ECOPICKUP_WEB_PUBLIC_URL`, `ECOPICKUP_HEALTHCHECK_URL`, `ECOPICKUP_LOG_DESTINATION`) serao apenas runbook ou tambem runtime tecnico.

## Riscos e document gaps

### Alto

- Sem secret manager escolhido, o risco de configurar secrets de forma inconsistente em staging/producao continua alto.
- Sem decisao de migration, `Persistence__ApplyMigrationsOnStartup` pode virar decisao implicita perigosa.
- Payment provider ainda e fake; deploy com cobranca real depende de decisao futura.

### Medio

- `.env.example` usa aliases `ECOPICKUP_PAYMENT_*`, enquanto o runtime ASP.NET canonico usa `Payments__*`; isso precisa ser tratado em slice futura se o arquivo exemplo for atualizado.
- `AllowedHosts=*` existe no appsettings base e deve ser restringido antes de producao.
- Variaveis operacionais de URL publica e observabilidade ainda nao sao consumidas por codigo.

### Baixo

- A web tem contrato runtime pequeno hoje, mas cookies/session em HTTPS ainda precisam de validacao operacional futura.
- Defaults locais sao suficientes para desenvolvimento, mas nao representam staging.

## Proxima slice recomendada

`EPIC-014C - Local Full-Stack Runbook`

Objetivo sugerido: documentar o procedimento reproduzivel para subir Postgres, MinIO, API e web localmente e validar `/health`, sem alterar Docker, appsettings ou codigo.

## Confirmacao de boundary

Esta slice nao alterou `.env.example`, `appsettings`, codigo, Docker, CI/CD, runtime, secrets reais, staging, producao, observabilidade tecnica ou deploy.
