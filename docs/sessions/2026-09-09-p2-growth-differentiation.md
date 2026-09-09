# Menu V3 — P2 Growth & Differentiation

**Date:** 2026-09-09  
**Branch:** `codex/p2-growth-differentiation`  
**Base:** `846c6894d454307672192fdb033e5c91932216ad`  
**Scope:** implement the supported P2 growth/differentiation layer without reopening protected themes or introducing unsupported backend claims.

## Completed

### 1. Deeper local visibility workflow

Added a data-backed **Local Visibility / Restaurant Presence Readiness** section to Owner Analytics. It checks only fields already present in the verified Menu V3 data model:

- restaurant name;
- city;
- active branch address;
- branch phone;
- maps link;
- WhatsApp;
- Instagram;
- logo/cover imagery.

The result is a readiness score and explicit missing-field priorities. It does not claim Google ranking, indexing, search position, reviews, or external directory status.

### 2. Advanced analytics storytelling

Expanded the existing analytics experience with a **Data Story** layer that turns the existing OwnerAnalytics event stream into readable operational signals:

- browse depth;
- leading product;
- leading category;
- existing growth opportunity/funnel interpretation.

No new analytics event source was introduced. Existing server-reported analytics remains the authority.

### 3. Experimentation framework foundation

Added a hypothesis-led experimentation board based on the current measured opportunity. Each recommendation defines:

- hypothesis;
- primary metric;
- decision rule.

The UI explicitly avoids claiming statistical significance or fabricated results. It is a lightweight decision framework, not a false promise of an experimentation backend.

## Intentionally not implemented

The following P2 items require capabilities not proven by the current repository contract and therefore were not invented:

- advanced personalization with user-level identity/segmentation;
- a new restaurant website engine;
- additional third-party integrations.

They remain future candidates only after backend/data support and demand are validated.

## Protected

No changes were made to:

- Essential;
- Editorial;
- Noir;
- Heritage / Taste;
- Gallery;
- ThemeRenderer;
- Cart;
- Quick Add;
- Item Notes;
- authentication/authorization;
- tenant/branch isolation;
- database migrations.

## Verification

- Added `tests/p2-growth-differentiation.test.mjs` to protect the P2 analytics, visibility, and experimentation contracts.
- GitHub Actions execution is the required full typecheck/lint/test/build verification path because local shell/npm execution is not available through the current connector environment.
- No production deployment was requested or performed.

## Status

**IMPLEMENTATION_COMPLETE_FOR_SUPPORTED_P2_SCOPE**

Remaining P2 items are explicitly `PROPOSED/UNKNOWN` where the current architecture does not yet prove sufficient support.
