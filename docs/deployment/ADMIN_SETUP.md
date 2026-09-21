# Menu V3 — Platform Admin

## Purpose

`/admin` is the private control center for the Menu V3 platform owner. Restaurant owners and tenant members are never granted access to platform leads.

## Access control

The server checks the authenticated Better Auth user against one of these Vercel environment variables:

- `PLATFORM_ADMIN_EMAILS` — comma-separated email addresses.
- `PLATFORM_ADMIN_USER_IDS` — comma-separated Better Auth user IDs.

Use at least one. The check happens server-side on every admin request; hiding the route is not the security boundary.

### Recommended Vercel production setup

Set `PLATFORM_ADMIN_EMAILS` to the exact email used by the platform owner's Menu V3 login, then redeploy. Example format:

```text
PLATFORM_ADMIN_EMAILS=owner@example.com
```

For multiple administrators:

```text
PLATFORM_ADMIN_EMAILS=owner@example.com,operations@example.com
```

Do not put this value in source code or `.env` committed to GitHub.

## Lead lifecycle

`جديد → تم التواصل → مؤهل → تم التحويل`

A lead can also be marked `مغلق / غير مهتم`.

The admin center supports:

- KPI counts by lifecycle state.
- Search by restaurant, city, contact, phone, or email.
- Filtering by lifecycle state.
- Full lead details.
- One-tap phone, WhatsApp, and email actions.
- Internal notes that customers cannot see.
- Status and notes updates with server-side authorization.
- A stable short reference shown to the prospect after submission.

## Deployment

Database migration `0003_leads_admin.sql` is additive and is automatically applied by the existing build migration runner. It does not delete or modify the older public/V2 schema.
