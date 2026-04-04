# AGENTS.md - EcoPickup

## Purpose

This file defines how agents must operate in the EcoPickup repository.

The project follows the **Protocolo Rick** from the beginning.
Agents must respect execution phases, required artifacts, backlog discipline, and validation rules.

---

# 1. Core Operating Rule

Do not start implementing features before the minimum artifacts of the current phase exist.

No phase advances without the minimum outputs of the previous phase.

---

# 2. Official Execution Flow

The project must follow this delivery pipeline:

1. Discovery
2. Planning
3. Development
4. Testing
5. Deploy

---

# 3. Phase Responsibilities

## Discovery

Main role:
- PM

Expected output:
- problem definition
- clear objective
- initial scope
- constraints and risks

## Planning

Main roles:
- PM
- TL
- SM

Expected output:
- broken backlog
- priorities
- acceptance criteria
- mapped dependencies
- initial architecture direction

## Development

Main roles:
- TL
- DEV

Expected output:
- implementation completed
- documentation updated
- lint/typecheck/build validated
- prisma generate before commit when applicable

## Testing

Main roles:
- QA
- TL
- DEV

Expected output:
- test evidence
- acceptance criteria validated
- critical bugs fixed

## Deploy

Main roles:
- INFRA
- TL

Expected output:
- reviewed configuration
- release performed
- smoke test
- initial observability
- rollback plan

---

# 4. Rules for Agents

## 4.1. Always identify the current phase

Before doing any work, determine whether the task belongs to:
- Discovery
- Planning
- Development
- Testing
- Deploy

## 4.2. Always validate previous artifacts

Do not proceed if the required artifacts of the previous phase are missing.

## 4.3. Backlog source of truth

Use:
`docs/ops/backlog.md`

Never use `status.md` as source of truth.

## 4.4. Documentation is mandatory

If implementation changes architecture, rules, behavior, or operations:
- update documentation in the same delivery

## 4.5. Never hide pending work

If something is incomplete:
- register it
- classify it
- do not present it as done

## 4.6. Criteria before DONE

A task can only be marked `DONE` when:
- scope is delivered
- acceptance criteria are validated
- documentation is updated
- required validations have passed

## 4.7. Quality gates

Before concluding development work, validate:
- lint
- typecheck
- build
- tests when applicable

## 4.8. Prisma rule

If Prisma is used in the project later:
- run `prisma generate` before commits affecting schema/client/contracts

## 4.9. Commit discipline

Do not commit impulsively.

Before any commit:

- validate the exact scope delivered
- ensure the work is in DONE state for that slice
- run required install/restore steps
- run lint, typecheck, and build
- run tests when applicable
- update impacted documentation
- use English commit messages only
- use Conventional Commits

Agents must never:

- commit broken work
- mix unrelated changes in the same commit
- mark incomplete work as finished

---

# 5. Agent Roles

## Orchestrator

Responsible for:
- reading context
- identifying phase
- validating minimum artifacts
- breaking work into steps
- delegating to subagents
- reviewing outputs
- consolidating next step

The orchestrator must not jump directly into coding.

## Specialist Subagents

Possible domains:
- architecture
- backend
- frontend
- database
- QA
- infra
- documentation

Each subagent must:
- stay within scope
- return objective output
- expose risks and dependencies
- not expand scope without justification

---

# 6. Required Output Format for Orchestration

Whenever analyzing a new task, the orchestrator should structure the response as:

## Current Phase

[discovery | planning | development | testing | deploy]

## Diagnosis

- what is already defined
- what is missing
- risks
- constraints
- dependencies

## Recommended Execution

- execution order
- smallest safe slice
- blocked items if any

## Suggested Delegation

- which subagent should act
- expected output

## Required Validation

- docs
- acceptance criteria
- lint
- typecheck
- build
- tests
- prisma generate when applicable

## Exact Next Step

- one clear action to execute now

---

# 7. Backlog Rules

Every backlog item must contain:
- ID
- title
- objective
- scope
- acceptance criteria
- dependencies
- status

Allowed statuses:
- READY
- IN_PROGRESS
- BLOCKED
- DONE

---

# 8. Definition of Done

A task is only DONE when:
- implementation is functional
- agreed scope was delivered
- acceptance criteria were validated
- technical validations passed
- impacted documentation was updated
- remaining risks were recorded

---

# 9. Recommended Project Docs

```txt
docs/
  product/
    prd.md
    business-rules.md
  architecture/
    system-design.md
    api-standards.md
  rules/
    protocolo-rick.md
    security.md
    testing.md
  ops/
    backlog.md
    status.md
```

---

# 10. Operational Discipline

Do not:

- skip phases
- improvise architecture without documentation
- mark incomplete work as done
- treat summary as source of truth
- start features before foundation
- commit broken or incomplete work

Do:

- work in controlled slices
- keep backlog updated
- keep docs aligned
- make dependencies explicit
- validate before concluding
- commit only after the slice is validated and complete

---

# 11. Current Repository Instruction

EcoPickup is still in its initial governance and planning stage.

At this moment, the correct priority is:

- establish documentation
- establish backlog
- define architecture foundation
- define monorepo foundation
- only then begin technical implementation
