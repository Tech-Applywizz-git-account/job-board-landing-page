# Payment Gateway Integration - Quick Start

## 🎉 What's Been Implemented

A complete payment gateway system for your Job Board with:

### ✅ Features Implemented

1. **Payment Form** - Beautiful modal with:
   - Full name, email, mobile number with country code
   - Promo code field
   - Terms & conditions checkbox
   - Full validation

2. **4 Payment Accounts**:
   - PayPal Dubai
   - PayPal India
   - Stripe Dubai
   - Stripe India

3. **3 Subscription Plans**:
   - Monthly: $45/month
   - 3 Months: $119.99 (10% off)
   - 6 Months: $224 (17% off)

4. **Database Table**: `jobboard_transactions`
   - Unique JB-ID format (JB-1, JB-11, JB-100)
   - Stores all transaction details
   - Tracks payment status, method, and account
   - Auto-calculates plan start/end dates

5. **7 Edge Functions**:
   - `paypal-create-dubai` - Create PayPal order (Dubai)
   - `paypal-create-india` - Create PayPal order (India)
   - `paypal-capture` - Capture PayPal payment
   - `stripe-create-dubai` - Create Stripe payment (Dubai)
   - `stripe-create-india` - Create Stripe payment (India)
   - `stripe-capture` - Capture Stripe payment
   - `send-payment-email` - Send email via Azure

6. **Email Notifications**:
   - Beautiful HTML emails
   - Sent via Azure Communication Services
   - Immediate delivery on success/failure

7. **Payment Pages**:
   - Success page with transaction details
   - Cancel page with retry option

8. **Subscription Management**:
   - Same record updated on renewal/upgrade
   - No duplicate records for same user

## 📁 File Structure

```
job-board-landing-page/
├── src/
│   ├── components/
│   │   └── PaymentForm.jsx          # Payment form modal
│   ├── lib/
│   │   ├── supabaseClient.js        # Supabase configuration
│   │   └── paymentService.js        # Payment logic
│   ├── pages/
│   │   ├── PricingPage.jsx          # Updated with payment integration
│   │   ├── PaymentSuccess.jsx       # Success page
│   │   └── PaymentCancel.jsx        # Cancel page
│   └── App.jsx                      # Updated with payment routes
├── supabase/
│   ├── functions/
│   │   ├── paypal-create-dubai/
│   │   ├── paypal-create-india/
│   │   ├── paypal-capture/
│   │   ├── stripe-create-dubai/
│   │   ├── stripe-create-india/
│   │   ├── stripe-capture/
│   │   └── send-payment-email/
│   ├── migrations/
│   │   └── 001_create_jobboard_transactions.sql
│   └── SECRETS_CONFIG.txt           # Secrets reference
├── .env.example                     # Environment variables template
└── PAYMENT_SETUP_GUIDE.md          # Detailed setup guide
```

## 🚀 Quick Setup (5 Steps)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key

### Step 2: Configure Environment

Create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Create Database Table

Run the SQL from `supabase/migrations/001_create_jobboard_transactions.sql` in Supabase SQL Editor.

### Step 4: Configure Payment Credentials

Go to Supabase Dashboard → Project Settings → Edge Functions → Secrets

Add your credentials (see `supabase/SECRETS_CONFIG.txt` for reference):

```
PAYPAL_DUBAI_CLIENT_ID=...
PAYPAL_DUBAI_SECRET=...
PAYPAL_INDIA_CLIENT_ID=...
PAYPAL_INDIA_SECRET=...
PAYPAL_API_URL=https://api-m.sandbox.paypal.com

STRIPE_DUBAI_SECRET_KEY=sk_test_...
STRIPE_INDIA_SECRET_KEY=sk_test_...

AZURE_COMMUNICATION_CONNECTION_STRING=...
AZURE_EMAIL_SENDER=noreply@yourdomain.com
```

### Step 5: Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy paypal-create-dubai
supabase functions deploy paypal-create-india
supabase functions deploy paypal-capture
supabase functions deploy stripe-create-dubai
supabase functions deploy stripe-create-india
supabase functions deploy stripe-capture
supabase functions deploy send-payment-email
```

## 🧪 Testing

```bash
# Start dev server
npm run dev

# Navigate to http://localhost:5173/pricing
# Click "Pay Now" on any plan
# Fill in the form
# Complete payment
```

## 📝 How It Works

### Payment Flow

```
1. User clicks "Pay Now" button
   ↓
2. Payment form modal opens
   ↓
3. User fills in details and clicks "Proceed to Payment"
   ↓
4. Transaction record created with JB-ID (e.g., JB-1)
   ↓
5. Payment gateway initialized (PayPal/Stripe)
   ↓
6. User redirected to payment gateway
   ↓
7. User completes payment
   ↓
8. Redirected to success/cancel page
   ↓
9. Payment captured and transaction updated
   ↓
10. Email sent to user
```

### Database Record Lifecycle

**Initial Creation (Pending)**:
```json
{
  "jb_id": "JB-1",
  "full_name": "John Doe",
  "email": "john@example.com",
  "payment_status": "pending",
  "payment_method": null,
  "plan_started": null,
  "plan_ended": null
}
```

**After Successful Payment**:
```json
{
  "jb_id": "JB-1",
  "payment_status": "success",
  "payment_method": "paypal",
  "payment_account": "dubai",
  "transaction_id": "PAYPAL-ORDER-ID",
  "plan_started": "2026-01-14T10:00:00Z",
  "plan_ended": "2026-02-14T10:00:00Z"
}
```

**On Renewal/Upgrade (Same Record)**:
```json
{
  "jb_id": "JB-1",  // Same JB-ID!
  "plan_id": "6-months",  // Updated
  "plan_started": "2026-02-14T10:00:00Z",  // Updated
  "plan_ended": "2026-08-14T10:00:00Z",  // Updated
  "updated_at": "2026-02-14T10:00:00Z"
}
```

## 🎨 Customization

### Change Payment Gateway

In `src/pages/PricingPage.jsx` (line ~30):

```javascript
const paymentMethod = 'paypal'; // or 'stripe'
const paymentAccount = 'dubai'; // or 'india'
```

### Add Admin Configuration

Create an admin panel to:
1. Set preferred payment gateway per region
2. Store in Supabase settings table
3. Fetch before payment processing

### Modify Plans

In `src/lib/paymentService.js`:

```javascript
export const PLAN_CONFIGS = {
    'monthly': {
        duration: 1,
        unit: 'month',
        price: 45
    },
    // Add more plans...
};
```

## 📧 Email Templates

Email templates are in `supabase/functions/send-payment-email/index.ts`.

Customize the HTML/text in `generateEmailHTML()` and `generateEmailText()` functions.

## 🔒 Security

- ✅ Row Level Security (RLS) enabled
- ✅ Service role key never exposed to frontend
- ✅ All payment credentials in Supabase secrets
- ✅ Input validation on all forms
- ✅ CORS properly configured

## 📚 Documentation

- **Detailed Setup**: See `PAYMENT_SETUP_GUIDE.md`
- **Secrets Reference**: See `supabase/SECRETS_CONFIG.txt`
- **API Reference**: See inline comments in code

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Create `.env` file with Supabase credentials.

### Issue: Edge function returns 401

**Solution**: Check that secrets are configured in Supabase dashboard.

### Issue: Email not sending

**Solution**: Verify Azure connection string and sender email.

### Issue: Payment not capturing

**Solution**: Check PayPal/Stripe credentials and API URLs.

## 🎯 Next Steps

1. **Test with sandbox accounts** (PayPal sandbox, Stripe test mode)
2. **Configure Azure email** with your domain
3. **Deploy edge functions** to Supabase
4. **Test complete flow** end-to-end
5. **Switch to production** credentials when ready

## 💡 Tips

- Use PayPal sandbox for testing: [developer.paypal.com](https://developer.paypal.com)
- Use Stripe test mode: Test cards at [stripe.com/docs/testing](https://stripe.com/docs/testing)
- Monitor edge function logs in Supabase dashboard
- Check email delivery in Azure portal

## 📞 Support

For issues:
1. Check Supabase logs (Dashboard → Logs)
2. Check Edge Function logs (Dashboard → Edge Functions → [Function] → Logs)
3. Review PayPal/Stripe dashboard for payment issues
4. See `PAYMENT_SETUP_GUIDE.md` for detailed troubleshooting

## 🎉 You're All Set!

Your payment gateway integration is complete and ready to use. Follow the Quick Setup steps above to get started!

---

**Built with**: React, Supabase, PayPal, Stripe, Azure Communication Services
