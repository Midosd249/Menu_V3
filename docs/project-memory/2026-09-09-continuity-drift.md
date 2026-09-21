# Project Memory — Continuity Drift Lesson

**Date:** 2026-09-09  
**Problem:** continuity/task ledgers lagged behind verified implementation and Production state.

## Symptoms
- `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md` referenced older main heads and older Vercel deployment commits.
- P2 Growth & Differentiation was already implemented, quality-gated, and deployed while older task records could make a future session believe it was unfinished.

## Root Cause
- **INFERRED:** implementation, CI, deployment, and documentation were updated at different times, allowing continuity files to become stale.

## Working Solution
- Reconcile current Git head first.
- Confirm relevant CI evidence.
- Confirm Production separately through direct Vercel evidence when deployment matters.
- Inspect live Supabase when security/data state matters.
- Only then update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`.
- Maintain one exact active task and one exact next task.
- Keep completed implementation explicitly protected.
- Maintain `docs/project-continuity-master-plan.md` as the durable handoff plan.

## Anti-patterns
- Do not restart a milestone because an old continuity file still lists it.
- Do not treat chat memory as current repository state.
- Do not treat CI as deployment evidence.
- Do not turn `UNKNOWN` device/accessibility gaps into implementation defects without observation.

## Detection Checklist
1. What is the current `main` SHA?
2. What did the latest relevant commits actually implement?
3. Does CI pass for the relevant head?
4. What commit is actually serving Production?
5. Does live backend state match the canonical project/schema?
6. Do task ledgers agree with those facts?
7. If not, reconcile documentation before starting new implementation.

## Reusable Rule
**Continuity is a reconciled record of evidence, not a source of truth.**
