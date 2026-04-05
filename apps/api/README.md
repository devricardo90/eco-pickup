# apps/api

Foundation estrutural da API do EcoPickup.

Escopo desta fase:

- estrutura inicial do backend
- projeto ASP.NET Core .NET 8
- health endpoint
- Swagger/OpenAPI
- foundation de persistencia com EF Core e PostgreSQL
- foundation de autenticacao com JWT

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
- `POST /api/v1/pickup-items/{id}/photos`
- `GET /api/v1/admin/pickup-requests`
- `GET /api/v1/admin/pickup-requests/{id}`
- `PATCH /api/v1/admin/pickup-requests/{id}/review`

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
- transicoes permitidas: `draft -> under_review`, `draft -> rejected`, `under_review -> rejected`
- historico de review persistido por request
- sem pricing, scheduling ou pagamento neste recorte

Fora de escopo nesta fase:

- regras de dominio
- endpoints de negocio
- integracoes de produto
