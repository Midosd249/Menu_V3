# Import & Notification Engineering Lessons — 2026-09-11

## Lessons learned

### 1. AI review notes must not be confused with blocking validation errors
The onboarding UI previously treated every issue as a reason not to save. This creates a false 100%-or-nothing workflow. Structural requirements should block persistence; advisory AI review notes should remain visible and reviewable without blocking a useful partial import.

### 2. Import recovery should preserve owner control
The correct flow is: ingest → draft → review → save ready rows → explicitly skip incomplete rows → continue refinement in Menu Intelligence. AI must remain review-first and must not silently publish or mutate sensitive menu content.

### 3. Provider names are implementation details
Owner-facing UI should describe capabilities and steps, not expose model/provider names, API keys, or backend implementation details.

### 4. Transient AI failures need bounded retry
A single automatic retry is appropriate for the observed intermittent extraction/draft failure. Retry remains bounded to one extra request; persistent failures still surface to the owner.

### 5. RTL popup alignment needs viewport-level reasoning
For notification popovers, `end-0` can place a wide popup outside the viewport in RTL because logical end maps to the left edge. Mobile uses fixed viewport-safe bounds; larger layouts use logical `start-0` when aligning to the triggering control.

## Protected boundaries
- No changes to auth, RLS, tenant isolation, pricing, orders, or database schema.
- AI remains schema-validated and review-first.
- Vercel release remains separate from implementation verification.
