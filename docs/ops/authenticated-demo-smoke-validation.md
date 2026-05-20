# EcoPickup - Authenticated Demo Smoke Validation

## Metadata

- Slice: `EPIC-019C - Authenticated Demo Account and Smoke Validation`
- Sprint: `SPR-02 - Product Demo Readiness`
- Mode: controlled staging smoke validation
- Repository baseline: `be07a82`
- Validation date: `2026-05-20`
- API URL: `https://ecopickup-api-stg.onrender.com`
- Web URL: `https://eco-pickup-web.vercel.app`

## Scope Guard

This slice did not change code, frontend, backend, database schema, environment variables, migrations, seed data, deployment configuration, Render, Vercel, object storage/R2, README, screenshots, or infrastructure.

The only state-changing actions were performed through the public staging application flow:

- public register flow for a dedicated staging demo account
- public login flow
- public authenticated pickup request creation flow
- public logout flow

No password, provider secret, database secret, Render secret, Vercel secret, R2 secret, or real credential was documented or committed.

## Account Handling

A dedicated staging demo account was created through the public register flow for this smoke validation.

The password was generated in memory for the validation run and was not printed intentionally, stored in the repository, committed, or documented.

This account is not the Trigger's personal account and must not be treated as the final public portfolio credential set. If public portfolio credentials are needed later, they must be created and distributed through an approved non-repository process.

### Operational Note

An initial automation attempt stopped because of a local PowerShell variable-name conflict after the public register/login sequence had already started. That attempt did not print or retain the password and did not use DB edits, seed, migrations, provider actions, or API-direct mutation outside the app flow.

The successful smoke run used a separate dedicated staging demo account created through the public register flow.

## Fake Demo Data

The successful smoke used synthetic data only:

```txt
Request description: Portfolio smoke validation pickup request
Item: Large Sofa
Item description: Synthetic sofa for portfolio smoke validation
Estimated size: large
Address: 123 Demo Loop, Sample City, 00000
Floor: 2
Access notes: Synthetic demo note only
Pickup window: future date, 09:00-11:00
Intent: save draft
```

No real address, phone, customer data, payment data, photo upload, or storage/R2 data was used.

## Availability Evidence

### Git Baseline

```txt
be07a82 (HEAD -> main, origin/main, origin/HEAD) docs(ops): diagnose staging api and demo account policy
a66fe85 docs(ops): record product demo baseline audit
2edecb7 docs(ops): prepare portfolio demo script and screenshot checklist
```

### API Health

First elevated attempt:

```txt
curl: (28) Operation timed out after 30006 milliseconds with 0 bytes received
```

Second elevated attempt:

```txt
HTTP/1.1 200 OK
Date: Wed, 20 May 2026 19:33:05 GMT
Content-Type: text/plain
x-render-origin-server: Kestrel

Healthy
```

Interpretation: the first 30s timeout is consistent with a transient cold-start or delayed response condition; the immediate retry confirmed the API was healthy before the authenticated smoke continued.

### Public Frontend

```txt
HTTP/1.1 200 OK
Date: Wed, 20 May 2026 19:30:44 GMT
Server: Vercel
X-Matched-Path: /
X-Powered-By: Next.js
```

## Smoke Evidence

The smoke was executed through public frontend forms and server actions, not by direct API mutation.

| Step | Result | Evidence |
| --- | --- | --- |
| Register page reachable | PASS | HTTP `200` |
| Demo account registration | PASS | public register form returned HTTP `303` redirect to login |
| Login page reachable | PASS | HTTP `200` |
| Demo account login | PASS | public login form returned HTTP `303` redirect to `/` |
| Authenticated home/session | PASS | home rendered authenticated session marker |
| Dashboard access | PASS | `/requests` returned HTTP `200` and dashboard marker |
| New request form access | PASS | `/requests/new` returned HTTP `200` |
| Fake pickup request creation | PASS | public request form returned HTTP `303` |
| Tracking/detail access | PASS | redirected to `/tracking/[requestId]?saved=1`, HTTP `200` |
| Request ID captured | PASS | tracking URL contained a request identifier |
| Dashboard/list visibility | PASS | request visible after creation |
| Timeline visibility | PASS | tracking page contained timeline marker |
| Logout | PASS | public logout form returned HTTP `303` redirect to `/auth/login` |

Captured request identifier:

```txt
b4c8c52f-3dd4-4a34-88f6-b8bb62267494
```

This identifier is not a credential.

## Findings

### PASS

- API staging was healthy before the authenticated smoke continued.
- Public frontend was available.
- Dedicated demo account registration worked through the public app flow.
- Login and logout worked with the dedicated demo account.
- Authenticated dashboard was reachable.
- Fake pickup request creation worked.
- Created request was visible from the dashboard/list.
- Tracking/detail/status surface was reachable.
- Timeline marker was present.

### Notes

- The demo account password was not retained in repository documentation.
- This smoke account should not be treated as a reusable public portfolio credential.
- A future public portfolio credential, if needed, must be created through a deliberate non-repository process.
- The request was saved as draft to keep the smoke minimal and avoid advancing operational review.

## DONE Assessment

`EPIC-019C` meets its DONE criteria:

- frontend/API availability was checked
- one successful dedicated demo account smoke was completed
- login and logout were validated
- dashboard access was validated
- one fake pickup request was created
- request visibility was validated
- tracking/status/timeline surface was validated
- evidence was documented
- no personal account was used
- no credentials were documented or committed
- no code, deploy, env, migration, seed, manual DB edit, Render/Vercel change, storage/R2 work, README final polish, or screenshot package was performed
