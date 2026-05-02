# EcoPickup - Item Photo Reference

## 1. Objective

This document records the initial reference photo set for `PickupItem` image capture in the MVP.

The goal is to support EPIC-009B with:

- a concrete example for `furniture`
- expected angles for operational review
- a Stitch-backed reference set already added to the repository

---

## 2. User Flow Context

Expected user flow for item photos:

1. user creates the pickup request
2. user provides the address
3. user adds one or more items
4. user uploads from `1` to `5` photos for each item
5. backend validates type, size and ownership
6. backend stores the file in private storage
7. backend stores metadata in the database
8. user finalizes the request
9. admin reviews request, items and photos

---

## 3. API Flow Reference

### Create request

`POST /api/v1/pickup-requests`

```json
{
  "address": {
    "street": "Exempelgatan 10",
    "city": "Stockholm",
    "postalCode": "11355",
    "floor": 3,
    "hasElevator": false
  },
  "items": [
    {
      "category": "furniture",
      "description": "3-seat gray sofa",
      "estimatedSize": "large"
    }
  ]
}
```

Expected response example:

- `pickupRequestId: req_123`
- `pickupItemId: item_001`

### Upload one photo per call

`POST /api/v1/pickup-items/{pickupItemId}/photos`

`Content-Type: multipart/form-data`

Example file:

- `file: sofa-front.jpg`

### Storage key examples

```txt
pickup-requests/req_123/items/item_001/photos/photo_001.jpg
pickup-requests/req_123/items/item_001/photos/photo_002.jpg
pickup-requests/req_123/items/item_001/photos/photo_003.jpg
```

---

## 4. Example Item

Reference item:

- `category: furniture`
- `description: 3-seat gray sofa`
- `estimatedSize: large`

Ideal photo set for this item:

1. full sofa from the front
2. sofa from the side
3. general condition, stains or damage
4. armrest or lower base detail
5. sofa in the room for pickup access context

---

## 5. Stitch Project Reference

Source Stitch project:

- title: `eco-pick sofa`
- project id: `3498333156740111945`

Important note:

- the reviewed Stitch screens expose screenshot download URLs
- `htmlCode` is currently empty for all five screens
- for this project, Stitch is acting as an image-reference source, not as a code-export source

---

## 6. Reviewed Screens

### Screen 1

- screen id: `b3fde981483a4e8c9e8bda8eaed632d2`
- local asset: `docs/assets/stitch/eco-pick-sofa/sofa-front.png`
- intended use: full front sofa photo
- assessment: `MATCH`

Why it matches:

- full front view is clear
- the sofa reads as a 3-seat gray fabric sofa
- natural window light is visible
- apartment looks neutral and realistic
- no people or watermark
- good enough for first-pass logistics evaluation

### Screen 2

- screen id: `2c458ba3db4541dfa28ecdb292f66e64`
- local asset: `docs/assets/stitch/eco-pick-sofa/sofa-arm-base.png`
- intended use: armrest and lower base detail
- assessment: `MATCH`

Why it matches:

- armrest and lower base are both visible
- floor is visible
- there are realistic signs of normal wear
- helps evaluate structure and condition

### Screen 3

- screen id: `80907598684c4b139d4fd50084e54874`
- local asset: `docs/assets/stitch/eco-pick-sofa/sofa-side.png`
- intended use: side angle and depth/profile
- assessment: `MATCH`

Why it matches:

- side perspective is clear
- seat depth and arm profile are visible
- the environment remains neutral and realistic
- natural lighting and no people are preserved

### Screen 4

- screen id: `e899ecb229554e4a9acf3f4b83166881`
- local asset: `docs/assets/stitch/eco-pick-sofa/sofa-wide-room.png`
- intended use: room context and pickup access
- assessment: `MATCH WITH MINOR RESERVATION`

Why it mostly matches:

- surrounding room and access path are visible
- pickup context is much clearer than in the other images
- door opening and circulation area help operational review

Reservation:

- this image is slightly more staged than a typical user phone photo
- it is still a strong reference for the kind of framing we want

### Screen 5

- screen id: `61a0658f44dd4084bc1c12633661a714`
- local asset: `docs/assets/stitch/eco-pick-sofa/sofa-upholstery.png`
- intended use: upholstery and seat cushion close-up
- assessment: `PARTIAL MATCH`

Why it is only partial:

- fabric texture is strong and realistic
- natural light and non-studio look are correct
- the framing shows upholstery detail well

Gap:

- signs of normal use are too subtle
- for production guidance, a better reference would include mild pilling, light discoloration or a more obvious wear point

---

## 7. Practical Guidance for EPIC-009B

This sample set is good enough to define the first review rubric for sofa uploads:

- require at least one wide framing of the full item
- encourage one side/profile image for bulky furniture
- encourage one damage or wear detail image
- encourage one structural image of arm, legs or base
- encourage one environment image for pickup access context

For the MVP, the backend should not hardcode category-specific photo enforcement yet.

Recommended first approach:

- enforce `1..5` photos per `PickupItem`
- keep item-specific guidance in product copy and admin review rules
- evolve into category-specific required angles later if operations really need it

---

## 8. Conclusion

The Stitch set is a good reference for the sofa example and aligns well with the intended bulky-item collection workflow.

Current fit summary:

- `4/5` images are strong matches
- `1/5` image is usable but should later be replaced with a wear detail that shows more obvious normal use

---

## 9. Appliance Example - Refrigerator

Reference item:

- `category: appliance`
- `description: white refrigerator, medium size`
- `estimatedSize: large`

Ideal photo set for this item:

1. refrigerator full front view
2. side view
3. back side or cable detail
4. interior with the door open
5. wear detail such as dent, scratches or rust

What these photos help operations decide:

- approximate weight
- whether two people are needed
- pickup difficulty
- item condition
- whether the item can pass through doors or elevator

Example metadata:

```json
{
  "id": "photo_101",
  "pickupItemId": "item_002",
  "storageKey": "pickup-requests/req_124/items/item_002/photos/photo_101.jpg",
  "originalFileName": "fridge-front.jpg",
  "contentType": "image/jpeg",
  "sizeBytes": 2845120,
  "createdUtc": "2026-04-05T14:20:00Z"
}
```

---

## 10. Stitch Project Reference - Refrigerator

Source Stitch project:

- title: `eco-picket geladeira`
- project id: `18294264256860613394`

Important note:

- the reviewed Stitch screens expose screenshot download URLs
- `htmlCode` is currently empty for all five screens in this project as well
- for this project, Stitch is again acting as an image-reference source, not as a code-export source

---

## 11. Reviewed Screens - Refrigerator

### Screen 1

- screen id: `8607f17d2b234f05928e72f57cc036ce`
- local asset: `docs/assets/stitch/eco-pick-fridge/fridge-front.png`
- intended use: refrigerator full front view
- assessment: `MATCH`

Why it matches:

- full front view is clear
- medium-to-large household scale is believable
- neutral Scandinavian kitchen context is visible
- practical documentary framing is preserved

### Screen 2

- screen id: `dddd1e49208147bf92f52ab64d8a80ae`
- local asset: `docs/assets/stitch/eco-pick-fridge/fridge-interior.png`
- intended use: interior with door open
- assessment: `MATCH`

Why it matches:

- open door, shelves and compartments are visible
- it reads as a used but functional household refrigerator
- the framing is useful for hygiene and internal-capacity review

### Screen 3

- screen id: `14cc4e4360284fffa5dabff23475eab0`
- local asset: `docs/assets/stitch/eco-pick-fridge/fridge-back.png`
- intended use: rear detail with cable and compressor
- assessment: `MATCH`

Why it matches:

- compressor area is visible
- power cable is visible
- appliance depth is legible
- this is strong practical evidence for pickup evaluation

### Screen 4

- screen id: `6ee6b6456da34abe9e4945d01a82da6d`
- local asset: `docs/assets/stitch/eco-pick-fridge/fridge-side.png`
- intended use: side angle and placement
- assessment: `MATCH`

Why it matches:

- side profile and depth are clear
- the utility-area context helps estimate removal difficulty
- nearby space gives clues about maneuvering constraints

### Screen 5

- screen id: `53d3f20b01ed4dadbed15dbfd7604e7a`
- local asset: `docs/assets/stitch/eco-pick-fridge/fridge-wear.png`
- intended use: damage or wear detail
- assessment: `MATCH`

Why it matches:

- scratches are visible
- a dent is visible
- small rust marks are visible
- the image is directly useful for condition review

---

## 12. Practical Guidance for Appliance Uploads

This refrigerator set is strong enough to guide the first appliance review rubric:

- require one full front image
- encourage one side image to show depth
- encourage one rear image with cable/compressor area for heavy appliances
- encourage one open-door image when relevant to the category
- encourage one condition-detail image when damage or rust exists

For the MVP, the backend should still avoid category-specific hard validation.

Recommended first approach:

- enforce `1..5` photos per `PickupItem`
- expose category-aware guidance in the UI copy
- use admin review to evaluate whether the image set is operationally sufficient

---

## 13. Overall Conclusion

The Stitch sets for sofa and refrigerator are both useful operational references for EPIC-009B.

Current fit summary:

- sofa set: `4/5` strong matches and `1/5` partial match
- refrigerator set: `5/5` strong matches

---

## 14. Furniture Example - Dining Table

Reference item:

- `category: furniture`
- `description: wood dining table for 6 people`
- `estimatedSize: medium`

Ideal photo set for this item:

1. full table
2. tabletop from above
3. legs and lower structure
4. scratches or damage detail
5. table in the room for space context

What the admin can evaluate:

- size
- whether disassembly is needed
- transport difficulty
- actual volume
- item condition

Frontend UX target for each item:

1. user adds category, description and estimated size
2. interface shows `Add photos for this item`
3. user uploads `1..5` photos with immediate preview
4. system shows upload status: `sent`, `validating`, `saved`
5. request detail shows item, description, size and photo thumbnails

---

## 15. Stitch Project Reference - Dining Table

Source Stitch project:

- title: `eco-pick mesa`
- project id: `6034308540471859595`

Important note:

- the reviewed Stitch screens expose screenshot download URLs
- `htmlCode` is currently empty for all five screens in this project too
- for this project, Stitch is again acting as an image-reference source, not as a code-export source

---

## 16. Reviewed Screens - Dining Table

### Screen 1

- screen id: `4e9c55b9fda2424a8b257067595190a5`
- local asset: `docs/assets/stitch/eco-pick-table/table-full.png`
- intended use: full table
- assessment: `MATCH`

Why it matches:

- the full table is visible
- capacity for `4-6` people is believable
- the room context is realistic enough for pickup evaluation
- natural light and Scandinavian interior cues are present

### Screen 2

- screen id: `c14d2b90f26740a89f95994c8fc8e803`
- local asset: `docs/assets/stitch/eco-pick-table/table-top.png`
- intended use: tabletop from above
- assessment: `MATCH`

Why it matches:

- the top surface is clearly visible
- oak grain reads well
- faint scratches and light signs of use are visible
- useful for condition assessment

### Screen 3

- screen id: `ac32d9bc0ab74424b05649e6dbdf3c51`
- local asset: `docs/assets/stitch/eco-pick-table/table-damage.png`
- intended use: scratch or damage detail
- assessment: `MATCH`

Why it matches:

- scratch detail is visible
- worn edge is visible
- this is directly useful for condition review

### Screen 4

- screen id: `d1296beba90547a49f141568c6626a2f`
- local asset: `docs/assets/stitch/eco-pick-table/table-room.png`
- intended use: room context and access
- assessment: `PARTIAL MATCH`

Why it is only partial:

- the surrounding room, chairs and doorway are visible
- pickup context and access path can still be inferred

Gap:

- the circular vignette makes the image less documentary and less like a normal phone photo
- the framing is still usable as a reference, but not ideal for production guidance

Replacement reviewed later:

- replacement screen id: `f5de0133b07241e0bbfb65097841dad9`
- replacement local asset: `docs/assets/stitch/eco-pick-table/table-room-v2.png`
- replacement assessment: `MATCH`

Why the replacement matches:

- no circular vignette or stylized exposure remains
- room context, chairs and circulation space are clear
- the image is now suitable as documentary guidance for pickup accessibility

### Screen 5

- screen id: `649b14b2111b4b328090910b933fcedd`
- local asset: `docs/assets/stitch/eco-pick-table/table-legs.png`
- intended use: legs and lower structure
- assessment: `PARTIAL MATCH`

Why it is only partial:

- joints and fastening hardware are visible
- this helps evaluate whether disassembly may be needed

Gap:

- a fingertip appears at the lower-left edge
- for production guidance, a cleaner structural image without any person fragment would be better

Replacement reviewed later:

- replacement screen id: `1b4a9766215249e582860a64911c5afc`
- replacement local asset: `docs/assets/stitch/eco-pick-table/table-legs-v2.png`
- replacement assessment: `MATCH`

Why the replacement matches:

- joints and attachment points remain clear
- no fingers, hands or body parts are visible
- the image is now strong enough for disassembly assessment

---

## 17. Practical Guidance for Table Uploads

This table set is still good enough to guide the first furniture review rubric:

- require one full-item image
- encourage one top-surface image for tabletop furniture
- encourage one structural image of legs or joints
- encourage one damage-detail image when wear exists
- encourage one room-context image for access and maneuvering

For the MVP, the backend should still avoid category-specific hard validation.

Recommended first approach:

- enforce `1..5` photos per `PickupItem`
- expose table-specific capture guidance in frontend copy
- let admin review determine whether the image set is sufficient for operational handling

---

## 18. Final Summary

The current Stitch reference coverage for EPIC-009B is now:

- sofa set: `4/5` strong matches and `1/5` partial match
- refrigerator set: `5/5` strong matches
- dining table set: `5/5` strong matches after the two regenerated replacements

Current overall conclusion:

- refrigerator remains the strongest original set
- sofa is still good, with one weaker wear-detail image
- dining table is now fully usable after the two regenerated replacements fixed the earlier artifacts
