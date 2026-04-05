# apps/api

API atual do MVP do EcoPickup.

Escopo consolidado nesta etapa:

- ASP.NET Core .NET 8 em camadas
- Swagger/OpenAPI e Scalar
- persistencia com EF Core e PostgreSQL
- autenticacao JWT com roles `USER` e `ADMIN`
- fluxo owner/admin do MVP ate payment, scheduling e tracking

Estrutura backend atual:

- `src/EcoPickup.Api`
- `src/EcoPickup.Application`
- `src/EcoPickup.Domain`
- `src/EcoPickup.Infrastructure`
- `tests/EcoPickup.UnitTests`

Persistencia estrutural atual:

- `EcoPickupDbContext`
- provider Npgsql configurado
- migration estrutural inicial
- PostgreSQL local via Docker Compose

Auth estrutural atual:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/admin-check`
- hash seguro de senha
- JWT access token
- roles `USER` e `ADMIN`

Fluxo atual de pickup request:

- `POST /api/v1/pickup-requests`
- `GET /api/v1/pickup-requests`
- `GET /api/v1/pickup-requests/{id}`
- `PUT /api/v1/pickup-requests/{id}`
- `PATCH /api/v1/pickup-requests/{id}/submit`
- `GET /api/v1/pickup-requests/{id}/history`
- `POST /api/v1/pickup-items/{id}/photos`
- `POST /api/v1/pickup-requests/{id}/payments`
- `GET /api/v1/admin/pickup-requests`
- `GET /api/v1/admin/pickup-requests/{id}`
- `GET /api/v1/admin/pickup-requests/{id}/history`
- `PATCH /api/v1/admin/pickup-requests/{id}/review`
- `PATCH /api/v1/admin/pickup-requests/{id}/pricing`
- `PATCH /api/v1/admin/pickup-requests/{id}/scheduling`
- `POST /api/v1/payments/webhook`

Owner flow atual:

- request nasce em `draft`
- owner pode editar apenas enquanto estiver em `draft`
- owner envia por transicao explicita `draft -> submitted`
- timeline/history read-only exposta para owner

Admin flow atual:

- leitura administrativa protegida por role `ADMIN`
- review controla `submitted -> under_review`, `submitted -> rejected` e `under_review -> rejected`
- pricing controla `under_review -> quoted` ou `under_review -> awaiting_payment`
- scheduling controla `quoted -> scheduled`

Tracking e payment atuais:

- historico persiste eventos de review, pricing, scheduling, submit e payment confirmation
- payment session owner existe apenas em `awaiting_payment`
- webhook confiavel confirma `awaiting_payment -> paid`

Media atual:

- `ItemPhoto` vinculado a `PickupItem`
- upload via API com `multipart/form-data`
- storage S3-compatible via MinIO local e provider compativel em producao
- ownership enforcement por usuario autenticado
- tipos permitidos: `image/jpeg`, `image/png`, `image/webp`
- tamanho maximo por arquivo: `10 MB`
- limite de `5` fotos por item
- detalhe da request retorna metadata de fotos por item

Admin read atual:

- endpoints administrativos de leitura protegidos por role `ADMIN`
- listagem administrativa minima de pickup requests
- detalhe administrativo com `address`, `items`, `photos` e `status`

Admin review atual:

- review minimo protegido por role `ADMIN`
- decisao `approve` ou `reject`
- nota administrativa opcional
- transicoes permitidas: `submitted -> under_review`, `submitted -> rejected`, `under_review -> rejected`
- historico de review persistido por request
- sem pricing, scheduling ou pagamento neste recorte

Pricing atual:

- pricing administrativo protegido por role `ADMIN`
- breakdown minimo com `basePrice`, `sizeAdjustment`, `floorAdjustment`, `distanceAdjustment`, `total` e `currency`
- `total` calculado no backend
- pricing permitido apenas em request `under_review`
- transicao para `quoted` ou `awaiting_payment`
- historico de pricing persistido por request
- sem scheduling ou payment neste recorte

Scheduling atual:

- scheduling administrativo protegido por role `ADMIN`
- janela operacional confirmada com `confirmedPickupWindowStartUtc` e `confirmedPickupWindowEndUtc`
- scheduling permitido apenas em request `quoted`
- transicao para `scheduled`
- historico de scheduling persistido por request
- sem payment neste recorte

Fora de escopo nesta fase:

- novas mutacoes operacionais alem das ja entregues
- execution controls administrativos completos
- polling, notificacoes e realtime
- novos contratos fora do MVP atual
