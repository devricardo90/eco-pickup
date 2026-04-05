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

Fora de escopo nesta fase:

- regras de dominio
- endpoints de negocio
- integracoes de produto
