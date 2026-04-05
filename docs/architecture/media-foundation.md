# EcoPickup - Media Foundation

## 1. Objective

This document defines the technical media foundation for EcoPickup before real upload implementation.

The purpose of this slice is to remove ambiguity around storage, upload flow, metadata, ownership and security before EPIC-009B starts.

---

## 2. MVP Storage Decision

Chosen direction for the MVP:

- storage category: S3-compatible object storage
- production-oriented MVP provider: Cloudflare R2
- local development companion: MinIO with the same S3-compatible contract

Reasoning:

- keeps the storage contract simple and portable
- avoids coupling the domain to a single cloud SDK
- supports a clean local workflow with MinIO
- gives predictable object-key semantics and straightforward private object handling

The application should depend on a storage abstraction, not directly on the provider SDK in domain logic.

---

## 3. Upload Flow Decision

Chosen direction for the first upload slice:

- upload via API

This means:

- the client sends the file to the backend
- the backend validates ownership, content type, size and item relationship
- the backend writes the object to storage
- the backend persists media metadata only after storage write succeeds

Reasoning:

- simpler ownership enforcement for the first real implementation
- easier auditability and validation at one boundary
- lower architectural complexity than signed direct upload
- adequate for MVP traffic and operational scale

Deferred option:

- direct upload with signed URLs may be introduced later if scale or UX requires it

---

## 4. Media Constraints

### Allowed content types

- `image/jpeg`
- `image/png`
- `image/webp`

Not allowed in MVP:

- `image/heic`
- `image/heif`
- `image/gif`
- `image/svg+xml`
- any non-image content type

### File size

- max size per file: `10 MB`

### Quantity

- max photos per `PickupItem`: `5`

### Visibility

- objects must remain private at storage level
- file access must happen through authenticated backend-controlled reads or future signed delivery

---

## 5. ItemPhoto Metadata Model

Planned metadata model for implementation:

- `Id`
- `PickupItemId`
- `StorageKey`
- `OriginalFileName`
- `ContentType`
- `SizeBytes`
- `CreatedUtc`

Recommended future additions if needed later:

- `UploadedByUserId`
- `ChecksumSha256`
- `Width`
- `Height`

The initial implementation should keep the metadata minimal and operational.

---

## 6. Relationship Decision

`ItemPhoto` must belong to `PickupItem`, not directly to `PickupRequest`.

Reasoning:

- keeps media attached to the concrete operational object being reviewed
- avoids ambiguity when a request contains multiple items
- aligns future pricing and admin review with item-level evidence

Cardinality:

- `PickupItem 1:N ItemPhoto`

---

## 7. Naming Convention

Storage keys must not depend on user-provided file names for identity.

Chosen storage key pattern:

```txt
pickup-requests/{pickupRequestId}/items/{pickupItemId}/photos/{photoId}.{ext}
```

Rules:

- `photoId` is generated server-side as a GUID
- `{ext}` is derived from validated content type, not trusted from raw file name
- `OriginalFileName` is stored only as metadata, never as the primary key

Extension mapping:

- `image/jpeg` -> `jpg`
- `image/png` -> `png`
- `image/webp` -> `webp`

---

## 8. Ownership and Security Rules

Ownership rules:

- a `USER` may upload or read photos only for items that belong to pickup requests owned by that same authenticated user
- an `ADMIN` may read any photo and may upload only if explicitly supported later

Security rules:

- validate the authenticated user before any media write
- validate that `PickupItem` belongs to a `PickupRequest` owned by the caller
- reject unsupported content types
- reject files above the allowed size
- keep objects private in storage
- do not expose raw storage bucket paths as public URLs
- do not trust client-provided mime type alone when server-side validation is available

Logging rules:

- log upload attempts with request, item and actor identifiers
- do not log raw file content
- avoid logging sensitive address or full payload context together with media events

---

## 9. Implementation Boundary for EPIC-009B

EPIC-009B should implement:

- upload endpoint
- storage write using the chosen abstraction
- metadata persistence
- ownership validation
- media exposure in request detail

EPIC-009B must not reopen:

- provider choice
- upload flow choice
- naming semantics
- content type policy
- max size policy
- photo count policy

Those decisions are already fixed in this foundation document.
