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

- EPIC-008A only creates the initial request foundation in `draft`
- item, image and full submission rules remain deferred to subsequent slices

---

## 4. Item Rules

A pickup request must contain one or more items.

Each item should capture:

- category
- description
- estimated size
- associated image(s) when available

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

---

## 7. Review and Approval Rules

After submission, a request enters operational review.

Admin may:

- approve and quote
- reject
- request internal clarification workflow in future versions, but not required for MVP

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

Rules:

- total must equal the sum of all active components
- currency defaults to SEK
- admin has final authority over pricing in MVP
- all quoted requests must preserve the final breakdown used

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

If payment fails:

- request must not move to `paid`

If payment succeeds:

- request becomes eligible for scheduling/execution

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

Alternative transitions:

- under_review -> rejected
- submitted -> cancelled
- awaiting_payment -> cancelled

---

## 11. Status History Rules

Every meaningful request status change must generate a status history record.

Each record should contain:

- request id
- new status
- timestamp
- actor when available
- optional note

This history is the source for timeline tracking.

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

## Admins

Can view:

- all pickup requests
- operational fields
- pricing
- status history
- disposal records

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
