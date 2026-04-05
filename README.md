# EcoPickup

Digital platform for scheduling bulky household item pickups in Sweden.

## MVP Current State

The repository is no longer only in foundation mode. The current MVP already delivers:

- authenticated owner and admin web surfaces
- owner create, edit-in-draft and explicit submit flow
- pickup item photo upload
- admin review, pricing and scheduling foundations
- owner quote visibility and payment session start
- owner tracking/detail with timeline, status and lifecycle messaging
- status-history tracking across the main request lifecycle

## Product Goal

Turn a real disposal and logistics problem in Sweden into a structured digital workflow with:

- request intake
- item and photo capture
- admin review and pricing
- payment confirmation
- scheduling and execution tracking
- final lifecycle visibility for owner and admin

## Delivery Discipline

The project started with governance, planning and foundation work before feature implementation, and it still follows that same discipline.

The project follows the **Protocolo Rick**, which means:

- no implementation starts without minimum discovery and planning artifacts
- backlog is the source of truth
- documentation must evolve together with the code
- no task is marked done without validation

## Planned Stack

### Backend
- ASP.NET Core (.NET 8)
- Entity Framework Core
- PostgreSQL
- JWT Auth
- FluentValidation
- Swagger / OpenAPI

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Infrastructure
- Docker
- PostgreSQL 16.13 for local development
- image storage
- deployment environment
- payment integration

## Planned Repository Structure

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
```

## Delivery Model

This project follows a staged execution model:

Discovery
Planning
Development
Testing
Deploy

Each phase must produce its minimum artifacts before the next one can begin.

## Source of Truth

`docs/ops/backlog.md`  official backlog
`docs/ops/status.md`  executive summary only

## Current State

Current delivered MVP slices include:

- request creation and draft editing
- explicit `draft -> submitted` owner submission
- owner and admin authenticated dashboards/detail surfaces
- tracking/history timeline endpoints and UI
- admin review, pricing and scheduling foundations
- payment foundation with owner checkout start and webhook confirmation
- owner messaging for `under_review`, `quoted`, `awaiting_payment`, `paid`, `scheduled`, `in_transit`, `collected`, `completed`, `cancelled` and `rejected`

## Current Technical Baseline

- monorepo foundation completed
- backend foundation completed
- frontend foundation completed
- PostgreSQL local persistence foundation completed through Docker + EF Core
- authentication and access control foundation completed with JWT

## Current Out Of Scope

The current MVP still keeps these areas outside the active scope:

- new operational mutations beyond the existing foundations
- polling, websockets and notifications
- full admin execution controls
- broader deploy/observability work beyond current local foundations
