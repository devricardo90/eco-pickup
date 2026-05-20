# EcoPickup - Status Executivo

## Estado atual
SPR-02 - Product Demo Readiness is in progress. EPIC-019D is complete as documentation/design handoff: official design brief, current UI handoff, and visual references are now documented before any UI polish implementation.

## Fase atual da esteira
Product Demo Readiness / Validation

## Situacao resumida
- repositorio criado
- nome do produto definido: EcoPickup
- visao inicial do produto definida
- protocolo operacional definido
- backlog inicial estruturado
- foundation documental completa registrada
- decisao da foundation tecnica do monorepo registrada
- scaffold estrutural da EPIC-003 executado
- workspace Node validado com install, build, lint e typecheck
- bootstrap da web validado localmente
- .NET SDK 8.0.408 instalado para validacao local da API
- bootstrap da API validado com build, Swagger e /health
- EPIC-003 concluida como foundation estrutural do monorepo
- EPIC-004 concluida com API estruturada em camadas
- solucao de backend criada com Api, Application, Domain e Infrastructure
- base de persistencia preparada com EF Core, Npgsql e DbContext inicial
- API em camadas validada com Swagger, Scalar e /health
- EPIC-005 concluida com foundation do frontend consolidada
- convencoes internas da web registradas em app, components, features, hooks e lib
- build, typecheck e dev server da web devem permanecer como gate estrutural
- EPIC-006 concluida com PostgreSQL local, EF Core migrations e validacao basica de persistencia
- migration estrutural inicial aplicada no banco local
- EPIC-007 concluida com registro, login, JWT e controle basico de acesso
- rota autenticada minima validada com `/api/v1/auth/me`
- rota admin protegida validada com roles `USER` e `ADMIN`
- EPIC-008A concluida com criacao autenticada de pickup request em estado inicial `draft`
- request passa a persistir descricao, janela de coleta e address vinculada ao usuario autenticado
- EPIC-008B concluida com itens vinculados a `PickupRequest` no mesmo payload de criacao
- request passa a persistir request + address + items em uma unica operacao autenticada
- pricing, pagamento e fluxo admin continuam fora do escopo atual
- EPIC-009A concluida com fundacao tecnica de midia definida antes do upload real
- leitura minima de request foi identificada como suporte necessario para ownership e exibicao futura de fotos
- EPIC-009R concluida com listagem e detalhe de pickup requests para o usuario autenticado
- EPIC-009B concluida com upload real de `ItemPhoto` para `PickupItem`
- storage S3-compatible validado localmente com MinIO
- metadata de foto persistida no banco com ownership enforcement, validacao de tipo/tamanho e limite de `5` fotos por item
- leitura atual retorna request, address, items e fotos do item para o dono autenticado
- EPIC-010A concluida com leitura administrativa minima para `ADMIN`
- admin agora consegue listar requests e abrir detalhe com `address`, `items`, `photos` e `status`
- EPIC-010B concluida com review administrativo minimo de approve/reject
- review admin agora aplica transicoes controladas de status e persiste historico com actor e nota opcional
- EPIC-011A concluida com pricing foundation administrativa
- pricing agora persiste breakdown na request e permite transicao controlada para `quoted` ou `awaiting_payment`
- EPIC-011B concluida com scheduling foundation administrativa
- scheduling agora persiste a janela operacional confirmada e permite transicao controlada para `scheduled`
- EPIC-012A concluida com payment foundation
- payment agora persiste `Payment`, cria payment session, recebe confirmacao segura por webhook e aplica a transicao controlada `awaiting_payment -> paid`
- EPIC-013A concluida com tracking / history foundation
- timeline e historico agora podem ser consultados pelo dono autenticado e por `ADMIN` sem abrir novas mutacoes operacionais
- EPIC-013B concluida com a primeira superficie frontend de tracking/status
- web agora consome os endpoints de history para owner e admin em rotas read-only com status destacado, timeline legivel e estados de loading/erro/vazio
- EPIC-013C concluida com auth/session foundation na web
- tracking owner/admin agora usa sessao autenticada real via cookie HTTP-only em vez de tokens manuais por env
- EPIC-013D concluida com a composicao autenticada de pickup request detail + tracking
- owner e admin agora veem resumo do pedido, status atual, metadados e timeline na mesma base visual, sem abrir mutacoes novas
- EPIC-013E concluida com dashboards autenticados de pickup request para owner e admin
- as listas agora usam os endpoints existentes de listagem e conectam cada request ao detail/tracking autenticado
- EPIC-008C concluida com a primeira superficie web autenticada de criacao de pickup request
- owner agora consegue criar uma request pela web usando a sessao real e o contrato existente de criacao, com redirecionamento para detail/tracking apos sucesso
- EPIC-008D concluida com UX de multiplos itens e edicao owner limitada a `draft`
- owner agora consegue editar requests em `draft` pela web, com bloqueio explicito apos entrada em fluxo operacional
- EPIC-008E concluida com semantica explicita de submissao
- owner agora diferencia salvar rascunho de enviar request, e o review admin parte de `submitted`
- EPIC-011C concluida com quote visibility para owner
- owner agora visualiza pricing persistido com clareza durante `under_review`, `quoted` e `awaiting_payment`
- EPIC-012B concluida com owner payment surface
- owner agora consegue iniciar checkout em `awaiting_payment` e ver confirmacao clara quando a request estiver `paid`
- EPIC-011D concluida com owner scheduled visibility
- owner agora ve claramente o estado pos-pagamento e a janela confirmada quando a request estiver `scheduled`
- EPIC-013F concluida com owner execution tracking messaging
- owner agora recebe leitura mais operacional para `in_transit`, `collected` e `completed`
- EPIC-013G concluida com owner final completion messaging
- owner agora ve encerramento mais claro para `completed`, `cancelled` e `rejected`
- EPIC-000R concluida com revisao transversal do MVP
- a consolidacao atual identificou um ajuste pequeno de baixo risco: evitar duplicidade de cards semanticos no estado `completed`
- EPIC-000S concluida com rodada curta de bug bash/manual QA no MVP
- bug real corrigido no fluxo owner: quando `create and submit` ou `save and submit` falhavam na etapa de submissao, o draft ja persistido nao era comunicado com clareza ao usuario
- owner tracking agora recebe notice explicito de `draft saved but submission did not complete`, evitando percepcao errada de perda de dados
- EPIC-000T concluida com segunda rodada curta de QA manual
- achados desta rodada ficaram concentrados em drift documental de baixo risco: `apps/api/README.md` ainda descrevia review saindo de `draft`, e `apps/web/README.md` ainda listava `completed` no execution card em vez do lifecycle card
- documentacao alinhada com o comportamento atual sem abrir nova frente funcional
- EPIC-000U concluida com cleanup documental final do MVP
- README raiz, README da API e README da web agora refletem o estado atual entregue, os fluxos owner/admin e os limites explicitos do escopo
- pausa de consolidacao do MVP encerrada formalmente em 2026-04-12
- conflito documental normalizado: EPIC-001 e EPIC-002 permaneciam como `READY`, mas foram tratadas como marcacoes obsoletas porque a documentacao viva ja sustenta discovery e planejamento minimos executados antes das foundations e do MVP atual
- EPIC-014 confirmada como proxima frente operacional coerente do backlog oficial
- EPIC-014A preparada como primeira slice segura de readiness, sem implementacao tecnica ou deploy real
- EPIC-014A concluida com readiness registrado em `docs/ops/infra-deploy-readiness.md`
- assessment confirmou que o ambiente local esta parcialmente pronto, mas staging, deploy real, smoke test, observabilidade operacional e rollback ainda nao estao definidos
- EPIC-014B definida como proxima slice READY para formalizar o contrato de variaveis e ambientes antes de qualquer mudanca tecnica
- EPIC-014B concluida com contrato de runtime registrado em `docs/ops/runtime-environment-contract.md`
- matriz local/staging/producao, nomes canonicos de runtime, secrets, defaults locais, lacunas e decisoes pendentes foram documentados sem mudanca tecnica
- EPIC-014C definida como proxima slice READY para documentar o runbook local full-stack
- EPIC-014C concluida com runbook local e validacao pratica registrados em `docs/ops/local-full-stack-runbook.md`
- stack local validado com Postgres, MinIO, API `/health`, web em porta alternativa e integracao basica web -> API
- gaps operacionais registrados: Node local `v22.21.1` abaixo da baseline `24.14.1`, Docker/dotnet exigindo permissao elevada neste ambiente, `pnpm.cmd` necessario no Windows e porta `3000` sujeita a conflito
- EPIC-014D definida como proxima slice READY para decidir targets de deploy sem provisionar infraestrutura
- EPIC-014D concluida com decisao registrada em `docs/ops/deploy-target-decision.md`
- stack recomendada para staging inicial: Vercel para web, Render Web Service com Docker para API, Render Postgres para banco, Cloudflare R2 para storage, secrets nativos das plataformas e logs nativos Render/Vercel
- EPIC-014E definida como proxima slice READY para plano de staging, smoke test e rollback antes de qualquer provisionamento
- EPIC-014E concluida com plano registrado em `docs/ops/staging-deployment-plan.md`
- staging futuro definido por camada: Vercel para web, Render Web Service com Docker para API, Render Postgres para banco, Cloudflare R2 para storage, secrets nativos das plataformas e logs nativos Render/Vercel
- ordem segura de provisionamento futuro, smoke test e rollback inicial foram documentados sem provisionar recursos, sem deploy e sem mudanca tecnica
- EPIC-014F definida como proxima slice READY para criar e validar o artefato Docker minimo da API antes de qualquer staging real
- EPIC-014F concluida com artefato Docker da API criado e validado localmente
- imagem `ecopickup-api:014f` buildada com sucesso; container local subiu em `localhost:5082`; `/health` respondeu `200 Healthy`
- build backend e testes unitarios passaram: `dotnet build apps/api/EcoPickup.Backend.sln` e `dotnet test apps/api/tests/EcoPickup.UnitTests/EcoPickup.UnitTests.csproj`
- bloqueio real corrigido: contexto Docker copiava `bin/` e `obj/` locais, causando falha no `dotnet publish`; `apps/api/.dockerignore` foi adicionado como menor correcao
- EPIC-014G definida como proxima slice READY para fechar estrategia de migrations de staging antes de qualquer provisionamento/deploy real
- EPIC-014G concluida com estrategia de migrations registrada em `docs/ops/staging-migration-strategy.md`
- decisao operacional: primeiro staging deve usar migration manual controlada e explicita, com `Persistence__ApplyMigrationsOnStartup=false`
- pre-condicoes, ordem segura, criterios de validacao, abort e rollback/forward fix foram documentados sem executar migration real
- EPIC-014H definida como proxima slice READY para preparar checklist final de provisionamento de staging sem provisionar recursos
- EPIC-014H concluida com checklist registrado em `docs/ops/staging-provisioning-checklist.md`
- checklist consolidou web, API, banco, storage, secrets, logs, naming convention, envs/secrets sem valores reais, ordem de provisionamento futuro, bloqueios e decisoes abertas
- nenhum recurso externo foi provisionado, nenhum secret real foi criado, nenhuma migration foi executada e nenhum deploy foi feito
- EPIC-014I havia sido definida como proxima slice READY para execucao de provisionamento real, condicionada a autorizacao explicita de custos e fechamento das decisoes abertas
- EPIC-014I teve autorizacao de provisionamento/custos recebida em 2026-04-12, mas foi bloqueada antes de criar recursos reais porque nao havia meio autenticado/aprovado para operar Render, Vercel e Cloudflare nesta sessao
- tentativa da EPIC-014I registrada em `docs/ops/staging-provisioning-execution.md`, que agora concentra o checklist minimo de retomada; nenhum recurso externo foi provisionado, nenhum secret real foi criado, nenhuma migration foi executada e nenhum deploy foi feito
- EPIC-014J concluida com hardening do runtime de object storage para staging
- causa raiz do upload de fotos em staging registrada: Cloudflare R2/S3-compatible nao estava completamente configurado no Render e a API dependia de `DoesS3BucketExistV2Async` antes do upload
- provider alvo confirmado: Cloudflare R2 via API S3-compatible; AWS S3 nativo nao e o alvo documentado de staging
- API agora nao executa `EnsureBucketExistsAsync` quando `ObjectStorage__AutoCreateBucket=false`, evitando dependencia de check/criacao de bucket em runtime para staging/producao
- logs `[OBJECT-STORAGE]` passam a classificar falhas de upload como conexao, credencial/permissao, bucket inexistente ou erro S3-compatible, sem expor secrets
- contrato Render/R2 atualizado com env vars obrigatorias em `docs/ops/runtime-environment-contract.md` e incidente registrado em `docs/ops/staging-provisioning-execution.md`
- retomada da EPIC-014I em 2026-04-21 tentou preparar a menor fatia reversivel de storage R2, mas parou antes de alterar staging porque nao havia `render`, `vercel` ou `wrangler` CLI, nem tokens/env vars operacionais locais para Render/Cloudflare/Vercel
- nenhum redeploy, smoke de upload, migration, alteracao de schema ou secret real foi executado/registrado na retomada de 2026-04-21
- Etapa 3 da retomada de storage R2 foi registrada como OK pelo operador: API staging redeployada com novas env vars de object storage, ambiente `Staging` confirmado, servico live no Render e sem falha fatal de startup relacionada ao storage
- validacao anterior da EPIC-014I apontava `/health` e smoke autenticado de upload de imagem em staging
- upload autenticado de imagem em staging chegou ate a camada de storage, mas falhou no R2 com `STREAMING-AWS4-HMAC-SHA256-PAYLOAD-TRAILER not implemented`
- causa tecnica registrada: o AWS SDK for .NET estava usando checksum de request em modo default `WHEN_SUPPORTED`, que pode emitir payload streaming com trailer para `PutObject`; Cloudflare R2 rejeitou esse modo
- correcao aplicada no cliente S3: `RequestChecksumCalculation=WHEN_REQUIRED`, preservando endpoint, dominio, auth, banco e schema
- build backend e testes unitarios passaram localmente apos a correcao R2: `dotnet build apps/api/EcoPickup.Backend.sln --no-restore -p:UseSharedCompilation=false -m:1` e `dotnet test apps/api/tests/EcoPickup.UnitTests/EcoPickup.UnitTests.csproj --no-restore -p:UseSharedCompilation=false -m:1`
- apos deploy da primeira correcao, upload autenticado continuou falhando no R2 com `STREAMING-AWS4-HMAC-SHA256-PAYLOAD not implemented`
- proxima correcao aplicada no `PutObjectRequest`: `UseChunkEncoding=false` e `DisablePayloadSigning=true`; `DisableDefaultChecksumValidation` nao foi alterado; `ContentLength` foi considerado, mas nao existe diretamente em `PutObjectRequest` na versao congelada do AWSSDK.S3
- decisao de escopo aprovada em 2026-04-21: upload de imagem sai do MVP publicavel atual para destravar deploy e apresentacao de portfolio
- upload de imagem nao foi descartado; a feature fica adiada para fase futura pos-deploy/refinamento
- EPIC-014K registrada como ajuste documental de escopo; upload/R2 deixa de ser gate critico da EPIC-014I
- API staging passou no smoke do MVP sem upload de imagem: `/health`, register, login, create pickup request, list, detail e history
- front publicado na Vercel e validado com login, dashboard e listagem funcionando
- EPIC-014I fechada como `DONE` no recorte do MVP publicavel atual, sem upload/R2 como gate
- EPIC-015 concluida com README raiz atualizado como peca de portfolio/showcase
- README reflete stack real, smoke validado em 2026-04-21, lifecycle state machine, features owner/admin/backend, upload/R2 como deferred e links publicos confirmados
- EPIC-016A concluida com snapshot de runtime do staging registrado
- API e frontend responderam HTTP 200 em 2026-05-02: API com cold start de ~15.6s e warm de ~0.18s, frontend com titulo e links de navegacao corretos
- EPIC-017A concluida com Public Landing UI Refinement na web
- EPIC-017B concluida com staging landing validation (com achados)
- EPIC-017C concluida com a transicao English-first da vitrine publica (Remote DONE + Staging/Public PASS)
- API /health revalidada como 200 OK em staging
- Landing, login e register acessiveis com 200 OK em staging
- Achados de linguagem tecnica e idioma Portuguese-first da EPIC-017B mitigados/resolvidos na vitrine publica
- Commit 0c98fce (`feat(web): transition public showcase and auth to english-first`) em origin/main
- EPIC-018A concluida: PASSA (decisão de prontidão para demo baseada em análise técnica; tempo estimado ~1m50s com API aquecida)
- EPIC-018B concluida: Roteiro de demo e checklist de screenshots registrados em `docs/ops/demo-script.md`
- SPR-02 aberta como Product Demo Readiness para transformar o MVP em vitrine funcional apresentavel
- EPIC-019A concluida com baseline audit registrado em `docs/ops/product-demo-baseline-audit.md`
- landing, login e register publicos responderam HTTP 200 em staging
- API staging nao respondeu em `/health`, raiz ou `/swagger` dentro das janelas de timeout testadas, bloqueando validacao autenticada real
- register/login real, sessao autenticada, dashboard, criacao de request e tracking nao foram executados porque a slice proibia mutacao de DB e nao havia conta demo segura aprovada com API disponivel
- fotos/upload foram apenas observados; Object Storage/R2 permanece sem smoke final nesta slice
- nenhuma alteracao de codigo, backend, frontend, DB, env, migration, seed, deploy ou storage foi realizada na EPIC-019A
- EPIC-019B concluida com diagnostico registrado em `docs/ops/api-staging-availability-diagnosis.md`
- politica segura de conta demo registrada em `docs/ops/demo-account-policy.md`
- tentativa HTTP sem rede elevada falhou com `curl: (7)` para Render e Vercel, classificada como restricao local/sandbox
- diagnostico HTTP com rede elevada confirmou API staging saudavel: `/health` HTTP 200 `Healthy` e raiz HTTP 200 com payload bootstrap
- `/swagger` retornou HTTP 404, classificado como esperado porque Swagger/Scalar sao mapeados apenas em ambiente `Development`
- frontend Vercel respondeu HTTP 200 no diagnostico atual
- nenhuma alteracao de codigo, backend, frontend, DB, env, migration, seed, deploy, storage/R2, Render, Vercel ou infraestrutura foi realizada na EPIC-019B
- EPIC-019C concluida com smoke report registrado em `docs/ops/authenticated-demo-smoke-validation.md`
- API `/health` teve um timeout inicial de 30s e passou no retry imediato com HTTP 200 `Healthy`
- frontend Vercel respondeu HTTP 200
- uma conta demo staging dedicada foi criada pelo fluxo publico de register
- a conta pessoal do Trigger nao foi usada nem modificada
- login/logout com a conta demo foram validados pelo fluxo publico
- dashboard autenticado, criacao de pickup request fake, visibilidade em lista e tracking/timeline foram validados
- request smoke capturada: `b4c8c52f-3dd4-4a34-88f6-b8bb62267494`
- nenhuma credencial foi documentada ou commitada
- nenhuma alteracao de codigo, deploy, env, migration, seed, DB manual, Render/Vercel, storage/R2, README final ou pacote de screenshots foi realizada na EPIC-019C
- EPIC-019D completed the design handoff documentation for UI polish readiness
- official design brief created at `docs/design/eco-pickup-design-brief.md`
- current UI handoff created at `docs/design/current-ui-handoff.md`
- visual references and direction created at `docs/design/visual-references.md`
- documentation states that the staging authenticated demo flow is validated, while cold starts/timeouts may still occur
- screenshot checklist for later collection was defined without adding screenshot files
- no code, frontend implementation, UI polish, screenshots, README final, deploy, env, API/backend, DB, migration, seed, Render/Vercel, storage/R2, image upload, Figma file, commit, or push was performed in EPIC-019D

## Objetivo atual
Decide the next SPR-02 slice after design handoff completion, without opening a new READY task automatically.

## O que ja existe
- ideia do produto
- direcao estrategica
- definicao de stack inicial
- estrutura de execucao baseada no Protocolo Rick
- backlog oficial inicial
- PRD registrado em arquivo
- business rules registradas
- protocolo formal salvo no repositorio
- system design inicial registrado
- api standards iniciais registrados
- decisao da foundation do monorepo registrada

## O que falta antes da proxima frente
- decide whether the next slice is UI polish implementation, Object Storage/R2 minimal smoke, or portfolio packaging
- if public portfolio credentials are needed, define a non-repository distribution process
- keep storage/R2 out of public claims until its own smoke passes
- collect screenshots only in a separately approved screenshot/package slice

## Proximo passo recomendado
Open a Discussion Gate for the next SPR-02 slice. Technical recommendation: proceed to a controlled UI polish implementation using the new design handoff before final README/screenshots packaging.

## Riscos atuais
- comecar implementacao cedo demais
- deixar decisoes arquiteturais implicitas
- abrir admin ou pricing sem base visual suficiente
- reabrir decisoes de media foundation ja fechadas em 009A
- expandir queries de usuario para escopo administrativo antes da hora
- backlog perder o papel de fonte oficial
- API staging indisponivel bloquear demo final
- tentar corrigir UI antes de provar o fluxo autenticado
- tentar validar R2/storage antes de estabilizar a demo principal

## Regra operacional
Cada nova feature deve entrar por fatias controladas, com docs, backlog e validacoes atualizados no mesmo slice.
