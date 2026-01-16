# Payment Gateway Integration - Setup Guide

This guide will help you set up the complete payment gateway integration for your Job Board project.

## Overview

The payment system supports:
- **4 Payment Accounts**: PayPal Dubai, PayPal India, Stripe Dubai, Stripe India
- **3 Subscription Plans**: Monthly ($45), 3-Months ($119.99), 6-Months ($224)
- **Unique Transaction IDs**: JB-1, JB-11, JB-100 format
- **Email Notifications**: Automatic emails via Azure Communication Services
- **Subscription Management**: Automatic renewal/upgrade on same record

## Architecture

```
User clicks "Pay Now" 
  → Payment Form (collects user details)
  → Create Transaction Record (JB-ID generated)
  → Process Payment (PayPal/Stripe based on admin config)
  → Capture Payment (success/failure)
  → Update Transaction Record
  → Send Email Notification
```

## Prerequisites

1. **Supabase Account** - [Sign up](https://supabase.com)
2. **PayPal Business Accounts** - Dubai and India
3. **Stripe Accounts** - Dubai and India
4. **Azure Communication Services** - For email notifications
5. **Supabase CLI** - Install from [here](https://supabase.com/docs/guides/cli)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be ready

### 1.2 Get Supabase Credentials

1. Go to Project Settings → API
2. Copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key
   - Service Role Key (keep this secret!)

### 1.3 Create Environment Variables

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Azure Email Configuration
AZURE_COMMUNICATION_CONNECTION_STRING=your_azure_connection_string
AZURE_EMAIL_SENDER=noreply@yourdomain.com
```

## Step 2: Database Setup

### 2.1 Run Migration

```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

Or manually run the SQL from `supabase/migrations/001_create_jobboard_transactions.sql` in the Supabase SQL Editor.

### 2.2 Verify Table Creation

Go to Supabase Dashboard → Table Editor and verify the `jobboard_transactions` table exists with all columns.

## Step 3: PayPal Setup

### 3.1 Create PayPal Apps

For **both Dubai and India accounts**:

1. Log in to [PayPal Developer Dashboard](https://developer.paypal.com)
2. Go to "My Apps & Credentials"
3. Click "Create App"
4. Name it (e.g., "Job Board Dubai" or "Job Board India")
5. Copy Client ID and Secret

### 3.2 Configure PayPal Credentials in Supabase

Go to Supabase Dashboard → Project Settings → Edge Functions → Secrets

Add these secrets:

```
PAYPAL_DUBAI_CLIENT_ID=your_dubai_client_id
PAYPAL_DUBAI_SECRET=your_dubai_secret
PAYPAL_INDIA_CLIENT_ID=your_india_client_id
PAYPAL_INDIA_SECRET=your_india_secret
PAYPAL_API_URL=https://api-m.paypal.com (production) or https://api-m.sandbox.paypal.com (testing)
```

## Step 4: Stripe Setup

### 4.1 Create Stripe Accounts

For **both Dubai and India accounts**:

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from Developers → API Keys
3. Copy Secret Key (starts with `sk_`)

### 4.2 Configure Stripe Credentials in Supabase

Add these secrets in Supabase:

```
STRIPE_DUBAI_SECRET_KEY=sk_live_...
STRIPE_INDIA_SECRET_KEY=sk_live_...
```

For testing, use test keys (starts with `sk_test_`)

## Step 5: Azure Communication Services Setup

### 5.1 Create Azure Communication Service

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new Communication Service resource
3. Create an Email Communication Service
4. Link a domain (or use Azure's free domain)
5. Get connection string from Keys section

### 5.2 Configure Azure in Supabase

Add these secrets:

```
AZURE_COMMUNICATION_CONNECTION_STRING=endpoint=https://...;accesskey=...
AZURE_EMAIL_SENDER=noreply@yourdomain.com
```

## Step 6: Deploy Edge Functions

### 6.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 6.2 Deploy All Functions

```bash
# Navigate to project directory
cd "c:\Users\saiku\OneDrive\Desktop\job board\job-board-landing-page"

# Deploy PayPal functions
supabase functions deploy paypal-create-dubai
supabase functions deploy paypal-create-india
supabase functions deploy paypal-capture

# Deploy Stripe functions
supabase functions deploy stripe-create-dubai
supabase functions deploy stripe-create-india
supabase functions deploy stripe-capture

# Deploy email function
supabase functions deploy send-payment-email
```

### 6.3 Verify Deployment

Go to Supabase Dashboard → Edge Functions and verify all 7 functions are deployed.

## Step 7: Frontend Configuration

### 7.1 Install Dependencies

```bash
npm install
```

### 7.2 Configure Payment Gateway Selection

In `src/pages/PricingPage.jsx`, update the payment method and account:

```javascript
// Line ~30 in handlePaymentFormSubmit
const paymentMethod = 'paypal'; // or 'stripe'
const paymentAccount = 'dubai'; // or 'india'
```

**Note**: You can make this dynamic by:
1. Creating an admin panel to set preferred gateway
2. Storing preference in Supabase
3. Fetching it before payment processing

## Step 8: Testing

### 8.1 Test Payment Flow

1. Start dev server: `npm run dev`
2. Go to pricing page
3. Click "Pay Now" on any plan
4. Fill in the form
5. Click "Proceed to Payment"
6. Complete payment on PayPal/Stripe
7. Verify:
   - Transaction record created in `jobboard_transactions`
   - Email received
   - Payment status updated

### 8.2 Test Scenarios

- ✅ Successful payment
- ✅ Failed payment
- ✅ Cancelled payment
- ✅ Email delivery
- ✅ JB-ID generation
- ✅ Plan date calculation

## Step 9: Production Deployment

### 9.1 Update Environment Variables

1. Replace sandbox/test credentials with production credentials
2. Update `PAYPAL_API_URL` to `https://api-m.paypal.com`
3. Use Stripe live keys (`sk_live_...`)

### 9.2 Enable Production Mode

Update Supabase secrets to use production credentials.

### 9.3 Deploy Frontend

```bash
npm run build
```

Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

## Payment Flow Details

### Creating a Transaction

1. User fills payment form
2. `createTransaction()` is called
3. Generates unique JB-ID (JB-1, JB-2, etc.)
4. Inserts record with `payment_status: 'pending'`
5. Returns transaction object

### Processing Payment

1. `processPayment()` is called with JB-ID
2. Calls appropriate edge function (e.g., `paypal-create-dubai`)
3. Edge function:
   - Fetches transaction details
   - Creates PayPal order / Stripe payment intent
   - Updates transaction with `transaction_id`
   - Returns approval URL / client secret

### Capturing Payment

1. User completes payment on PayPal/Stripe
2. `capturePayment()` is called
3. Edge function:
   - Verifies payment status
   - Updates transaction with:
     - `payment_status: 'success'` or `'failed'`
     - `plan_started` (current timestamp)
     - `plan_ended` (calculated based on plan)
   - Sends email notification

### Upgrading Subscription

1. Check if user has existing transaction (by email)
2. If exists, call `upgradeSubscription(jbId, newPlanId)`
3. Updates same record with new plan details
4. Process payment as usual

## Database Schema

```sql
jobboard_transactions
├── id (UUID, primary key)
├── jb_id (TEXT, unique) -- JB-1, JB-11, etc.
├── full_name (TEXT)
├── email (TEXT)
├── country_code (TEXT)
├── mobile_number (TEXT)
├── promo_code (TEXT, nullable)
├── plan_id (TEXT) -- 'monthly', '3-months', '6-months'
├── plan_started (TIMESTAMPTZ, nullable)
├── plan_ended (TIMESTAMPTZ, nullable)
├── payment_status (TEXT) -- 'pending', 'success', 'failed'
├── payment_method (TEXT) -- 'paypal', 'stripe'
├── payment_account (TEXT) -- 'dubai', 'india'
├── transaction_id (TEXT) -- PayPal/Stripe ID
├── amount (DECIMAL)
├── currency (TEXT)
├── payment_details (JSONB)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## Edge Functions

1. **paypal-create-dubai** - Create PayPal order (Dubai account)
2. **paypal-create-india** - Create PayPal order (India account)
3. **paypal-capture** - Capture PayPal payment (shared)
4. **stripe-create-dubai** - Create Stripe payment intent (Dubai account)
5. **stripe-create-india** - Create Stripe payment intent (India account)
6. **stripe-capture** - Capture Stripe payment (shared)
7. **send-payment-email** - Send email notifications via Azure

## Troubleshooting

### Issue: Edge function returns 401 Unauthorized

**Solution**: Make sure you're passing the Supabase anon key in the request headers.

### Issue: Email not sending

**Solution**: 
1. Verify Azure connection string is correct
2. Check sender email is verified in Azure
3. Check edge function logs in Supabase

### Issue: JB-ID not incrementing

**Solution**: Check if the `jobboard_transactions` table has proper permissions and the query is working.

### Issue: Payment not capturing

**Solution**:
1. Check PayPal/Stripe credentials
2. Verify API URLs (sandbox vs production)
3. Check edge function logs

## Security Considerations

1. ✅ Never expose service role key in frontend
2. ✅ Use Row Level Security (RLS) on database
3. ✅ Validate all inputs in edge functions
4. ✅ Use HTTPS for all API calls
5. ✅ Store sensitive credentials in Supabase secrets
6. ✅ Implement rate limiting on edge functions

## Support

For issues or questions:
- Check Supabase logs: Dashboard → Logs
- Check Edge Function logs: Dashboard → Edge Functions → [Function] → Logs
- Review PayPal/Stripe dashboard for payment issues

## Next Steps

1. **Admin Panel**: Create an admin interface to:
   - View all transactions
   - Configure payment gateway preferences
   - Manage promo codes
   - View analytics

2. **Webhooks**: Implement PayPal/Stripe webhooks for:
   - Automatic payment status updates
   - Subscription renewals
   - Refund handling

3. **Analytics**: Track:
   - Conversion rates
   - Popular plans
   - Payment method preferences
   - Regional trends

4. **Promo Codes**: Implement promo code validation and discounts

5. **Subscription Management**: Allow users to:
   - View subscription status
   - Cancel subscription
   - Upgrade/downgrade plans
