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
**Status:** READY

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

---

# EPIC-010 - Painel Admin
**Status:** READY

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

---

# EPIC-011 - Motor de Preco MVP
**Status:** READY

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

---

# EPIC-012 - Pagamentos
**Status:** READY

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

---

# EPIC-013 - Tracking e Historico
**Status:** READY

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
