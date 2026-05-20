# EcoPickup - Current UI Handoff

## Purpose

This document describes the current UI state before any polish implementation. It should help a designer or future frontend implementation agent understand what to review, what to improve, and what must remain stable.

## Current Screens To Review

### Landing Page

Review:

- first impression
- product value proposition
- call-to-action hierarchy
- session summary area
- service explanation cards
- public language quality
- mobile layout

Current concern: the page works as a product entry point, but still has a generic card-heavy composition and includes technical wording such as `Session state`.

### Login

Review:

- form layout
- field hierarchy
- error and loading states
- relationship to register
- mobile usability
- visual consistency with landing

Current concern: the form is functional but basic and visually close to a scaffold form.

### Register

Review:

- account creation clarity
- field states
- success transition to login
- visual consistency with login

Current concern: the register flow works, but the UI needs stronger product framing and state handling.

### Dashboard / Requests

Review:

- empty state
- request list hierarchy
- status visibility
- primary action to create a request
- density and scanability
- mobile behavior

Current concern: the dashboard is functional but needs clearer information architecture and stronger status/list design.

### Create Pickup Request

Review:

- form grouping
- labels and helper text
- item section pattern
- pickup window controls
- address fields
- draft vs submit actions
- validation/error states
- mobile ergonomics

Current concern: the form is complete but visually basic, with limited hierarchy and internal wording around photos being outside a slice.

### Request Detail / Tracking Timeline

Review:

- current status hierarchy
- request summary
- timeline readability
- metadata grouping
- owner actions
- draft/submitted states
- mobile layout

Current concern: the tracking surface is functional and validated, but it needs a more polished status/timeline pattern and clearer relationship between request data and lifecycle events.

### Mobile Layout

Review the full path:

- landing
- auth
- dashboard
- create request
- tracking/detail

Current concern: mobile needs specific spacing, text wrapping, button stacking, and timeline handling. Do not assume desktop card layout will translate cleanly.

## Current Visual Issues

| Issue | Impact |
| --- | --- |
| Generic scaffold feel | The product looks implemented but not yet portfolio-polished. |
| Weak hierarchy | Important actions and states do not always dominate the page. |
| Inconsistent spacing | Repeated surfaces feel similar but not systematically composed. |
| Basic form presentation | Forms work, but grouping, helper text, and states need refinement. |
| Unclear states | Empty, loading, error, draft, submitted, and timeline states need clearer visual language. |
| Disabled/secondary button contrast | Secondary actions may not feel sufficiently distinct or accessible. |
| Technical/internal wording | Public surfaces should avoid terms such as `Session state`, `slice`, or implementation-oriented explanations. |
| Possible UTC/date display issue | Date and time values should be reviewed for user-friendly local display and timezone clarity. |
| Lack of component system | Styling is repeated locally rather than guided by a mini design system. |

## Screenshots Checklist For Later Collection

Do not add screenshot files in this slice. Later collection should include:

- `01-landing-desktop.png`
- `02-landing-mobile.png`
- `03-login.png`
- `04-register.png`
- `05-dashboard-empty-or-demo.png`
- `06-create-request-form.png`
- `07-create-request-filled.png`
- `08-request-detail-tracking.png`
- `09-request-timeline-mobile.png`
- `10-logout-or-session-state.png`

Screenshots should be captured only after UI polish or as explicit current-state evidence in a separately approved task.

## What The Designer Should Not Change Yet

Do not change:

- core flow order
- backend contracts
- authentication behavior
- request creation semantics
- draft vs submit behavior
- tracking/timeline data model
- storage/photo promises
- admin flow scope
- payment/pricing claims

Do not introduce:

- new product features
- photo upload as a polished public promise
- real payment UI claims beyond the validated scope
- new routes or information architecture that require backend changes

## How Future UI Polish Tasks Will Use This Handoff

Future UI polish tasks should use this handoff to:

- prioritize the owner demo flow
- create or implement the mini design system
- remove technical/internal language from public surfaces
- improve visual hierarchy and component consistency
- make forms and timelines feel production-ready
- prepare for final screenshots and README packaging

The first implementation pass should be narrow: landing, auth, dashboard, create request, and tracking/detail. Broader admin or storage presentation should wait for dedicated slices.
