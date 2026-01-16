-- Admin Settings Table
-- Stores payment gateway configuration

CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert default payment gateway settings
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
    ('payment_method', 'paypal', 'Active payment method: paypal or stripe'),
    ('payment_account', 'dubai', 'Active payment account: dubai or india')
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE admin_settings IS 'Stores admin configuration settings including payment gateway preferences';
COMMENT ON COLUMN admin_settings.setting_key IS 'Unique setting identifier';
COMMENT ON COLUMN admin_settings.setting_value IS 'Setting value';
