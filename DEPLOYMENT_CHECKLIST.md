# Quote System Deployment Checklist

## Pre-Deployment

- [ ] Run `npm run build` to verify no errors
- [ ] All files created successfully:
  - [ ] `src/data/menuData.js` (menu data)
  - [ ] `src/utils/quoteCalculations.js` (pricing logic)
  - [ ] `src/pages/QuotePage.jsx` (wizard component)
  - [ ] `src/pages/QuotePage.css` (styling)
  - [ ] `QUOTE_SETUP_INSTRUCTIONS.md` (setup guide)
  - [ ] `IMPLEMENTATION_SUMMARY.md` (overview)
  - [ ] `DEPLOYMENT_CHECKLIST.md` (this file)

- [ ] All files modified:
  - [ ] `src/App.jsx` (added `/quote` route)
  - [ ] `src/pages/Dashboard/Customers.jsx` (added Submitted Quotes tab)
  - [ ] `src/pages/Dashboard/Dashboard.css` (added tab styles)

## Database Setup (Supabase)

- [ ] Create `quotes` table using SQL from QUOTE_SETUP_INSTRUCTIONS.md
- [ ] Verify indexes are created
- [ ] Enable RLS on `quotes` table
- [ ] Add policies (insert public, select/update admin-only)
- [ ] Test RLS policies work correctly

## Email Configuration

- [ ] Verify Resend API key is set in Supabase secrets
- [ ] Verify `send-email` Edge Function exists and is working
- [ ] Test email delivery with contact form first
- [ ] Update admin email if needed (currently: `humblechefbrian@gmail.com`)

## Testing

### Quote Form (`/quote`)
- [ ] Navigate to `/quote` successfully
- [ ] Complete Step 1 (event details)
- [ ] Complete Step 2 (tier selection) — verify auto-advance
- [ ] Complete Step 3 (menu building) — select items per tier
- [ ] Complete Step 4 (add-ons) — if tier has upgrades
- [ ] Complete Step 5 (contact info)
- [ ] Complete Step 6 (review) — verify summary
- [ ] Submit quote
- [ ] See confirmation screen
- [ ] Verify quote in Supabase table

### Email Notifications
- [ ] Admin email received to `humblechefbrian@gmail.com`
- [ ] Admin email contains all quote details
- [ ] Customer email received to provided address
- [ ] Customer email contains confirmation and summary

### Admin Dashboard
- [ ] Log in to `/dashboard`
- [ ] Navigate to **Customers** section
- [ ] See **Submitted Quotes** tab (next to All Customers)
- [ ] Click tab to view submitted quotes
- [ ] Verify quote from test submission appears
- [ ] Click quote row to expand details
- [ ] Verify all details displayed correctly:
  - [ ] Contact info
  - [ ] Event details
  - [ ] Selected tier
  - [ ] Menu selections (grouped by course)
  - [ ] Add-ons/upgrades
  - [ ] Customer message
  - [ ] Estimated total range
- [ ] Change quote status — verify saves
- [ ] Add admin note — verify saves
- [ ] Click email link — opens email client
- [ ] Use search filter — find quote by name
- [ ] Use search filter — find quote by email
- [ ] Use status filter — filter by status

### Mobile Testing
- [ ] Form works on mobile (375px+)
- [ ] Progress bar visible and functional
- [ ] All form inputs accessible
- [ ] Tier cards stack properly
- [ ] Menu items display correctly
- [ ] Summary sidebar adjusts to mobile layout
- [ ] Buttons are touch-friendly (48px+ height)

### Error Handling
- [ ] Submit form with missing fields — see validation errors
- [ ] Submit form with invalid email — see validation error
- [ ] Guest count min > max — see validation error
- [ ] Simulate Supabase error — see friendly error message
- [ ] Simulate email send failure — see friendly error message
- [ ] Form data persists after error

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Performance Verification

- [ ] Run `npm run build` — verify no errors
- [ ] Check bundle size — should be reasonable
- [ ] Page loads quickly
- [ ] Animations are smooth
- [ ] No console errors or warnings

## Post-Deployment

- [ ] Update navigation/header if "Get a Quote" CTA needed
- [ ] Update landing page if needed
- [ ] Inform team of new `/quote` URL
- [ ] Monitor Supabase for incoming quotes
- [ ] Test quote management workflow with real quote

## Customization (Optional)

- [ ] Update menu items in `src/data/menuData.js` if needed
- [ ] Update email templates in `src/pages/QuotePage.jsx` if branding change
- [ ] Update admin email in `src/pages/QuotePage.jsx`
- [ ] Adjust pricing if needed in `menuData.js`
- [ ] Customize tier descriptions/highlights

## Rollback Plan

If issues occur:
1. Stop deployment immediately
2. Check browser console for errors
3. Check Supabase logs for database errors
4. Check email service for delivery issues
5. Verify all files were added/modified correctly
6. Revert any manual changes if needed

## Support

For setup help: See `QUOTE_SETUP_INSTRUCTIONS.md`
For technical details: See `IMPLEMENTATION_SUMMARY.md`
For troubleshooting: See QUOTE_SETUP_INSTRUCTIONS.md "Troubleshooting" section

---

## Sign-Off

- Developer: _________________ Date: _______
- QA: _________________ Date: _______
- Deployed to: _________________ Date: _______
