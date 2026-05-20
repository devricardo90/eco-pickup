# EcoPickup - API Staging Availability Diagnosis

## Metadata

- Slice: `EPIC-019B - Diagnose API Staging Availability and Define Demo Account Policy`
- Sprint: `SPR-02 - Product Demo Readiness`
- Mode: documentation and diagnosis only
- Repository baseline: `a66fe85`
- Diagnostic date: `2026-05-20`
- API URL: `https://ecopickup-api-stg.onrender.com`
- Web URL: `https://eco-pickup-web.vercel.app`

## Scope Guard

This slice did not change code, frontend, backend, database, environment variables, migrations, seed data, deployment configuration, storage/R2 configuration, Render resources, Vercel resources, or infrastructure.

No authenticated login, register, pickup request creation, tracking mutation, photo upload, deploy, migration, seed, database write, environment change, or secret access was executed.

## Summary

API staging is currently reachable from a network-unrestricted diagnostic run.

The EPIC-019A timeout remains valid as historical evidence for that audit window, but EPIC-019B found that the public API is responding now. The current availability diagnosis is:

- `/health` is healthy.
- `/` is healthy and returns the API bootstrap payload.
- `/swagger` returns `404 Not Found`, which is expected for the current code because Swagger/Scalar endpoints are only mapped when `app.Environment.IsDevelopment()`.
- The first non-escalated curl attempt from the sandbox failed for both Render and Vercel with `curl: (7) Could not connect to server`, so those failures are classified as local sandbox/network restrictions, not staging evidence.

## Raw HTTP Evidence

### Sandbox Network Attempt

The first attempt used the allowed read-only curl commands without elevated network access.

| Target | Result | Interpretation |
| --- | --- | --- |
| API `/health` | `curl: (7) Failed to connect ... Could not connect to server` | Not reliable as staging evidence because Vercel failed the same way. |
| API `/` | `curl: (7) Failed to connect ... Could not connect to server` | Not reliable as staging evidence because Vercel failed the same way. |
| API `/swagger` | `curl: (7) Failed to connect ... Could not connect to server` | Not reliable as staging evidence because Vercel failed the same way. |
| Web `/` | `curl: (7) Failed to connect ... Could not connect to server` | Confirms local/sandbox network restriction. |

### Network-Unrestricted Diagnostic

The same read-only commands were repeated with approved elevated network access.

#### API `/health`

```txt
HTTP/1.1 200 OK
Date: Wed, 20 May 2026 19:10:13 GMT
Content-Type: text/plain
Cache-Control: no-store, no-cache
rndr-id: 4ef79d28-7de0-4d70
x-render-origin-server: Kestrel

Healthy
```

#### API `/`

```txt
HTTP/1.1 200 OK
Date: Wed, 20 May 2026 19:10:14 GMT
Content-Type: application/json; charset=utf-8
rndr-id: fa6f69e6-ee07-4f93
x-render-origin-server: Kestrel

{"service":"EcoPickup.Api","status":"bootstrap"}
```

#### API `/swagger`

```txt
HTTP/1.1 404 Not Found
Date: Wed, 20 May 2026 19:10:13 GMT
Content-Length: 0
rndr-id: 49e9a5ce-f31d-42e0
x-render-origin-server: Kestrel
```

#### Web `/`

```txt
HTTP/1.1 200 OK
Date: Wed, 20 May 2026 19:10:14 GMT
Server: Vercel
X-Matched-Path: /
X-Powered-By: Next.js
X-Vercel-Cache: MISS
```

## Swagger Interpretation

`/swagger` returning `404` in staging is expected under the current API program.

The API maps Swagger, Swagger UI, and Scalar only inside:

```csharp
if (app.Environment.IsDevelopment())
{
  app.MapSwagger("/openapi/{documentName}.json");
  app.UseSwaggerUI();
  app.MapScalarApiReference("/scalar", options =>
  {
    options.WithTitle("EcoPickup API");
  });
}
```

Therefore, `/swagger` must not be used as a staging health signal unless a future slice intentionally exposes staging API docs.

## Diagnosis

| Area | Status | Evidence |
| --- | --- | --- |
| API process availability | PASS | `/health` returned `200 OK` and `Healthy`. |
| API root endpoint | PASS | `/` returned `200 OK` with bootstrap JSON. |
| Render origin | PASS | Responses include `x-render-origin-server: Kestrel` and Render request IDs. |
| Public web availability | PASS | Vercel returned `200 OK`. |
| Swagger in staging | NOT A FAILURE | `404` is expected because API docs are Development-only. |
| Authenticated journey | NOT VALIDATED | This slice did not perform login/register/request creation because it is diagnosis-only and no safe demo account exists yet. |

## Decision

The availability blocker from EPIC-019A is no longer present at the public API health/root level during this diagnostic window.

The remaining blocker for authenticated demo validation is not API process availability. It is the absence of a safe demo account/data policy and the lack of a controlled authenticated smoke slice.

## Required Evidence Before Future Mutation

Before any future code, env, DB, seed, deploy, Render, Vercel, storage/R2, or infrastructure change, collect or confirm:

- current API `/health` response with timestamp
- current API `/` response with timestamp
- current frontend `/` response with timestamp
- Render latest deploy commit SHA, status, and logs around the diagnostic timestamp
- Vercel latest deploy commit SHA and status
- whether staging API is intended to expose API docs; current code says no
- approved demo account policy and whether account creation is manual, seeded, or operator-owned

## Recommended Next Slice

Recommended next slice: `EPIC-019C - Authenticated Demo Account and Smoke Validation`.

Purpose:

- create or confirm a safe demo account through an approved non-secret process
- validate login/session/dashboard/request creation/tracking
- record evidence without exposing credentials
- avoid UI polish until the authenticated demo path is proven
