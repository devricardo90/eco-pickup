# EcoPickup - Backlog Oficial

## Regras
- Este arquivo e a fonte oficial do backlog.
- `status.md` e apenas resumo executivo.
- Nenhum item pode avancar para `DONE` sem criterios de aceite validados.
- Nenhuma fase avanca sem os artefatos minimos da fase anterior.

---

# EPIC-000 - Governanca e Foundation Documental
**Status:** DONE

## Objetivo
Estabelecer a base documental, operacional e de governanca do projeto antes de qualquer implementacao tecnica.

## Escopo
- criar README inicial
- criar AGENTS.md
- registrar PRD
- registrar protocolo
- criar backlog inicial
- criar status inicial
- definir estrutura documental

## Criterios de aceite
- arquivos base criados
- protocolo definido
- backlog inicial criado
- status inicial criado
- estrutura documental definida
- projeto claramente posicionado em Discovery/Planning

## Dependencias
- nenhuma

---

# EPIC-001 - Discovery do Produto
**Status:** READY

## Objetivo
Formalizar o problema, objetivo, publico, escopo inicial e restricoes do EcoPickup.

## Escopo
- definir problema central
- definir objetivo do produto
- definir publico-alvo
- definir escopo do MVP
- definir restricoes e riscos iniciais

## Criterios de aceite
- problema documentado
- objetivo claro documentado
- escopo inicial definido
- riscos iniciais registrados
- restricoes operacionais registradas

## Dependencias
- EPIC-000

---

# EPIC-002 - Planejamento Inicial
**Status:** READY

## Objetivo
Quebrar o projeto em epicos e definir a ordem de execucao segura.

## Escopo
- organizar backlog
- definir prioridades
- mapear dependencias
- registrar criterios de aceite por frente
- definir recorte minimo executavel

## Criterios de aceite
- backlog estruturado por epicos
- ordem de execucao definida
- dependencias visiveis
- criterios de aceite registrados
- menor recorte seguro identificado

## Dependencias
- EPIC-001

---

# EPIC-003 - Foundation do Monorepo
**Status:** DONE

## Objetivo
Criar a base tecnica do monorepo sem implementar features de produto.

## Escopo
- criar estrutura `apps/`
- criar estrutura `packages/`
- preparar `apps/api`
- preparar `apps/web`
- preparar `packages/contracts`
- preparar `packages/ui`
- configurar arquivos raiz do workspace

## Criterios de aceite
- estrutura do monorepo criada
- projetos base inicializados
- convencoes iniciais registradas
- repo pronto para desenvolvimento por epicos
- nenhuma feature implementada ainda

## Dependencias
- EPIC-002

---

# EPIC-004 - Foundation do Backend
**Status:** DONE

## Objetivo
Subir a base da API ASP.NET Core com estrutura minima de arquitetura.

## Escopo
- inicializar API em .NET 8
- estruturar camadas iniciais
- configurar Swagger
- configurar health check
- definir convencao de pastas
- preparar base para auth e dominio

## Criterios de aceite
- API sobe localmente
- Swagger funcional
- estrutura minima estabelecida
- documentacao inicial de arquitetura atualizada

## Dependencias
- EPIC-003

---

# EPIC-005 - Foundation do Frontend
**Status:** DONE

## Objetivo
Subir a base do app web em Next.js com estrutura minima.

## Escopo
- inicializar app Next.js
- configurar TypeScript
- configurar Tailwind
- definir layout base
- preparar estrutura de rotas
- preparar convencoes iniciais

## Criterios de aceite
- app sobe localmente
- Tailwind configurado
- estrutura inicial criada
- documentacao impactada atualizada
- build validado
- typecheck validado
- foundation consolidada sem feature de produto

## Dependencias
- EPIC-003

---

# EPIC-006 - Banco de Dados e Persistencia
**Status:** DONE

## Objetivo
Preparar a camada de banco para suportar a evolucao do dominio sem implementar regras finais do produto.

## Escopo
- configurar PostgreSQL
- definir estrategia de migrations
- preparar persistencia estrutural
- validar conexao local

## Criterios de aceite
- banco sobe localmente
- estrategia de migration definida
- DbContext preparado para evolucao
- base pronta para evolucao do dominio
- PostgreSQL validado via Docker Compose
- migration estrutural aplicada
- ciclo tecnico minimo de persistencia validado sem feature de produto

## Dependencias
- EPIC-004

---

# EPIC-007 - Auth e Controle de Acesso
**Status:** DONE

## Objetivo
Permitir cadastro, login e autorizacao por perfil.

## Escopo
- registro de usuario
- login
- JWT
- roles USER e ADMIN
- protecao de rotas

## Criterios de aceite
- usuario consegue registrar
- usuario consegue autenticar
- JWT emitido corretamente
- rotas protegidas por perfil
- senha armazenada com hash seguro
- endpoint autenticado minimo validado
- documentacao de auth atualizada

## Dependencias
- EPIC-004
- EPIC-006

---

# EPIC-008 - Fluxo de Solicitacao de Coleta
**Status:** IN_PROGRESS

## Objetivo
Permitir ao usuario criar um pedido de coleta completo.

## Escopo
- criar pedido
- adicionar endereco
- adicionar descricao do item
- definir janela de coleta
- enviar solicitacao

## Criterios de aceite
- pedido criado com sucesso
- dados persistidos corretamente
- status inicial registrado
- fluxo validado de ponta a ponta no escopo do MVP

## Dependencias
- EPIC-005
- EPIC-006
- EPIC-007

### Fatias de execucao

#### EPIC-008A - Pickup Request Foundation
**Status:** DONE

##### Objetivo
Entregar o primeiro recorte de negocio para criacao de solicitacao de coleta, mantendo o fluxo minimo e sem antecipar itens, upload, pricing ou operacao admin.

##### Escopo
- modelar `PickupRequest`
- modelar `Address`
- relacionar request e address
- criar migration correspondente
- expor endpoint autenticado minimo de criacao
- persistir request vinculada ao usuario autenticado
- atualizar documentacao impactada

##### Criterios de aceite
- `PickupRequest` modelado
- `Address` modelado
- migration criada
- endpoint `POST /api/v1/pickup-requests` funcional
- request persistida corretamente
- vinculo com usuario autenticado funcionando
- Swagger e Scalar continuam funcionais
- build continua passando
- documentacao impactada atualizada

##### Dependencias
- EPIC-007

##### Fora de escopo
- `PickupItem`
- upload de imagem
- pricing
- timeline completa
- fluxo admin
- pagamento

#### EPIC-008B - Pickup Items
**Status:** DONE

##### Objetivo
Expandir a solicitacao para suportar itens associados sem ainda abrir upload de imagem.

##### Escopo
- modelar `PickupItem`
- relacionar item com `PickupRequest`
- expandir payload de criacao da request para aceitar items
- persistir request + address + items juntos
- adicionar validacoes minimas para items
- atualizar testes e documentacao impactada

##### Criterios de aceite
- `PickupItem` modelado
- relacao com request funcionando
- migration criada e aplicada
- endpoint de criacao expandido com items
- persistencia validada
- validacoes minimas presentes
- testes atualizados e passando
- Swagger, Scalar e OpenAPI continuam funcionando
- documentacao impactada atualizada

##### Dependencias
- EPIC-008A

##### Fora de escopo
- upload de imagem
- `ItemPhoto`
- pricing
- fluxo admin
- timeline completa
- pagamento

---

# EPIC-009 - Upload de Imagens
**Status:** IN_PROGRESS

## Objetivo
Permitir upload e associacao de fotos aos itens da solicitacao.

## Escopo
- upload de imagens
- armazenamento
- associacao ao item/pedido
- exibicao no fluxo do usuario e admin

## Criterios de aceite
- imagem enviada com sucesso
- arquivo persistido em storage definido
- vinculo com item ou pedido preservado
- admin consegue visualizar

## Dependencias
- EPIC-008

### Fatias de execucao

#### EPIC-009A - Media Foundation
**Status:** DONE

##### Objetivo
Definir a fundacao de midia antes do upload real, preservando o dominio e evitando acoplamento prematuro com storage, admin ou pricing.

##### Escopo
- definir estrategia de storage
- decidir entre upload direto ou upload via API
- modelar `ItemPhoto`
- definir vinculo entre `ItemPhoto` e `PickupItem`
- definir ownership, autorizacao e regras de seguranca
- definir convencao de chave/nome de arquivo
- definir limites de tipo e tamanho
- registrar contratos e documentacao da fundacao de midia
- registrar a necessidade de leitura minima de request para sustentar exibicao futura

##### Criterios de aceite
- estrategia de storage definida
- fluxo tecnico de upload decidido
- modelo `ItemPhoto` definido documentalmente
- ownership e regras de seguranca definidos
- limites e constraints documentados
- backlog e arquitetura atualizados
- proximo recorte de upload real preparado sem ambiguidade

##### Dependencias
- EPIC-008B

##### Fora de escopo
- upload real de arquivo
- endpoint de upload
- persistencia de metadata em banco
- exibicao de foto no frontend
- painel admin
- pricing
- pagamento

#### EPIC-009R - Pickup Request Read Foundation
**Status:** DONE

##### Objetivo
Garantir leitura minima de pickup request para ownership, verificacao de detalhe e base futura de exibicao de fotos.

##### Escopo
- `GET /api/v1/pickup-requests`
- `GET /api/v1/pickup-requests/{id}`
- ownership minimo para usuario autenticado
- retorno de request com address e items

##### Criterios de aceite
- listagem minima disponivel
- detalhe minimo disponivel
- ownership validado
- retorno com request, address e items funcionando
- testes aplicaveis passando
- Swagger, Scalar e OpenAPI continuam funcionais
- documentacao impactada atualizada

##### Dependencias
- EPIC-008B

##### Fora de escopo
- fotos
- `ItemPhoto`
- queries administrativas
- painel admin
- pricing
- pagamento

#### EPIC-009B - Item Photo Upload
**Status:** DONE

##### Objetivo
Implementar upload real de fotos de item sobre a fundacao de midia previamente definida.

##### Escopo
- endpoint de upload
- persistencia de metadata
- vinculo com `PickupItem`
- validacoes de tipo/tamanho
- leitura das fotos no detalhe da request
- testes e documentacao impactada

##### Criterios de aceite
- upload funcional
- metadata persistida
- ownership validado
- leitura de fotos no detalhe funcional
- testes passando
- Swagger, Scalar e OpenAPI atualizados

##### Fora de escopo
- painel admin
- pricing
- pagamento
- workflow administrativo completo
- direct upload
- reabertura de provider ou estrategia de upload

##### Dependencias
- EPIC-009A
- EPIC-009R

#### EPIC-009C - Item Photo Capture Reference
**Status:** DONE

##### Objetivo
Registrar um conjunto de referencia para orientar captura e revisao operacional de fotos por item antes da abertura do upload real no produto.

##### Escopo
- analisar um conjunto de referencia no Stitch para item do tipo sofa
- adicionar os assets de referencia ao repositorio
- documentar aderencia das imagens ao fluxo operacional
- registrar recomendacoes praticas para copy e revisao admin

##### Criterios de aceite
- conjunto de referencia documentado
- assets adicionados ao repositorio
- aderencia das imagens analisada
- recomendacoes praticas registradas para EPIC-009B

##### Dependencias
- EPIC-009A
- EPIC-009R

---

# EPIC-010 - Painel Admin
**Status:** IN_PROGRESS

## Objetivo
Permitir operacao administrativa do ciclo da coleta.

## Escopo
- listar pedidos
- filtrar por status
- abrir detalhes
- aprovar ou rejeitar
- ajustar preco
- definir agendamento final
- atualizar status
- registrar destino do item

## Criterios de aceite
- admin visualiza pedidos
- admin altera status
- admin ajusta preco
- admin registra destino
- operacao minima do MVP concluida

## Dependencias
- EPIC-005
- EPIC-007
- EPIC-008
- EPIC-009

### Fatias de execucao

#### EPIC-010A - Admin Read Foundation
**Status:** DONE

##### Objetivo
Entregar leitura administrativa minima de pickup requests antes de abrir qualquer acao operacional de admin.

##### Escopo
- listar pickup requests no admin
- detalhar pickup request no admin
- restringir acesso a role `ADMIN`
- retornar `address`, `items`, `photos` e `status`
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- endpoint admin de listagem funcional
- endpoint admin de detalhe funcional
- acesso restrito a `ADMIN`
- detalhe retorna `address`, `items`, `photos` e `status`
- build continua passando
- testes aplicaveis passam
- Swagger, Scalar e OpenAPI continuam funcionando
- documentacao impactada atualizada

##### Dependencias
- EPIC-009B

##### Fora de escopo
- pricing
- approve/reject
- mudanca de status
- pagamento
- workflow administrativo completo
- acoes operacionais

#### EPIC-010B - Admin Review Foundation
**Status:** DONE

##### Objetivo
Entregar a primeira acao administrativa controlada para permitir decisao minima de review sem abrir pricing, scheduling ou pagamento.

##### Escopo
- implementar approve/reject administrativo
- restringir acesso a role `ADMIN`
- validar transicoes controladas de status
- registrar historico da acao administrativa
- aceitar nota administrativa opcional
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- endpoint admin de approve/reject funcional
- acesso restrito a `ADMIN`
- transicoes de status validadas
- historico da acao registrado
- build continua passando
- testes aplicaveis passam
- Swagger, Scalar e OpenAPI continuam funcionando
- documentacao impactada atualizada

##### Dependencias
- EPIC-010A

##### Fora de escopo
- pricing
- scheduling
- pagamento
- workflow administrativo completo
- acoes operacionais alem de review

---

# EPIC-011 - Motor de Preco MVP
**Status:** IN_PROGRESS

## Objetivo
Implementar logica de preco simples e auditavel.

## Escopo
- base price
- ajuste por tamanho
- ajuste por andar sem elevador
- ajuste por distancia
- breakdown de preco

## Criterios de aceite
- calculo aplicado corretamente
- breakdown persistido
- total consistente
- admin visualiza composicao do preco

## Dependencias
- EPIC-008
- EPIC-010

### Fatias de execucao

#### EPIC-011A - Pricing Foundation
**Status:** DONE

##### Objetivo
Entregar a fundacao administrativa de pricing com breakdown persistido e transicao controlada de status sem abrir scheduling ou payment.

##### Escopo
- implementar acao administrativa de pricing
- restringir acesso a role `ADMIN`
- modelar breakdown minimo de preco
- persistir pricing na request
- suportar `base price`, `size adjustment`, `floor adjustment`, `distance adjustment`, `total` e `currency`
- aplicar transicao controlada para `quoted` ou `awaiting_payment`
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- endpoint admin de pricing funcional
- acesso restrito a `ADMIN`
- breakdown persistido corretamente
- total consistente com os componentes
- transicao de status validada
- build continua passando
- testes aplicaveis passam
- Swagger, Scalar e OpenAPI continuam funcionando
- documentacao impactada atualizada

##### Dependencias
- EPIC-010B

##### Fora de escopo
- payment
- scheduling
- workflow administrativo completo
- cobranca
- upload
- review

#### EPIC-011B - Scheduling Foundation
**Status:** DONE

##### Objetivo
Entregar a fundacao administrativa de scheduling com janela operacional confirmada e transicao controlada para `scheduled`, sem abrir payment.

##### Escopo
- implementar acao administrativa de scheduling
- restringir acesso a role `ADMIN`
- modelar e persistir os campos minimos de agendamento
- aplicar transicao controlada para `scheduled`
- registrar historico da acao administrativa
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- endpoint admin de scheduling funcional
- acesso restrito a `ADMIN`
- dados de scheduling persistidos corretamente
- transicao de status validada
- historico registrado
- build continua passando
- testes aplicaveis passam
- Swagger, Scalar e OpenAPI continuam funcionando
- documentacao impactada atualizada

##### Dependencias
- EPIC-011A

##### Fora de escopo
- payment
- workflow administrativo completo
- cobranca
- review
- upload
- pricing

---

# EPIC-012 - Pagamentos
**Status:** IN_PROGRESS

## Objetivo
Permitir cobranca do pedido aprovado.

## Escopo
- integracao de pagamento
- criacao de checkout
- persistencia de pagamento
- webhook de confirmacao
- atualizacao de status do pedido

## Criterios de aceite
- checkout criado
- pagamento confirmado via webhook
- status atualizado corretamente
- falhas tratadas no fluxo minimo

## Dependencias
- EPIC-010
- EPIC-011

### Fatias de execucao

#### EPIC-012A - Payment Foundation
**Status:** DONE

##### Objetivo
Entregar a fundacao de cobranca e confirmacao de pagamento com persistencia do estado e transicao controlada sem abrir refund, dispute ou conciliacao completa.

##### Escopo
- definir o modelo minimo de `Payment`
- relacionar `Payment` com `PickupRequest`
- implementar criacao de payment session
- persistir status do pagamento
- implementar confirmacao segura do pagamento
- aplicar transicoes controladas de status
- registrar historico da acao quando aplicavel
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- modelo `Payment` funcional
- criacao de cobranca funcional
- persistencia do estado de pagamento funcionando
- confirmacao de pagamento funcionando
- transicoes de status validadas
- build continua passando
- testes aplicaveis passam
- Swagger, Scalar e OpenAPI continuam funcionando
- documentacao impactada atualizada

##### Dependencias
- EPIC-011A

##### Fora de escopo
- workflow administrativo completo
- refund avancado
- dispute
- conciliacao completa
- reabertura de review
- reabertura de pricing
- reabertura de scheduling

---

# EPIC-013 - Tracking e Historico
**Status:** DONE

## Objetivo
Permitir acompanhamento completo do pedido.

## Escopo
- timeline de status
- historico de mudancas
- tela de acompanhamento
- feedback final opcional

## Criterios de aceite
- usuario acompanha o status
- historico e exibido corretamente
- transicoes principais estao registradas

## Dependencias
- EPIC-008
- EPIC-010
- EPIC-012

### Fatias de execucao

#### EPIC-013A - Tracking / History Foundation
**Status:** DONE

##### Objetivo
Entregar a leitura inicial de timeline e historico da pickup request para user e admin sobre os eventos ja persistidos, sem abrir novas mutacoes operacionais.

##### Escopo
- expor endpoint de timeline/history para o usuario autenticado
- expor endpoint de timeline/history para `ADMIN`
- retornar eventos relevantes ja persistidos de review, pricing, scheduling e payment
- garantir ownership para `USER`
- manter acesso restrito para `ADMIN`
- definir formato consistente da timeline
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- endpoint de timeline/history funcional
- ownership para `USER` funcionando
- acesso administrativo funcionando
- eventos retornados corretamente
- formato consistente da timeline
- build continua passando
- testes aplicaveis passam
- Swagger, Scalar e OpenAPI continuam funcionando
- documentacao impactada atualizada

##### Dependencias
- EPIC-010B
- EPIC-011A
- EPIC-011B
- EPIC-012A

##### Fora de escopo
- novas mutacoes operacionais
- reabertura de review
- reabertura de pricing
- reabertura de scheduling
- reabertura de payment
- workflow administrativo completo

#### EPIC-013B - Frontend Tracking / Status Read Surface
**Status:** DONE

##### Objetivo
Entregar a primeira superficie visual de acompanhamento no frontend, consumindo os endpoints de history ja existentes para exibir status atual e timeline em modo somente leitura.

##### Escopo
- consumir `GET /api/v1/pickup-requests/{id}/history`
- consumir `GET /api/v1/admin/pickup-requests/{id}/history`
- destacar `currentStatus`
- renderizar timeline legivel a partir de `events[]`
- mapear labels humanas para `action`, `fromStatus` e `toStatus`
- tratar loading, empty state e error state
- reutilizar componentes entre owner e admin
- adicionar testes de mapeamento visual
- atualizar documentacao impactada

##### Criterios de aceite
- frontend consome os endpoints de history corretamente
- status atual aparece em destaque
- timeline renderiza o contrato sem mutacao
- eventos sistemicos aparecem com ator legivel
- datas aparecem formatadas corretamente
- loading, erro e vazio estao tratados
- nenhuma mutacao nova foi criada
- testes aplicaveis passam
- build, lint e typecheck continuam passando

##### Dependencias
- EPIC-013A
- EPIC-005

##### Fora de escopo
- novas mutacoes backend
- reabertura de review
- reabertura de pricing
- reabertura de scheduling
- reabertura de payment
- polling
- websocket
- notificacoes

#### EPIC-013C - Web Auth / Session Foundation
**Status:** DONE

##### Objetivo
Entregar a fundacao de autenticacao e sessao da web para substituir tokens manuais por env por contexto autenticado real, preservando a timeline como superficie read-only.

##### Escopo
- consumir `POST /api/v1/auth/login`
- consumir `POST /api/v1/auth/register`
- consumir `GET /api/v1/auth/me` quando necessario para sessao
- criar sessao web com cookie HTTP-only
- proteger a superficie owner por sessao autenticada
- proteger a superficie admin por role `ADMIN`
- adicionar login, register e logout na web
- atualizar a leitura de tracking para usar a sessao real
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- login funcional no frontend
- register funcional no frontend
- sessao web persistida em cookie HTTP-only
- owner tracking usa sessao autenticada real
- admin tracking exige role `ADMIN`
- nenhuma mutacao operacional nova foi criada
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-007
- EPIC-013B

##### Fora de escopo
- refresh token
- reset de senha
- perfil completo de usuario
- mutacoes operacionais no frontend
- polling
- websocket

#### EPIC-013D - Pickup Request Detail + Tracking Composition
**Status:** DONE

##### Objetivo
Consolidar em uma unica superficie autenticada o resumo do pedido, status atual, timeline e metadados relevantes para owner e admin, consumindo apenas os endpoints ja existentes.

##### Escopo
- criar superficie autenticada de pickup request detail
- compor resumo do pedido, status atual, timeline e metadados relevantes
- reutilizar a base visual e de transformacao entre owner e admin
- manter owner detail usando sessao autenticada real
- manter admin detail exigindo role `ADMIN`
- tratar loading, empty state e error state
- preservar contratos backend existentes
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- existe uma superficie autenticada unica de detail/tracking
- owner so acessa o que e dele
- admin acessa a superficie administrativa protegida
- resumo do pedido aparece em destaque
- currentStatus aparece claramente
- timeline usa os endpoints existentes sem alterar contrato
- eventos sistemicos sao legiveis
- estados de loading, erro e vazio estao cobertos
- nenhuma mutacao nova foi introduzida
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-013A
- EPIC-013B
- EPIC-013C

##### Fora de escopo
- editar pedido
- reabrir fluxo
- redefinir preco
- reagendar
- confirmar manualmente pagamento
- polling
- websocket
- notificacoes

#### EPIC-013E - Authenticated Pickup Request List / Dashboard
**Status:** DONE

##### Objetivo
Entregar dashboards autenticados de owner e admin para listar pickup requests existentes e conectar a lista aos detalhes autenticados ja entregues.

##### Escopo
- consumir `GET /api/v1/pickup-requests`
- consumir `GET /api/v1/admin/pickup-requests`
- criar dashboard autenticado de owner
- criar dashboard autenticado de admin
- reutilizar componentes visuais entre owner e admin quando possivel
- conectar cada item listado ao detail/tracking correspondente
- tratar loading, empty state e error state
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- owner acessa sua lista autenticada
- admin acessa a lista administrativa protegida
- cada item listado linka para a superficie detail/tracking correta
- loading, erro e vazio estao tratados
- nenhuma mutacao nova foi introduzida
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-013C
- EPIC-013D

##### Fora de escopo
- filtros avancados
- paginacao
- mutacoes operacionais
- polling
- websocket
- notificacoes

#### EPIC-008C - Web Pickup Request Creation Surface
**Status:** DONE

##### Objetivo
Entregar a primeira superficie autenticada de criacao de pickup request na web, consumindo o endpoint existente de criacao sem abrir pricing, scheduling, payment ou mutacoes administrativas.

##### Escopo
- criar superficie autenticada de criacao em `/requests/new`
- consumir `POST /api/v1/pickup-requests`
- capturar descricao, janela de pickup, address e um item inicial
- reutilizar a sessao autenticada real ja entregue
- redirecionar para o detail/tracking apos criacao bem-sucedida
- tratar erro de validacao e erro de request
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- owner autenticado consegue abrir a superficie de criacao
- submit usa o contrato backend existente sem alteracao
- criacao bem-sucedida redireciona para a superficie detail/tracking
- erros basicos estao tratados
- nenhuma mutacao administrativa nova foi criada
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-008B
- EPIC-013C
- EPIC-013D
- EPIC-013E

##### Fora de escopo
- multiplos itens dinamicos
- upload de foto no frontend
- pricing
- scheduling
- payment
- mutacoes administrativas

#### EPIC-008D - Owner Draft Editing + Multi-Item UX
**Status:** DONE

##### Objetivo
Evoluir a superficie web de criacao para suportar multiplos itens e permitir edicao owner apenas dentro do escopo inicial da request, antes de estados operacionais posteriores.

##### Escopo
- adicionar UX de multiplos itens na request
- criar superficie owner de edicao autenticada
- reutilizar a base visual de create/edit
- consumir mutacao owner de update apenas para requests editaveis
- bloquear edicao depois da entrada em fluxo operacional
- tratar feedback de erro e sucesso
- adicionar testes da regra de edicao permitida/bloqueada e do payload multi-item
- atualizar documentacao impactada

##### Criterios de aceite
- owner autenticado consegue editar requests em `draft`
- owner nao consegue editar requests apos `under_review`
- formulario suporta multiplos itens
- create e edit compartilham a mesma base visual
- feedback de erro e sucesso esta tratado
- nenhuma mutacao admin nova foi criada
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-008C
- EPIC-013C
- EPIC-013D

##### Fora de escopo
- upload de foto no frontend
- pricing
- scheduling
- payment
- mutacoes admin
- reabertura de fluxo operacional

#### EPIC-008E - Request Submission Semantics
**Status:** DONE

##### Objetivo
Separar explicitamente `draft` de `submitted`, criando a semantica de envio owner sem reabrir pricing, scheduling, payment ou mutacoes administrativas alem do review ja existente.

##### Escopo
- criar transicao owner de `draft -> submitted`
- registrar historico da submissao
- manter create/update trabalhando sobre `draft`
- bloquear edicao owner apos submissao
- ajustar o review admin para partir de `submitted`
- explicitar na web a diferenca entre salvar rascunho e enviar request
- adicionar testes aplicaveis
- atualizar documentacao impactada

##### Criterios de aceite
- existe endpoint owner de submit funcional
- submissao registra historico corretamente
- edicao continua disponivel apenas em `draft`
- requests submetidas nao podem mais ser editadas
- review admin parte de `submitted`
- a web diferencia salvar rascunho de enviar
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-008D
- EPIC-010B
- EPIC-013D

##### Fora de escopo
- pricing
- scheduling
- payment
- mutacoes admin novas
- polling
- notificacoes

#### EPIC-011C - Quote Visibility + Awaiting Payment Owner Surface
**Status:** DONE

##### Objetivo
Expor para o owner a transicao `under_review -> quoted/awaiting_payment`, mostrando com clareza o pricing ja persistido e o estado atual da request sem abrir novas mutacoes operacionais.

##### Escopo
- ajustar a surface owner de detail/tracking para destacar `quoted` e `awaiting_payment`
- mostrar pricing persistido com breakdown legivel
- manter timeline e status coerentes com o contrato existente
- reutilizar componentes e mapeamentos ja existentes quando possivel
- tratar estados de visibilidade relevantes no frontend
- adicionar testes de mapeamento para quote visibility
- atualizar documentacao impactada

##### Criterios de aceite
- owner visualiza claramente quando a request esta `under_review`, `quoted` ou `awaiting_payment`
- pricing persistido aparece de forma clara e legivel
- nenhuma mutacao nova e criada
- o contrato backend permanece intacto
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-011A
- EPIC-013D
- EPIC-008E

##### Fora de escopo
- novas mutacoes operacionais
- novos contratos backend
- pricing novo ou edicao de pricing
- scheduling
- payment capture
- polling
- notificacoes

#### EPIC-012B - Owner Payment Surface
**Status:** DONE

##### Objetivo
Expor para o owner a superficie de pagamento sobre os endpoints ja existentes de payment session, refletindo com clareza os estados `awaiting_payment` e `paid` sem abrir novos contratos backend.

##### Escopo
- criar CTA owner para iniciar checkout quando a request estiver em `awaiting_payment`
- mostrar estado de pagamento confirmado quando a request estiver em `paid`
- reutilizar detail/tracking e mapeamentos existentes
- manter pricing, status e timeline coerentes com o contrato atual
- adicionar testes frontend de mapeamento para payment visibility
- atualizar documentacao impactada

##### Criterios de aceite
- owner consegue iniciar payment session a partir da surface de tracking
- `awaiting_payment` aparece com CTA e amount legiveis
- `paid` aparece como estado confirmado sem CTA extra
- nenhuma mutacao backend nova e criada
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-012A
- EPIC-011C
- EPIC-013D

##### Fora de escopo
- payment capture no frontend
- novos contratos backend
- scheduling
- polling
- notificacoes

---

# EPIC-014 - Infra, Deploy e Observabilidade
**Status:** READY

## Objetivo
Preparar execucao local, staging e deploy inicial.

## Escopo
- Docker
- variaveis de ambiente
- setup de ambientes
- publicacao
- smoke test
- observabilidade minima
- rollback inicial

## Criterios de aceite
- ambiente local reproduzivel
- configuracao revisada
- deploy realizado
- smoke test executado
- rollback definido

## Dependencias
- EPIC-004
- EPIC-005
- EPIC-006
- EPIC-012

---

# Ordem de execucao recomendada

1. EPIC-000 - Governanca e Foundation Documental
2. EPIC-001 - Discovery do Produto
3. EPIC-002 - Planejamento Inicial
4. EPIC-003 - Foundation do Monorepo
5. EPIC-004 - Foundation do Backend
6. EPIC-005 - Foundation do Frontend
7. EPIC-006 - Banco de Dados e Persistencia
8. EPIC-007 - Auth e Controle de Acesso
9. EPIC-008 - Fluxo de Solicitacao de Coleta
10. EPIC-009 - Upload de Imagens
11. EPIC-010 - Painel Admin
12. EPIC-011 - Motor de Preco MVP
13. EPIC-012 - Pagamentos
14. EPIC-013 - Tracking e Historico
15. EPIC-014 - Infra, Deploy e Observabilidade
