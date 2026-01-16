# 🚀 Payment Integration - Quick Reference Card

## 📞 Emergency Contacts & Links

### Supabase
- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs
- CLI: `npm install -g supabase`

### PayPal
- Developer Dashboard: https://developer.paypal.com
- Sandbox: https://www.sandbox.paypal.com
- API Docs: https://developer.paypal.com/docs/api

### Stripe
- Dashboard: https://dashboard.stripe.com
- Test Cards: https://stripe.com/docs/testing
- API Docs: https://stripe.com/docs/api

### Azure
- Portal: https://portal.azure.com
- Communication Services: https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Communication%2FCommunicationServices

## 🔑 Environment Variables

```env
# Frontend (.env)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Supabase Secrets (Dashboard → Edge Functions → Secrets)
PAYPAL_DUBAI_CLIENT_ID=
PAYPAL_DUBAI_SECRET=
PAYPAL_INDIA_CLIENT_ID=
PAYPAL_INDIA_SECRET=
PAYPAL_API_URL=https://api-m.sandbox.paypal.com

STRIPE_DUBAI_SECRET_KEY=sk_test_...
STRIPE_INDIA_SECRET_KEY=sk_test_...

AZURE_COMMUNICATION_CONNECTION_STRING=endpoint=...
AZURE_EMAIL_SENDER=noreply@yourdomain.com
```

## 🎯 Quick Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all edge functions
supabase functions deploy paypal-create-dubai
supabase functions deploy paypal-create-india
supabase functions deploy paypal-capture
supabase functions deploy stripe-create-dubai
supabase functions deploy stripe-create-india
supabase functions deploy stripe-capture
supabase functions deploy send-payment-email

# View function logs
supabase functions logs FUNCTION_NAME
```

## 📊 Database Quick Reference

### Table: `jobboard_transactions`

```sql
-- View all transactions
SELECT * FROM jobboard_transactions ORDER BY created_at DESC;

-- View pending transactions
SELECT * FROM jobboard_transactions WHERE payment_status = 'pending';

-- View successful transactions
SELECT * FROM jobboard_transactions WHERE payment_status = 'success';

-- Get transaction by JB-ID
SELECT * FROM jobboard_transactions WHERE jb_id = 'JB-1';

-- Get transactions by email
SELECT * FROM jobboard_transactions WHERE email = 'user@example.com';

-- Count transactions by status
SELECT payment_status, COUNT(*) FROM jobboard_transactions GROUP BY payment_status;
```

## 🔧 Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: Create `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Issue: Edge function returns 401
**Solution**: Add secrets in Supabase Dashboard → Edge Functions → Secrets

### Issue: Email not sending
**Solution**: Check Azure connection string and verify sender email is configured

### Issue: Payment not capturing
**Solution**: Verify PayPal/Stripe credentials and check API URL (sandbox vs production)

### Issue: JB-ID not incrementing
**Solution**: Check database permissions and verify table has data

## 🎨 Customization Quick Guide

### Change Payment Gateway
File: `src/pages/PricingPage.jsx` (line ~30)
```javascript
const paymentMethod = 'paypal'; // or 'stripe'
const paymentAccount = 'dubai'; // or 'india'
```

### Modify Plans
File: `src/lib/paymentService.js`
```javascript
export const PLAN_CONFIGS = {
    'monthly': { duration: 1, unit: 'month', price: 45 },
    '3-months': { duration: 3, unit: 'month', price: 119.99 },
    '6-months': { duration: 6, unit: 'month', price: 224 }
};
```

### Update Email Template
File: `supabase/functions/send-payment-email/index.ts`
Function: `generateEmailHTML()` and `generateEmailText()`

## 📱 Test Cards

### Stripe Test Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0027 6000 3184
- **Expiry**: Any future date
- **CVC**: Any 3 digits

### PayPal Sandbox
- Create test accounts at: https://developer.paypal.com/developer/accounts
- Use sandbox credentials for testing

## 🔍 Monitoring & Logs

### Supabase Logs
Dashboard → Logs → Filter by:
- Edge Functions
- Database
- API

### Edge Function Logs
Dashboard → Edge Functions → [Function Name] → Logs

### Database Queries
Dashboard → SQL Editor → Run custom queries

## 📈 Analytics Queries

```sql
-- Total revenue
SELECT SUM(amount) FROM jobboard_transactions WHERE payment_status = 'success';

-- Revenue by plan
SELECT plan_id, SUM(amount), COUNT(*) 
FROM jobboard_transactions 
WHERE payment_status = 'success' 
GROUP BY plan_id;

-- Revenue by payment method
SELECT payment_method, payment_account, SUM(amount), COUNT(*) 
FROM jobboard_transactions 
WHERE payment_status = 'success' 
GROUP BY payment_method, payment_account;

-- Recent transactions
SELECT jb_id, email, plan_id, amount, payment_status, created_at 
FROM jobboard_transactions 
ORDER BY created_at DESC 
LIMIT 10;

-- Active subscriptions
SELECT COUNT(*) 
FROM jobboard_transactions 
WHERE payment_status = 'success' 
AND plan_ended > NOW();
```

## 🎯 Testing Checklist

- [ ] PayPal Dubai (sandbox)
- [ ] PayPal India (sandbox)
- [ ] Stripe Dubai (test mode)
- [ ] Stripe India (test mode)
- [ ] Email delivery (success)
- [ ] Email delivery (failure)
- [ ] Payment cancellation
- [ ] JB-ID generation
- [ ] Subscription renewal

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| PAYMENT_README.md | Quick start guide |
| PAYMENT_SETUP_GUIDE.md | Detailed setup |
| SETUP_CHECKLIST.md | Step-by-step checklist |
| ARCHITECTURE.md | System diagrams |
| INTEGRATION_SUMMARY.md | Complete overview |
| FILE_TREE.md | File structure |

## 🔒 Security Reminders

- ✅ Never commit `.env` file
- ✅ Never expose service role key
- ✅ Use HTTPS in production
- ✅ Keep secrets in Supabase dashboard
- ✅ Enable RLS on database
- ✅ Validate all inputs

## 💡 Pro Tips

1. **Use sandbox/test mode** until you're confident
2. **Monitor logs closely** during first transactions
3. **Test email delivery** before going live
4. **Keep backup** of database before major changes
5. **Document** any custom modifications

## 🎉 Quick Start (5 Steps)

1. **Create Supabase project** → Copy credentials
2. **Run database migration** → Create table
3. **Add payment credentials** → Supabase secrets
4. **Deploy edge functions** → 7 functions
5. **Test payment flow** → Complete transaction

**Time**: ~40 minutes

## 📞 Support

- **Supabase**: support@supabase.com
- **PayPal**: https://developer.paypal.com/support
- **Stripe**: https://support.stripe.com
- **Azure**: https://azure.microsoft.com/support

---

**Print this card and keep it handy! 📋**
