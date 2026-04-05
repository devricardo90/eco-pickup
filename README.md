# EcoPickup

Digital platform for scheduling bulky household item pickups in Sweden.

## Vision

EcoPickup is a product designed to help residents in Sweden schedule the pickup of bulky household items such as furniture and large objects, with a clear operational flow:

- user submits a request
- uploads item photos
- chooses pickup window
- admin reviews and quotes
- user pays
- collection is completed
- final status is tracked end-to-end

## Product Goal

Turn a real disposal and logistics problem in Sweden into a structured digital workflow with:

- multilingual UX
- operational quoting
- image upload
- payment integration
- admin panel
- request tracking

## Initial Scope

This repository starts with governance, planning, and project foundation before feature implementation.

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

Project initialized in governance and planning mode.

No feature development should start before:

PRD is registered
backlog is broken down
architecture foundation is defined
execution order is approved

## Current Technical Baseline

- monorepo foundation completed
- backend foundation completed
- frontend foundation completed
- PostgreSQL local persistence foundation completed through Docker + EF Core
- authentication and access control foundation completed with JWT
