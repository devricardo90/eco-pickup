# EcoPickup - Business Rules

## 1. Objective

This document defines the initial business rules for the EcoPickup MVP.

The focus is to make the first version operationally simple, auditable, and aligned with the end-to-end collection workflow.

---

## 2. Roles

## USER

Can:

- register
- log in
- create pickup requests
- upload item photos
- provide address and pickup preferences
- view quotes
- pay approved requests
- track status of own requests

Cannot:

- access admin routes
- modify pricing after quote
- change operational statuses directly

## ADMIN

Can:

- view all pickup requests
- view address, items, item photos and current status for any request
- approve or reject requests
- define or adjust pricing
- define final scheduling
- update operational statuses
- record disposal/destination information

Cannot:

- impersonate users without explicit support tooling
- skip mandatory lifecycle integrity rules

---

## 3. Pickup Request Creation Rules

A pickup request may only be submitted when the minimum required fields are present.

Minimum required fields:

- at least one item
- item description
- pickup address
- preferred pickup window
- at least one image in the initial MVP recommendation, unless explicitly relaxed later

A request starts in:

- `draft` while incomplete
- `submitted` after successful submission

Once submitted:

- the user cannot directly change core operational fields if the request is already under review, quoted, paid, scheduled, or beyond

Current implementation note:

- EPIC-008A and EPIC-008B create the request foundation in `draft`
- the current creation payload already requires at least one item
- image, pricing, payment and full submission workflow remain deferred to subsequent slices
- media foundation must be defined before real image upload

---

## 4. Item Rules

A pickup request must contain one or more items.

Each item should capture:

- category
- description
- estimated size
- associated image(s) when available

Current implementation note:

- EPIC-008B persists `category`, `description` and `estimatedSize`
- accepted sizes are `small`, `medium` and `large`
- EPIC-009B now persists `ItemPhoto` metadata under `PickupItem`
- item photo upload is authenticated and ownership-scoped to the request owner
- allowed content types are `image/jpeg`, `image/png` and `image/webp`
- max file size is `10 MB`
- max quantity is `5` photos per item

Current implementation note:

- item photos attach to `PickupItem`, not directly to `PickupRequest`
- upload enforcement validates ownership, file type, file signature and file size constraints
- request detail for the authenticated owner now exposes photo metadata per item
- objects remain private in storage and are not exposed as public bucket URLs

Estimated size options for MVP may be normalized to:

- small
- medium
- large

The goal is not perfect classification in v1, but enough information for operational quoting.

---

## 5. Address Rules

Each request must have one pickup address.

Address must capture at minimum:

- street
- city
- postal code

Optional operational fields:

- floor
- hasElevator
- access notes

If `hasElevator = false` and floor is above ground, stair adjustment may apply.

---

## 6. Pickup Window Rules

The MVP should use pickup windows instead of exact times.

Minimum structure:

- pickupWindowStart
- pickupWindowEnd

Rules:

- end must be later than start
- pickup window must be in the future
- admin may confirm a more specific operational time later
- user preference does not guarantee final scheduling until admin confirmation

Current implementation note:

- EPIC-011B introduces an admin-confirmed operational pickup window
- the current scheduling slice stores `confirmedPickupWindowStartUtc` and `confirmedPickupWindowEndUtc`
- the user-provided pickup window remains preserved as the original preference

---

## 7. Review and Approval Rules

After submission, a request enters operational review.

Admin may:

- approve and quote
- reject
- request internal clarification workflow in future versions, but not required for MVP

Current implementation note:

- EPIC-010B opens the first controlled admin review action
- `approve` currently moves `draft -> under_review`
- `reject` currently moves `draft -> rejected` or `under_review -> rejected`
- admin review may include an optional note
- pricing and scheduling remain deferred

If rejected:

- request status becomes `rejected`
- payment cannot proceed

If approved:

- admin must define quote data
- request moves toward `quoted` or `awaiting_payment`

---

## 8. Pricing Rules

The MVP uses a simple pricing model.

Initial reference:

- base = 199 SEK
- small item = +99 SEK
- medium item = +199 SEK
- no elevator = +79 SEK per floor
- distance = variable adjustment

These values are initial operational defaults and may evolve.

The system should store:

- priceBase
- priceSizeAdjustment
- priceFloorAdjustment
- priceDistanceAdjustment
- priceTotal
- currency

Current implementation note:

- EPIC-011A now persists pricing directly on `PickupRequest`
- pricing breakdown includes `priceBase`, `priceSizeAdjustment`, `priceFloorAdjustment`, `priceDistanceAdjustment`, `priceTotal` and `currency`
- `priceTotal` is computed on the backend as the sum of the active pricing components
- current pricing flow is admin-driven and isolated from payment

Rules:

- total must equal the sum of all active components
- currency defaults to SEK
- admin has final authority over pricing in MVP
- all quoted requests must preserve the final breakdown used

Current implementation note:

- pricing is currently allowed only after review while the request is `under_review`
- current target statuses for pricing are `quoted` or `awaiting_payment`
- repricing after this step remains out of scope for the current slice

---

## 9. Payment Rules

A request cannot move into paid operational flow before successful payment confirmation.

Rules:

- payment can only be initiated after quote approval
- payment amount must match the active quoted total
- payment confirmation must come from trusted backend verification/webhook flow
- payment status must be stored separately from pickup request status

Suggested payment statuses:

- pending
- requires_action
- paid
- failed
- refunded
- cancelled

Current implementation note:

- EPIC-012A introduces the first persisted `Payment` model related to `PickupRequest`
- the current slice implements `pending`, `paid`, `failed` and `cancelled`
- payment session creation is currently allowed only when the request is `awaiting_payment`
- payment amount and currency are derived from the persisted pricing breakdown
- payment confirmation is handled by a secure backend webhook

If payment fails:

- request must not move to `paid`

If payment succeeds:

- request becomes eligible for scheduling/execution

Current implementation note:

- successful confirmation currently applies `awaiting_payment -> paid`
- failed or cancelled confirmation updates the payment state but keeps the request status unchanged
- advanced refund, dispute and reconciliation flows remain deferred

---

## 10. Status Lifecycle Rules

Primary request statuses:

- draft
- submitted
- under_review
- quoted
- awaiting_payment
- paid
- scheduled
- in_transit
- collected
- completed
- cancelled
- rejected

Rules:

- every status change must be recorded in status history
- invalid transitions should be blocked
- terminal statuses must be treated carefully

Terminal statuses:

- completed
- cancelled
- rejected

Example expected transitions:

- draft -> submitted
- submitted -> under_review
- under_review -> quoted
- quoted -> awaiting_payment
- awaiting_payment -> paid
- paid -> scheduled
- scheduled -> in_transit
- in_transit -> collected
- collected -> completed

Current implementation note:

- current implemented transitions include `draft -> under_review`, `draft -> rejected`, `under_review -> rejected`, `under_review -> quoted`, `under_review -> awaiting_payment`, `awaiting_payment -> paid` and `quoted -> scheduled`
- scheduling after `paid` remains a separate operational step

Alternative transitions:

- under_review -> rejected
- submitted -> cancelled
- awaiting_payment -> cancelled

---

## 11. Status History Rules

Every meaningful request status change must generate a status history record.

Each record should contain:

- request id
- previous status
- new status
- timestamp
- actor when available
- optional note

This history is the source for timeline tracking.

Current implementation note:

- EPIC-010B now persists review-generated request status history
- current history entries capture `fromStatus`, `toStatus`, `action`, `actorUserId`, `note` and `createdUtc`
- EPIC-012A now also records a request status-history entry when payment confirmation moves the request to `paid`

---

## 12. Disposal Record Rules

At the end of the operational flow, admin should be able to record the final destination of the item(s).

Suggested destination types:

- recycle_center
- donation
- resale
- landfill
- other

Purpose:

- operational traceability
- sustainability visibility
- future reporting opportunities

---

## 13. Visibility Rules

## Users

Can view only:

- their own profile-related data
- their own pickup requests
- their own request statuses
- their own payment-related flow

Current implementation note:

- user read access currently covers own pickup request list and own pickup request detail
- read responses now expose request, address, items and item photo metadata for the owner
- admin-wide photo visibility remains out of scope until the admin slice is opened

## Admins

Can view:

- all pickup requests
- operational fields
- pickup address
- pickup items
- item photos
- current request status
- pricing
- status history
- disposal records

Current implementation note:

- EPIC-010A delivers admin read-only access to request list and detail
- current admin detail includes `address`, `items`, `photos` and `status`
- admin actions such as pricing, approve/reject and status mutation remain deferred

---

## 14. Cancellation Rules

Cancellation rules for MVP should stay simple.

Suggested behavior:

- users may cancel only before certain operational milestones
- after payment or after scheduling, cancellation may require admin action
- admin can cancel requests when operationally necessary

This exact policy can be tightened in later versions.

---

## 15. Auditability Rules

The MVP should preserve minimum operational traceability for:

- who created a request
- when the request was submitted
- what quote was defined
- payment outcome
- status changes
- final disposal destination

---

## 16. MVP Simplicity Rule

When in doubt:

- prefer manual admin control over premature automation
- prefer clarity over sophistication
- prefer explicit state transitions over hidden logic

The MVP should prove the workflow, not over-engineer the business too early.
