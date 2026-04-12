# EcoPickup - Staging Deployment Plan / Smoke and Rollback

## Contexto

Slice: `EPIC-014E - Staging Deployment Plan / Smoke and Rollback`

Data: 2026-04-12

Objetivo: transformar a decisao de targets da `EPIC-014D` em um plano operacional de staging, smoke test e rollback, sem provisionar recursos, sem alterar codigo/configuracao e sem executar deploy real.

## Estado de entrada

Base considerada:

- `EPIC-014A` registrou que o MVP ainda nao estava pronto para deploy real.
- `EPIC-014B` definiu o contrato de runtime por ambiente.
- `EPIC-014C` validou localmente Postgres, MinIO, API, web e integracao basica web -> API.
- `EPIC-014D` decidiu a stack recomendada para staging inicial.

Stack alvo definida:

```txt
Web: Vercel
API: Render Web Service, Docker-based
Database: Render Postgres, mesma regiao da API
Storage: Cloudflare R2
Secrets: Render Environment Groups + Vercel Environment Variables + Cloudflare R2 tokens
Logs: Render logs + Vercel runtime logs
```

Boundary desta slice:

- nao provisionar Render, Vercel, R2 ou banco
- nao criar staging real
- nao criar Dockerfile
- nao alterar codigo, Docker, CI/CD, runtime ou envs
- nao configurar secrets reais
- nao executar migrations
- nao executar deploy
- nao implementar observabilidade

## Plano de staging por camada

### Web

Alvo: Vercel.

Plano operacional:

- criar futuro projeto Vercel apontando para `apps/web`
- configurar ambiente `staging`
- configurar `ECOPICKUP_API_BASE_URL` apontando para a URL publica da API staging no Render
- garantir que o build use a baseline do projeto antes do primeiro deploy
- manter web staging isolada de producao

Variaveis esperadas:

- `ECOPICKUP_API_BASE_URL`
- `ECOPICKUP_WEB_PUBLIC_URL` como variavel operacional/runbook, se a plataforma nao a fornecer diretamente

Pre-requisitos:

- definir URL final da API staging
- fechar o gap de Node local/build identificado na `EPIC-014C`
- confirmar estrategia de dominio: URL gerada da Vercel primeiro, dominio customizado depois

### API

Alvo: Render Web Service com Docker.

Plano operacional:

- criar futura imagem/artefato Docker da API em slice tecnica propria
- criar futuro Render Web Service a partir desse artefato
- configurar `ASPNETCORE_ENVIRONMENT=Staging`
- configurar `AllowedHosts` para hosts reais do ambiente
- expor `/health` como check minimo de disponibilidade
- manter deploy de API separado do deploy de web

Variaveis esperadas:

- `ASPNETCORE_ENVIRONMENT=Staging`
- `AllowedHosts`
- `ConnectionStrings__Database`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__SigningKey`
- `Jwt__AccessTokenLifetimeMinutes`
- `ObjectStorage__ServiceUrl`
- `ObjectStorage__BucketName`
- `ObjectStorage__AccessKey`
- `ObjectStorage__SecretKey`
- `ObjectStorage__Region`
- `ObjectStorage__ForcePathStyle`
- `ObjectStorage__AutoCreateBucket=false`
- `Payments__ProviderName`
- `Payments__CheckoutBaseUrl`
- `Payments__WebhookSecret`
- `Persistence__ApplyMigrationsOnStartup`
- `Logging__LogLevel__Default`
- `Logging__LogLevel__Microsoft.AspNetCore`

Pre-requisitos:

- Dockerfile da API ainda precisa ser criado e validado em slice futura
- politica de migrations precisa estar fechada antes do primeiro deploy real
- secrets reais nao podem ser versionados

### Banco

Alvo: Render Postgres.

Plano operacional:

- criar futuro banco Postgres staging no mesmo projeto/regiao da API
- usar connection string gerenciada como secret no Render
- manter banco staging isolado de producao
- definir usuario/credencial gerenciada pela plataforma
- definir politica minima de backup/restore antes de qualquer migration com risco de dados

Variaveis esperadas:

- `ConnectionStrings__Database`
- `Persistence__ApplyMigrationsOnStartup`

Pre-requisitos:

- escolher regiao do Render
- escolher plano do Postgres
- decidir se migrations rodam manualmente, por job ou como etapa controlada do deploy

### Storage

Alvo: Cloudflare R2.

Plano operacional:

- criar futuro bucket exclusivo de staging
- manter bucket privado por padrao
- criar token/API key especifico de staging
- configurar endpoint S3-compatible no contrato da API
- confirmar `Region` e `ForcePathStyle` antes do deploy
- nao compartilhar bucket/credenciais entre staging e producao

Variaveis esperadas:

- `ObjectStorage__ServiceUrl`
- `ObjectStorage__BucketName`
- `ObjectStorage__AccessKey`
- `ObjectStorage__SecretKey`
- `ObjectStorage__Region`
- `ObjectStorage__ForcePathStyle`
- `ObjectStorage__AutoCreateBucket=false`

Pre-requisitos:

- nome do bucket staging
- token R2 staging
- politica de lifecycle/retencao minima

### Secrets

Alvos:

- Render Environment Groups para API
- Vercel Environment Variables para web
- Cloudflare R2 API tokens para storage

Plano operacional:

- configurar secrets por ambiente, nunca no repositorio
- separar secrets de staging e producao
- registrar somente nomes canonicos em documentacao
- validar que nenhum valor real aparece em logs, status ou arquivos versionados

Secrets esperados:

- `ConnectionStrings__Database`
- `Jwt__SigningKey`
- `ObjectStorage__AccessKey`
- `ObjectStorage__SecretKey`
- `Payments__WebhookSecret`

### Logs

Alvos:

- Render logs para API
- Vercel runtime logs para web
- Render Postgres metrics/logs para banco

Plano operacional:

- usar logs nativos no primeiro staging
- validar durante smoke que API e web registram eventos suficientes para troubleshooting
- revisar logs apos cada smoke test
- confirmar que secrets, tokens e dados sensiveis nao aparecem nos logs

Variaveis operacionais:

- `ECOPICKUP_LOG_DESTINATION`
- `ECOPICKUP_HEALTHCHECK_URL`

## Ordem segura de execucao futura

1. Confirmar acessos, contas, regioes, planos e nomes dos ambientes.
2. Fechar o gap de versao Node/build da web identificado na validacao local.
3. Executar slice tecnica para criar e validar o artefato Docker da API.
4. Fechar politica de migrations para staging.
5. Preparar a matriz final de env vars de staging a partir do contrato da `EPIC-014B`.
6. Criar bucket R2 staging e token dedicado.
7. Criar Render Postgres staging na mesma regiao da API.
8. Criar Render Environment Group da API com os secrets de staging.
9. Criar Render Web Service da API sem promover para producao.
10. Executar migration de staging somente pelo procedimento aprovado.
11. Criar projeto/ambiente Vercel staging para a web.
12. Configurar `ECOPICKUP_API_BASE_URL` da web apontando para a API staging.
13. Executar deploy da API staging.
14. Validar `/health` da API.
15. Executar deploy da web staging.
16. Executar smoke test completo.
17. Revisar logs de API, web e banco.
18. Registrar evidencias e decisoes antes de marcar qualquer deploy slice como `DONE`.

## Checklist de smoke test

### Pre-smoke

- commit SHA ou referencia de build registrada
- URL da API staging registrada
- URL da web staging registrada
- env vars obrigatorias configuradas nas plataformas
- secrets configurados fora do repositorio
- banco staging criado e isolado
- storage staging criado e isolado
- migration strategy executada conforme procedimento aprovado
- rollback path conhecido antes de iniciar o smoke

### API

- `GET /health` retorna `200 Healthy`
- endpoint de documentacao/API, se exposto no ambiente, carrega sem erro
- `POST /api/v1/auth/register` cria usuario de smoke
- `POST /api/v1/auth/login` autentica usuario de smoke
- `GET /api/v1/auth/me` retorna usuario autenticado
- rota protegida sem token retorna `401` ou `403`
- rota administrativa com usuario comum retorna `401` ou `403`

### Web

- pagina inicial ou rota autenticada inicial carrega sem erro 5xx
- `/auth/register` carrega
- `/auth/login` carrega
- cadastro pela web conclui ou retorna erro operacional claro
- login pela web cria sessao funcional
- sessao autenticada acessa `/requests`
- rota protegida sem sessao redireciona ou bloqueia corretamente

### Requests owner

- owner cria request em `draft`
- owner adiciona address e items no fluxo esperado
- owner salva draft
- owner visualiza detalhe/tracking da request
- owner submete request quando aplicavel
- request submetida deixa de permitir edicao owner fora de `draft`

### Tracking

- timeline owner carrega
- status atual aparece coerente com o estado da request
- endpoint de history responde para owner autenticado
- admin, se usuario de smoke admin existir, consegue abrir leitura administrativa

### Storage

- upload de foto de item funciona em staging, quando o fluxo for incluido no smoke
- metadata da foto aparece no detalhe da request
- objeto fica no bucket staging correto
- URL/retorno nao expoe credenciais

### Payment

- provider de staging/sandbox esta explicitamente identificado
- criacao de payment session funciona quando request estiver em estado elegivel
- webhook de confirmacao aceita secret valido
- webhook com secret invalido e rejeitado
- status de pagamento muda apenas na transicao esperada

### Logs

- Render registra request de `/health`
- Render registra erro operacional se algum smoke falhar
- Vercel registra acesso a rotas web principais
- logs nao exibem secrets, tokens ou connection strings

## Plano de rollback inicial

### Falha de deploy da API

Condicao:

- build/deploy da API falha antes de servir trafego valido ou `/health` nao responde.

Acao:

- manter ultima versao funcional como referencia
- reverter o deploy para a ultima imagem/build conhecido como bom
- restaurar env vars anteriores caso alguma tenha sido alterada
- nao executar migration se a API nao passou em `/health`
- registrar logs e causa antes de nova tentativa

### Falha de runtime da API

Condicao:

- API sobe, mas falha em auth, banco, storage, payment ou rotas criticas.

Acao:

- interromper promocao do staging
- revisar Render logs e connection string sem expor secrets
- reverter para deploy anterior se existir
- desfazer apenas mudancas de env vars associadas ao deploy atual
- se houve migration, seguir o plano de falha de migrations antes de qualquer rollback de banco

### Falha de deploy da web

Condicao:

- web nao builda, nao carrega ou aponta para API incorreta.

Acao:

- reverter para ultimo deployment Vercel funcional
- revisar `ECOPICKUP_API_BASE_URL`
- manter API staging intacta se ela passou no smoke
- registrar evidencia da falha antes de nova tentativa

### Falha de migrations

Condicao:

- migration falha antes, durante ou depois da aplicacao.

Acao:

- se falhar antes de aplicar mudancas: abortar deploy e nao promover API/web
- se falhar parcialmente: congelar novas tentativas e registrar estado do banco
- se a migration for destrutiva ou houver perda de dados: restaurar de backup/snapshot aprovado
- se a migration for aditiva e reversivel por forward fix: documentar decisao antes de aplicar correcao
- nunca executar rollback de banco por conveniencia sem plano de dados

### Falha de storage

Condicao:

- upload, leitura ou credencial R2 falha.

Acao:

- manter objetos existentes
- nao apagar bucket durante troubleshooting
- revisar endpoint, bucket, access key, secret key, region e force path style
- reverter env vars de storage para o ultimo conjunto funcional, se existir

### Falha de payment

Condicao:

- checkout ou webhook staging falha.

Acao:

- manter provider em modo staging/sandbox
- validar `Payments__WebhookSecret`
- bloquear promocao se webhook de confirmacao nao for confiavel
- nao ativar cobranca real sem nova decisao formal

## Riscos e pendencias

### Alto

- API ainda nao possui Dockerfile/artefato de deploy validado.
- Politica de migrations ainda precisa ser decidida antes do primeiro staging real.
- Secrets reais de staging ainda nao existem e nao devem ser criados fora de slice propria.
- Payment ainda depende de decisao de provider real ou sandbox.

### Medio

- Node local validado esta abaixo da baseline documentada.
- Stack multi-plataforma exige coordenacao de URLs, cookies, CORS/hosts e logs.
- R2 ainda precisa de parametros finais de endpoint, region, bucket e force path style.
- Retencao de logs depende dos planos escolhidos nas plataformas.

### Baixo

- Primeiro staging pode usar URLs geradas das plataformas antes de dominio customizado.
- Preview environments podem ficar fora do primeiro staging.
- Observabilidade inicial sera suficiente para troubleshooting, mas ainda nao cobre tracing, alertas ou dashboards dedicados.

## Proxima slice recomendada

`EPIC-014F - API Deploy Artifact Foundation`

Objetivo sugerido: criar e validar o artefato minimo de deploy da API para Render Web Service com Docker, sem provisionar staging e sem executar deploy real.

Escopo sugerido:

- criar Dockerfile minimo da API
- validar build da imagem localmente
- validar execucao local do container contra Postgres/MinIO locais, se tecnicamente viavel
- documentar comandos e evidencias
- manter web, CI/CD, provisionamento e deploy real fora do escopo

Gates esperados para a slice futura:

- `dotnet build apps/api/EcoPickup.Backend.sln`
- testes backend aplicaveis
- `docker build` da API
- validacao local de `/health` no container, se a execucao local for incluida no recorte

## Boundary

Esta slice nao provisionou recursos, nao criou staging, nao alterou codigo, nao criou Dockerfile, nao alterou Docker, CI/CD, runtime ou envs, nao configurou secrets reais, nao executou migrations, nao fez deploy, nao implementou observabilidade e nao fez commit.
