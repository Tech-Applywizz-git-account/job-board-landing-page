# 📋 Payment Integration - Setup Checklist

Use this checklist to ensure you've completed all setup steps.

## ✅ Pre-Setup (Already Done)

- [x] Payment form component created
- [x] Payment service logic implemented
- [x] Database schema designed
- [x] Edge functions created (7 total)
- [x] Email templates designed
- [x] Success/Cancel pages created
- [x] Routes configured
- [x] Documentation written

## 🔧 Setup Steps (Your Action Required)

### Step 1: Supabase Project Setup
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Copy Project URL
- [ ] Copy Anon/Public Key
- [ ] Copy Service Role Key (keep secret!)
- [ ] Create `.env` file with credentials

### Step 2: Database Setup
- [ ] Open Supabase SQL Editor
- [ ] Run migration: `supabase/migrations/001_create_jobboard_transactions.sql`
- [ ] Verify table `jobboard_transactions` exists
- [ ] Verify RLS policies are enabled
- [ ] Test table access

### Step 3: PayPal Setup (Dubai Account)
- [ ] Log in to PayPal Developer Dashboard
- [ ] Create app for Dubai account
- [ ] Copy Client ID
- [ ] Copy Secret
- [ ] Add to Supabase secrets: `PAYPAL_DUBAI_CLIENT_ID`
- [ ] Add to Supabase secrets: `PAYPAL_DUBAI_SECRET`

### Step 4: PayPal Setup (India Account)
- [ ] Log in to PayPal Developer Dashboard
- [ ] Create app for India account
- [ ] Copy Client ID
- [ ] Copy Secret
- [ ] Add to Supabase secrets: `PAYPAL_INDIA_CLIENT_ID`
- [ ] Add to Supabase secrets: `PAYPAL_INDIA_SECRET`

### Step 5: PayPal API URL
- [ ] For testing: Set `PAYPAL_API_URL=https://api-m.sandbox.paypal.com`
- [ ] For production: Set `PAYPAL_API_URL=https://api-m.paypal.com`

### Step 6: Stripe Setup (Dubai Account)
- [ ] Log in to Stripe Dashboard
- [ ] Get API key for Dubai account
- [ ] Copy Secret Key (starts with `sk_`)
- [ ] Add to Supabase secrets: `STRIPE_DUBAI_SECRET_KEY`

### Step 7: Stripe Setup (India Account)
- [ ] Log in to Stripe Dashboard
- [ ] Get API key for India account
- [ ] Copy Secret Key (starts with `sk_`)
- [ ] Add to Supabase secrets: `STRIPE_INDIA_SECRET_KEY`

### Step 8: Azure Communication Services
- [ ] Create Azure Communication Service
- [ ] Create Email Communication Service
- [ ] Link domain (or use Azure's free domain)
- [ ] Copy connection string
- [ ] Add to Supabase secrets: `AZURE_COMMUNICATION_CONNECTION_STRING`
- [ ] Set sender email: `AZURE_EMAIL_SENDER`

### Step 9: Deploy Edge Functions
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] Link project: `supabase link --project-ref YOUR_REF`
- [ ] Deploy: `supabase functions deploy paypal-create-dubai`
- [ ] Deploy: `supabase functions deploy paypal-create-india`
- [ ] Deploy: `supabase functions deploy paypal-capture`
- [ ] Deploy: `supabase functions deploy stripe-create-dubai`
- [ ] Deploy: `supabase functions deploy stripe-create-india`
- [ ] Deploy: `supabase functions deploy stripe-capture`
- [ ] Deploy: `supabase functions deploy send-payment-email`
- [ ] Verify all 7 functions are deployed in Supabase dashboard

### Step 10: Configure Payment Gateway
- [ ] Open `src/pages/PricingPage.jsx`
- [ ] Set preferred payment method (line ~30)
- [ ] Set preferred payment account (line ~31)
- [ ] Save file

## 🧪 Testing Steps

### Test 1: PayPal Dubai (Sandbox)
- [ ] Start dev server: `npm run dev`
- [ ] Go to pricing page
- [ ] Click "Pay Now" on any plan
- [ ] Fill in form with test data
- [ ] Click "Proceed to Payment"
- [ ] Complete PayPal sandbox payment
- [ ] Verify redirect to success page
- [ ] Check transaction in Supabase
- [ ] Check email received

### Test 2: PayPal India (Sandbox)
- [ ] Change payment account to 'india' in code
- [ ] Repeat Test 1 steps
- [ ] Verify correct account used

### Test 3: Stripe Dubai (Test Mode)
- [ ] Change payment method to 'stripe'
- [ ] Change payment account to 'dubai'
- [ ] Use Stripe test card: 4242 4242 4242 4242
- [ ] Complete payment
- [ ] Verify success

### Test 4: Stripe India (Test Mode)
- [ ] Change payment account to 'india'
- [ ] Repeat Test 3 steps
- [ ] Verify correct account used

### Test 5: Payment Cancellation
- [ ] Start payment flow
- [ ] Cancel on payment gateway
- [ ] Verify redirect to cancel page
- [ ] Check transaction status is 'failed'

### Test 6: Email Notifications
- [ ] Complete successful payment
- [ ] Check email inbox
- [ ] Verify email received
- [ ] Check email content (HTML)
- [ ] Verify transaction details are correct

### Test 7: JB-ID Generation
- [ ] Complete first payment
- [ ] Check JB-ID is "JB-1"
- [ ] Complete second payment
- [ ] Check JB-ID is "JB-2"
- [ ] Verify sequential numbering

### Test 8: Subscription Renewal
- [ ] Complete payment with email X
- [ ] Note JB-ID (e.g., JB-1)
- [ ] Complete another payment with same email X
- [ ] Verify same JB-ID is updated (still JB-1)
- [ ] Verify plan dates are updated

## 🚀 Production Deployment

### Pre-Production Checklist
- [ ] All tests passed
- [ ] Switch PayPal to production API
- [ ] Switch Stripe to live keys
- [ ] Configure production domain for emails
- [ ] Test with real payment (small amount)
- [ ] Verify email delivery in production
- [ ] Set up monitoring/alerts

### Production Deployment
- [ ] Build frontend: `npm run build`
- [ ] Deploy to hosting (Vercel/Netlify/etc.)
- [ ] Update environment variables in hosting
- [ ] Test production URL
- [ ] Monitor first few transactions

### Post-Deployment
- [ ] Monitor Supabase logs
- [ ] Monitor edge function logs
- [ ] Check email delivery rates
- [ ] Monitor payment success rates
- [ ] Set up error alerts

## 📊 Monitoring Checklist

### Daily Checks (First Week)
- [ ] Check Supabase logs for errors
- [ ] Check edge function logs
- [ ] Verify email delivery
- [ ] Check payment success rate
- [ ] Review transaction records

### Weekly Checks (Ongoing)
- [ ] Review payment analytics
- [ ] Check for failed payments
- [ ] Monitor email bounce rates
- [ ] Review customer feedback
- [ ] Check for security issues

## 🔒 Security Checklist

- [ ] Service role key is NOT in frontend code
- [ ] All secrets are in Supabase dashboard
- [ ] RLS policies are enabled
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Input validation is working
- [ ] Error messages don't leak sensitive info

## 📚 Documentation Checklist

- [ ] Read PAYMENT_README.md
- [ ] Read PAYMENT_SETUP_GUIDE.md
- [ ] Review ARCHITECTURE.md
- [ ] Understand payment flow
- [ ] Know how to troubleshoot issues

## 🎯 Optional Enhancements

- [ ] Create admin panel for transactions
- [ ] Implement promo code validation
- [ ] Add payment analytics dashboard
- [ ] Set up webhooks for auto-updates
- [ ] Create user subscription dashboard
- [ ] Add invoice generation
- [ ] Implement refund handling

## ✅ Final Verification

Before going live, verify:
- [ ] All edge functions deployed
- [ ] All secrets configured
- [ ] Database table created
- [ ] All tests passed
- [ ] Email delivery working
- [ ] Production credentials set
- [ ] Monitoring in place
- [ ] Documentation reviewed

## 🎉 Launch Checklist

- [ ] Announce to users
- [ ] Monitor first transactions closely
- [ ] Be ready for support requests
- [ ] Have rollback plan ready
- [ ] Celebrate! 🎊

---

## 📝 Notes

Use this space to track your progress:

```
Date Started: _______________
Date Completed: _____________

Issues Encountered:
1. 
2. 
3. 

Solutions:
1. 
2. 
3. 

Production Launch Date: _______________
```

---

**Total Estimated Time**: 40-60 minutes for complete setup
**Difficulty**: Medium (requires API key management)
**Support**: See PAYMENT_SETUP_GUIDE.md for troubleshooting
