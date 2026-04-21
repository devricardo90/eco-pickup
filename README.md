# EcoPickup

EcoPickup is a digital platform for scheduling bulky household item pickups in Sweden.

It structures a process that is often handled through fragmented channels into a clearer digital workflow for owners and operators.

---

## Live MVP

### Web
[EcoPickup Web](https://eco-pickup-web.vercel.app)

### API Health
[API /health](https://ecopickup-api-stg.onrender.com/health)

---

## Current MVP State

The current public MVP already delivers:

- authenticated web flow
- user registration and login
- pickup request creation
- draft editing before submission
- explicit request submission flow
- pickup request list and detail views
- request history and timeline visibility
- deployed frontend on Vercel
- deployed API on Render
- staging validation of the main flow

### Validated flow
The following flow has been manually validated in staging:

- `/health`
- register
- login
- create pickup request
- list pickup requests
- view pickup request detail
- view pickup request history
- front-end login and dashboard flow

---

## Product Goal

EcoPickup turns a real logistics and disposal problem into a structured workflow with:

- request intake
- item registration
- owner visibility over request progress
- operator/admin review foundations
- tracking and lifecycle visibility

---

## Scope of the Current Public MVP

The current public MVP is focused on the core request lifecycle.

### Included
- authenticated access
- pickup request creation and submission
- request listing and detail
- request history/timeline
- deployed web + API flow

### Not part of the current published MVP
- image upload in the live deployed flow
- Cloudflare R2 integration in production/staging flow
- advanced admin execution controls
- real-time notifications
- broader observability and production hardening

---

## Roadmap / Next Iterations

Planned future improvements include:

- image upload for pickup items
- object storage integration refinement
- richer admin execution controls
- stronger observability and operational tooling
- payment and logistics workflow expansion

---

## Tech Stack

### Backend
- ASP.NET Core (.NET 8)
- Entity Framework Core
- PostgreSQL
- JWT authentication
- FluentValidation
- Swagger / OpenAPI

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Infrastructure
- Render
- Vercel
- PostgreSQL
- Docker for local development

---

## Architecture

This repository follows a monorepo structure:

```txt
apps/
  api/
  web/

packages/
  contracts/
  ui/

docs/
  product/
  architecture/
  rules/
  ops/

Delivery Discipline

This project follows Protocolo Rick, a structured execution model focused on controlled delivery.

Core principles:

no implementation starts without minimum discovery and planning artifacts
backlog is the source of truth
documentation evolves with the code
no task is done without validation evidence

Execution phases:

Discovery
Planning
Development
Testing
Deploy
Operational Source of Truth

Primary operational documents:

docs/ops/backlog.md — canonical backlog
docs/ops/status.md — executive status summary
Current Project Position

The project is no longer only in foundation mode.

It now has:

a validated staging API
a published frontend
a working end-to-end MVP flow for the current scope
documented scope control for what is intentionally deferred
Notes

Image upload and Cloudflare R2 integration were intentionally removed from the current MVP gate to keep the deployment focused and publishable. They remain planned as a future refinement phase, not as discarded functionality.
