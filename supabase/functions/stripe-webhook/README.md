# Stripe Webhook Handler

Server-side payment verification for Stripe payments.

## Setup Required

### 1. Add Webhook Secret to Supabase

In your Supabase project, add the webhook secret to Edge Functions Secrets:

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET="whsec_..."
```

Get your webhook secret from Stripe:
- Go to https://dashboard.stripe.com/webhooks
- Create a new endpoint pointing to: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
- Select events to listen for:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- Copy the signing secret (starts with `whsec_`)

### 2. Database Schema

Ensure your `orders` table has these columns:
```sql
-- Update orders table
ALTER TABLE orders ADD COLUMN payment_verified_at TIMESTAMP;

-- Create webhook logs table for audit trail
CREATE TABLE webhook_logs (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_id TEXT NOT NULL UNIQUE,
  payment_intent_id TEXT,
  amount INTEGER,
  currency TEXT,
  status TEXT,
  processed_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX webhook_logs_event_id_idx ON webhook_logs(event_id);
CREATE INDEX webhook_logs_payment_intent_idx ON webhook_logs(payment_intent_id);
```

### 3. Environment Variables

Your `.env.local` should have:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  (set in Supabase Secrets)
```

## How It Works

1. **Stripe sends webhook** → POST to `/functions/v1/stripe-webhook`
2. **Signature verified** using `STRIPE_WEBHOOK_SECRET`
3. **Event processed:**
   - `payment_intent.succeeded`: Updates order status to "Paid"
   - `payment_intent.payment_failed`: Updates order status to "Payment Failed"
4. **Event logged** to `webhook_logs` table for audit trail

## Security Features

✅ **Webhook signature verification** - Only Stripe can trigger these handlers  
✅ **Service Role authentication** - Uses server-side credentials, never exposed  
✅ **Idempotent updates** - Safe to retry without duplicates  
✅ **Event audit trail** - All webhook events logged to database  
✅ **Error logging** - Failed webhooks logged for debugging  

## Testing

### Test in Development

```bash
# Use Stripe CLI to forward webhooks to localhost
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook

# In another terminal, trigger test events
stripe trigger payment_intent.succeeded
```

### Verify Payment in Database

After successful payment:
```sql
SELECT order_number, status, payment_verified_at 
FROM orders 
WHERE stripe_payment_intent = 'pi_...'
```

Should show:
- `status`: "Paid"
- `payment_verified_at`: Recent timestamp

## Webhook Events

### payment_intent.succeeded
- **When:** Payment captured successfully
- **Action:** Update order status to "Paid"
- **Order flow:** Confirmed → Paid → In Prep → Out for Delivery → Delivered

### payment_intent.payment_failed
- **When:** Payment declined or failed
- **Action:** Update order status to "Payment Failed"
- **Next step:** Customer can retry payment in Account page

## Troubleshooting

**Webhook not triggering?**
- Verify webhook endpoint URL in Stripe dashboard
- Check Stripe API logs for delivery attempts
- Ensure webhook secret matches between Stripe and Supabase

**Order status not updating?**
- Check Supabase edge function logs for errors
- Verify `STRIPE_SERVICE_ROLE_KEY` is set correctly
- Ensure `payment_verified_at` column exists on orders table

**Payment failed events?**
- Check Stripe dashboard for decline reasons
- Verify customer has sufficient funds
- Consider implementing retry logic
