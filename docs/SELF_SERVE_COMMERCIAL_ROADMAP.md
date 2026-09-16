# Menu V3 — Self-Serve Commercial Roadmap

Status: IN_PROGRESS

## 1. Customer journey — approved direction

```text
Landing page
  ↓
Start free
  ↓
Create account
  - Full name
  - Email
  - Phone
  - Password
  - Confirm password
  - No SMS OTP at signup
  ↓
Create brand
  - Brand name (required)
  - English name (optional)
  - Business type (required)
  - Short description (optional)
  - Logo optional / can be completed later in Studio
  ↓
Studio
  ↓
Choose menu creation path
  - Start from scratch
  - Import existing menu
  - Get AI help
  ↓
Build and complete menu
  ↓
Email verification before public publishing
```

## 2. Commercial packaging — approved direction

### Free — 0 SAR/month
- 1 branch
- 15 products
- 1 team member
- Arabic
- Basic QR/public link
- Basic analytics
- Very limited AI
- No WhatsApp
- No advanced Intelligence/Growth/CRM/Campaigns/Experiments
- Menu V3 branding

### Growth — 49 SAR/month
- 3 branches
- 300 products
- Up to 10 team members
- Arabic + English
- WhatsApp
- Advanced analytics
- Expanded AI
- Menu Intelligence
- Owner Intelligence
- Growth workspace and recommendations
- CRM/feedback/retention capabilities within implemented scope
- Campaign/Loyalty capabilities within implemented scope
- Remove Menu V3 branding

### Pro — 149 SAR/month
- 10 branches
- Unlimited products
- Up to 25 team members
- Arabic + English
- WhatsApp
- Advanced analytics and cross-branch view
- Higher AI allowance
- Advanced Intelligence/Growth
- Advanced CRM/retention/campaign capabilities
- Experiments and evidence review within implemented scope
- Priority support positioning only when operationally supported

## 3. Annual pricing — approved direction

- Growth: 490 SAR/year — two months free versus monthly billing.
- Pro: 1,490 SAR/year — two months free versus monthly billing.
- Annual savings are shown explicitly; monthly billing remains available.

## 4. Paid-plan trial — approved direction

- Growth and Pro receive a clearly disclosed 14-day trial.
- No credit card is required to start the trial.
- The initial flow must not claim automatic charging without a real payment method/subscription billing integration.
- At trial end, the owner chooses whether to continue.
- Tenant data is retained when a paid trial/subscription ends; access and publication limits are enforced according to the active entitlement state.

## 5. Implementation sequence

1. Self-serve registration and account capture — IN PROGRESS / current task.
2. Brand setup and Studio handoff — included in the current registration journey.
3. Menu creation choice: scratch/import/AI.
4. Free entitlement presentation and server-side enforcement alignment.
5. Pricing page and plan comparison: 0 / 49 / 149 + annual billing.
6. 14-day Growth/Pro trial lifecycle.
7. Billing/payment integration only after a real supported payment provider is selected and verified.
8. Upgrade/downgrade/expiry UX and retention behavior.
9. Full commercial QA: auth, tenant isolation, entitlement limits, RTL/LTR, mobile, trial expiry, and publication rules.

## Evidence labels

- VERIFIED: current repository already has Better Auth email/password, tenant creation, subscription/entitlement infrastructure, and Studio routes.
- PROPOSED: feature packaging and pricing beyond the currently enforced subscription catalog until the implementation milestone is completed.
- UNKNOWN: production payment-provider configuration and production billing capability.
- BLOCKED: automatic paid-plan charging cannot be claimed until a real payment integration exists.
