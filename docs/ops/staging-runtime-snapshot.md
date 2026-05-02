# EcoPickup - Staging Runtime Snapshot

## Snapshot date

`2026-05-02`

## Repository base at time of snapshot

- commit: `55f401f`
- branch: `main`

---

## API — `https://ecopickup-api-stg.onrender.com/health`

### Attempt 1 — cold start

| Field | Value |
|---|---|
| timestamp | `2026-05-02T15:34:43Z` |
| HTTP status | `200` |
| response time | `15.653742s` |
| body | `Healthy` |
| interpretation | Render free tier cold start — service was sleeping, first request woke it |

### Attempt 2 — warm

| Field | Value |
|---|---|
| timestamp | `2026-05-02T15:35:08Z` |
| HTTP status | `200` |
| response time | `0.177594s` |
| body | `Healthy` |
| interpretation | Warm response — service fully up after cold start |

### API conclusion

- service is **operational**
- cold start confirms Render free tier sleeping behavior — not a failure condition
- `/health` endpoint responding correctly under current deploy

---

## Frontend — `https://eco-pickup-web.vercel.app`

| Field | Value |
|---|---|
| timestamp | `2026-05-02T15:35:20Z` |
| HTTP status | `200` |
| response time | `1.524383s` |
| page title | `EcoPickup` |
| navigation links present | `Sign in`, `Register` |
| authenticated routes exposed | `/requests`, `/requests/new`, `/admin/requests`, `/tracking/[requestId]`, `/admin/tracking/[requestId]` |
| framework | Next.js App Router |

### Frontend conclusion

- service is **operational**
- landing page and navigation links render correctly
- authenticated surfaces exist at expected routes
- no rendering error observed

---

## Overall conclusion

Both staging surfaces responded with HTTP 200 as of `2026-05-02`.

| Surface | Status |
|---|---|
| API (`/health`) | Operational — cold start behavior confirmed |
| Frontend (Vercel) | Operational — landing page and routes verified |

---

## Known limitations at this snapshot

- image upload (Cloudflare R2) is excluded from the current MVP gate — deferred to post-MVP per `EPIC-014K`
- Render free tier sleeping is expected behavior — API may require ~15s on first request after inactivity
- no authenticated smoke was performed in this snapshot — auth, request creation and tracking were validated on `2026-04-21` (see `docs/ops/staging-provisioning-execution.md`)
- Render staging may still be running the pre-hardening build from before `EPIC-014J` (`55ce82a`) — no redeploy was authorized in the current session
