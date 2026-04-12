FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY EcoPickup.Backend.sln ./
COPY src/EcoPickup.Api/EcoPickup.Api.csproj src/EcoPickup.Api/
COPY src/EcoPickup.Application/EcoPickup.Application.csproj src/EcoPickup.Application/
COPY src/EcoPickup.Domain/EcoPickup.Domain.csproj src/EcoPickup.Domain/
COPY src/EcoPickup.Infrastructure/EcoPickup.Infrastructure.csproj src/EcoPickup.Infrastructure/

RUN dotnet restore src/EcoPickup.Api/EcoPickup.Api.csproj

COPY src/ src/
RUN dotnet publish src/EcoPickup.Api/EcoPickup.Api.csproj \
  --configuration Release \
  --output /app/publish \
  --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

COPY --from=build /app/publish ./

ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet EcoPickup.Api.dll"]
