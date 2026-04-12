# EcoPickup - Staging Migration Strategy

## Contexto

Slice: `EPIC-014G - Staging Migration Strategy`

Data: 2026-04-12

Objetivo: definir a estrategia de migrations para o primeiro staging em Render Postgres antes de provisionar banco, criar staging ou fazer deploy real.

## Estado de entrada

Base considerada:

- `EPIC-014D` definiu Render Postgres como banco recomendado para staging inicial.
- `EPIC-014E` definiu que migration strategy deve existir antes do primeiro deploy.
- `EPIC-014F` criou e validou o artefato Docker minimo da API.
- A API usa EF Core migrations no projeto `EcoPickup.Infrastructure`.
- O health check da API valida PostgreSQL quando `ConnectionStrings__Database` esta configurada.

Boundary desta slice:

- nao provisionar banco
- nao criar staging real
- nao executar migration real
- nao alterar codigo
- nao alterar runtime/envs
- nao executar deploy

## Estrategia recomendada

Para o primeiro staging, migrations devem ser aplicadas por etapa operacional manual e explicita, antes de promover a API staging como valida.

Decisao:

- `Persistence__ApplyMigrationsOnStartup=false` em staging.
- A API nao deve aplicar migrations automaticamente no startup.
- A primeira aplicacao de migrations em staging deve ser uma operacao separada, controlada e registrada.
- CI/CD ou migration job dedicado ficam para slice futura, depois do primeiro staging controlado.

Racional:

- o projeto ainda nao possui CI/CD
- Render Postgres ainda nao foi provisionado
- nao ha rollback automatizado de banco
- migration acoplada ao startup pode derrubar a API ou aplicar schema sem janela operacional explicita
- uma etapa manual reduz surpresa operacional no primeiro staging

## Modelo operacional

### Modo inicial: manual controlado

Responsavel:

- operador tecnico com acesso temporario a `ConnectionStrings__Database` de staging

Origem:

- maquina local controlada ou ambiente operacional aprovado
- mesmo commit SHA que sera usado no deploy da API

Ferramenta:

- EF Core CLI / `dotnet ef`

Comandos esperados, ainda nao executados em staging:

```powershell
dotnet ef migrations list --project apps/api/src/EcoPickup.Infrastructure/EcoPickup.Infrastructure.csproj --startup-project apps/api/src/EcoPickup.Api/EcoPickup.Api.csproj --context EcoPickupDbContext
dotnet ef migrations script --idempotent --project apps/api/src/EcoPickup.Infrastructure/EcoPickup.Infrastructure.csproj --startup-project apps/api/src/EcoPickup.Api/EcoPickup.Api.csproj --context EcoPickupDbContext --output tmp/staging-migration.sql
dotnet ef database update --project apps/api/src/EcoPickup.Infrastructure/EcoPickup.Infrastructure.csproj --startup-project apps/api/src/EcoPickup.Api/EcoPickup.Api.csproj --context EcoPickupDbContext
```

Observacao:

- a connection string de staging deve ser fornecida por variavel de ambiente ou secret temporario fora do repositorio
- o arquivo `tmp/staging-migration.sql`, se gerado, nao deve ser commitado
- secrets reais nao devem aparecer em terminal compartilhado, logs, status ou documentacao

### Evolucao futura: pipeline ou job dedicado

Depois do primeiro staging validado, a estrategia pode evoluir para:

- job manual de migration no provider
- etapa manual-gated de pipeline
- migration bundle versionado como artefato de release

Essa evolucao deve ser uma slice propria, nao parte da `EPIC-014G`.

## Pre-condicoes

Antes de qualquer migration em staging:

1. Render Postgres staging criado e isolado de producao.
2. Connection string de staging disponivel como secret, nunca versionada.
3. Commit SHA da API definido.
4. Imagem/artefato da API correspondente ao mesmo commit validado.
5. `Persistence__ApplyMigrationsOnStartup=false` confirmado para staging.
6. Lista de migrations pendentes revisada.
7. Script idempotente gerado e revisado quando houver risco operacional.
8. Backup/snapshot/export definido antes de migration em banco com dados relevantes.
9. Janela operacional de staging aberta.
10. Rollback/forward fix conhecido antes da execucao.

## Ordem segura de execucao

1. Congelar o commit SHA do deploy candidato.
2. Confirmar que a imagem da API foi buildada a partir do mesmo commit.
3. Confirmar Render Postgres staging disponivel e isolado.
4. Confirmar `ConnectionStrings__Database` de staging fora do repositorio.
5. Confirmar `Persistence__ApplyMigrationsOnStartup=false`.
6. Executar listagem de migrations localmente contra o codigo do commit.
7. Gerar script SQL idempotente.
8. Revisar o script para comandos destrutivos ou alteracoes sensiveis.
9. Se banco tiver dados relevantes, gerar backup/snapshot/export antes da migration.
10. Aplicar migration manualmente por EF Core CLI ou SQL aprovado.
11. Validar schema apos migration.
12. Subir ou reiniciar API staging com o Docker artifact validado.
13. Validar `/health`.
14. Executar smoke test definido em `docs/ops/staging-deployment-plan.md`.
15. Registrar evidencias antes de marcar a slice de deploy real como `DONE`.

## Criterios de validacao

### Validacao antes da migration

- lista de migrations disponivel
- ultima migration esperada identificada
- script idempotente gerado sem erro
- script revisado sem comando destrutivo inesperado
- connection string aponta para staging, nao local e nao producao
- backup/snapshot/export definido quando houver dados relevantes

### Validacao apos migration

Comandos esperados, ainda nao executados em staging:

```sql
select "MigrationId" from "__EFMigrationsHistory" order by "MigrationId";
```

Validar:

- tabela `__EFMigrationsHistory` existe
- ultima migration esperada esta registrada
- tabelas principais existem
- constraints principais existem
- API `/health` responde `200 Healthy`
- fluxo minimo de auth funciona no smoke
- logs nao mostram erro de migration, connection string ou schema

Tabelas principais esperadas pelo MVP atual:

- users/identity conforme modelo atual
- pickup requests
- addresses
- pickup items
- item photos
- status history
- payments

Observacao:

- os nomes fisicos exatos devem ser confirmados a partir do schema gerado pela migration atual no momento do staging

## Criterios de abort

Abortar antes de aplicar migration se:

- connection string nao puder ser comprovada como staging
- commit SHA do codigo e artefato Docker nao baterem
- script idempotente nao puder ser gerado
- script contem operacao destrutiva nao aprovada
- backup/snapshot/export exigido nao estiver disponivel
- Render Postgres estiver instavel
- secrets aparecerem em logs, terminal compartilhado ou arquivo versionado

Abortar durante/depois da tentativa se:

- migration falhar parcialmente
- schema ficar em estado indefinido
- API nao iniciar depois da migration
- `/health` falhar por erro de banco
- logs indicarem incompatibilidade de schema

## Rollback e forward fix

### Migration nao aplicada

Acao:

- abortar deploy
- manter API staging no estado anterior
- registrar causa
- corrigir em nova slice antes de tentar novamente

### Migration aplicada parcialmente

Acao:

- congelar novas tentativas
- registrar estado do banco
- revisar `__EFMigrationsHistory`
- decidir entre restore de backup/snapshot ou forward fix documentado
- nao reiniciar deploy ate a decisao estar registrada

### Migration aplicada com sucesso, mas API falha

Acao:

- manter banco no estado migrado
- inspecionar logs da API
- se falha for incompatibilidade de codigo/schema, preferir forward fix no mesmo ambiente
- se houver perda de dados ou alteracao destrutiva, restaurar backup/snapshot aprovado

### Migration destrutiva

Regra:

- nao aplicar migration destrutiva em staging sem revisao explicita
- exigir backup/snapshot/export antes da execucao
- documentar plano de restore antes de aplicar

## Alinhamento com Docker artifact

O Docker artifact da `EPIC-014F` nao deve aplicar migrations automaticamente.

Para staging:

- container da API deve receber `ConnectionStrings__Database` do Render Postgres
- container deve iniciar com `Persistence__ApplyMigrationsOnStartup=false`
- migration deve ocorrer antes da validacao final de `/health`
- `/health` deve ser usado como validacao de conectividade e schema minimo apos migration

## Riscos e pendencias

### Alto

- Render Postgres ainda nao foi provisionado.
- Backup/snapshot/export depende do plano escolhido.
- Nao ha CI/CD ou migration job dedicado.
- Nao ha decisao sobre dados seed/admin para smoke test.

### Medio

- `dotnet ef` precisa estar disponivel no ambiente operacional que aplicara migrations.
- Secrets de staging ainda nao existem.
- Script SQL idempotente precisa ser revisado antes de execucao.
- Migration destructive ainda nao tem policy automatizada.

### Baixo

- Primeiro staging pode usar banco vazio, reduzindo risco inicial.
- Estrategia manual e adequada para primeiro staging, mas nao deve virar processo permanente sem revisao.

## Proxima slice recomendada

`EPIC-014H - Staging Provisioning Checklist`

Objetivo sugerido: preparar o checklist final de provisionamento de Render, Vercel, Render Postgres e Cloudflare R2 com nomes, regioes, secrets esperados e ordem de criacao, ainda sem provisionar recursos.

## Boundary

Esta slice nao provisionou banco, nao criou staging real, nao executou migration real, nao alterou codigo, nao alterou runtime/envs, nao fez deploy e nao fez commit.
