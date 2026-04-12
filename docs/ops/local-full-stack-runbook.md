# EcoPickup - Local Full-Stack Runbook

## Contexto

Slice: `EPIC-014C - Local Full-Stack Runbook`

Data: 2026-04-12

Objetivo: documentar e validar na pratica a subida local do stack atual, cobrindo Postgres, MinIO, API e web antes de qualquer avanco de infra/deploy.

## Resultado executivo

Validacao local concluida com sucesso parcial e evidencias reais.

Subiu com sucesso:

- PostgreSQL local via Docker Compose
- MinIO local via Docker Compose
- API ASP.NET Core em `http://localhost:5081`
- endpoint API `/health`
- web Next.js em `http://127.0.0.1:3001`
- integracao basica API -> web com sessao autenticada e leitura de dashboard owner

Gaps operacionais encontrados:

- Docker precisou de permissao elevada para acessar o daemon no Windows.
- `pnpm` via PowerShell falhou por `ExecutionPolicy`; `pnpm.cmd` funcionou.
- Node local esta em `v22.21.1`, abaixo da baseline documentada `24.14.1`.
- `dotnet build` falhou dentro do sandbox sem erro MSBuild explicito; com permissao elevada, passou.
- O comando `pnpm --filter @ecopickup/web dev -- --hostname localhost --port 3000` nao e adequado neste workspace porque repassa argumentos de forma incorreta para o Next.
- A porta `3000` ficou ocupada/travada durante a primeira tentativa; a validacao final usou `3001`.
- Submissao manual de Server Action via script nao foi considerada evidencia valida de browser, porque retornou erro de FormData/Server Action.

## Pre-requisitos validados

Comandos executados:

```powershell
docker --version
docker compose version
node --version
pnpm.cmd --version
dotnet --version
```

Resultados:

- Docker: `29.2.0`
- Docker Compose: `v5.0.2`
- Node: `v22.21.1`
- pnpm: `10.26.0`
- .NET SDK: `8.0.408`

Observacoes:

- Docker emitiu aviso de acesso negado a `C:\Users\ricardodev\.docker\config.json`, mas o comando de versao retornou com sucesso.
- `pnpm --version` falhou por politica de execucao do PowerShell. Usar `pnpm.cmd --version`.
- A baseline documental atual pede Node `24.14.1`; o ambiente validado esta com Node `22.21.1`.

## Variaveis locais usadas

Baseadas em `docs/ops/runtime-environment-contract.md`:

- `ECOPICKUP_API_BASE_URL=http://localhost:5081`
- `ASPNETCORE_ENVIRONMENT=Development`

Defaults locais consumidos por arquivos existentes:

- PostgreSQL local em `localhost:5432`
- database `ecopickup_dev`
- user `postgres`
- password `postgres`
- MinIO API em `localhost:9000`
- MinIO console em `localhost:9001`
- payment provider `FakeCheckout`

## Ordem validada de subida local

### 1. Subir infraestrutura local

Comando executado:

```powershell
docker compose -f docker/compose.yaml up -d
```

Resultado inicial sem permissao elevada:

- Falhou com acesso negado ao Docker daemon:

```txt
open //./pipe/docker_engine: Access is denied
```

Resultado com permissao elevada:

```txt
Container ecopickup-minio Running
Container ecopickup-postgres Running
```

### 2. Validar containers

Comandos executados:

```powershell
docker compose -f docker/compose.yaml ps
docker exec ecopickup-postgres pg_isready -U postgres -d ecopickup_dev
Test-NetConnection -ComputerName localhost -Port 9000
Test-NetConnection -ComputerName localhost -Port 9001
```

Evidencias:

- `ecopickup-postgres`: `Up ... (healthy)`
- `ecopickup-minio`: `Up`
- `pg_isready`: `accepting connections`
- porta `9000`: `TcpTestSucceeded : True`
- porta `9001`: `TcpTestSucceeded : True`

### 3. Build da API

Comando executado:

```powershell
dotnet build apps/api/EcoPickup.Backend.sln
```

Resultado inicial sem permissao elevada:

- Falhou durante restore/build sem erro MSBuild explicito.

Resultado com permissao elevada:

```txt
Build succeeded.
0 Warning(s)
0 Error(s)
```

### 4. Subir API local

Comando executado:

```powershell
$env:ASPNETCORE_ENVIRONMENT='Development'
dotnet run --project apps/api/src/EcoPickup.Api/EcoPickup.Api.csproj --urls http://localhost:5081
```

Validacao executada:

```powershell
Invoke-WebRequest -Uri http://localhost:5081/health -UseBasicParsing
```

Evidencia:

```txt
StatusCode: 200
Content: Healthy
```

### 5. Subir web local

Comando que falhou:

```powershell
$env:ECOPICKUP_API_BASE_URL='http://localhost:5081'
pnpm.cmd --filter @ecopickup/web dev -- --hostname localhost --port 3000
```

Causa:

- O Next interpretou `--hostname` como diretorio.

Comando correto validado:

```powershell
$env:ECOPICKUP_API_BASE_URL='http://localhost:5081'
pnpm.cmd --dir apps/web dev --hostname 127.0.0.1 --port 3001
```

Observacoes:

- Uma tentativa em `3000` ficou com porta ocupada/travada.
- A validacao final usou `3001`.

Validacao executada:

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:3001/auth/register -UseBasicParsing
```

Evidencia:

```txt
StatusCode: 200
```

### 6. Validar integracao basica web -> API

Fluxo validado:

1. Criar usuario via API local.
2. Fazer login via API local.
3. Criar cookie `ecopickup_session` com o token retornado pela API.
4. Acessar `/requests` pela web com esse cookie.
5. Confirmar que a web respondeu `200` sem redirecionar para login.
6. Confirmar que a API respondeu `200 []` para `GET /api/v1/pickup-requests` com o mesmo token.

Comandos executados, em forma resumida:

```powershell
Invoke-RestMethod -Uri http://localhost:5081/api/v1/auth/register -Method Post
Invoke-RestMethod -Uri http://localhost:5081/api/v1/auth/login -Method Post
Invoke-WebRequest -Uri http://localhost:5081/api/v1/pickup-requests -Headers @{ Authorization = "Bearer <token>" }
Invoke-WebRequest -Uri http://127.0.0.1:3001/requests -Headers @{ Cookie = "ecopickup_session=<session-json>" }
```

Evidencias finais:

```txt
ApiListStatus: 200
ApiListBody: []
WebStatus: 200
WebNotLogin: True
```

Conclusao:

- A API autenticou usuario local e retornou token valido.
- A API respondeu a listagem autenticada de pickup requests.
- A web aceitou a sessao baseada no token da API e renderizou a rota owner autenticada.
- Esse check valida uma integracao basica web -> API no stack local atual.

## Comandos reais usados

```powershell
docker --version
docker compose version
node --version
pnpm --version
pnpm.cmd --version
dotnet --version
docker compose -f docker/compose.yaml up -d
docker compose -f docker/compose.yaml ps
docker exec ecopickup-postgres pg_isready -U postgres -d ecopickup_dev
Test-NetConnection -ComputerName localhost -Port 9000
Test-NetConnection -ComputerName localhost -Port 9001
dotnet build apps/api/EcoPickup.Backend.sln
dotnet run --project apps/api/src/EcoPickup.Api/EcoPickup.Api.csproj --urls http://localhost:5081
Invoke-WebRequest -Uri http://localhost:5081/health -UseBasicParsing
pnpm.cmd --filter @ecopickup/web dev -- --hostname localhost --port 3000
pnpm.cmd --dir apps/web dev --hostname localhost --port 3000
pnpm.cmd --dir apps/web dev --hostname 127.0.0.1 --port 3001
Invoke-WebRequest -Uri http://127.0.0.1:3001/auth/register -UseBasicParsing
Invoke-RestMethod -Uri http://localhost:5081/api/v1/auth/register -Method Post
Invoke-RestMethod -Uri http://localhost:5081/api/v1/auth/login -Method Post
Invoke-WebRequest -Uri http://localhost:5081/api/v1/pickup-requests
Invoke-WebRequest -Uri http://127.0.0.1:3001/requests
Stop-Process -Id <api/web-process-ids> -Force
```

## Checks validados

- Infra local sobe: validado.
- PostgreSQL fica healthy: validado.
- Storage local responde nas portas esperadas: validado.
- API builda: validado com permissao elevada.
- API sobe localmente: validado.
- API `/health` responde `200 Healthy`: validado.
- Web sobe localmente: validado em `127.0.0.1:3001`.
- Web aponta para API correta: validado por sessao/token e rota owner autenticada.
- Integracao basica web -> API: validada.

## Bloqueios e gaps

### Alto

- Ambiente local de Node diverge da baseline: `v22.21.1` vs `24.14.1`.
- Docker e `dotnet build` exigiram permissao elevada neste ambiente para validacao completa.

### Medio

- Comando de web via `--filter` e repasse de argumentos e uma armadilha operacional.
- Porta `3000` pode ficar ocupada/travada; runbook deve permitir porta alternativa.
- Submissao automatizada de Server Action sem browser nao e evidencia confiavel.

### Baixo

- Docker emite warning de acesso a `C:\Users\ricardodev\.docker\config.json`.
- `pnpm` direto no PowerShell falha por Execution Policy; `pnpm.cmd` deve ser usado no Windows.

## Comandos de parada nao destrutiva

Encerrar API/web iniciados manualmente:

```powershell
Stop-Process -Id <process-id> -Force
```

Parar containers sem remover volumes:

```powershell
docker compose -f docker/compose.yaml stop
```

Nao usar em rotina normal se quiser preservar dados locais:

```powershell
docker compose -f docker/compose.yaml down -v
```

## Boundary

Esta slice nao executou deploy, nao criou staging, nao implementou observabilidade, nao alterou CI/CD, nao alterou Docker, nao alterou `.env.example`, nao alterou `appsettings`, nao alterou codigo e nao fez commit.
