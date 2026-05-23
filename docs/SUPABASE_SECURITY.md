# Supabase Security Audit (2026-03-21)

## Critical fixes applied

| Issue | Risk | Fix |
|-------|------|-----|
| `send-email` accepted arbitrary `to` / `from` | Email abuse, spam relay | Server-only `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`; structured contact fields; HTML escaped |
| `create-payment-intent` had no auth | Unauthorized PaymentIntents | JWT required; amount clamped $0.50–$10,000 |
| Orders RLS `USING (true)` for admins | Any logged-in user could read all orders | `is_admin()` checks `app_metadata.role = 'admin'` |
| `weekly_menu` admin policy `USING (true)` | Any user could edit published menu | Admin-only via `is_admin()` |
| Hardcoded admin email in About | Inconsistent access control | Uses `useAuth().isAdmin` + shared `lib/admin.js` |
| `app_settings` per-user | Global meal-prep toggle broken | Single `global` row; public read, admin update |
| Gallery storage (when enabled) | Open upload/delete | Storage policies: public read, admin write/delete |
| Contact form HTML injection | XSS in admin inbox | Edge function escapes all fields |

## Required setup (production)

### 1. Run migrations

Applied on remote project `yzyeyrphjkqmjuoyyooc` via migration `security_hardening_and_site_settings`.

Local files for reference:

1. `supabase/migrations/menu_items_table.sql`
2. `supabase/migrations/recipes_table.sql`
3. `supabase/migrations/20260321120000_security_rls_and_schema.sql` (uses `site_settings` for global meal-prep toggle)

### 2. Promote admin users

For each admin, in **Authentication → Users → user → Raw App Meta Data**:

```json
{ "role": "admin" }
```

`VITE_ADMIN_EMAILS` controls UI access only until metadata is set. **RLS uses `app_metadata.role` only.**

### 3. Edge function secrets

| Secret | Used by |
|--------|---------|
| `RESEND_API_KEY` | send-email |
| `CONTACT_TO_EMAIL` | send-email (default: humblechefbrian@gmail.com) |
| `CONTACT_FROM_EMAIL` | send-email (verified Resend domain) |
| `STRIPE_SECRET_KEY` | create-payment-intent |

Deploy functions:

```bash
supabase functions deploy send-email
supabase functions deploy create-payment-intent
```

### 4. Storage (when gallery is enabled)

Create public bucket `gallery-uploads`. Policies are applied by migration.

### 5. Enable Realtime (optional)

For live meal-prep toggle: Database → Replication → enable `app_settings`.

## Client env vars

See `.env.example`. Never commit `.env.local` or service role keys.

## Remaining recommendations

- Require sign-in before checkout (`create-payment-intent` already enforces JWT).
- Add rate limiting on `send-email` (Supabase rate limits or Cloudflare).
- Set short JWT expiry for sensitive admin actions.
- Periodic: Supabase Dashboard → Database → Advisors (security lints).
