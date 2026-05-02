# EcoPickup

Digital platform for scheduling bulky household item pickups in Sweden.

Owners submit pickup requests, attach item details, and track the full lifecycle — from review and pricing through payment, scheduling, and execution. Admins manage the operational side: reviewing requests, setting prices, scheduling pickups, and driving requests through every status transition.

---

## Live / Staging

| Surface | URL |
|---|---|
| API (`/health`) | `https://ecopickup-api-stg.onrender.com/health` |
| Frontend | `https://eco-pickup-web.vercel.app` |

> Both endpoints were live and validated on 2026-04-21. Current availability depends on platform uptime.

---

## Validated MVP — Smoke Test (2026-04-21)

The following flows were validated end-to-end on staging:

- `GET /health` → `200 Healthy`
- Owner registration and login
- Authenticated pickup request creation
- Request list and detail
- Status history / tracking timeline
- Frontend login, dashboard, and request listing via Vercel deploy

> Image upload (Cloudflare R2) was excluded from the current MVP gate. See [Deferred: Image Upload](#deferred-image-upload) below.

---

## Product Goal

Turn the real disposal and logistics problem in Sweden into a structured digital workflow:

1. Owner submits a request with item details and a preferred pickup window
2. Admin reviews, prices, and schedules the pickup
3. Owner pays and tracks progress through execution and completion

---

## Stack

### Backend
- ASP.NET Core (.NET 8) — layered architecture (Api / Application / Domain / Infrastructure)
- Entity Framework Core + PostgreSQL 16
- JWT authentication with role-based access (`USER` / `ADMIN`)
- FluentValidation
- Swagger / Scalar / OpenAPI
- Dockerized for Render Web Service

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- HTTP-only cookie session

### Infrastructure (Staging)
- **API**: Render Web Service (Docker-based)
- **Database**: Render Postgres (same region)
- **Frontend**: Vercel
- **Storage**: Cloudflare R2 (S3-compatible) — configured, smoke deferred (see below)
- **Secrets**: Render Environment Groups + Vercel Environment Variables

---

## Architecture

```
apps/
  api/           # ASP.NET Core backend (layered: Api, Application, Domain, Infrastructure)
  web/           # Next.js frontend

packages/
  contracts/     # Shared type contracts
  ui/            # Shared UI components

docs/
  ops/           # Operational docs: backlog, status, runbooks, deploy decisions
  product/       # Product docs and item photo reference
  assets/        # Visual reference assets
```

**Request lifecycle state machine:**

```
draft → submitted → under_review → quoted → awaiting_payment
      → paid → scheduled → in_transit → collected → completed
      → cancelled / rejected
```

Status history is persisted for every transition, with actor and optional note.

---

## Key Features

### Owner
- Authenticated registration and login (HTTP-only cookie session)
- Create and edit pickup requests in `draft` with multi-item support
- Explicit submission (`draft → submitted`) — separate from save
- Read-only access after submission enters operational flow
- Quote visibility when request is `quoted` or `awaiting_payment`
- Payment session initiation when `awaiting_payment`
- Full tracking timeline across all lifecycle statuses
- Clear messaging for execution states: `in_transit`, `collected`, `completed`
- Clear terminal messaging for `cancelled` and `rejected`

### Admin
- Authenticated dashboard with role guard (`ADMIN`)
- Request listing and detail view (address, items, photos metadata, status)
- Review: approve or reject with optional note (`submitted → under_review`)
- Pricing: persist breakdown and transition to `quoted` or `awaiting_payment`
- Scheduling: confirm pickup window, transition to `scheduled`
- Full tracking timeline access

### Backend
- Secure password hashing
- JWT issuance with role claims
- Ownership enforcement on all owner endpoints
- Payment session creation and webhook-based confirmation (`awaiting_payment → paid`)
- Status history with actor and timestamp on every transition
- Structured startup validation — rejects missing `ConnectionStrings__Database` outside Development
- Structured upload error classification (`[OBJECT-STORAGE]` logs by failure category)

---

## Deferred: Image Upload

The item photo upload feature (Cloudflare R2 / S3-compatible) was built and is present in the codebase but was **excluded from the current publishable MVP** to unblock the staging deploy and portfolio presentation.

**What exists:**
- `ItemPhoto` model, upload endpoint, ownership validation, type/size limits (max 5 photos per item)
- S3-compatible storage client configured for Cloudflare R2
- Two R2 compatibility fixes already applied (`RequestChecksumCalculation=WHEN_REQUIRED`, `UseChunkEncoding=false`, `DisablePayloadSigning=true`)

**Why deferred:**
- Cloudflare R2 rejected streaming SigV4 payload modes (`STREAMING-AWS4-HMAC-SHA256-PAYLOAD-TRAILER` and `STREAMING-AWS4-HMAC-SHA256-PAYLOAD`). Fixes were applied but the final smoke was superseded by the scope decision.
- Decision documented in `EPIC-014K`.

**Next step:** Validate upload smoke with a dedicated R2 session after MVP presentation.

---

## Running Locally

A full local runbook is available at [`docs/ops/local-full-stack-runbook.md`](docs/ops/local-full-stack-runbook.md).

**Requirements:** Docker, .NET 8 SDK, Node.js, pnpm

**Quick start:**

```bash
# Start Postgres and MinIO (local storage)
docker compose up -d

# Run API
cd apps/api
dotnet run --project src/EcoPickup.Api

# Run web (separate terminal)
cd apps/web
pnpm install
pnpm dev
```

**Validate:**
- API health: `GET http://localhost:5082/health` → `200 Healthy`
- Web: `http://127.0.0.1:3001`

> Known local gaps: Docker/dotnet may require elevated permissions on Windows; use `pnpm.cmd` on Windows; port `3000` may conflict — use `3001` as fallback.

---

## Project Status

| Milestone | Status |
|---|---|
| Monorepo foundation | Done |
| Backend foundation (layered API, auth, persistence) | Done |
| Frontend foundation (Next.js, TypeScript, Tailwind) | Done |
| Owner full lifecycle (create → submit → track → pay → complete) | Done |
| Admin review, pricing, scheduling | Done |
| Payment foundation (session + webhook confirmation) | Done |
| Tracking timeline (owner + admin) | Done |
| Staging deploy (Render + Vercel) | Done |
| Smoke test (health, auth, requests, tracking) | Done |
| Image upload (Cloudflare R2) | Deferred — post-MVP |

---

## Next Steps (Post-MVP)

- Validate image upload smoke with Cloudflare R2 (fixes already in place)
- Full admin execution controls (`in_transit`, `collected`, `completed` mutations)
- Notifications / real-time status updates
- Custom domains for staging and production
- CI/CD pipeline
- Observability: structured logging drain, error tracking (Sentry or equivalent)

---

## Delivery Discipline — Protocolo Rick

This project follows the **Protocolo Rick** execution model:

- No implementation starts without minimum discovery and planning artifacts
- Backlog (`docs/ops/backlog.md`) is the single source of truth
- Documentation evolves together with the code — no task is closed without validation artifacts
- Each feature is delivered in controlled slices with explicit acceptance criteria
- Deploy decisions, scope changes, and deferred items are documented before execution

> Source of truth: [`docs/ops/backlog.md`](docs/ops/backlog.md) — [`docs/ops/status.md`](docs/ops/status.md)
