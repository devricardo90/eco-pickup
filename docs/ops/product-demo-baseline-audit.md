# EcoPickup - Product Demo Baseline Audit

## Metadata

- Slice: `EPIC-019A - Product Demo Baseline Audit`
- Sprint: `SPR-02 - Product Demo Readiness`
- Mode: validation and documentation only
- Repository baseline: `2edecb7`
- Audit timestamp: `2026-05-20T18:24:56Z`
- Public web URL: `https://eco-pickup-web.vercel.app`
- Public API URL: `https://ecopickup-api-stg.onrender.com`

## Scope Guard

This audit did not change application code, frontend, backend, database, environment variables, migrations, seed data, deploy configuration, storage configuration, or infrastructure.

No register, authenticated login, pickup request creation, payment action, photo upload, storage configuration, deploy, migration, or seed was executed because this slice explicitly forbids mutating the database, environment, deploy, or storage.

## Executive Result

`EPIC-019A` is complete as a baseline audit, but the product is not ready for final portfolio presentation.

The main blocker is API staging availability. The frontend public pages are reachable, but the API did not respond to `/health`, `/`, or `/swagger` within controlled timeout windows. Because the API was unavailable and no pre-approved demo account was available in scope, the authenticated journey could not be validated end to end without violating the non-mutation rule.

## HTTP Evidence

### Public Frontend

| Check | Command intent | Result |
| --- | --- | --- |
| Landing | `GET https://eco-pickup-web.vercel.app` | PASS: HTTP `200`, `0.398295s` |
| Login page | `GET https://eco-pickup-web.vercel.app/auth/login` | PASS: HTTP `200`, `0.770703s` |
| Register page | `GET https://eco-pickup-web.vercel.app/auth/register` | PASS: HTTP `200`, `0.346072s` |
| Owner dashboard without auth | `GET https://eco-pickup-web.vercel.app/requests` | OBSERVED: HTTP `200`, body contains `auth/login` marker |
| New request without auth | `GET https://eco-pickup-web.vercel.app/requests/new` | OBSERVED: HTTP `200`, body contains `auth/login` marker |
| Placeholder tracking URL without auth | `GET https://eco-pickup-web.vercel.app/requests/demo/tracking` | PASS/EXPECTED: HTTP `404`, `0.119064s` |

### Public API

| Check | Result |
| --- | --- |
| `GET https://ecopickup-api-stg.onrender.com/health` | FAIL: timed out after `90s` and again after `180s` |
| `GET https://ecopickup-api-stg.onrender.com/health` with `--max-time 30` | FAIL: `status=000`, `Operation timed out after 30009 milliseconds with 0 bytes received` |
| `GET https://ecopickup-api-stg.onrender.com` with `--max-time 30` | FAIL: `status=000`, `Operation timed out after 30011 milliseconds with 0 bytes received` |
| `GET https://ecopickup-api-stg.onrender.com/swagger` with `--max-time 30` | FAIL: `status=000`, `Operation timed out after 30004 milliseconds with 0 bytes received` |

## Journey Baseline

| Step | Status | Result |
| --- | --- | --- |
| 1. Public landing | PASS with findings | Frontend returned HTTP `200`. Source/content markers confirm EcoPickup landing is deployed. Visual polish still needs review before final portfolio packaging. |
| 2. Register/login/sign-in | BLOCKED | Login and register pages returned HTTP `200`, but real register/login was not executed because register mutates DB and login requires either API availability or a safe pre-approved demo account. API staging was unavailable. |
| 3. Authenticated session | BLOCKED | Session persistence could not be validated because login could not be safely executed in this slice. Source confirms HTTP-only cookie session handling exists. |
| 4. Authenticated dashboard | BLOCKED | `/requests` returned HTTP `200` with an `auth/login` marker when unauthenticated. Real dashboard data could not be validated without an authenticated session. |
| 5. Pickup request creation | BLOCKED | Not executed because it mutates DB and depends on authenticated API availability. |
| 6. Tracking/status/timeline | BLOCKED | Not executed because no request was created or selected under a safe demo account. |
| 7. Photos/upload state | OBSERVED ONLY | Code and docs show item photo upload exists at API level, but frontend request creation still states photos are outside the current slice. R2/Object Storage remains deferred and was not configured or tested. |
| 8. Relevant visual issues | RECORDED | See visual findings below. |
| 9. Relevant technical issues | RECORDED | See technical findings below. |
| 10. Next tasks | RECOMMENDED ONLY | Recommendations are listed below; no new READY task was opened. |

## Visual Findings

| Priority | Finding | Evidence | Impact |
| --- | --- | --- | --- |
| HIGH | Landing and app surfaces still read as early product UI, not final portfolio polish. | Repeated large rounded cards, radial background, similar card treatments across landing/dashboard/form/tracking. | The product may still look like a scaffold despite functional copy improvements. |
| HIGH | Public landing includes a technical `Session state` panel. | `SessionSummary` renders the heading `Session state` on the public home page. | This exposes implementation language in the first public impression. |
| MEDIUM | Request form still exposes internal scope language. | Form copy says `Photos remain outside this slice.` | This is useful for internal delivery but weak for a public product demo. |
| MEDIUM | Source contains mojibake for check mark and password placeholder characters. | Landing and auth source include mojibake sequences for symbolic characters. | Potential visible encoding artifact depending on rendered output and capture path. |
| MEDIUM | No mini design system is documented for portfolio polish. | Components repeat local Tailwind classes and rounded card styles directly. | UI consistency will be harder to improve without a small shared visual direction. |

## Technical Findings

| Priority | Finding | Evidence | Impact |
| --- | --- | --- | --- |
| CRITICAL | API staging is not available for demo. | `/health`, `/`, and `/swagger` timed out with no bytes received. | Blocks auth, request creation, tracking, API smoke, and final demo confidence. |
| HIGH | No safe demo account/data contract is available in the current scope. | Demo script suggests data, but no documented safe account or reset policy exists. | Forces either DB mutation during demo or inability to validate login/session/dashboard. |
| HIGH | Authenticated journey cannot currently be proven from public staging. | API unavailable and no demo account available. | Blocks end-to-end portfolio readiness. |
| MEDIUM | Protected frontend routes return HTTP `200` for unauthenticated HTTP checks while embedding an `auth/login` marker. | `/requests` and `/requests/new` returned HTTP `200` with `auth/login` marker. | May be acceptable for Next.js rendering, but it weakens simple HTTP smoke validation and should be browser-validated. |
| MEDIUM | Object Storage/R2 remains unresolved as a demo claim. | Previous docs record R2 compatibility work and deferred final smoke. | The project should not claim final photo functionality until upload/storage/readback is validated. |

## Recommended Next Slices

These are recommendations only. No new `READY` task was opened by this audit.

1. `EPIC-019B - API Staging Availability and Demo Account Gate`
   - Objective: restore or confirm API staging availability and define a safe demo account/data policy without leaking secrets.
   - Reason: the current API timeout blocks every authenticated demo path.

2. `EPIC-019C - Product UI Polish Baseline`
   - Objective: define and apply a small visual system across landing, auth, dashboard, request form, and tracking.
   - Reason: the current UI is functional but not yet final portfolio quality.

3. `EPIC-019D - Object Storage Minimal Demo Smoke`
   - Objective: validate the smallest real photo flow: upload, metadata persistence, and basic readback/visibility.
   - Reason: photos are part of the product promise but remain deferred and unverified.

4. `EPIC-019E - Portfolio Packaging Finalization`
   - Objective: update README, screenshots, final demo script, GitHub description, honest limitations, and optional short demo video.
   - Reason: packaging should happen after the product flow and visual baseline are credible.

## DONE Assessment

`EPIC-019A` meets its DONE criteria as an audit:

- The current journey was tested until the exact blocking point.
- Pass/fail status was recorded per required step.
- Visual issues were prioritized.
- Technical issues were prioritized.
- Recommended next slices were recorded without opening a new READY task.
- No code, frontend, backend, database, environment, migration, seed, deploy, or storage change was made.
