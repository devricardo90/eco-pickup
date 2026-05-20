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
**Status:** DONE

## Nota operacional
Marcacao normalizada em 2026-04-12. Este item permanecia como `READY`, mas a documentacao viva do projeto ja sustenta que a discovery minima foi executada antes das foundations e do MVP atual. A marcacao anterior passa a ser tratada como obsoleta.

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
**Status:** DONE

## Nota operacional
Marcacao normalizada em 2026-04-12. Este item permanecia como `READY`, mas a documentacao viva do projeto ja sustenta que o planejamento inicial foi executado antes da EPIC-003 e das slices posteriores do MVP. A marcacao anterior passa a ser tratada como obsoleta.

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

## Nota operacional - escopo do deploy MVP
Em 2026-04-21, por decisao de escopo/prioridade, o upload de imagem foi retirado do MVP publicavel atual para destravar o deploy e a apresentacao de portfolio. A feature nao foi descartada: a fundacao, o historico tecnico e o endpoint existente permanecem registrados, mas a validacao de upload/R2 deixa de ser gate do deploy atual e sera retomada em fase futura pos-deploy/refinamento.

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

##### Nota de escopo para deploy
Implementacao entregue no repositorio, mas excluida do fluxo critico do MVP publicavel em 2026-04-21. Para deploy/apresentacao atual, o fluxo principal deve seguir sem depender de upload de imagem ou de smoke R2. A retomada da feature fica para fase futura pos-deploy/refinamento.

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

#### EPIC-011D - Owner Scheduled Visibility + Post-Payment Messaging
**Status:** DONE

##### Objetivo
Deixar claro para o owner quando a request saiu de `paid` para `scheduled`, destacando a janela confirmada de coleta e a mensagem operacional pos-pagamento sem abrir novas mutacoes.

##### Escopo
- criar visibilidade owner para o estado pos-pagamento
- destacar a janela confirmada quando a request estiver `scheduled`
- mostrar mensagem clara quando o pagamento estiver confirmado, mas o agendamento ainda nao tiver sido fechado
- reutilizar detail/tracking e mapeamentos existentes
- adicionar testes frontend relevantes
- atualizar documentacao impactada

##### Criterios de aceite
- owner entende claramente a diferenca entre `paid` e `scheduled`
- janela confirmada aparece em destaque quando disponivel
- nenhuma mutacao backend nova e criada
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-011B
- EPIC-012B
- EPIC-013D

##### Fora de escopo
- novas mutacoes operacionais
- novos contratos backend
- polling
- notificacoes

#### EPIC-013F - Owner Execution Tracking Messaging
**Status:** DONE

##### Objetivo
Cobrir de forma legivel para o owner os estados `in_transit`, `collected` e `completed` na surface de tracking, usando linguagem mais operacional sem criar novas mutacoes.

##### Escopo
- criar messaging owner para os estados de execucao
- destacar o contexto operacional em `in_transit`
- refletir de forma clara os estados `collected` e `completed`
- reutilizar detail/tracking e mapeamentos existentes
- adicionar testes frontend relevantes
- atualizar documentacao impactada

##### Criterios de aceite
- owner entende claramente o que significa `in_transit`, `collected` e `completed`
- a surface permanece coerente com o contrato backend atual
- nenhuma mutacao nova e criada
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-013D
- EPIC-011D

##### Fora de escopo
- novas mutacoes operacionais
- novos contratos backend
- polling
- notificacoes

#### EPIC-013G - Owner Final Completion Messaging
**Status:** DONE

##### Objetivo
Reforcar a leitura final do lifecycle owner para `completed`, `cancelled` e `rejected`, deixando o encerramento do fluxo explicito sem criar novas mutacoes.

##### Escopo
- criar messaging owner para estados terminais
- reforcar o encerramento claro do lifecycle em `completed`
- tratar semanticamente `cancelled` e `rejected`
- reutilizar detail/tracking e mapeamentos existentes
- adicionar testes frontend relevantes
- atualizar documentacao impactada

##### Criterios de aceite
- owner entende claramente quando a request terminou com sucesso, cancelamento ou rejeicao
- a surface permanece coerente com o contrato backend atual
- nenhuma mutacao nova e criada
- lint, typecheck, build e testes aplicaveis passam

##### Dependencias
- EPIC-013D
- EPIC-013F

##### Fora de escopo
- novas mutacoes operacionais
- novos contratos backend
- polling
- notificacoes

#### EPIC-000R - MVP Transversal Review / Stabilization
**Status:** DONE

##### Objetivo
Executar uma revisao transversal do MVP web/backend entregue para validar coerencia entre estados, contratos, guards, rotas e messaging, aplicando apenas correcoes pequenas e de baixo risco.

##### Escopo
- revisar fluxo owner ponta a ponta
- revisar consistencia de status e transicoes entre backend e frontend
- revisar guards owner/admin
- revisar messaging semantica, empty state, error state e success state
- revisar nomes, tipos e contratos do frontend
- revisar testes existentes e gaps pequenos
- aplicar apenas ajustes pequenos de consolidacao quando necessarios

##### Criterios de aceite
- revisao transversal executada
- achados priorizados registrados
- apenas ajustes pequenos e de baixo risco aplicados
- gates relevantes executados

##### Dependencias
- MVP atual entregue ate EPIC-013G

##### Fora de escopo
- novas mutacoes operacionais
- novos contratos backend
- redesign amplo
- polling
- notificacoes

#### EPIC-000S - MVP Bug Bash / Manual QA
**Status:** DONE

##### Objetivo
Executar uma rodada curta de QA manual sobre o MVP entregue para validar comportamento real, guardas, mensagens e consistencia entre summary, status, timeline, cards semanticos e CTAs.

##### Escopo
- validar fluxo owner ponta a ponta
- validar superfices admin existentes em modo leitura
- revisar estados vazios, erros, sucessos e bloqueios
- registrar bugs reais com correcao objetiva
- aplicar apenas correcoes pequenas e seguras

##### Criterios de aceite
- checklist curto de QA executado
- bugs reais registrados com severidade e reproducao
- apenas correcao de baixo risco aplicada quando necessaria
- backlog e status atualizados
- lint, typecheck, build e testes do frontend executados

##### Dependencias
- EPIC-000R
- MVP atual entregue ate EPIC-013G

##### Fora de escopo
- novas funcionalidades
- novas mutacoes operacionais
- novos contratos backend
- redesign amplo
- novas dependencias

#### EPIC-000T - MVP Bug Bash / Manual QA Round 2
**Status:** DONE

##### Objetivo
Executar uma segunda rodada curta de QA manual com foco em consistencia entre estados seedados do lifecycle, superfices owner/admin e documentacao operacional do MVP antes de retomar novas frentes.

##### Escopo
- validar coerencia entre `draft`, `submitted`, `awaiting_payment`, `scheduled` e `completed`
- revisar consistencia entre summary, status badge, timeline, cards semanticos e CTAs
- revisar guardas owner/admin sem abrir mutacoes novas
- corrigir apenas bugs pequenos e seguros encontrados na rodada

##### Criterios de aceite
- rodada curta executada com registro objetivo dos achados
- bugs pequenos corrigidos sem ampliar escopo
- backlog e status atualizados
- gates necessarios executados para os arquivos tocados

##### Dependencias
- EPIC-000S
- MVP atual entregue ate EPIC-013G

##### Fora de escopo
- novas funcionalidades
- novas mutacoes operacionais
- novos contratos backend
- redesign
- refactors amplos

#### EPIC-000U - MVP Documentation Cleanup
**Status:** DONE

##### Objetivo
Consolidar README, backlog e status para refletir o estado real do MVP atual sem abrir escopo funcional novo.

##### Escopo
- revisar README raiz, `apps/api/README.md` e `apps/web/README.md`
- alinhar backlog e status com o estado entregue das slices owner/admin
- remover descricoes desatualizadas, ambiguas ou redundantes
- registrar claramente o que continua fora do escopo atual

##### Criterios de aceite
- README(s) atualizados com o fluxo MVP atual
- backlog e status consolidados
- cleanup estritamente documental

##### Dependencias
- EPIC-000T

##### Fora de escopo
- novas funcionalidades
- novas mutacoes operacionais
- mudancas de contrato backend
- refactors de codigo
- redesign de documentacao

---

# EPIC-014 - Infra, Deploy e Observabilidade
**Status:** IN_PROGRESS

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

### Fatias de execucao

#### EPIC-014A - Infra / Deploy Readiness Assessment
**Status:** DONE

##### Objetivo
Mapear a prontidao de infraestrutura, deploy e observabilidade do MVP atual antes de executar qualquer deploy real ou alterar configuracoes tecnicas.

##### Escopo
- revisar requisitos atuais de execucao local, staging e deploy
- inventariar variaveis de ambiente necessarias para API, web, banco, storage e payment
- revisar configuracoes existentes documentadas sem aplicar mudancas tecnicas
- identificar lacunas para deploy inicial, smoke test, observabilidade minima e rollback
- propor a ordem segura das proximas slices de EPIC-014
- atualizar documentacao operacional impactada

##### Criterios de aceite
- readiness de infra/deploy registrado de forma objetiva
- dependencias externas e variaveis de ambiente mapeadas
- lacunas e riscos classificados
- primeira ordem de execucao tecnica da EPIC-014 definida
- nenhuma implementacao tecnica, deploy real ou mudanca de configuracao aplicada
- status operacional atualizado

##### Dependencias
- EPIC-014
- encerramento formal da pausa de consolidacao do MVP

##### Fora de escopo
- deploy real
- criacao de ambiente staging
- alteracoes em Docker, CI/CD ou configuracoes de runtime
- mudancas de codigo
- observabilidade implementada
- smoke test real
- rollback executado

##### Resultado
- readiness registrado em `docs/ops/infra-deploy-readiness.md`
- ambiente local identificado como parcialmente pronto
- staging e deploy real identificados como nao definidos
- observabilidade identificada como minima local
- smoke test e rollback identificados como pendentes
- proxima slice segura definida como `EPIC-014B - Runtime Environment Contract`

#### EPIC-014B - Runtime Environment Contract
**Status:** DONE

##### Objetivo
Formalizar o contrato de ambiente para local, staging e producao antes de alterar configuracoes tecnicas ou executar deploy.

##### Escopo
- definir matriz de variaveis por ambiente para API, web, banco, storage e payment
- separar secrets de valores nao sensiveis
- registrar nomes esperados de variaveis para runtime hospedado
- definir URLs/base URLs esperadas por ambiente
- registrar defaults permitidos apenas para desenvolvimento local
- identificar valores que devem ser provisionados fora do repositorio
- atualizar documentacao operacional impactada

##### Criterios de aceite
- matriz local/staging/producao registrada
- secrets claramente identificados
- contrato de env da API registrado no formato esperado por runtime hospedado
- contrato de env da web registrado
- lacunas remanescentes explicitadas
- nenhuma mudanca tecnica aplicada

##### Dependencias
- EPIC-014A

##### Fora de escopo
- alteracao de `.env.example`
- alteracao de `appsettings`
- alteracao de Docker, CI/CD ou runtime
- provisionamento de secrets
- deploy real
- criacao de staging
- implementacao de observabilidade

##### Resultado
- contrato registrado em `docs/ops/runtime-environment-contract.md`
- matriz local/staging/producao definida
- nomes canonicos de runtime hospedado definidos para API e web
- secrets, valores obrigatorios, opcionais, derivados e local-only classificados
- defaults permitidos apenas em local documentados
- lacunas e decisoes pendentes registradas
- proxima slice segura definida como `EPIC-014C - Local Full-Stack Runbook`

#### EPIC-014C - Local Full-Stack Runbook
**Status:** DONE

##### Objetivo
Documentar o procedimento reproduzivel para subir o ambiente local completo do MVP, cobrindo Postgres, MinIO, API e web, sem alterar configuracoes tecnicas.

##### Escopo
- documentar pre-requisitos locais
- documentar ordem de subida de Postgres e MinIO via Docker Compose
- documentar ordem de execucao local da API
- documentar ordem de execucao local da web
- documentar validacao minima de `/health`
- documentar validacao minima de conectividade web -> API
- registrar comandos de parada/limpeza nao destrutiva
- registrar troubleshooting basico
- atualizar status operacional

##### Criterios de aceite
- runbook local registrado em documentacao operacional
- fluxo local completo documentado sem ambiguidade
- `/health` incluido como validacao minima
- dependencias e variaveis locais referenciadas a partir do contrato de runtime
- nenhuma mudanca tecnica aplicada

##### Dependencias
- EPIC-014B

##### Fora de escopo
- alterar Docker Compose
- criar Dockerfile para API ou web
- alterar `.env.example`
- alterar `appsettings`
- executar deploy
- criar staging
- implementar observabilidade
- criar smoke test real de staging/producao

##### Resultado
- runbook registrado em `docs/ops/local-full-stack-runbook.md`
- PostgreSQL local validado via Docker Compose e `pg_isready`
- MinIO local validado nas portas `9000` e `9001`
- API validada com build, subida local e `/health` respondendo `200 Healthy`
- web validada em `127.0.0.1:3001`
- integracao basica web -> API validada com sessao autenticada e rota owner `/requests`
- gaps operacionais registrados: Node local abaixo da baseline, necessidade de permissao elevada para Docker/dotnet neste ambiente, uso de `pnpm.cmd` no Windows e porta `3000` potencialmente ocupada
- nenhuma mudanca tecnica aplicada

#### EPIC-014D - Deploy Target Decision
**Status:** DONE

##### Objetivo
Escolher a estrategia e os alvos de deploy para API, web, banco, storage, secrets e logs antes de qualquer provisionamento ou deploy real.

##### Escopo
- comparar opcoes de hosting para API
- comparar opcoes de hosting para web
- definir direcao para PostgreSQL gerenciado
- confirmar direcao de storage S3-compatible para staging/producao
- definir direcao de secret manager
- definir direcao de logs/observabilidade inicial
- registrar criterios de escolha e tradeoffs
- atualizar documentacao operacional impactada

##### Criterios de aceite
- alvo recomendado para API registrado
- alvo recomendado para web registrado
- direcao de banco, storage, secrets e logs registrada
- riscos e dependencias externas classificados
- nenhuma infraestrutura provisionada
- nenhum deploy executado

##### Dependencias
- EPIC-014C

##### Fora de escopo
- provisionar staging
- criar contas ou recursos externos
- alterar Docker, CI/CD, runtime ou codigo
- configurar secrets reais
- executar deploy
- implementar observabilidade

##### Resultado
- decisao registrada em `docs/ops/deploy-target-decision.md`
- API recomendada para Render Web Service com Docker
- web recomendada para Vercel
- banco recomendado para Render Postgres na mesma regiao da API
- storage recomendado para Cloudflare R2
- secrets recomendados via mecanismos nativos das plataformas no primeiro staging
- logs recomendados via Render logs e Vercel runtime logs no primeiro staging
- nenhuma infraestrutura provisionada e nenhum deploy executado

#### EPIC-014E - Staging Deployment Plan / Smoke and Rollback
**Status:** DONE

##### Objetivo
Transformar a decisao de targets da EPIC-014D em um plano operacional de staging, smoke test e rollback antes de qualquer provisionamento.

##### Escopo
- definir topologia de staging
- definir URLs esperadas para web e API
- definir matriz final de env vars para staging
- definir plano de migrations para primeiro deploy
- definir checklist de smoke test
- definir rollback inicial
- registrar gates antes de provisionar recursos
- atualizar documentacao operacional impactada

##### Criterios de aceite
- plano de staging registrado
- smoke test inicial definido
- rollback inicial definido
- estrategia de migrations registrada
- gates de provisionamento explicitados
- nenhuma infraestrutura provisionada
- nenhum deploy executado

##### Dependencias
- EPIC-014D

##### Fora de escopo
- provisionar Render, Vercel, R2 ou banco
- criar contas ou recursos externos
- criar Dockerfile
- alterar codigo
- alterar Docker, CI/CD, runtime ou envs
- configurar secrets reais
- executar deploy
- implementar observabilidade

##### Resultado
- plano registrado em `docs/ops/staging-deployment-plan.md`
- topologia de staging definida com Vercel, Render Web Service, Render Postgres e Cloudflare R2
- ordem segura de execucao futura registrada antes de provisionamento
- checklist de smoke test definido para API, web, auth, requests, tracking, storage, payment e logs
- rollback inicial definido para falha de deploy, runtime, migrations, storage e payment
- riscos e pendencias registrados
- nenhuma infraestrutura provisionada, nenhum deploy executado e nenhuma mudanca tecnica aplicada

#### EPIC-014F - API Deploy Artifact Foundation
**Status:** DONE

##### Objetivo
Criar e validar o artefato minimo de deploy da API para Render Web Service com Docker, sem provisionar staging e sem executar deploy real.

##### Escopo
- criar Dockerfile minimo da API
- validar build da imagem localmente
- validar execucao local do container contra Postgres/MinIO locais, se tecnicamente viavel
- validar `/health` do container, se a execucao local fizer parte do recorte
- documentar comandos, evidencias e gaps
- atualizar documentacao operacional impactada

##### Criterios de aceite
- artefato Docker da API criado
- imagem da API builda localmente
- comportamento runtime documentado
- `/health` validado no artefato quando aplicavel
- gates backend aplicaveis executados
- nenhuma infraestrutura provisionada
- nenhum deploy executado

##### Dependencias
- EPIC-014E

##### Fora de escopo
- provisionar Render, Vercel, R2 ou banco
- criar staging real
- alterar CI/CD
- criar Dockerfile da web
- executar deploy
- configurar secrets reais
- implementar observabilidade
- executar smoke test de staging real

##### Resultado
- Dockerfile da API criado em `apps/api/Dockerfile`
- contexto Docker ajustado com `apps/api/.dockerignore` para excluir `bin/` e `obj/`
- imagem `ecopickup-api:014f` buildada localmente com sucesso
- container local subiu em `localhost:5082`
- `/health` respondeu `200 Healthy` no container
- build backend e testes unitarios executados com sucesso
- assumptions de runtime e evidencias registradas em `docs/ops/api-deploy-artifact-foundation.md`
- nenhum provisionamento, staging ou deploy real executado

#### EPIC-014G - Staging Migration Strategy
**Status:** DONE

##### Objetivo
Definir a estrategia operacional de migrations para o primeiro staging em Render Postgres antes de provisionar ou executar deploy real.

##### Escopo
- definir quando e como migrations serao aplicadas em staging
- definir criterio para `Persistence__ApplyMigrationsOnStartup`
- definir pre-checks antes de migration
- definir backup/snapshot/export minimo antes de migration com risco
- definir estrategia de rollback ou forward fix
- documentar comandos esperados sem executar em staging real
- atualizar documentacao operacional impactada

##### Criterios de aceite
- estrategia de migrations de staging registrada
- decisao sobre migrations automaticas documentada
- pre-checks e rollback/forward fix definidos
- nenhum banco externo provisionado
- nenhuma migration de staging executada
- nenhum deploy real executado

##### Dependencias
- EPIC-014F

##### Fora de escopo
- provisionar Render Postgres
- executar migrations em staging
- alterar migrations existentes
- alterar codigo
- alterar CI/CD
- criar staging real
- executar deploy

##### Resultado
- estrategia de migrations registrada em `docs/ops/staging-migration-strategy.md`
- decisao registrada: primeiro staging usa migration manual controlada e explicita
- `Persistence__ApplyMigrationsOnStartup=false` definido como diretriz para staging
- pre-condicoes, ordem segura, validacoes, abort e rollback/forward fix documentados
- estrategia alinhada com o Docker artifact validado na EPIC-014F e com o plano de staging da EPIC-014E
- nenhum banco provisionado, nenhuma migration real executada e nenhum deploy realizado

#### EPIC-014H - Staging Provisioning Checklist
**Status:** DONE

##### Objetivo
Preparar o checklist final de provisionamento de Render, Vercel, Render Postgres e Cloudflare R2 com nomes, regioes, secrets esperados e ordem de criacao, ainda sem provisionar recursos.

##### Escopo
- definir nomes operacionais dos recursos de staging
- definir regiao alvo para Render API e Render Postgres
- listar secrets finais por plataforma
- definir ordem de criacao dos recursos
- definir evidencias esperadas de cada recurso provisionado futuramente
- atualizar documentacao operacional impactada

##### Criterios de aceite
- checklist de provisionamento de staging registrado
- recursos e nomes esperados definidos
- secrets por plataforma listados sem valores reais
- ordem de criacao registrada
- nenhum recurso externo provisionado
- nenhum deploy executado

##### Dependencias
- EPIC-014G

##### Fora de escopo
- provisionar Render, Vercel, R2 ou banco
- criar secrets reais
- alterar codigo
- alterar runtime/envs
- executar migrations
- executar deploy

##### Resultado
- checklist registrado em `docs/ops/staging-provisioning-checklist.md`
- checklist consolidado por camada: web, API, banco, storage, secrets e logs
- naming convention proposta para recursos de staging
- envs/secrets esperados listados sem valores reais
- ordem segura de provisionamento futuro registrada
- bloqueios, pendencias e decisoes abertas registrados
- nenhum recurso externo provisionado, nenhum secret real criado e nenhum deploy executado

#### EPIC-014I - Staging Provisioning Execution
**Status:** DONE

##### Nota operacional - decisao de escopo em 2026-04-21
O upload de imagem/R2 deixou de ser bloqueio do MVP publicavel atual. A EPIC-014I foi fechada com deploy e smoke do MVP sem upload de imagem. A funcionalidade de imagem nao foi descartada e deve ser retomada em fase futura pos-deploy/refinamento.

##### Objetivo
Criar os recursos reais de staging na ordem aprovada, registrando evidencias e parando antes de deploy funcional se qualquer pre-condicao falhar.

##### Escopo
- confirmar autorizacao para provisionamento e custos
- criar recursos de staging conforme checklist aprovado
- registrar evidencias de recursos criados
- preencher secrets reais nas plataformas sem versionar valores
- manter migrations e deploy funcional sob controle operacional explicito
- atualizar documentacao operacional impactada

##### Criterios de aceite
- recursos externos de staging criados conforme checklist
- secrets configurados nas plataformas sem vazamento em repositorio
- evidencias registradas
- nenhum valor real de secret versionado
- bloqueios registrados se algum recurso nao puder ser criado

##### Dependencias
- EPIC-014H
- autorizacao explicita para provisionar recursos externos e aceitar custos
- decisoes abertas da EPIC-014H fechadas pelo responsavel do projeto

##### Fora de escopo
- executar deploy funcional completo sem pre-condicoes fechadas
- executar migration sem seguir EPIC-014G
- implementar CI/CD
- implementar observabilidade externa
- alterar codigo de produto

##### Resultado
- tentativa registrada em `docs/ops/staging-provisioning-execution.md`
- autorizacao de provisionamento/custos foi recebida nesta execucao
- provisionamento bloqueado por ausencia de meio autenticado e aprovado para operar Render, Vercel e Cloudflare
- `render`, `vercel` e `wrangler` CLI nao estavam disponiveis no `PATH`
- contas/workspaces aprovados, billing owner, region, planos, Vercel environment, payment staging, seed/admin e modo Docker permanecem sem confirmacao operacional nesta sessao
- checklist minimo de retomada consolidado em `docs/ops/staging-provisioning-execution.md`
- nenhum recurso externo foi provisionado
- nenhum secret real foi criado, lido, registrado ou versionado
- staging nao ficou pronto para migration/deploy
- retomada posterior registrou API staging no Render, front publicado na Vercel e smoke do MVP sem upload de imagem
- smoke confirmado: `/health`, register, login, create pickup request, list, detail e history
- upload de imagem/R2 retirado do gate atual por decisao documentada em `EPIC-014K`
- proxima etapa operacional passa a ser README/GitHub/portfolio, sem reabrir upload como bloqueio

#### EPIC-014J - Staging Object Storage Runtime Hardening
**Status:** DONE

##### Objetivo
Corrigir a falha operacional de upload de fotos em staging causada por configuracao ausente/incompleta de storage R2/S3-compatible no Render e por dependencia de verificacao/criacao de bucket em runtime.

##### Escopo
- confirmar provider de storage alvo para staging
- listar env vars obrigatorias para Render
- ajustar a API para nao depender de `EnsureBucketExistsAsync` quando `ObjectStorage__AutoCreateBucket=false`
- adicionar logs claros para falhas de conexao, credencial/permissao, bucket inexistente e erro S3-compatible
- atualizar documentacao operacional impactada
- executar gates tecnicos aplicaveis

##### Criterios de aceite
- causa raiz operacional registrada
- variaveis obrigatorias de storage para Render documentadas
- staging/producao nao dependem de criacao/check de bucket em runtime quando `AutoCreateBucket=false`
- logs de upload classificam os principais modos de falha sem expor secrets
- build e testes backend aplicaveis passam

##### Dependencias
- EPIC-014D
- EPIC-014H
- configuracao real de Cloudflare R2 e Render continua dependente de acesso/autorizacao operacional

##### Fora de escopo
- provisionar bucket R2 real
- criar token/secret real
- alterar permissao diretamente na Cloudflare
- configurar Render externamente nesta sessao
- executar deploy real

##### Resultado
- provider confirmado: Cloudflare R2 via API S3-compatible, com MinIO apenas para desenvolvimento local
- `ObjectStorage__AutoCreateBucket=false` passou a evitar `DoesS3BucketExistV2Async` antes do upload
- logs `[OBJECT-STORAGE]` adicionados para diagnostico de upload e cleanup
- contrato de ambiente atualizado em `docs/ops/runtime-environment-contract.md`
- incidente e instrucoes Render/R2 registrados em `docs/ops/staging-provisioning-execution.md`

#### EPIC-014K - MVP Deploy Scope Adjustment
**Status:** DONE

##### Objetivo
Registrar a decisao operacional de retirar upload de imagem do MVP publicavel atual para concluir deploy e apresentacao do projeto sem depender de Cloudflare R2.

##### Escopo
- registrar que upload de imagem nao foi descartado
- registrar que upload/R2 sai do gate critico do deploy atual
- preservar o historico tecnico e a retomada futura da feature
- atualizar backlog, status e handoff operacional

##### Criterios de aceite
- backlog canonico registra a decisao
- status operacional aponta o novo objetivo de deploy
- handoff da EPIC-014I remove upload/R2 como proximo bloqueio critico
- nenhuma mudanca de schema, auth, banco, dominio ou deploy pipeline

##### Dependencias
- decisao explicita do responsavel do projeto em 2026-04-21
- EPIC-014I em andamento

##### Fora de escopo
- remover tabelas, migrations ou endpoint ja implementado
- refatorar storage
- alterar autenticacao, banco, dominio ou fluxo principal de requests
- validar upload R2 em staging

##### Resultado
- upload de imagem classificado como fase futura pos-deploy/refinamento
- deploy MVP atual passa a depender de health, auth, requests, tracking/admin basico e apresentacao, nao de smoke R2
- historico da tentativa R2 mantido em `docs/ops/staging-provisioning-execution.md`

---

# EPIC-015 - README e Portfolio
**Status:** DONE

## Objetivo
Atualizar o README raiz como peca de portfolio/showcase honesta e profissional sobre o MVP publicavel validado.

## Escopo
- substituir README de planejamento por README de portfolio
- refletir stack real, lifecycle state machine, features owner/admin/backend
- incluir links publicos confirmados
- registrar upload/R2 como deferred com transparencia

## Criterios de aceite
- README atualizado e publicado
- links de staging confirmados
- escopo real do MVP documentado sem exagero
- upload/R2 explicitamente deferred

## Dependencias
- EPIC-014I
- EPIC-014K

### Fatias de execucao

#### EPIC-015A - README Portfolio Update
**Status:** DONE

##### Objetivo
Substituir o README de planejamento por um README de portfolio que reflita o MVP publicavel validado em 2026-04-21.

##### Resultado
- README raiz atualizado com stack, lifecycle, features owner/admin/backend, smoke test evidence
- links publicos: `https://ecopickup-api-stg.onrender.com/health` e `https://eco-pickup-web.vercel.app`
- upload/R2 registrado como deferred com historico tecnico preservado
- commit publicado em `main` via worktree merge apos resolucao de divergencia com remote

---

# EPIC-016 - Staging Validation e Observabilidade
**Status:** IN_PROGRESS

## Objetivo
Validar e documentar o estado operacional do staging apos o MVP publicavel, sem abrir novas frentes funcionais.

## Escopo
- snapshot de runtime do staging
- validacao periodica de disponibilidade
- observabilidade minima

## Criterios de aceite
- staging documentado como operacional
- snapshot registrado com evidencias HTTP
- proxima etapa de observabilidade definida

## Dependencias
- EPIC-014I
- EPIC-015

### Fatias de execucao

#### EPIC-016A - Staging Runtime Snapshot
**Status:** DONE

##### Objetivo
Registrar um snapshot do estado operacional do staging (API Render e frontend Vercel) para fechar a lacuna de 11 dias sem validacao documentada apos o smoke do MVP em 2026-04-21.

##### Escopo
- validar `GET /health` da API staging
- validar landing page do frontend Vercel
- registrar evidencias HTTP com timestamp, status, tempo de resposta e interpretacao
- atualizar backlog e status operacional

##### Criterios de aceite
- snapshot registrado com evidencias HTTP objetivas
- cold start documentado e interpretado corretamente
- backlog e status atualizados
- nenhum deploy, redeploy, migration ou alteracao de codigo executada

##### Dependencias
- EPIC-015

##### Resultado
- snapshot registrado em `docs/ops/staging-runtime-snapshot.md`
- API: HTTP 200 em `2026-05-02T15:34:43Z`, cold start 15.65s, warm 0.18s, body `Healthy`
- Frontend: HTTP 200 em `2026-05-02T15:35:20Z`, 1.52s, titulo `EcoPickup`, links corretos
- repository base no momento do snapshot: commit `55f401f`
- nenhum deploy, redeploy, migration ou alteracao de codigo executada

---

# EPIC-017 - Public Functional Demo Surface
**Status:** IN_PROGRESS

## Objetivo
Transformar a pagina publica do EcoPickup em uma vitrine funcional minima, com linguagem de produto e CTAs reais.

## Escopo
- atualizar texto da landing page para linguagem de produto
- remover linguagem de "bootstrap tecnico / mock"
- criar/ajustar secao "Como funciona"
- adicionar CTAs reais para login, cadastro e criacao de solicitacao
- ajustar cards para mostrar valor do produto (coleta, avaliacao, acompanhamento)

## Criterios de aceite
- home publica comunica EcoPickup como produto funcional simples
- usuario externo entende o fluxo principal em ate 2 minutos
- CTAs principais apontam para rotas reais
- linguagem de "mock/bootstrap" removida da interface publica

### Fatias de execucao

#### EPIC-017A - Public Landing UI Refinement
**Status:** DONE

##### Objetivo
Refinar a landing page para remover linguagem técnica e focar em proposta de valor e CTAs reais.

#### EPIC-017B - Staging Landing Validation
**Status:** DONE (with findings)

##### Objetivo
Validar a landing page em staging, garantindo disponibilidade, conectividade e coerência visual/textual.

##### Achados
- API /health: 200 OK (Healthy).
- Landing, login e register: 200 OK.
- Achado MEDIUM: Linguagem técnica remanescente nas páginas de auth.
- Achado MEDIUM: Landing pública Portuguese-first (impacto negativo em portfólio internacional).
- Decisão: Public showcase deve ser English-first.
- Recomendação: Tratar em tarefa futura EPIC-017C — Make Public Showcase English-First.

#### EPIC-017C - Make Public Showcase English-First
**Status:** DONE (Remote DONE + Staging PASS)

##### Objetivo
Transicionar a superfície pública (Landing, Auth, Nav) para Inglês e remover jargões técnicos.

##### Evidência
- Commit 0c98fce em origin/main.
- Validação manual em staging: PASS.
- Escopo: landing, public auth/login/register, e session-summary.
- Nenhuma alteração de backend, database, env, migration, seed, auth logic, Zod schema ou React Hook Form binding. Alterações de frontend foram limitadas à copy/superfície pública autorizada.

#### EPIC-018A - Demo Readiness Validation
**Status:** Discussion Gate DONE (PASSA)

##### Objetivo
Validar se a jornada pública publicada sustenta uma demo guiada de portfolio em até 2 minutos (decisão de prontidão baseada em análise técnica).

##### Resultado
- Decisão: **PASSA**.
- Tempo estimado: ~1m50s com API aquecida.
- Ponto crítico: Cold start da API no Render (recomendado aquecer via /health antes de demos).
- R2/Object Storage: Permanece fora do caminho crítico/MVP.
- Recomendação: Seguir para EPIC-018B (Portfolio Demo Script).


## Dependencias
- EPIC-013G
- EPIC-014I

### Fatias de execucao

#### EPIC-017A - Public Functional Demo Surface
**Status:** DONE

##### Objetivo
Executar a transformacao da landing page de bootstrap tecnico para vitrine de produto.

#### EPIC-018B - Prepare Portfolio Demo Script and Screenshots
**Status:** DONE (Script & Checklist)

##### Objetivo
Criar o roteiro oficial de demo de portfolio e registrar o checklist de screenshots da jornada pública validada.

##### Escopo
- Criar `docs/ops/demo-script.md`.
- Registrar checklist de 5-7 screenshots principais.
- Documentar limitações (Photo upload como roadmap).
- Validar jornada ponta a ponta (~2 min).

##### Criterios de aceite
- Roteiro de demo completo e profissional.
- Checklist de evidências visuais registrado.
- Nenhuma alteração de código/app.

---

# SPR-02 - Product Demo Readiness
**Status:** IN_PROGRESS

## Objetivo
Transformar o EcoPickup de MVP tecnicamente demonstravel em uma vitrine funcional de portfolio, com fluxo principal validado, superficie visual apresentavel e decisao objetiva sobre fotos/Object Storage.

## Escopo
- auditar a jornada real antes de polish
- priorizar problemas visuais e tecnicos
- definir proximas fatias sem abrir implementacao prematura
- validar Auth/API demo flow antes de empacotamento final
- retomar Object Storage/R2 apenas em fatia propria e autorizada
- preparar portfolio packaging apos baseline funcional e visual

## Criterios de aceite
- baseline documentada com pass/fail por etapa
- bloqueios reais classificados
- proximas fatias recomendadas sem abrir READY automaticamente
- nenhuma implementacao iniciada antes da auditoria

## Dependencias
- EPIC-018B

### Fatias de execucao

#### EPIC-019A - Product Demo Baseline Audit
**Status:** DONE

##### Objetivo
Validar o estado real atual da jornada principal antes de iniciar UI polish, Auth/API demo flow ou Object Storage/R2.

##### Escopo
- testar landing publica
- testar register/login/sign-in ate o limite nao mutante permitido
- testar acesso autenticado ate o limite nao mutante permitido
- testar dashboard autenticado ate o limite nao mutante permitido
- testar criacao de pickup request ate o limite nao mutante permitido
- testar tracking/status/timeline ate o limite nao mutante permitido
- observar estado atual de fotos/upload sem configurar storage
- registrar problemas visuais relevantes
- registrar problemas tecnicos relevantes
- recomendar proximas tasks
- criar `docs/ops/product-demo-baseline-audit.md`

##### Criterios de aceite
- jornada testada ponta a ponta ou falha registrada no ponto exato
- pass/fail por etapa registrado
- problemas visuais priorizados
- problemas tecnicos priorizados
- decisao recomendada para proximas slices
- confirmacao explicita de que nao houve alteracao de codigo, DB, env, deploy, migration, seed ou storage

##### Dependencias
- EPIC-018B

##### Fora de escopo
- alterar codigo
- alterar frontend
- alterar backend
- alterar DB
- alterar env
- criar migration
- rodar seed
- fazer deploy
- configurar storage/R2
- corrigir CSS
- implementar feature
- capturar screenshots finais
- mexer no README final
- abrir nova READY task automaticamente

##### Resultado
- relatorio criado em `docs/ops/product-demo-baseline-audit.md`
- landing, login e register publicos responderam HTTP 200
- API staging falhou por timeout em `/health`, raiz e `/swagger`, bloqueando a validacao autenticada real
- register, login real, sessao autenticada, dashboard autenticado, criacao de request e tracking foram bloqueados pela indisponibilidade da API e pela restricao de nao mutar DB sem conta demo segura
- fotos/upload observados apenas documentalmente; R2/Object Storage segue sem smoke final nesta slice
- problemas visuais e tecnicos priorizados
- proximas slices recomendadas sem abrir nova READY automaticamente
- nenhuma alteracao de codigo, produto, backend, frontend, DB, env, migration, seed, deploy ou storage foi realizada

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
16. SPR-02 - Product Demo Readiness
