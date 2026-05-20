# EcoPickup - Demo Account Policy

## Metadata

- Slice: `EPIC-019B - Diagnose API Staging Availability and Define Demo Account Policy`
- Sprint: `SPR-02 - Product Demo Readiness`
- Mode: documentation and diagnosis only
- Repository baseline: `a66fe85`
- Policy date: `2026-05-20`

## Purpose

Define how EcoPickup should use demo accounts and demo data for portfolio validation without exposing credentials, relying on personal accounts, or leaving the staging database in an unknown state.

## Policy Decision

EcoPickup should use a dedicated staging-only demo account for portfolio validation.

The demo account must be created or confirmed in a future authorized slice. EPIC-019B does not create the account, does not seed data, does not write to the database, and does not store credentials.

## Account Requirements

| Requirement | Policy |
| --- | --- |
| Environment | Staging only. |
| Role | `USER` for public owner demo. Admin demo account is separate and optional. |
| Email | Use a non-personal, project-scoped address or alias controlled by the project owner. |
| Password | Must never be committed, pasted into docs, logs, screenshots, or chat. |
| Storage | Credentials must live only in the approved password manager or platform secret workflow, not in the repository. |
| Data | Demo data must be synthetic and non-sensitive. |
| Reset | Demo data should be disposable and resettable by a documented future process. |

## Allowed Demo Data

Use synthetic data only:

- realistic item descriptions
- non-real addresses or clearly fictional addresses
- no real phone numbers
- no real customer names
- no personal notes or private access codes
- no real payment details
- no real object storage credentials or bucket identifiers beyond already documented non-secret resource names

## Recommended Demo User Profile

This profile is a placeholder policy, not a credential:

```txt
Role: USER
Purpose: public owner journey demo
Label: portfolio-demo-owner
Email pattern: project-owned demo alias
Password: managed outside repository
```

## Recommended Demo Journey Data

Use the EPIC-018B demo script as the narrative source, with fictional data:

```txt
Pickup Request: Living Room Furniture Upgrade
Items:
- Large Sofa, good condition, needs recycling
- Wooden Coffee Table, minor scratches
Address:
- Fictional public demo address only
```

## Prohibited Practices

- Do not commit demo credentials.
- Do not expose real passwords in operational docs.
- Do not use a personal email account for the public demo.
- Do not use real customer data.
- Do not create a production account for staging demos.
- Do not rely on R2/photo upload as a demo promise until storage smoke is validated.
- Do not create or mutate demo data outside an authorized slice.

## Future Account Creation Options

Any future account creation must be explicitly authorized and recorded as a separate slice.

Acceptable options:

1. Operator-created account through the public register flow.
2. One-time controlled seed in staging, if explicitly approved.
3. Manual database insertion only if explicitly approved and documented as an operational exception.

Preferred option for portfolio readiness:

- operator-created staging account through the public UI or API, followed by a controlled authenticated smoke test.

## DONE Boundary For EPIC-019B

EPIC-019B defines this policy only.

It does not:

- create the demo account
- choose or record a real password
- mutate the database
- seed staging
- validate login
- create pickup requests
- upload photos
- configure Render, Vercel, R2, or secrets

## EPIC-019C Application

EPIC-019C applied this policy through a controlled staging smoke validation:

- a dedicated staging demo account was created through the public register flow
- the Trigger's personal account was not used or modified
- credentials were not documented, committed, or intentionally printed
- fake pickup request data was used
- no DB edit, seed, migration, provider action, deploy, env change, Render/Vercel change, or storage/R2 change was performed
- the resulting smoke account is not the final public portfolio credential set
