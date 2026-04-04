# apps/api

Foundation estrutural da API do EcoPickup.

Escopo desta fase:

- estrutura inicial do backend
- projeto ASP.NET Core .NET 8
- health endpoint
- Swagger/OpenAPI
- foundation de persistencia com EF Core e PostgreSQL

Estrutura backend atual:

- `src/EcoPickup.Api`
- `src/EcoPickup.Application`
- `src/EcoPickup.Domain`
- `src/EcoPickup.Infrastructure`

Persistencia estrutural atual:

- `EcoPickupDbContext`
- provider Npgsql configurado
- migration estrutural inicial
- PostgreSQL local via Docker Compose

Fora de escopo nesta fase:

- autenticacao funcional
- regras de dominio
- endpoints de negocio
- integracoes de produto
