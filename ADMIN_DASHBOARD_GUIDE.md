# 🎛️ Admin Dashboard - Complete Guide

## Overview

The Admin Dashboard is a powerful, beautiful control panel that allows you to:
- **Switch payment gateways** with a single click
- **View all transactions** (success, failed, pending)
- **Filter transactions** by status, method, account, or search
- **View detailed transaction information**
- **Monitor payment statistics** in real-time

## Features

### 1. Payment Gateway Switcher 🔄
Switch between any payment gateway combination with one click:
- **PayPal Dubai** 💳
- **PayPal India** 💳
- **Stripe Dubai** 💎
- **Stripe India** 💎

The active gateway is highlighted with a green glow and pulsing indicator.

### 2. Statistics Dashboard 📊
Real-time stats displayed in beautiful cards:
- **Total Transactions** - All transactions count
- **Successful** - Completed payments (green)
- **Failed** - Failed payments (red)
- **Total Revenue** - Sum of all successful payments

### 3. Transaction Filters 🔍
Filter transactions by:
- **Status**: All, Success, Failed, Pending
- **Payment Method**: All, PayPal, Stripe
- **Account**: All, Dubai, India
- **Search**: JB-ID, Email, or Name

### 4. Transaction Table 📋
Comprehensive table showing:
- JB-ID (unique identifier)
- Customer name and email
- Plan type
- Amount paid
- Payment method and account
- Status (with color coding)
- Date created
- View details button

### 5. Transaction Details Modal 🔍
Click any transaction to view:
- **Customer Information**: Name, email, phone, promo code
- **Payment Information**: Plan, amount, method, account, transaction ID, status
- **Subscription Period**: Start and end dates
- **Timestamps**: Created and last updated

## Access

**URL**: `http://localhost:5173/admin`

**Production**: `https://yourdomain.com/admin`

## Setup

### Step 1: Run Database Migration

Run the admin settings migration in Supabase SQL Editor:

```sql
-- This is in: supabase/migrations/002_create_admin_settings.sql
```

Or manually:

```sql
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
    ('payment_method', 'paypal', 'Active payment method: paypal or stripe'),
    ('payment_account', 'dubai', 'Active payment account: dubai or india')
ON CONFLICT (setting_key) DO NOTHING;
```

### Step 2: Access Dashboard

Navigate to `/admin` route in your browser.

## How It Works

### Payment Gateway Switching

1. **Admin clicks** on a payment gateway button
2. **System updates** `admin_settings` table
3. **All future payments** use the new gateway automatically
4. **Visual feedback** shows active gateway with green glow

### Dynamic Payment Processing

When a user makes a payment:

1. **User clicks** "Pay Now" on pricing page
2. **System fetches** current gateway settings from `admin_settings`
3. **Payment processes** through the active gateway
4. **Transaction records** which gateway was used

### Transaction Filtering

Filters work in real-time:
- **Status filter**: Shows only transactions with selected status
- **Method filter**: Shows only PayPal or Stripe transactions
- **Account filter**: Shows only Dubai or India transactions
- **Search**: Searches across JB-ID, email, and customer name

## UI Design

### Color Scheme
- **Background**: Dark gradient (gray-900 → blue-950 → black)
- **Cards**: Glassmorphism with backdrop blur
- **Active Gateway**: Green glow with pulsing indicator
- **Status Colors**:
  - Success: Green (#10b981)
  - Failed: Red (#ef4444)
  - Pending: Yellow (#eab308)

### Typography
- **Headers**: Bold, gradient text (blue → purple)
- **Body**: Clean, readable white text
- **Accents**: Gray-400 for secondary text

### Interactions
- **Hover effects**: Scale and glow on buttons
- **Smooth transitions**: 300ms duration
- **Loading states**: Spinner with message
- **Modal animations**: Fade in/out

## Database Schema

### admin_settings Table

```sql
id              UUID PRIMARY KEY
setting_key     TEXT UNIQUE NOT NULL
setting_value   TEXT NOT NULL
description     TEXT
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

**Default Records**:
```
payment_method  | paypal | Active payment method: paypal or stripe
payment_account | dubai  | Active payment account: dubai or india
```

## API Functions

### getPaymentSettings()
Fetches current payment gateway configuration.

**Returns**:
```javascript
{
  method: 'paypal',  // or 'stripe'
  account: 'dubai'   // or 'india'
}
```

### updatePaymentSettings(method, account)
Updates payment gateway configuration.

**Parameters**:
- `method`: 'paypal' or 'stripe'
- `account`: 'dubai' or 'india'

**Returns**:
```javascript
{
  success: true,
  method: 'paypal',
  account: 'dubai'
}
```

### getTransactions(filters)
Fetches transactions with optional filters.

**Parameters**:
```javascript
{
  status: 'all' | 'success' | 'failed' | 'pending',
  method: 'all' | 'paypal' | 'stripe',
  account: 'all' | 'dubai' | 'india',
  search: 'search term'
}
```

**Returns**: Array of transaction objects

### getTransactionStats()
Fetches transaction statistics.

**Returns**:
```javascript
{
  total: 100,
  success: 85,
  failed: 10,
  pending: 5,
  totalRevenue: 4250.00,
  byMethod: { paypal: 50, stripe: 35 },
  byAccount: { dubai: 60, india: 25 },
  byPlan: { monthly: 40, '3-months': 30, '6-months': 15 }
}
```

## Usage Examples

### Example 1: Switch to Stripe India

1. Go to `/admin`
2. Click on "Stripe India" button
3. System updates settings
4. All future payments use Stripe India
5. Green glow appears on Stripe India button

### Example 2: View Failed Transactions

1. Go to `/admin`
2. In filters section, select "Failed" from Status dropdown
3. Table updates to show only failed transactions
4. Click any transaction to view details

### Example 3: Search for Customer

1. Go to `/admin`
2. In search box, type customer email or JB-ID
3. Table filters in real-time
4. Click transaction to view full details

## Customization

### Add More Settings

Edit `supabase/migrations/002_create_admin_settings.sql`:

```sql
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
    ('email_notifications', 'enabled', 'Enable/disable email notifications'),
    ('promo_codes_enabled', 'true', 'Enable/disable promo code validation')
ON CONFLICT (setting_key) DO NOTHING;
```

### Modify Gateway Options

Edit `src/lib/adminService.js`:

```javascript
export const PAYMENT_COMBINATIONS = [
    { method: 'paypal', account: 'dubai', label: 'PayPal Dubai', color: 'blue' },
    { method: 'paypal', account: 'india', label: 'PayPal India', color: 'blue' },
    { method: 'stripe', account: 'dubai', label: 'Stripe Dubai', color: 'purple' },
    { method: 'stripe', account: 'india', label: 'Stripe India', color: 'purple' },
    // Add more combinations here
];
```

### Change Default Gateway

Update the INSERT statement in migration:

```sql
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
    ('payment_method', 'stripe', 'Active payment method: paypal or stripe'),
    ('payment_account', 'india', 'Active payment account: dubai or india')
ON CONFLICT (setting_key) DO NOTHING;
```

## Security Considerations

### Authentication (Recommended)

Add authentication to protect admin dashboard:

```javascript
// In AdminDashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user || user.email !== 'admin@yourdomain.com') {
            navigate('/');
        }
    };

    // Rest of component...
};
```

### IP Whitelisting

Configure in hosting provider to only allow specific IPs to access `/admin`.

### Environment-Based Access

```javascript
// Only show admin link in development
{process.env.NODE_ENV === 'development' && (
    <Link to="/admin">Admin</Link>
)}
```

## Troubleshooting

### Issue: Gateway not switching

**Solution**: 
1. Check browser console for errors
2. Verify `admin_settings` table exists
3. Check Supabase connection

### Issue: Transactions not loading

**Solution**:
1. Verify `jobboard_transactions` table has data
2. Check browser console for errors
3. Verify Supabase credentials

### Issue: Filters not working

**Solution**:
1. Clear browser cache
2. Check console for JavaScript errors
3. Verify filter values match database values

## Performance Tips

### Pagination (Future Enhancement)

For large transaction lists, add pagination:

```javascript
const [page, setPage] = useState(1);
const [pageSize] = useState(50);

const { data, error } = await supabase
    .from('jobboard_transactions')
    .select('*')
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false });
```

### Caching

Cache statistics to reduce database queries:

```javascript
const [statsCache, setStatsCache] = useState(null);
const [cacheTime, setCacheTime] = useState(null);

const loadStats = async () => {
    const now = Date.now();
    if (statsCache && cacheTime && (now - cacheTime < 60000)) {
        return statsCache; // Use cache if less than 1 minute old
    }
    
    const stats = await getTransactionStats();
    setStatsCache(stats);
    setCacheTime(now);
    return stats;
};
```

## Future Enhancements

1. **Export Transactions** - Download as CSV/Excel
2. **Date Range Filter** - Filter by date range
3. **Refund Management** - Process refunds from dashboard
4. **Email Resend** - Resend confirmation emails
5. **Promo Code Management** - Create and manage promo codes
6. **Analytics Charts** - Visual charts for revenue trends
7. **User Management** - View and manage user subscriptions
8. **Webhook Logs** - View PayPal/Stripe webhook activity

## Screenshots

### Dashboard Overview
- Stats cards at top
- Payment gateway switcher below
- Filters section
- Transaction table

### Active Gateway
- Green glow around active button
- Pulsing indicator in top-right
- "Active" label

### Transaction Details Modal
- Full customer information
- Complete payment details
- Subscription period
- Timestamps

---

**Access**: `/admin`
**Files**: 
- `src/pages/AdminDashboard.jsx`
- `src/lib/adminService.js`
- `supabase/migrations/002_create_admin_settings.sql`
