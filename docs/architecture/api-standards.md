# EcoPickup - API Standards

## 1. Objective

This document defines the initial API standards for EcoPickup.

The API must be predictable, versionable, secure, and easy to evolve.

---

## 2. General Principles

The API should be:

- explicit
- consistent
- versioned
- validated
- well documented
- safe by default

The API is the operational backbone of the product and must preserve domain clarity.

---

## 3. Versioning

All routes should be versioned from the beginning.

Recommended base prefix:

```txt
/api/v1
```

Examples:

- `/api/v1/auth/register`
- `/api/v1/auth/login`
- `/api/v1/pickup-requests`
- `/api/v1/admin/pickup-requests`
- `/api/v1/payments`

---

## 4. Resource Naming

Use plural resource-oriented naming when appropriate.

Recommended patterns:

- `/pickup-requests`
- `/pickup-items`
- `/payments`
- `/users`

Admin routes should remain explicit.

Example:

- `/api/v1/admin/pickup-requests`

Avoid:

- vague route names
- action names that hide resource meaning
- mixing user and admin concerns without clear separation

---

## 5. Request and Response Standards

### Request bodies

- should use explicit DTOs
- should be validated at the boundary
- should reject invalid or incomplete payloads

### Responses

- should return predictable shapes
- should avoid leaking infrastructure details
- should use proper status codes
- should preserve clear error semantics

---

## 6. Recommended Response Shape

Success responses may be direct resource payloads for MVP simplicity, but consistency is preferred.

Suggested response envelope for non-trivial endpoints:

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

Suggested error response:

```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more validation errors occurred."
  }
}
```

Final format may be refined, but must remain consistent.

---

## 7. HTTP Status Code Standards

### Common success codes

- `200 OK` - successful read/update
- `201 Created` - successful creation
- `204 No Content` - successful operation without response body

### Common client error codes

- `400 Bad Request` - malformed request
- `401 Unauthorized` - authentication missing or invalid
- `403 Forbidden` - authenticated but not allowed
- `404 Not Found` - resource not found
- `409 Conflict` - state conflict or business conflict
- `422 Unprocessable Entity` - validation or domain rule failure when applicable

### Server error

- `500 Internal Server Error` - unexpected failure

---

## 8. Authentication Standards

Authentication should be JWT-based.

Rules:

- protected endpoints require valid token
- admin endpoints require admin authorization
- resource ownership must be enforced
- frontend trust is never sufficient for protected actions

Auth endpoints direction:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Future additions may include:

- refresh token flow
- logout/invalidation mechanisms
- password reset flows

---

## 9. Authorization Standards

Authorization must distinguish:

- authenticated user access
- admin-only access
- ownership-based access

Examples:

- users can read only their own requests
- admins can read all requests
- users cannot update admin-defined pricing
- payment confirmation cannot be trusted from client-side only

---

## 10. Validation Standards

Boundary validation is mandatory.

Validation should cover:

- required fields
- enum correctness
- date/time consistency
- payload shape
- business-safe minimums

Examples:

- pickup window end must be after start
- payment amount must be positive
- request cannot be submitted without required fields

Validation errors should be readable and consistent.

---

## 11. API Documentation Standards

OpenAPI/Swagger must be enabled from the foundation stage.

Requirements:

- all public endpoints documented
- request DTOs documented
- response shapes documented
- auth requirements documented
- versioning visible in docs

The API docs must help both development and testing workflows.

---

## 12. Domain Separation Standards

The API should keep clear boundaries between contexts.

Examples of route grouping:

- auth
- pickup requests
- admin operations
- payments
- health/system

Do not mix unrelated domain actions in the same controller without good reason.

---

## 13. Pickup Request Endpoint Direction

Suggested initial direction:

### User-facing

- `GET /api/v1/auth/me`
- `POST /api/v1/pickup-requests`
- `GET /api/v1/pickup-requests`
- `GET /api/v1/pickup-requests/{id}`

Current implemented scope:

- `POST /api/v1/pickup-requests` creates an authenticated request in `draft`
- `GET /api/v1/pickup-requests` lists authenticated user requests
- `GET /api/v1/pickup-requests/{id}` returns authenticated user request detail with ownership enforcement
- current payload stores description, pickup window, a single pickup address and one or more pickup items
- items require `category`, `description` and `estimatedSize`
- images, pricing and status history are intentionally deferred to later slices

Planned near-term direction:

- define media contracts before exposing `POST /api/v1/pickup-requests/{id}/images` or item-level upload routes

### Status / tracking

- `GET /api/v1/pickup-requests/{id}/history`

### Images

- `POST /api/v1/pickup-requests/{id}/images`

Recommended foundation before implementation:

- final upload route may move to an item-oriented shape such as `POST /api/v1/pickup-items/{id}/photos`
- the contract is fixed to API-mediated upload for MVP
- content type whitelist is `image/jpeg`, `image/png`, `image/webp`
- max size is `10 MB`
- max photo count is `5` per `PickupItem`
- storage keys must follow server-generated item-scoped naming

### Payments

- `POST /api/v1/pickup-requests/{id}/payments`

### Admin

- `GET /api/v1/admin/pickup-requests`
- `GET /api/v1/admin/pickup-requests/{id}`
- `PATCH /api/v1/admin/pickup-requests/{id}/review`
- `PATCH /api/v1/admin/pickup-requests/{id}/quote`
- `PATCH /api/v1/admin/pickup-requests/{id}/status`
- `PATCH /api/v1/admin/pickup-requests/{id}/disposal`

These are directional standards, not locked implementation details yet.

---

## 14. Idempotency and Safety

Where relevant, operations should be designed carefully to avoid accidental duplication.

Special attention areas:

- payment initiation
- webhook processing
- repeated status updates
- duplicate request submission

Webhook handlers must be idempotent where possible.

---

## 15. Error Handling Standards

Errors should:

- be explicit
- avoid leaking sensitive internal details
- preserve actionable messages
- remain consistent across endpoints

Recommended categories:

- validation errors
- authentication errors
- authorization errors
- not found
- business rule conflicts
- unexpected internal errors

---

## 16. Logging and Traceability

The API should support traceability of important actions, including:

- request creation
- status changes
- quote updates
- payment events
- disposal registration

Logging should help diagnose operational problems without exposing sensitive data inappropriately.

---

## 17. Pagination and Filtering

List endpoints should be designed with future pagination in mind.

For admin listing, likely needs:

- page
- pageSize
- status filter
- date filter
- search inputs in future

The MVP may start simple, but should not block later pagination/filtering evolution.

---

## 18. Consistency Rules

Do:

- keep route naming predictable
- keep response shape consistent
- keep auth rules explicit
- keep validation strict
- keep domain boundaries visible

Do not:

- overload endpoints with mixed responsibilities
- rely on frontend assumptions for backend truth
- skip versioning
- return inconsistent error patterns
