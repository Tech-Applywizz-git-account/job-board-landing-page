# Payment System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │ Pricing Page │───▶│ Payment Form │───▶│Success/Cancel│    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND SERVICES                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              paymentService.js                           │  │
│  │  • createTransaction()                                   │  │
│  │  • processPayment()                                      │  │
│  │  • capturePayment()                                      │  │
│  │  • upgradeSubscription()                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  DATABASE TABLE                         │   │
│  │          jobboard_transactions                          │   │
│  │  • JB-ID (unique identifier)                            │   │
│  │  • Customer details                                     │   │
│  │  • Plan information                                     │   │
│  │  • Payment status                                       │   │
│  │  • Transaction details                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              EDGE FUNCTIONS (7 total)                   │   │
│  │                                                         │   │
│  │  PayPal Functions:                                      │   │
│  │  ├─ paypal-create-dubai                                │   │
│  │  ├─ paypal-create-india                                │   │
│  │  └─ paypal-capture (shared)                            │   │
│  │                                                         │   │
│  │  Stripe Functions:                                      │   │
│  │  ├─ stripe-create-dubai                                │   │
│  │  ├─ stripe-create-india                                │   │
│  │  └─ stripe-capture (shared)                            │   │
│  │                                                         │   │
│  │  Email Function:                                        │   │
│  │  └─ send-payment-email                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│  PAYPAL GATEWAY  │  │STRIPE GATEWAY│  │AZURE EMAIL   │
│                  │  │              │  │SERVICE       │
│  • Dubai Account │  │• Dubai Acct  │  │              │
│  • India Account │  │• India Acct  │  │• Send emails │
└──────────────────┘  └──────────────┘  └──────────────┘
```

## Payment Flow Sequence

```
User                Frontend            Supabase           Payment Gateway      Email
 │                     │                    │                     │              │
 │  Click "Pay Now"    │                    │                     │              │
 ├────────────────────▶│                    │                     │              │
 │                     │                    │                     │              │
 │  Show Payment Form  │                    │                     │              │
 │◀────────────────────┤                    │                     │              │
 │                     │                    │                     │              │
 │  Submit Form        │                    │                     │              │
 ├────────────────────▶│                    │                     │              │
 │                     │                    │                     │              │
 │                     │ createTransaction()│                     │              │
 │                     ├───────────────────▶│                     │              │
 │                     │                    │                     │              │
 │                     │  JB-1 Created      │                     │              │
 │                     │◀───────────────────┤                     │              │
 │                     │                    │                     │              │
 │                     │ processPayment()   │                     │              │
 │                     ├───────────────────▶│                     │              │
 │                     │                    │                     │              │
 │                     │                    │  Create Order       │              │
 │                     │                    ├────────────────────▶│              │
 │                     │                    │                     │              │
 │                     │                    │  Approval URL       │              │
 │                     │                    │◀────────────────────┤              │
 │                     │                    │                     │              │
 │                     │  Redirect URL      │                     │              │
 │                     │◀───────────────────┤                     │              │
 │                     │                    │                     │              │
 │  Redirect to Gateway│                    │                     │              │
 │◀────────────────────┤                    │                     │              │
 │                     │                    │                     │              │
 │  Complete Payment   │                    │                     │              │
 ├─────────────────────────────────────────────────────────────▶│              │
 │                     │                    │                     │              │
 │  Redirect to Success│                    │                     │              │
 │◀────────────────────────────────────────────────────────────┤              │
 │                     │                    │                     │              │
 │                     │ capturePayment()   │                     │              │
 │                     ├───────────────────▶│                     │              │
 │                     │                    │                     │              │
 │                     │                    │  Capture Payment    │              │
 │                     │                    ├────────────────────▶│              │
 │                     │                    │                     │              │
 │                     │                    │  Payment Confirmed  │              │
 │                     │                    │◀────────────────────┤              │
 │                     │                    │                     │              │
 │                     │                    │  Update Transaction │              │
 │                     │                    │  (status: success)  │              │
 │                     │                    │                     │              │
 │                     │                    │  Send Email         │              │
 │                     │                    ├──────────────────────────────────▶│
 │                     │                    │                     │              │
 │                     │  Success Response  │                     │              │
 │                     │◀───────────────────┤                     │              │
 │                     │                    │                     │              │
 │  Show Success Page  │                    │                     │              │
 │◀────────────────────┤                    │                     │              │
 │                     │                    │                     │              │
 │                     │                    │                     │   Email Sent │
 │◀─────────────────────────────────────────────────────────────────────────────┤
```

## Database Record States

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSACTION LIFECYCLE                        │
└─────────────────────────────────────────────────────────────────┘

State 1: PENDING (Initial Creation)
┌──────────────────────────────────────┐
│ jb_id: "JB-1"                        │
│ payment_status: "pending"            │
│ payment_method: null                 │
│ plan_started: null                   │
│ plan_ended: null                     │
└──────────────────────────────────────┘
                │
                │ User completes payment
                ▼
State 2: SUCCESS (After Payment)
┌──────────────────────────────────────┐
│ jb_id: "JB-1"                        │
│ payment_status: "success"            │
│ payment_method: "paypal"             │
│ payment_account: "dubai"             │
│ transaction_id: "PAYPAL-ORDER-123"   │
│ plan_started: "2026-01-14T10:00:00Z" │
│ plan_ended: "2026-02-14T10:00:00Z"   │
└──────────────────────────────────────┘
                │
                │ Plan expires, user renews
                ▼
State 3: RENEWED (Same Record Updated)
┌──────────────────────────────────────┐
│ jb_id: "JB-1"  ← SAME ID!            │
│ plan_id: "6-months" ← UPDATED        │
│ payment_status: "success"            │
│ plan_started: "2026-02-14T10:00:00Z" │
│ plan_ended: "2026-08-14T10:00:00Z"   │
│ updated_at: "2026-02-14T10:00:00Z"   │
└──────────────────────────────────────┘
```

## Payment Gateway Selection

```
┌─────────────────────────────────────────────────────────────────┐
│                   ADMIN CONFIGURATION                           │
│                  (Future Enhancement)                           │
└─────────────────────────────────────────────────────────────────┘

Current: Hardcoded in PricingPage.jsx
┌──────────────────────────────────────┐
│ const paymentMethod = 'paypal';      │
│ const paymentAccount = 'dubai';      │
└──────────────────────────────────────┘

Future: Dynamic Selection
┌──────────────────────────────────────┐
│ Admin Panel                          │
│  ├─ Set preferred gateway by region │
│  ├─ Configure fallback options      │
│  └─ Store in Supabase settings      │
└──────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│ Frontend fetches configuration       │
│  ├─ User location: Dubai → PayPal   │
│  ├─ User location: India → Stripe   │
│  └─ Default: PayPal Dubai            │
└──────────────────────────────────────┘
```

## Email Notification Flow

```
Payment Captured
       │
       ▼
┌──────────────────────────────────────┐
│ send-payment-email Edge Function     │
│                                      │
│ 1. Get transaction details           │
│ 2. Generate HTML email               │
│ 3. Generate text email               │
│ 4. Call Azure Communication API      │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Azure Communication Services         │
│                                      │
│ • Validates sender                   │
│ • Sends email                        │
│ • Returns message ID                 │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ User receives email                  │
│                                      │
│ • Transaction details                │
│ • Plan information                   │
│ • Access link                        │
└──────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

Frontend (Public)
┌──────────────────────────────────────┐
│ • Supabase Anon Key (public)         │
│ • Input validation                   │
│ • HTTPS only                         │
└──────────────────────────────────────┘
                │
                ▼
Supabase (Protected)
┌──────────────────────────────────────┐
│ • Row Level Security (RLS)           │
│ • Service Role Key (private)         │
│ • Edge Function authentication       │
└──────────────────────────────────────┘
                │
                ▼
Payment Gateways (Encrypted)
┌──────────────────────────────────────┐
│ • API keys in Supabase secrets       │
│ • HTTPS/TLS encryption               │
│ • OAuth 2.0 (PayPal)                 │
│ • API key authentication (Stripe)    │
└──────────────────────────────────────┘
```

## JB-ID Generation Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                    JB-ID GENERATION                             │
└─────────────────────────────────────────────────────────────────┘

Step 1: Query latest transaction
┌──────────────────────────────────────┐
│ SELECT jb_id FROM transactions       │
│ ORDER BY created_at DESC             │
│ LIMIT 1                              │
└──────────────────────────────────────┘
                │
                ▼
Step 2: Extract number
┌──────────────────────────────────────┐
│ Last JB-ID: "JB-99"                  │
│ Extract: 99                          │
│ Increment: 100                       │
└──────────────────────────────────────┘
                │
                ▼
Step 3: Format new ID
┌──────────────────────────────────────┐
│ New JB-ID: "JB-100"                  │
└──────────────────────────────────────┘

Examples:
JB-1, JB-2, ..., JB-9, JB-10, JB-11, ..., JB-99, JB-100, JB-1000
```
