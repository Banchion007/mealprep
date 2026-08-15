# Quote System Setup Instructions

## Step 1: Create Supabase Table

Run the following SQL in your Supabase SQL editor (https://app.supabase.com → Your Project → SQL Editor):

```sql
-- Create quotes table
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  
  -- Event details
  event_date DATE,
  event_type TEXT,
  guest_count_min INTEGER NOT NULL,
  guest_count_max INTEGER NOT NULL,
  
  -- Tier selection
  tier_id INTEGER NOT NULL CHECK (tier_id BETWEEN 1 AND 7),
  tier_name TEXT NOT NULL,
  base_price_low NUMERIC(8,2) NOT NULL,
  base_price_high NUMERIC(8,2) NOT NULL,
  
  -- Selections stored as JSON
  selected_items JSONB NOT NULL DEFAULT '{}',
  
  -- Upgrades stored as JSON array
  upgrades JSONB NOT NULL DEFAULT '[]',
  
  -- Calculated totals
  total_low NUMERIC(10,2) NOT NULL,
  total_high NUMERIC(10,2) NOT NULL,
  
  -- Admin status
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'quoted', 'booked', 'declined')),
  admin_notes TEXT
);

-- Create indexes for faster queries
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_email ON quotes(email);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Public can insert (no auth required for quote form)
CREATE POLICY "quotes_insert_public" ON quotes FOR INSERT WITH CHECK (true);

-- Only authenticated users (admin) can read
CREATE POLICY "quotes_select_admin" ON quotes FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users (admin) can update status/notes
CREATE POLICY "quotes_update_admin" ON quotes FOR UPDATE USING (auth.role() = 'authenticated');
```

## Step 2: Verify Email Configuration

The quote system sends emails via your Supabase Edge Function called `send-email`. This function should:
- Send admin notification to: `humblechefbrian@gmail.com`
- Send customer confirmation to: customer's email (from the form)

The existing `send-email` Edge Function in your project should already handle this. Verify:
1. The function exists at: Supabase → Your Project → Edge Functions → send-email
2. It has a valid RESEND_API_KEY in your project secrets
3. Test with the contact form to ensure emails are being sent

## Step 3: Access the Quote Form

The quote form is now available at:
- **Public URL**: `https://yourdomain.com/quote`
- **During development**: `http://localhost:5173/quote`

## Step 4: View Submitted Quotes

Admin can view submitted quotes in the Dashboard:
1. Log in to `/dashboard`
2. Go to **Customers** section
3. Click the **Submitted Quotes** tab
4. View, filter, and manage quotes

## Features Implemented

### Quote Wizard (Multi-Step Form)
- **Step 1**: Event Details (guest count, type, date)
- **Step 2**: Choose Service Tier (7 tiers with visual hierarchy)
- **Step 3**: Build Menu (select items per tier)
- **Step 4**: Add-Ons & Upgrades (optional tier-specific upgrades)
- **Step 5**: Your Information (name, email, phone, message)
- **Step 6**: Review & Submit (full summary with estimated total)

### Pricing Calculation
- Per-person pricing based on selected tier
- Automatic upgrade cost calculation
- Estimated total range display
- Live updating throughout wizard

### Admin Dashboard Features
- **Submitted Quotes Tab** in Customers section
- View all quote submissions
- Filter by status (new, reviewed, quoted, booked, declined)
- Search by name or email
- Expand quote to see full details:
  - Contact information
  - Event details
  - Selected menu items
  - Add-ons selected
  - Customer message
  - Estimated total
- Change quote status
- Add admin notes (auto-saves)
- Direct email link to customer

### Email Notifications
- **Admin receives**: Full quote details with all selections
- **Customer receives**: Confirmation email with tier selection and estimated total

## Files Created/Modified

### New Files
- `src/data/menuData.js` - Menu tiers and items
- `src/pages/QuotePage.jsx` - Main quote wizard component
- `src/pages/QuotePage.css` - Quote page styles
- `src/utils/quoteCalculations.js` - Pricing logic

### Modified Files
- `src/App.jsx` - Added `/quote` route
- `src/pages/Dashboard/Customers.jsx` - Added Submitted Quotes tab
- `src/pages/Dashboard/Dashboard.css` - Added tab and quote styles

## Testing

1. **Test the quote form**: Navigate to `/quote` and complete all steps
2. **Verify database**: Check Supabase → Your Project → Table Editor → quotes (should show new quote)
3. **Check emails**: Verify both admin and customer emails were received
4. **Test admin panel**: Log in, go to Dashboard → Customers → Submitted Quotes tab
5. **Test quote management**: Expand a quote, change status, add notes

## Customization

### Change Brian's Email
In `src/pages/QuotePage.jsx`, find this line and update:
```javascript
await sendEmailViaResend({
  to: 'humblechefbrian@gmail.com',  // <- Change this email
  ...
})
```

### Customize Email Templates
Edit the `buildAdminEmailHTML()` and `buildCustomerEmailHTML()` functions in `src/pages/QuotePage.jsx` to match your brand colors and messaging.

### Adjust Menu/Pricing
Edit `src/data/menuData.js` to add, remove, or modify:
- Service tiers (TIERS array)
- Menu items per tier
- Breakfast options
- Available upgrades
- Pricing per tier

## Troubleshooting

**Emails not sending:**
- Check Supabase Edge Functions dashboard for errors
- Verify RESEND_API_KEY is set in project secrets
- Test with the contact form to verify email system works

**Quotes not saving:**
- Check browser console for errors
- Verify `quotes` table exists in Supabase
- Check RLS policies are correct

**Can't access admin dashboard:**
- Ensure you're logged in with an admin account
- Check `isAdminUser()` function in `src/lib/admin.js`

## Next Steps

1. Run the SQL in Supabase
2. Test the quote form at `/quote`
3. Submit a test quote
4. Verify emails received
5. Check Dashboard → Customers → Submitted Quotes
6. Customize email templates and menu as needed
