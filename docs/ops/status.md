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
- upload, pricing, pagamento e fluxo admin continuam fora do escopo atual
- EPIC-009A concluida com fundacao tecnica de midia definida antes do upload real
- leitura minima de request foi identificada como suporte necessario para ownership e exibicao futura de fotos
- EPIC-009R concluida com listagem e detalhe de pickup requests para o usuario autenticado
- leitura atual retorna request, address e items, sem fotos e sem escopo administrativo

## Objetivo atual
Executar o upload real de fotos sobre uma fundacao de midia ja definida e com leitura minima pronta.

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
- abrir upload real, pricing e operacao admin em etapas separadas

## Proximo passo recomendado
Abrir a EPIC-009B para implementar upload real de fotos em `PickupItem` usando a fundacao de midia ja definida.

## Riscos atuais
- comecar implementacao cedo demais
- deixar decisoes arquiteturais implicitas
- abrir admin ou pricing sem base visual suficiente
- reabrir decisoes de media foundation ja fechadas em 009A
- expandir queries de usuario para escopo administrativo antes da hora
- backlog perder o papel de fonte oficial

## Regra operacional
Cada nova feature deve entrar por fatias controladas, com docs, backlog e validacoes atualizados no mesmo slice.
