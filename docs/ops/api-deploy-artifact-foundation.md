# EcoPickup - API Deploy Artifact Foundation

## Contexto

Slice: `EPIC-014F - API Deploy Artifact Foundation`

Data: 2026-04-12

Objetivo: criar e validar o artefato minimo de deploy da API para Render Web Service com Docker, validando localmente o container e o comportamento basico de runtime, sem provisionar staging e sem deploy real.

## Estado de entrada

Base considerada:

- `EPIC-014D` definiu Render Web Service com Docker como alvo recomendado da API.
- `EPIC-014E` definiu que o artefato Docker da API deve ser validado antes de qualquer staging real.
- API atual roda em .NET 8.
- `/health` ja existe e inclui check de PostgreSQL quando `ConnectionStrings__Database` esta configurado.

## Artefato criado

Arquivo criado:

- `apps/api/Dockerfile`
- `apps/api/.dockerignore`

Caracteristicas:

- build multi-stage com `mcr.microsoft.com/dotnet/sdk:8.0`
- runtime com `mcr.microsoft.com/dotnet/aspnet:8.0`
- publica `src/EcoPickup.Api/EcoPickup.Api.csproj` em `Release`
- expoe porta interna `8080`
- usa `PORT` quando fornecida pela plataforma, com fallback para `8080`
- define `ASPNETCORE_ENVIRONMENT=Production` como default do container
- exclui `bin/` e `obj/` locais do contexto Docker para evitar sobrescrever assets restaurados dentro da imagem

## Runtime assumptions

### Porta

O container escuta em:

```txt
http://+:${PORT:-8080}
```

Para validacao local, a porta interna usada foi `8080`.

### Banco

Para `/health` retornar `Healthy`, o container precisa de `ConnectionStrings__Database` apontando para um PostgreSQL acessivel a partir do container.

Na validacao local, a API containerizada apontou para o PostgreSQL local via:

```txt
Host=host.docker.internal;Port=5432;Database=ecopickup_dev;Username=postgres;Password=postgres
```

Em staging, esse valor deve ser substituido pela connection string gerenciada do Render Postgres.

### Storage

O container precisa das variaveis `ObjectStorage__*` documentadas em `docs/ops/runtime-environment-contract.md` para fluxos que usam upload/leitura de fotos.

`/health` nao valida storage hoje.

### Payment

O container usa as variaveis `Payments__*` documentadas em `docs/ops/runtime-environment-contract.md`.

O runtime atual usa `FakeCheckout` como provider registrado na infraestrutura.

### Migrations

Esta slice nao executou migrations.

`Persistence__ApplyMigrationsOnStartup` deve continuar sendo decisao operacional explicita antes do primeiro staging real.

## Comandos reais usados

```powershell
dotnet build apps/api/EcoPickup.Backend.sln
dotnet test apps/api/tests/EcoPickup.UnitTests/EcoPickup.UnitTests.csproj
docker compose -f docker/compose.yaml ps
docker compose -f docker/compose.yaml up -d
docker build -f apps/api/Dockerfile -t ecopickup-api:014f apps/api
docker run --name ecopickup-api-014f --rm -d -p 5082:8080 -e ASPNETCORE_ENVIRONMENT=Development -e ConnectionStrings__Database="Host=host.docker.internal;Port=5432;Database=ecopickup_dev;Username=postgres;Password=postgres" ecopickup-api:014f
Invoke-WebRequest -Uri http://localhost:5082/health -UseBasicParsing
docker logs ecopickup-api-014f
docker stop ecopickup-api-014f
```

## Evidencias

### Build backend

Comando:

```powershell
dotnet build apps/api/EcoPickup.Backend.sln
```

Resultado:

```txt
Build succeeded.
0 Warning(s)
0 Error(s)
```

Observacao:

- O build falhou dentro do sandbox sem erro MSBuild explicito.
- Reexecutado com permissao elevada, passou.

### Testes backend

Comando:

```powershell
dotnet test apps/api/tests/EcoPickup.UnitTests/EcoPickup.UnitTests.csproj
```

Resultado:

```txt
Passed! - Failed: 0, Passed: 37, Skipped: 0, Total: 37
```

### Infra local usada pela validacao

Comando:

```powershell
docker compose -f docker/compose.yaml ps
```

Resultado:

```txt
ecopickup-postgres Up ... (healthy) 0.0.0.0:5432->5432/tcp
ecopickup-minio    Up ...           0.0.0.0:9000-9001->9000-9001/tcp
```

### Docker build

Comando:

```powershell
docker build -f apps/api/Dockerfile -t ecopickup-api:014f apps/api
```

Resultado final:

```txt
EcoPickup.Api -> /app/publish/
naming to docker.io/library/ecopickup-api:014f done
```

### Docker run

Comando:

```powershell
docker run --name ecopickup-api-014f --rm -d -p 5082:8080 -e ASPNETCORE_ENVIRONMENT=Development -e ConnectionStrings__Database="Host=host.docker.internal;Port=5432;Database=ecopickup_dev;Username=postgres;Password=postgres" ecopickup-api:014f
```

Resultado:

```txt
7a4c6dbc9c625828a363cd6e2b73abe29ef389d5e874c6949001d003274401c3
```

Status do container:

```txt
ecopickup-api-014f Up ... 0.0.0.0:5082->8080/tcp
```

### Health check

Comando:

```powershell
Invoke-WebRequest -Uri http://localhost:5082/health -UseBasicParsing
```

Resultado:

```txt
StatusCode: 200
Content: Healthy
```

### Logs do container

Comando:

```powershell
docker logs ecopickup-api-014f
```

Evidencias relevantes:

```txt
Now listening on: http://[::]:8080
Application started.
Hosting environment: Development
Content root path: /app
```

Warnings observados:

```txt
Storing keys in a directory '/root/.aspnet/DataProtection-Keys' that may not be persisted outside of the container.
No XML encryptor configured.
Overriding HTTP_PORTS '8080' and HTTPS_PORTS ''. Binding to values defined by URLS instead 'http://+:8080'.
```

### Encerramento do container efemero

Comando:

```powershell
docker stop ecopickup-api-014f
```

Resultado:

```txt
ecopickup-api-014f
```

## Bloqueios e gaps

### Bloqueio corrigido

O primeiro `docker build` falhou no `dotnet publish` com:

```txt
error NETSDK1064: Package AWSSDK.S3, version 3.7.414 was not found.
```

Causa:

- O contexto Docker estava copiando `bin/` e `obj/` locais para dentro da imagem.
- Esses artefatos sobrescreviam os assets restaurados no ambiente Linux do build.

Menor correcao aplicada:

- criar `apps/api/.dockerignore` excluindo `**/bin/` e `**/obj/`.

### Gaps remanescentes

Alto:

- Ainda nao ha estrategia formal de migrations para staging.
- Ainda nao ha secrets reais de staging.

Medio:

- Docker segue exigindo permissao elevada neste ambiente Windows.
- O container foi validado em `ASPNETCORE_ENVIRONMENT=Development` para reutilizar configuracoes locais e Postgres local; staging deve usar `Staging`.
- Data Protection em container emite warning de chave efemera em `/root/.aspnet/DataProtection-Keys`; nao bloqueia `/health`, mas deve ser revisado antes de runtime real se a API passar a depender de Data Protection persistente.

Baixo:

- O log informa override de `HTTP_PORTS` por `ASPNETCORE_URLS`; o comportamento e intencional para suportar `PORT` com fallback `8080`.

## Boundary

Esta slice nao provisionou Render, Vercel, R2 ou banco, nao criou staging, nao alterou CI/CD, nao criou Dockerfile da web, nao executou deploy real, nao configurou secrets reais e nao implementou observabilidade.
