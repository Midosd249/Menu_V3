# 2026-09-29 — Menuun Auth Email Preview Environment — RESEND CONFIGURED

- VERIFIED: The owner configured the existing restricted Resend Sending-access API key as a Vercel project environment variable.
- VERIFIED: The secret value is not present in GitHub, source code, or this document.
- VERIFIED: No DNS, Resend domain, production database, or application data was changed by this continuity action.
- REQUIRED: A fresh Preview deployment is needed because Vercel environment-variable changes apply to a new deployment; the previous Preview deployment was built before this environment change.
- REQUIRED: After the fresh Preview deployment reaches READY, execute safe auth email verification using a dedicated test account only.
- REQUIRED: Do not perform destructive database tests because Preview may share the production Supabase database.
- STATUS: Preview redeploy pending.
