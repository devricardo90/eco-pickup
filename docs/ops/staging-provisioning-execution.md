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

Validacao local executada:

```txt
dotnet build apps/api/EcoPickup.Backend.sln --no-restore -p:UseSharedCompilation=false -m:1
dotnet test apps/api/tests/EcoPickup.UnitTests/EcoPickup.UnitTests.csproj --no-restore -p:UseSharedCompilation=false -m:1
```

Resultado:

- build backend passou.
- testes unitarios passaram: `40` passed, `0` failed.

Validacao pendente:

- redeploy da API staging com a correcao.
- novo smoke autenticado de upload de imagem.
- registro de evidencia nao sensivel do resultado.
## Checklist minimo para destravar a EPIC-014I

Este e o ponto unico de retomada operacional da `EPIC-014I`.

### 1. Acessos e contas necessarios

- conta/workspace Render aprovado para staging.
- owner de billing Render confirmado.
- permissao para criar Render Postgres, Render Environment Group e Render Web Service.
- conta/team Vercel aprovado para staging.
- permissao para criar/configurar projeto Vercel e environment variables.
- conta Cloudflare aprovada para R2.
- permissao para criar bucket R2 e token/API key de staging com escopo minimo.
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
- parametros finais do R2: account, endpoint S3-compatible, region, force path style e lifecycle/retencao inicial.

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
5. Criar Cloudflare R2 bucket `ecopickup-media-stg`.
6. Criar token R2 de staging com escopo minimo e registrar apenas evidencia nao sensivel.
7. Criar Render Postgres `ecopickup-postgres-stg` na region aprovada.
8. Capturar internal/external database URLs sem versionar valores.
9. Criar Render Environment Group `ecopickup-api-stg-env`.
10. Configurar envs/secrets da API no Render, mantendo `Persistence__ApplyMigrationsOnStartup=false`.
11. Criar Render Web Service `ecopickup-api-stg` com Docker artifact aprovado.
12. Parar antes de migration/deploy funcional se qualquer pre-condicao da `EPIC-014G` nao estiver fechada.
13. Criar/configurar Vercel project/environment `ecopickup-web`.
14. Configurar `ECOPICKUP_API_BASE_URL` e `ECOPICKUP_WEB_PUBLIC_URL` na Vercel sem expor valores sensiveis.
15. Registrar nomes finais, URLs nao sensiveis, regioes, planos e evidencias operacionais.
16. Atualizar backlog/status e documentacao operacional impactada.

## Validacao

Validacao executada:

- consistencia documental com `docs/ops/backlog.md`, `docs/ops/status.md` e `docs/ops/staging-provisioning-checklist.md`.
- verificacao local da disponibilidade dos CLIs necessarios.

Gates tecnicos nao foram executados porque nao houve mudanca de codigo, Docker, runtime, CI/CD ou produto.

## Resultado

EPIC-014I nao pode ser marcada como `DONE`.

Status operacional recomendado: `BLOCKED`.

Motivo: autorizacao de custo/provisionamento foi fornecida, mas as contas/workspaces aprovados e o meio autenticado para provisionamento nao estao disponiveis nesta execucao.

## Proximo passo recomendado

Fechar o checklist minimo acima e reexecutar `EPIC-014I` seguindo a ordem segura de `docs/ops/staging-provisioning-checklist.md`.

## Boundary

Esta tentativa nao provisionou recursos externos, nao criou secrets reais, nao executou migrations, nao executou deploy, nao alterou codigo de produto, nao alterou Docker, nao alterou CI/CD e nao implementou observabilidade externa.

