# EcoPickup - System Design

## 1. Objective

This document defines the initial system design for EcoPickup MVP.

The goal is to establish a technical foundation that is simple, scalable enough for MVP evolution, and aligned with the product workflow.

---

## 2. High-Level Architecture

EcoPickup will start as a monorepo with separated applications for API and web, plus shared packages.

```txt
apps/
  api/
  web/

packages/
  contracts/
  ui/
```

---

## 3. Initial Architectural Direction

### apps/api

Backend API responsible for:

- authentication
- pickup request lifecycle
- pricing logic
- payment orchestration
- status history
- admin operations
- storage integration
- persistence access

Technology direction:

- ASP.NET Core (.NET 8)
- Entity Framework Core
- PostgreSQL
- Swashbuckle + Scalar over Swagger/OpenAPI in development
- JWT authentication

### apps/web

Frontend application responsible for:

- marketing/public entry points
- authentication screens
- user dashboard
- pickup request flow
- quote/payment flow
- request tracking
- admin panel in v1

Technology direction:

- Next.js
- TypeScript
- Tailwind CSS

### packages/contracts

Shared contracts intended for:

- API DTO references
- typed request/response boundaries
- shared enums when appropriate
- integration documentation support

### packages/ui

Shared UI primitives/components intended for:

- reusable design primitives
- shared UI patterns
- optional future cross-surface reuse

---

## 4. MVP Topology

User

Interacts with:

- web application

Web application

Interacts with:

- API

API

Interacts with:

- PostgreSQL
- image storage provider
- payment provider

Admin

Uses:

- admin routes inside the web app in MVP

---

## 5. Initial Context Diagram

```txt
User
  -> Web App (Next.js)
     -> API (ASP.NET Core)
        -> PostgreSQL
        -> Image Storage
        -> Payment Provider
```

---

## 6. Core Domain Areas

The MVP domain is composed of the following main areas:

### Identity

- user registration
- authentication
- roles
- authorization

### Pickup Requests

- request creation
- item details
- address details
- pickup windows
- status progression

### Pricing

- operational quote
- pricing breakdown
- admin-controlled adjustments

### Payments

- payment initiation
- payment confirmation
- request/payment synchronization

### Operations

- admin review
- scheduling
- collection flow
- disposal recording

### Tracking

- status timeline
- history visibility
- request detail visibility

---

## 7. Initial Entity Direction

Planned core entities:

- User
- Address
- PickupRequest
- PickupItem
- ItemPhoto
- Payment
- StatusHistory
- DisposalRecord

Additional derived concepts may include:

- roles
- request status enum
- payment status enum
- item size enum
- destination type enum

---

## 8. Backend Structural Direction

Initial preferred layering:

```txt
src/
  EcoPickup.Api/
  EcoPickup.Application/
  EcoPickup.Domain/
  EcoPickup.Infrastructure/
```

Applied foundation:

- `apps/api/EcoPickup.Backend.sln`
- `apps/api/src/EcoPickup.Api`
- `apps/api/src/EcoPickup.Application`
- `apps/api/src/EcoPickup.Domain`
- `apps/api/src/EcoPickup.Infrastructure`

### EcoPickup.Api

Responsibilities:

- HTTP endpoints
- auth middleware
- request/response mapping
- OpenAPI exposure
- composition root

### EcoPickup.Application

Responsibilities:

- use cases
- orchestration
- validation flow coordination
- commands/queries if adopted

### EcoPickup.Domain

Responsibilities:

- entities
- enums
- domain rules
- core invariants

### EcoPickup.Infrastructure

Responsibilities:

- database access
- EF Core mappings
- auth implementation
- storage providers
- payment provider integration

Current backend foundation includes:

- `EcoPickupDbContext` bootstrap without product entities
- dependency injection wiring for infrastructure
- PostgreSQL provider configuration prepared for future persistence work
- auth foundation with register, login, JWT and protected endpoints
- initial pickup request foundation with `PickupRequest`, `Address`, `PickupItem` and authenticated draft creation endpoint

---

## 9. Frontend Structural Direction

Initial app structure should support:

- public routes
- auth routes
- user dashboard routes
- request creation flow
- request detail/tracking routes
- admin routes

Suggested direction:

```txt
src/
  app/
  components/
  features/
  lib/
  hooks/
```

The exact internal structure may evolve, but should keep domain clarity.

Applied frontend foundation:

- `apps/web/src/app`
- `apps/web/src/components`
- `apps/web/src/features`
- `apps/web/src/hooks`
- `apps/web/src/lib`

Current frontend foundation includes:

- App Router bootstrap
- Tailwind CSS baseline
- TypeScript path alias `@/* -> src/*`
- placeholder page limited to foundation messaging
- no product flows, auth screens or admin functionality

---

## 10. Monorepo Foundation Decision

The monorepo foundation must define:

- workspace tool
- root package conventions
- app bootstrap rules
- package boundaries
- environment strategy
- local development workflow

This must be formally decided before opening implementation of EPIC-003.

---

## 11. Data Persistence Direction

Primary database:

- PostgreSQL

Persistence strategy:

- relational model
- migrations managed in backend workflow
- explicit status tracking
- auditable price breakdown
- operational history preserved

Current persistence foundation:

- PostgreSQL `16.13` for local development through Docker Compose
- EF Core migrations managed from `EcoPickup.Infrastructure`
- design-time factory for `EcoPickupDbContext`
- structural baseline table `persistence_checkpoints` used only to validate the migration pipeline
- auth identity tables and the current `pickup_requests`, `addresses`, `pickup_items`, `item_photos`, `pickup_request_status_history`, pricing columns and confirmed scheduling window foundation for request/admin evolution

---

## 12. File/Image Storage Direction

The MVP should support uploaded item photos.

Storage requirements:

- durable file storage
- URL persistence
- association with pickup items or request context
- backend-controlled upload flow or signed upload strategy

The provider may be defined later, but architecture should assume external object storage.

Current planning direction for media foundation:

- media must attach to `PickupItem`, not directly to `PickupRequest`
- `ItemPhoto` should preserve at minimum: id, pickupItemId, storageKey, originalFileName, contentType, sizeBytes, createdUtc
- ownership must follow the parent request owner or admin authorization
- chosen MVP provider: Cloudflare R2 through an S3-compatible abstraction, with MinIO for local development
- chosen first upload strategy: upload through API with backend-managed storage write
- a read foundation for `GET /api/v1/pickup-requests` and `GET /api/v1/pickup-requests/{id}` now exists so photos can later be exposed in a stable detail shape
- media foundation is now fixed in [media-foundation.md](/C:/Users/ricardodev/Desktop/eco-pickup/docs/architecture/media-foundation.md)

---

## 13. Payment Integration Direction

The payment layer should be externalized through a provider abstraction.

MVP expectations:

- checkout/session creation
- callback/webhook confirmation
- persisted payment state
- synchronized request status updates after trusted confirmation

---

## 14. Security Direction

Minimum security expectations:

- JWT-based authentication
- role-based authorization
- protected admin routes
- input validation
- backend-side payment verification
- ownership checks for user resources

Current auth foundation includes:

- password hashing with PBKDF2
- JWT access token issuance
- roles `USER` and `ADMIN`
- protected auth validation endpoints

---

## 15. Observability Direction

The MVP should be built with minimum observability in mind.

Minimum expectations:

- structured logs
- health check endpoint
- environment-aware configuration
- ability to troubleshoot request lifecycle and payment flow

---

## 16. Architectural Constraints

- no feature-first implementation before foundation
- no hidden coupling between user and admin flows
- no direct trust in frontend for payment success
- no undocumented state transition logic
- no premature overengineering for v1

---

## 17. Evolution Path

The architecture should support future evolution into:

- dedicated admin app
- more advanced pricing engine
- municipality-specific disposal rules
- notifications
- operations dashboard
- mobile app or driver-facing tools
- multi-tenant or multi-operator structure if needed later

For MVP, the priority is:

- correctness
- traceability
- simple operability
- end-to-end flow

---

## 18. Version Baseline

Pinned baseline for compatibility:

### Workspace / frontend

- Node.js `24.14.1`
- pnpm `10.26.0`
- Next.js `16.2.2`
- eslint-config-next `16.2.2`
- React `19.2.0`
- react-dom `19.2.0`
- Tailwind CSS `4.2.2`

### Backend / API

- .NET SDK `8.0.408`
- Target Framework `net8.0`
- Swashbuckle.AspNetCore `9.0.6`
- Scalar.AspNetCore `2.13.19`
- Scalar.AspNetCore.Swashbuckle `2.9.0`
- Microsoft.EntityFrameworkCore `8.0.25`
- Microsoft.EntityFrameworkCore.Design `8.0.25`
- Npgsql.EntityFrameworkCore.PostgreSQL `8.0.11`

### Database

- PostgreSQL `16.13`
