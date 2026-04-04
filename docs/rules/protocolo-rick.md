# Protocolo Rick v1 - Governanca de Execucao

## Objetivo

O Protocolo Rick define como projetos devem ser planejados, executados, validados e entregues dentro de um fluxo controlado, com clareza de papeis, artefatos minimos, criterios de passagem entre fases e disciplina operacional.

Este protocolo existe para garantir:

- execucao organizada
- qualidade tecnica
- previsibilidade
- documentacao viva
- controle de escopo
- validacao antes de avancar
- entrega com rastreabilidade

---

# 1. Principios do Protocolo Rick

## 1.1. Regra central

Nenhuma fase avanca sem entregar os artefatos minimos da fase anterior.

## 1.2. Fonte da verdade

- `docs/ops/backlog.md` e a fonte oficial do backlog
- `docs/ops/status.md` e apenas resumo executivo
- decisoes arquiteturais devem ficar documentadas em `docs/architecture/`
- regras de negocio devem ficar em `docs/product/business-rules.md`

## 1.3. Execucao controlada

Toda execucao deve seguir:

1. entendimento do problema
2. planejamento
3. implementacao
4. validacao
5. entrega

## 1.4. Nada de sair codando direto

Antes de implementar qualquer feature:

- contexto precisa estar claro
- escopo precisa estar definido
- criterios de aceite precisam existir
- dependencias precisam estar visiveis

## 1.5. Qualidade obrigatoria

Antes de concluir qualquer entrega, validar:

- lint
- typecheck
- build
- testes aplicaveis

## 1.6. Documentacao sincronizada

Se a mudanca impacta arquitetura, regra, operacao ou fluxo:

- a documentacao deve ser atualizada na mesma entrega

## 1.7. Regra especial para Prisma

Quando aplicavel no projeto:

- executar `prisma generate` antes de commits que afetem schema, client ou contratos dependentes do Prisma

---

# 2. Esteira de Entrega do Protocolo Rick

O Protocolo Rick segue uma esteira de execucao dividida em 5 fases:

1. Discovery
2. Planejamento
3. Desenvolvimento
4. Teste
5. Deploy

---

# 3. Papeis por fase

## Discovery

- PM

## Planejamento

- PM
- TL
- SM

## Desenvolvimento

- TL
- DEV

## Teste

- QA
- TL
- DEV

## Deploy

- INFRA
- TL

---

# 4. Regra de passagem entre fases

Nenhuma fase pode avancar sem que a fase anterior tenha seus artefatos minimos concluidos e validados.

Se houver bloqueio:

- registrar no backlog
- registrar impacto
- registrar dependencia
- nao mascarar pendencia como concluida

---

# 5. Artefatos minimos por fase

## 5.1. Discovery

Artefatos minimos:

- problema definido
- objetivo claro
- escopo inicial
- riscos e restricoes

## 5.2. Planejamento

Artefatos minimos:

- backlog quebrado
- prioridades
- criterios de aceite
- dependencias mapeadas

## 5.3. Desenvolvimento

Artefatos minimos:

- implementacao concluida
- documentacao atualizada
- lint/typecheck/build validados
- prisma generate antes de commit quando aplicavel

## 5.4. Teste

Artefatos minimos:

- evidencias de teste
- validacao dos criterios de aceite
- correcao de bugs criticos

## 5.5. Deploy

Artefatos minimos:

- configuracao revisada
- publicacao realizada
- smoke test
- observabilidade inicial
- plano de rollback

---

# 6. Estrutura de execucao por agentes

O Protocolo Rick opera com um modelo de:

- Orquestrador principal
- Subagentes especialistas por dominio

## 6.1. Papel do Orquestrador

Responsabilidades:

- entender contexto
- quebrar o trabalho em etapas
- delegar para subagentes
- revisar qualidade
- garantir aderencia ao protocolo
- consolidar saida final

O orquestrador deve sempre:

- ler o contexto
- identificar fase atual
- validar artefatos minimos
- so entao acionar execucao

## 6.2. Papel dos Subagentes

Cada subagente atua em um dominio especifico, por exemplo:

- arquitetura
- backend
- frontend
- banco de dados
- QA
- infra
- documentacao

Subagentes devem:

- receber contexto claro
- atuar dentro do escopo definido
- devolver resultado objetivo
- registrar impactos e dependencias

---

# 7. Regras de backlog

## 7.1. Fonte oficial

O arquivo oficial e:
`docs/ops/backlog.md`

## 7.2. Estados minimos

Cada item deve estar em um destes estados:

- READY
- IN_PROGRESS
- BLOCKED
- DONE

## 7.3. Todo item deve conter

- identificador
- titulo claro
- objetivo
- escopo
- criterios de aceite
- dependencias
- estado

## 7.4. Regra de conclusao

Um item so pode ser marcado como `DONE` se:

- criterios de aceite forem atendidos
- validacoes minimas forem executadas
- documentacao impactada tiver sido atualizada
- riscos residuais relevantes tiverem sido registrados

---

# 8. Criterio de DONE

Um item so e considerado concluido quando:

- implementacao esta funcional
- escopo acordado foi entregue
- criterios de aceite foram validados
- lint passou
- typecheck passou
- build passou
- testes aplicaveis passaram
- documentacao foi atualizada
- pendencias remanescentes foram registradas

---

# 9. Estrutura documental recomendada

```txt
docs/
  product/
    prd.md
    business-rules.md
  architecture/
    system-design.md
    api-standards.md
  rules/
    protocolo-rick.md
    security.md
    testing.md
  ops/
    backlog.md
    status.md
```

---

# 10. Ritual operacional recomendado

Antes de executar:

- identificar fase atual
- validar artefatos minimos
- confirmar escopo
- mapear dependencias

Durante a execucao:

- atualizar progresso no backlog
- registrar bloqueios
- manter documentacao sincronizada

Antes de concluir:

- validar criterios de aceite
- validar lint/typecheck/build
- revisar impacto tecnico
- revisar documentacao

Antes de deploy:

- revisar variaveis de ambiente
- revisar configuracoes
- executar smoke test
- definir rollback

---

# 11. Regras de disciplina tecnica

## 11.1. Nao esconder problema

Se algo nao foi concluido:

- registrar
- classificar
- nao mascarar como pronto

## 11.2. Nao quebrar arquitetura por pressa

Toda decisao fora do padrao deve:

- ser justificada
- ser documentada
- registrar trade-off

## 11.3. Nao deixar documentacao para depois

Se a mudanca impacta arquitetura, regra ou operacao:

- a documentacao deve ser atualizada na mesma entrega

## 11.4. Qualidade e parte da entrega

Entrega sem validacao nao e entrega.
E rascunho com autoestima alta.

---

# 12. Template de leitura operacional para qualquer tarefa

Para cada nova demanda, o orquestrador deve responder internamente:

- Em que fase da esteira essa demanda esta?
- Os artefatos minimos da fase anterior existem?
- O backlog ja esta quebrado?
- Ha criterios de aceite?
- Ha dependencias ou bloqueios?
- Qual o menor recorte executavel seguro?
- Quais documentos precisam ser atualizados?
- Quais validacoes sao obrigatorias antes de concluir?

---

# 13. Saida esperada do Protocolo Rick

Ao seguir este protocolo, o projeto deve produzir:

- clareza de escopo
- execucao por fases
- backlog rastreavel
- documentacao confiavel
- validacao tecnica consistente
- deploy controlado
- base pronta para escalar

---

## 14. Regras de Commit

### 14.1. Commit por unidade concluida

Cada commit deve representar uma unidade clara de entrega.
Nao misturar multiplos assuntos nao relacionados no mesmo commit.

### 14.2. Commit somente apos validacao

Nenhum commit deve ser realizado antes de validar o escopo alterado.

Validacoes minimas antes de commit:

- install/restore executado
- lint passou
- typecheck passou
- build passou
- testes aplicaveis passaram
- documentacao impactada atualizada

### 14.3. Commits em ingles

Todos os commits do projeto devem ser escritos em ingles.

### 14.4. Padrao obrigatorio

Usar Conventional Commits no formato:

`type(scope): short description`

Exemplos:

- `chore(monorepo): initialize workspace foundation`
- `docs(protocol): add commit and delivery rules`
- `build(api): pin dotnet sdk and nuget config`
- `refactor(api): organize backend layers`

### 14.5. Nao commitar trabalho quebrado

E proibido:

- commitar codigo quebrado
- commitar alteracao sem validacao minima
- commitar escopo incompleto como se estivesse pronto
- commitar multiplas mudancas desconectadas no mesmo commit

### 14.6. Regras especificas por stack

#### Workspace Node

Antes de commit, executar:

- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

#### API .NET

Antes de commit, executar:

- `dotnet restore`
- `dotnet build`

#### Testes

Quando aplicavel:

- `pnpm test`
- `dotnet test`

#### Prisma

Quando aplicavel:

- executar `prisma generate` antes de commits que afetem schema, client ou contratos dependentes
