# EcoPickup - PRD

## 1. Product Overview

EcoPickup is a digital platform for scheduling bulky household item pickups in Sweden.

The product is designed to solve a common operational problem: residents often do not know how to dispose of large household items such as furniture, mattresses, or other bulky objects, especially when they do not have a car, do not understand local disposal rules, or need help with logistics.

EcoPickup provides a simple digital workflow:

1. user creates a pickup request
2. uploads photos
3. informs location and pickup preferences
4. admin reviews the request
5. admin provides a quote
6. user pays
7. collection is performed
8. user tracks status until completion

---

## 2. Problem Statement

Residents in Sweden face difficulties when trying to dispose of bulky domestic items because:

- they do not know the correct disposal process
- they lack transportation
- local rules and destinations may be unclear
- there is no clear price expectation
- there is no predictable service workflow for this use case

This is especially relevant for:

- people living in apartments
- foreigners unfamiliar with local systems
- users without cars
- people needing simple and fast logistics support

---

## 3. Product Goal

Create a reliable platform that transforms a fragmented disposal/logistics problem into a structured end-to-end digital workflow with:

- clear request creation
- photo-based triage
- operational quote
- payment flow
- status tracking
- administrative handling

---

## 4. Target Audience

### Primary audience

- residents in Sweden
- apartment residents
- people without a car
- users needing help with removal of bulky household items

### Secondary audience

- foreigners and immigrants
- users who need multilingual UX
- users who want predictable service and transparent pricing

---

## 5. MVP Scope

The MVP must validate the operational core of the product.

### Included in MVP

- user registration and login
- create pickup request
- upload item photos
- provide address
- choose pickup time window
- admin review of request
- admin approval/rejection
- admin quote definition
- payment flow
- status tracking
- admin status updates
- destination/disposal registration

### Out of scope for MVP

- marketplace between multiple collection companies
- route optimization engine
- advanced automated pricing
- AI item recognition
- in-app chat
- driver mobile app
- multi-provider dispatching
- full analytics dashboards
- advanced notification engine

---

## 6. User Journey

### User flow

1. user signs up or logs in
2. user creates a new pickup request
3. user uploads photos of the item(s)
4. user provides item description
5. user enters pickup address
6. user selects preferred pickup window
7. request is submitted
8. admin reviews request
9. admin approves, rejects, or adjusts quote
10. user receives quote
11. user pays
12. request moves to scheduling/collection
13. user tracks request status
14. collection is completed
15. final status is shown as completed

### Admin flow

1. admin accesses request list
2. admin opens request details
3. admin reviews photos, description, address, and logistics factors
4. admin approves or rejects
5. admin defines pricing
6. admin confirms scheduling
7. admin updates operational statuses
8. admin records destination/disposal outcome
9. request is completed

---

## 7. Core MVP Features

### User-facing

- authentication
- request creation
- image upload
- address submission
- pickup window selection
- quote viewing
- payment
- status tracking

### Admin-facing

- request listing
- request detail view
- approval/rejection
- price adjustment
- final scheduling
- status updates
- disposal/destination record

---

## 8. Business Value

EcoPickup creates value by:

- simplifying disposal logistics
- reducing friction in a real-life local problem
- providing convenience
- improving predictability around price and service
- serving residents who may otherwise abandon the process

From a product and portfolio perspective, the project also demonstrates:

- real operational workflow
- admin panel design
- business rules
- payment integration
- media upload flow
- lifecycle state management

---

## 9. Success Criteria for MVP

The MVP will be considered successful if it demonstrates that:

- a user can create a request from start to submission
- an admin can review and quote the request
- the user can pay successfully
- request status can be tracked end-to-end
- the request can reach a completed state with operational traceability

---

## 10. Main Entities

- User
- Address
- PickupRequest
- PickupItem
- ItemPhoto
- Payment
- StatusHistory
- DisposalRecord

---

## 11. Request Status Lifecycle

Planned main statuses:

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

---

## 12. Pricing Direction for MVP

Initial pricing should be operational and simple.

Base idea:

- base fee
- adjustment by item size
- adjustment by stairs when there is no elevator
- distance adjustment
- final total

The system should preserve a pricing breakdown for transparency and admin visibility.

---

## 13. Risks and Constraints

### Risks

- operational pricing may be harder than expected
- disposal rules may vary by municipality
- image quality may be insufficient for quote accuracy
- logistics window expectations may differ from actual operations
- payment integration may add complexity early

### Constraints

- MVP must stay operationally simple
- implementation should prioritize end-to-end flow over breadth
- technical foundation must be stable before features
- the first version should focus on one clear operating model

---

## 14. Product Positioning

EcoPickup is not just a demo app.
It is intended to be:

- a strong portfolio case
- a real product foundation
- a startup-capable concept
- a practical example of solving a local European problem through software
