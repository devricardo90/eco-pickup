# EcoPickup - Status Executivo

## Estado atual
Projeto com MVP owner/admin consolidado, pausa de novas frentes funcionais encerrada formalmente e EPIC-014 aberta como proxima frente operacional.

## Fase atual da esteira
Deploy

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

## Objetivo atual
Desbloquear a EPIC-014I - Staging Provisioning Execution com acesso autenticado/aprovado as plataformas de staging e decisoes finais de contas, billing, region, planos e ambientes.

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

## O que falta antes de executar staging real
- fechar o checklist minimo consolidado em `docs/ops/staging-provisioning-execution.md`
- disponibilizar meio autenticado/aprovado para operar Render, Vercel e Cloudflare nesta execucao
- reexecutar EPIC-014I - Staging Provisioning Execution somente depois dos acessos e decisoes acima

## Proximo passo recomendado
Proximo passo recomendado: redeployar a API staging com a correcao R2 e repetir o smoke autenticado de upload de imagem, registrando evidencia nao sensivel antes de considerar a fatia de storage concluida.

## Riscos atuais
- comecar implementacao cedo demais
- deixar decisoes arquiteturais implicitas
- abrir admin ou pricing sem base visual suficiente
- reabrir decisoes de media foundation ja fechadas em 009A
- expandir queries de usuario para escopo administrativo antes da hora
- backlog perder o papel de fonte oficial

## Regra operacional
Cada nova feature deve entrar por fatias controladas, com docs, backlog e validacoes atualizados no mesmo slice.

