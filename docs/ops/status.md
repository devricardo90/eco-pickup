# EcoPickup - Status Executivo Inicial

## Estado atual
Projeto em development com a primeira fatia de fluxo de negocio aberta de forma controlada.

## Fase atual da esteira
Development

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

## Objetivo atual
Preparar o proximo slice apos auth/session foundation da web sem misturar identidade com mutacoes operacionais novas.

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

## O que falta antes de desenvolver
- manter a separacao entre o recorte atual e os proximos escopos do produto
- abrir painel admin, pricing e pagamento em etapas separadas

## Proximo passo recomendado
Abrir o proximo recorte operacional apos auth/session foundation, como execution tracking detalhado, pickup request detail surface ou disposal record.

## Riscos atuais
- comecar implementacao cedo demais
- deixar decisoes arquiteturais implicitas
- abrir admin ou pricing sem base visual suficiente
- reabrir decisoes de media foundation ja fechadas em 009A
- expandir queries de usuario para escopo administrativo antes da hora
- backlog perder o papel de fonte oficial

## Regra operacional
Cada nova feature deve entrar por fatias controladas, com docs, backlog e validacoes atualizados no mesmo slice.
