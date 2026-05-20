# EcoPickup - Design Brief

## Product Context

EcoPickup is a sustainable pickup request product for people who need to dispose of or repurpose bulky items responsibly.

The product connects a user-facing request flow with an operational backend that can review, price, schedule, track, and complete collection requests. The portfolio version must communicate a real service workflow, not only a technical prototype.

## Current Product State

The product has a working staging demo path:

- public landing page
- public register/login/logout
- authenticated owner dashboard
- pickup request creation
- request detail and tracking timeline
- backend API health

The staging authenticated demo flow has been validated with a dedicated demo account and safe fake request data. API cold starts or transient 30s timeouts may still occur, but the API should not be described as unavailable in current design materials.

Photo upload/Object Storage is implemented historically but remains outside the validated public demo path and should not be treated as a polished product promise until a dedicated storage smoke is completed.

## Validated Demo Flow

The validated product story for design should follow:

1. A visitor understands the sustainable pickup value proposition.
2. The visitor creates or uses a dedicated demo account.
3. The user signs in.
4. The user opens the owner dashboard.
5. The user creates a fake pickup request with item, address, and pickup window data.
6. The user sees the request in the dashboard/list.
7. The user opens request detail.
8. The user sees status and timeline.
9. The user logs out.

## Main UX Problem

The current UI is functional but still feels like a scaffold. It needs a coherent product identity, clearer hierarchy, consistent spacing, better form ergonomics, stronger states, and a small reusable design system before final portfolio presentation.

The goal is not to make a marketing landing page only. The goal is to make the product flow feel credible, calm, and usable from first impression through authenticated tracking.

## Priority Screens

1. Landing page
2. Login
3. Register
4. Owner dashboard / requests list
5. Create pickup request
6. Request detail / tracking timeline
7. Mobile layout for the same flow

Admin screens are not the priority for the next polish slice unless a future task explicitly expands scope.

## Expected Mini Design System Deliverables

The next design output should define:

- page shell and max-width rules
- typography scale
- color tokens
- spacing scale
- button variants
- form field states
- card and panel rules
- status badges
- timeline pattern
- empty/loading/error states
- mobile behavior for key screens

This should be small enough for one implementation pass, but explicit enough to avoid ad hoc styling.

## Core Components Needed

- Primary button
- Secondary button
- Text link
- Form input
- Textarea
- Select
- Checkbox/toggle
- Field label and helper/error text
- Page header
- Section header
- Dashboard list item
- Request summary panel
- Status badge
- Timeline item
- Alert/notice
- Empty state
- Loading state
- Error state

## Desired Visual Direction

EcoPickup should feel:

- sustainable, but not childish
- practical, but not cold
- modern, but not trendy for its own sake
- trustworthy, but not heavy corporate
- service-oriented, not generic SaaS
- clean and calm enough for repeated operational use

The visual language should support a civic/service workflow: request, review, schedule, track, complete.

## What To Avoid

- generic template look
- excessive green-on-green UI
- decorative leaves, blobs, or fake eco illustrations
- oversized marketing hero that hides the actual product
- weak contrast on secondary actions
- rounded-card repetition without hierarchy
- technical/internal copy such as "slice", "bootstrap", or "session state" on public product surfaces
- presenting photo upload as validated before Object Storage/R2 smoke passes

## Suggested Palette Direction

Use a restrained, multi-tone palette:

- neutral foundation: white, slate, soft gray
- sustainable accent: muted green or emerald
- action contrast: dark slate or near-black for primary actions
- support tones: amber for pending/review states, blue for informational states, red/rose for errors

Avoid a monochrome green interface. Green should signal the product category, not dominate every surface.

## UX Language Guidance

Use English-first product language.

Preferred voice:

- clear
- direct
- practical
- service-oriented
- human without being playful

Avoid:

- technical delivery terms
- internal process language
- overpromising automation
- claims about uploads/photos until validated
- vague sustainability claims without tying them to the pickup workflow

## Accessibility And Contrast Expectations

The design must support:

- readable text on mobile and desktop
- visible focus states
- sufficient contrast for primary and secondary actions
- clear error states with text, not color only
- labels for all form fields
- touch-friendly controls
- timeline/status information that does not rely on color alone
- responsive layouts that do not overlap or compress text

## Success Criteria

The design handoff is successful when a future frontend implementation agent can:

- identify the target visual direction without asking for brand clarification
- update the priority screens consistently
- remove the scaffold feel
- preserve the validated demo flow
- improve hierarchy and form usability
- avoid unvalidated storage/photo claims
- implement a small reusable component system instead of one-off styling
- prepare the product for final README, screenshots, and portfolio packaging after polish validation
