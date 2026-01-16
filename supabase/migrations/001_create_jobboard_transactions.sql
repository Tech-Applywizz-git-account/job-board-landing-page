-- Job Board Transactions Table
-- This table stores all payment transactions for the job board subscription system

CREATE TABLE IF NOT EXISTS jobboard_transactions (
    -- Primary identifier
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Unique JB identifier (JB-1, JB-11, JB-100, etc.)
    jb_id TEXT UNIQUE NOT NULL,
    
    -- Customer information
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    country_code TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    promo_code TEXT,
    
    -- Plan information
    plan_id TEXT NOT NULL CHECK (plan_id IN ('monthly', '3-months', '6-months')),
    plan_started TIMESTAMPTZ,
    plan_ended TIMESTAMPTZ,
    
    -- Payment information
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
    payment_method TEXT CHECK (payment_method IN ('paypal', 'stripe')),
    payment_account TEXT CHECK (payment_account IN ('dubai', 'india')),
    transaction_id TEXT, -- PayPal Order ID or Stripe Payment Intent ID
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_details JSONB, -- Additional payment gateway response data
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobboard_transactions_jb_id ON jobboard_transactions(jb_id);
CREATE INDEX IF NOT EXISTS idx_jobboard_transactions_email ON jobboard_transactions(email);
CREATE INDEX IF NOT EXISTS idx_jobboard_transactions_payment_status ON jobboard_transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_jobboard_transactions_created_at ON jobboard_transactions(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_jobboard_transactions_updated_at ON jobboard_transactions;
CREATE TRIGGER update_jobboard_transactions_updated_at
    BEFORE UPDATE ON jobboard_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE jobboard_transactions IS 'Stores all job board subscription payment transactions';
COMMENT ON COLUMN jobboard_transactions.jb_id IS 'Unique identifier in format JB-1, JB-11, JB-100, etc.';
COMMENT ON COLUMN jobboard_transactions.plan_id IS 'Subscription plan: monthly, 3-months, or 6-months';
COMMENT ON COLUMN jobboard_transactions.payment_status IS 'Payment status: pending, success, or failed';
COMMENT ON COLUMN jobboard_transactions.payment_method IS 'Payment gateway used: paypal or stripe';
COMMENT ON COLUMN jobboard_transactions.payment_account IS 'Payment account region: dubai or india';
COMMENT ON COLUMN jobboard_transactions.transaction_id IS 'Payment gateway transaction ID (PayPal Order ID or Stripe Payment Intent ID)';
COMMENT ON COLUMN jobboard_transactions.payment_details IS 'Full payment gateway response stored as JSON';
