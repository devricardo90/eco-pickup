# EcoPickup - Staging Provisioning Execution

## Contexto

Slice: `EPIC-014I - Staging Provisioning Execution`

Data: 2026-04-12

Objetivo: executar o provisionamento real dos recursos minimos de staging definidos nas slices anteriores, usando apenas contas/workspaces aprovados, sem versionar secrets e parando no primeiro bloqueio de acesso, billing, plano ou permissao.

## Estado de entrada

Base considerada:

- `EPIC-014D` definiu a stack alvo: Vercel, Render Web Service, Render Postgres, Cloudflare R2 e logs nativos.
- `EPIC-014E` definiu plano de staging, smoke test e rollback.
- `EPIC-014F` criou e validou o Docker artifact da API.
- `EPIC-014G` definiu migration manual controlada para staging.
- `EPIC-014H` definiu o checklist final de provisionamento.

Autorizacao recebida nesta execucao:

- provisionamento real e possivel custo foram autorizados pelo responsavel do projeto.
- continua obrigatorio usar apenas contas/workspaces aprovados.
- continua proibido versionar secrets ou valores sensiveis.

## Tentativa de execucao

Foram verificados os meios locais disponiveis para operar as plataformas aprovadas:

```txt
Get-Command render -ErrorAction SilentlyContinue
Get-Command vercel -ErrorAction SilentlyContinue
Get-Command wrangler -ErrorAction SilentlyContinue
```

Resultado:

- `render` CLI nao encontrado no `PATH`.
- `vercel` CLI nao encontrado no `PATH`.
- `wrangler` CLI nao encontrado no `PATH`.
- nenhum contexto autenticado de Render, Vercel ou Cloudflare foi identificado nesta sessao.

## Bloqueio

Provisionamento real bloqueado por ausencia de meio autenticado e aprovado para criar recursos externos.

Nao foi possivel confirmar:

- conta/workspace Render aprovado.
- conta/team Vercel aprovado.
- conta Cloudflare aprovada.
- owner de billing das plataformas.
- region final do Render para API e banco.
- planos finais de Render Web Service e Render Postgres.
- environment Vercel final: Preview ou custom staging.
- parametros finais do R2 em conta real.
- provider de payment staging/sandbox.
- usuario/admin seed para smoke.
- modo final de deploy Docker no Render: Git-backed Docker build ou registry.

## Recursos provisionados

Nenhum recurso externo foi provisionado.

Nao foram criados:

- Render Postgres staging.
- Render Environment Group da API.
- Render Web Service da API.
- Cloudflare R2 bucket de staging.
- Cloudflare R2 token de staging.
- Vercel project/environment de staging.

## Envs e secrets

Nenhum valor real de secret foi criado, lido, registrado ou versionado.

Nenhuma env var foi configurada em plataforma externa porque o acesso autenticado nao estava disponivel.

Diretriz preservada para a proxima tentativa:

```txt
Persistence__ApplyMigrationsOnStartup=false
```

## Estado do staging

O staging nao ficou pronto para migration/deploy.

## Atualizacao operacional - PostgreSQL health check em staging

Data: 2026-04-16

Contexto:

- A API de staging no Render subiu normalmente.
- A aplicacao leu `ConnectionStrings__Database` com host interno curto do Render Postgres.
- O health check `postgresql` retornava `UNHEALTHY` mesmo com a API live.

Sintoma observado:

```txt
Health check PostgreSQL retornando UNHEALTHY
```

Causa registrada:

- Problema de conexao/configuracao no ambiente Render envolvendo connection string, variaveis de ambiente, SSL ou host.
- A causa foi tratada como configuracao de ambiente porque a aplicacao passou a ler a connection string esperada e a conexao real com o banco de staging foi validada posteriormente.
- Nao houve registro de secret real nesta documentacao.

Correcao aplicada:

- Ajuste da connection string do Render para o PostgreSQL de staging.
- Validacao de conexao real com o banco de staging.
- Health check da API mantido como verificacao real de PostgreSQL.

Validacao final observada:

```txt
[DB-CONNECT] Database startup connection validation succeeded.
GET /health -> Healthy
```

Hardening permanente definido apos o incidente:

- `ConnectionStrings__Database` deve vir do ambiente em staging/producao.
- A API deve falhar no startup se a connection string `Database` nao existir.
- A API nao deve aceitar `localhost`, `127.0.0.1` ou `::1` como host de banco fora de `Development`.
- O health check de PostgreSQL deve usar conexao real via `AddNpgSql(...)`.
- Logs de startup devem registrar tentativa, sucesso ou falha de conexao sem expor senha.

## Atualizacao operacional - upload de fotos / storage R2 em staging

Data: 2026-04-17

Contexto:

- Upload de fotos falhava com `500` no endpoint `POST /api/v1/pickup-items/{itemId}/photos`.
- Logs apontavam falha em `AmazonS3Util.DoesS3BucketExistV2Async` chamada por `S3ItemPhotoStorage.EnsureBucketExistsAsync`.
- A stack alvo documentada para staging e Cloudflare R2 via API S3-compatible, nao AWS S3 nativo.

Causa registrada:

- Storage R2/S3-compatible nao estava completamente configurado no ambiente Render.
- O runtime tambem dependia de `EnsureBucketExistsAsync` antes de cada primeiro upload do processo. Esse pre-check usa operacao de bucket e transforma erro de endpoint, credencial, permissao ou bucket ausente em falha antes do `PutObject`.
- Em staging/producao, bucket e credenciais devem ser provisionados fora da aplicacao; a API nao deve criar ou validar bucket como requisito de runtime para cada upload.

Correcao aplicada:

- `ObjectStorage__AutoCreateBucket=false` passa a ser o comportamento default nao-development.
- Quando `AutoCreateBucket=false`, a API nao executa `DoesS3BucketExistV2Async` antes do upload; ela tenta `PutObject` diretamente no bucket configurado.
- Logs de storage foram endurecidos com prefixo `[OBJECT-STORAGE]` e classificacao de falha:
  - `connection_error`
  - `credential_or_permission_error`
  - `bucket_missing`
  - `s3_service_error`
- Falhas de cleanup best-effort agora geram warning sem expor secrets.

Variaveis obrigatorias para Render API usando Cloudflare R2:

```txt
ObjectStorage__ServiceUrl=https://<CLOUDFLARE_ACCOUNT_ID>.r2.cloudflarestorage.com
ObjectStorage__BucketName=ecopickup-media-stg
ObjectStorage__AccessKey=<R2_ACCESS_KEY_ID>
ObjectStorage__SecretKey=<R2_SECRET_ACCESS_KEY>
ObjectStorage__Region=auto
ObjectStorage__ForcePathStyle=true
ObjectStorage__AutoCreateBucket=false
```

Validacao operacional necessaria no Render/Cloudflare:

1. Confirmar que o bucket R2 `ecopickup-media-stg` existe na conta Cloudflare aprovada.
2. Confirmar que o token R2 usado pelo Render tem permissao minima para operar objetos nesse bucket.
3. Confirmar que `ObjectStorage__ServiceUrl` usa o endpoint S3-compatible da conta Cloudflare.
4. Confirmar que as env vars estao no Render Web Service ou Environment Group vinculado a API.
5. Redeployar a API apos salvar as env vars.
6. Executar smoke de upload autenticado e verificar logs `[OBJECT-STORAGE]` caso falhe.

## Atualizacao operacional - retomada do smoke R2

Data: 2026-04-21

Objetivo da retomada:

- executar a menor fatia reversivel restante da `EPIC-014I`: configurar storage R2 em staging, redeployar a API e validar smoke autenticado de upload de imagem.

Estado reconstruido antes da execucao:

- `HEAD` local em `f4500f71610bce56230a804cd3cee982cd4b06c5`.
- branch local: `main`.
- API staging no Render e Render Postgres ja tinham evidencias documentais de conexao real e `/health` `Healthy`.
- nao ha evidencia documental de migrations aplicadas em staging.
- nao ha evidencia documental de front/Vercel concluido apontando para a API de staging.
- havia mudancas locais nao commitadas em codigo, documentacao operacional e arquivos nao rastreados; essas mudancas nao foram tratadas como checkpoint fechado.

Classificacao das mudancas locais observadas:

- codigo: hardening de banco/startup em `apps/api/src/EcoPickup.Api/Program.cs` e `apps/api/src/EcoPickup.Infrastructure/DependencyInjection/InfrastructureServiceCollectionExtensions.cs`.
- testes: novo teste nao rastreado em `apps/api/tests/EcoPickup.UnitTests/Infrastructure/InfrastructureServiceCollectionExtensionsTests.cs`.
- documentacao operacional: `docs/ops/backlog.md`, `docs/ops/runtime-environment-contract.md`, `docs/ops/staging-provisioning-execution.md` e `docs/ops/status.md`.
- documentacao/assets de produto: `docs/product/item-photo-reference.md` e assets em `docs/assets/`.

Dependencias R2 verificadas sem expor valores:

- `render`, `vercel` e `wrangler` CLI nao estavam disponiveis no `PATH`.
- as env vars locais `ObjectStorage__ServiceUrl`, `ObjectStorage__BucketName`, `ObjectStorage__AccessKey`, `ObjectStorage__SecretKey`, `ObjectStorage__Region`, `ObjectStorage__ForcePathStyle`, `ObjectStorage__AutoCreateBucket`, `RENDER_API_KEY`, `CLOUDFLARE_API_TOKEN` e `VERCEL_TOKEN` nao estavam presentes.

Resultado da retomada:

- nenhuma env var foi alterada no Render.
- nenhum bucket R2 foi criado ou confirmado nesta sessao.
- nenhum token R2 foi criado, lido ou registrado.
- nenhum redeploy foi executado.
- nenhum smoke autenticado de upload foi executado.
- nenhuma migration foi executada.
- nenhum schema foi alterado.
- nenhum secret foi registrado no repositorio, docs ou logs.

Bloqueio atual:

- a fatia reversivel de upload staging continua bloqueada por ausencia de meio operacional autenticado/aprovado para Render e Cloudflare nesta sessao.
- o proximo passo executavel exige dashboard autenticado ou CLIs/tokens oficiais aprovados para configurar `ObjectStorage__*` no Render, confirmar/criar o bucket `ecopickup-media-stg`, redeployar a API e rodar o smoke de upload.

## Atualizacao operacional - Etapa 3 - Redeploy API

Data: 2026-04-21

Status informado: OK.

Evidencias registradas pelo operador:

- API staging redeployada com novas env vars de object storage.
- aplicacao iniciou com sucesso.
- ambiente confirmado como `Staging`.
- servico ficou live no Render.
- nao houve falha fatal de startup relacionada ao storage.

Observacoes:

- warnings de DataProtection/XML encryption foram observados, mas nao bloquearam a subida da API.
- esta etapa nao valida upload de imagem.
- esta etapa nao comprova migrations aplicadas.
- proxima validacao operacional do MVP atual: `/health`, login e fluxo principal sem upload de imagem.

## Atualizacao operacional - compatibilidade PutObject com Cloudflare R2

Data: 2026-04-21

Contexto:

- bucket R2 confirmado existente.
- env vars `ObjectStorage__*` configuradas no Render.
- API staging sobe normalmente e `/health` responde `Healthy`.
- login funciona.
- endpoint de upload responde.
- upload autenticado chega ate a camada de storage.

Erro raiz observado nos logs:

```txt
[OBJECT-STORAGE] Failed to upload item photo
Category=s3_service_error
Bucket=ecopickup-stg-media
Endpoint=https://7b72172fe39b6097765593c22e29f3c0.r2.cloudflarestorage.com
StatusCode=NotImplemented
ErrorCode=NotImplemented
Message=STREAMING-AWS4-HMAC-SHA256-PAYLOAD-TRAILER not implemented
```

Causa tecnica:

- o AWS SDK for .NET estava usando o comportamento default de checksum de request `WHEN_SUPPORTED`.
- para `PutObject` com stream, esse modo pode emitir assinatura/payload streaming com trailer de checksum.
- Cloudflare R2 rejeitou esse modo com `STREAMING-AWS4-HMAC-SHA256-PAYLOAD-TRAILER not implemented`.
- o erro nao foi tratado como problema de credencial, bucket inexistente ou autorizacao, porque o upload chegou ao storage e o provider retornou incompatibilidade de modo de payload.

Correcao aplicada:

- `AmazonS3Config.RequestChecksumCalculation` foi definido como `WHEN_REQUIRED`.
- o endpoint e o contrato de negocio do upload nao foram alterados.
- auth, banco, dominio e migrations permaneceram fora do escopo.

Validacao pendente:

- supersedida pela decisao de escopo de 2026-04-21: upload de imagem/R2 nao e gate do MVP publicavel atual.
- a correcao permanece registrada no historico, mas a validacao R2 fica para fase futura pos-deploy/refinamento.

Validacao local executada:

```txt
dotnet build apps/api/EcoPickup.Backend.sln --no-restore -p:UseSharedCompilation=false -m:1
dotnet test apps/api/tests/EcoPickup.UnitTests/EcoPickup.UnitTests.csproj --no-restore -p:UseSharedCompilation=false -m:1
```

Resultado:

- build backend passou.
- testes unitarios passaram: `40` passed, `0` failed.

Observacao:

- tentativas anteriores de build em paralelo falharam por lock de arquivo em `obj/bin` no Windows (`CS2012` em `EcoPickup.Domain.dll`), nao por erro da correcao S3/R2.
- o rerun sequencial com `UseSharedCompilation=false` e `-m:1` passou.

## Atualizacao operacional - desabilitar payload streaming assinado no PutObject

Data: 2026-04-21

Contexto:

- commit com a primeira correcao R2 foi deployado.
- `/health` continuou `Healthy`.
- login continuou funcional.
- upload autenticado continuou chegando ate a camada de storage.

Erro atual observado nos logs:

```txt
Amazon.S3.AmazonS3Exception: STREAMING-AWS4-HMAC-SHA256-PAYLOAD not implemented
```

Causa tecnica:

- `RequestChecksumCalculation=WHEN_REQUIRED` removeu o trailer de checksum, mas o SDK ainda podia enviar `PutObject` como payload streaming assinado/chunked.
- Cloudflare R2 tambem rejeitou esse modo de payload com `STREAMING-AWS4-HMAC-SHA256-PAYLOAD not implemented`.

Correcao aplicada:

- `PutObjectRequest.UseChunkEncoding=false`.
- `PutObjectRequest.DisablePayloadSigning=true`, usando `UNSIGNED-PAYLOAD` sobre HTTPS para evitar o modo streaming SigV4 incompativel com R2.
- `DisableDefaultChecksumValidation` nao foi alterado.
- endpoint, dominio, auth, banco, schema e migrations permaneceram fora do escopo.

Observacao:

- `ContentLength` foi considerado, mas a versao congelada do AWSSDK.S3 usada no projeto nao expoe essa propriedade diretamente em `PutObjectRequest`.

Validacao pendente:

- supersedida pela decisao de escopo de 2026-04-21: upload de imagem/R2 nao e gate do MVP publicavel atual.
- a retomada do upload deve ocorrer em fase futura pos-deploy/refinamento, com smoke R2 proprio.

## Atualizacao operacional - decisao de escopo do MVP publicavel

Data: 2026-04-21

Decisao aprovada:

- upload de imagem sai do MVP publicavel atual para destravar deploy e apresentacao de portfolio.
- a funcionalidade nao foi descartada.
- a fundacao tecnica, endpoint, historico de debugging e docs de storage permanecem registrados para retomada futura.
- Cloudflare R2/upload de foto deixa de ser gate critico da `EPIC-014I`.
- o deploy atual deve validar o fluxo principal sem upload de imagem.

Impacto operacional:

- nao alterar schema, banco, auth, dominio ou deploy pipeline por causa desta decisao.
- nao exigir smoke autenticado de upload de imagem para considerar o MVP atual apresentavel.
- nao remover o historico dos erros R2; ele sera a base da fase futura pos-deploy/refinamento.
- orientar README/portfolio para o fluxo owner/admin sem prometer upload de fotos no MVP publicado.

Novo gate minimo para seguir o deploy:

1. API staging live.
2. `/health` respondendo `Healthy`.
3. login funcionando.
4. fluxo principal de pickup request sem upload funcionando ou bloqueio registrado.
5. migrations confirmadas antes de validar fluxos persistidos.
6. front/Vercel apontando para API staging ou bloqueio registrado.

## Checklist minimo para destravar a EPIC-014I

Este e o ponto unico de retomada operacional da `EPIC-014I` apos a decisao de retirar upload de imagem do MVP publicavel atual.

### 1. Acessos e contas necessarios

- conta/workspace Render aprovado para staging.
- owner de billing Render confirmado.
- permissao para criar Render Postgres, Render Environment Group e Render Web Service.
- conta/team Vercel aprovado para staging.
- permissao para criar/configurar projeto Vercel e environment variables.
- repositorio acessivel pela plataforma escolhida ou registry aprovado para o Docker artifact.
- responsavel autorizado para configurar secrets reais diretamente nas plataformas.

### 2. Decisoes pendentes

- Render region final para API e banco.
- plano Render Web Service para `ecopickup-api-stg`.
- plano Render Postgres para `ecopickup-postgres-stg`.
- Vercel environment: Preview ou custom staging.
- dominio customizado agora ou apenas URLs geradas pelas plataformas.
- payment provider de staging/sandbox e valores operacionais correspondentes.
- usuario/admin seed para smoke test.
- modo de deploy Docker no Render: Git-backed Docker build ou imagem prebuilt em registry.
- auto-deploy ligado ou desligado no primeiro staging.
- retomada futura de R2/upload fora do deploy MVP atual.

### 3. Ferramentas ou alternativas de operacao

Pelo menos um caminho aprovado precisa existir antes da reexecucao:

- acesso interativo/autenticado aos dashboards de Render, Vercel e Cloudflare durante a execucao;
- CLIs oficiais instaladas e autenticadas para Render, Vercel e Cloudflare;
- tokens/API keys de automacao configurados somente em ambiente local seguro ou nas plataformas, sem expor valores no repositorio;
- operacao manual guiada pelo checklist, com o responsavel do projeto executando nas plataformas e retornando evidencias nao sensiveis.

Observacao: a ausencia de CLI nao bloqueia por si so se houver dashboard autenticado ou operacao manual aprovada. O bloqueio atual e a ausencia de qualquer meio autenticado/aprovado nesta sessao.

### 4. Ordem exata de retomada

1. Confirmar que a autorizacao para provisionamento real e possivel custo continua valida.
2. Confirmar contas/workspaces, billing owner, region, planos e responsaveis.
3. Confirmar o caminho operacional: dashboard, CLI autenticado, token de automacao ou operacao manual guiada.
4. Revalidar que nenhum secret real sera registrado em arquivos, logs de conversa, issues ou commits.
5. Confirmar Render Postgres `ecopickup-postgres-stg` e connection string sem versionar valores.
6. Confirmar Render Environment Group `ecopickup-api-stg-env`.
7. Configurar envs/secrets obrigatorias da API no Render, mantendo `Persistence__ApplyMigrationsOnStartup=false`.
8. Confirmar Render Web Service `ecopickup-api-stg` com Docker artifact aprovado.
9. Parar antes de migration/deploy funcional se qualquer pre-condicao da `EPIC-014G` nao estiver fechada.
10. Criar/configurar Vercel project/environment `ecopickup-web`.
11. Configurar `ECOPICKUP_API_BASE_URL` e `ECOPICKUP_WEB_PUBLIC_URL` na Vercel sem expor valores sensiveis.
12. Validar `/health`, login e fluxo principal sem upload de imagem.
13. Registrar nomes finais, URLs nao sensiveis, regioes, planos e evidencias operacionais.
14. Atualizar backlog/status e documentacao operacional impactada.

## Validacao

Validacao executada:

- consistencia documental com `docs/ops/backlog.md`, `docs/ops/status.md` e `docs/ops/staging-provisioning-checklist.md`.
- verificacao local da disponibilidade dos CLIs necessarios.

Gates tecnicos nao foram executados porque nao houve mudanca de codigo, Docker, runtime, CI/CD ou produto.

## Resultado

EPIC-014I nao pode ser marcada como `DONE`.

Status operacional recomendado: `IN_PROGRESS`.

Motivo: a decisao de escopo remove upload/R2 do gate critico do MVP publicavel, mas ainda faltam evidencias finais de deploy sem upload, incluindo API staging, `/health`, login, migrations quando aplicavel, front/Vercel e fluxo principal.

## Proximo passo recomendado

Seguir com deploy MVP sem upload de imagem: confirmar API staging no commit atual, validar `/health` e login, confirmar migrations antes de fluxos persistidos, conectar front/Vercel a API staging e preparar README/portfolio.

## Boundary

Esta tentativa nao provisionou recursos externos, nao criou secrets reais, nao executou migrations, nao executou deploy, nao alterou codigo de produto, nao alterou Docker, nao alterou CI/CD e nao implementou observabilidade externa.
