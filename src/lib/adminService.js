import { supabase } from './supabaseClient';

/**
 * Admin service for managing payment gateway settings and transactions
 */

// Payment gateway combinations
export const PAYMENT_COMBINATIONS = [
    { method: 'paypal', account: 'dubai', label: 'PayPal Dubai', color: 'blue' },
    { method: 'paypal', account: 'india', label: 'PayPal India', color: 'blue' },
    { method: 'stripe', account: 'dubai', label: 'Stripe Dubai', color: 'purple' },
    { method: 'stripe', account: 'india', label: 'Stripe India', color: 'purple' },
];

/**
 * Get current payment gateway settings
 */
export const getPaymentSettings = async () => {
    try {
        const { data, error } = await supabase
            .from('admin_settings')
            .select('*')
            .in('setting_key', ['payment_method', 'payment_account']);

        if (error) throw error;

        const settings = {};
        data.forEach(item => {
            settings[item.setting_key] = item.setting_value;
        });

        return {
            method: settings.payment_method || 'paypal',
            account: settings.payment_account || 'dubai'
        };
    } catch (error) {
        console.error('Error fetching payment settings:', error);
        return { method: 'paypal', account: 'dubai' };
    }
};

/**
 * Update payment gateway settings
 */
export const updatePaymentSettings = async (method, account) => {
    try {
        // Update payment method
        const { error: methodError } = await supabase
            .from('admin_settings')
            .update({ setting_value: method, updated_at: new Date().toISOString() })
            .eq('setting_key', 'payment_method');

        if (methodError) throw methodError;

        // Update payment account
        const { error: accountError } = await supabase
            .from('admin_settings')
            .update({ setting_value: account, updated_at: new Date().toISOString() })
            .eq('setting_key', 'payment_account');

        if (accountError) throw accountError;

        return { success: true, method, account };
    } catch (error) {
        console.error('Error updating payment settings:', error);
        throw error;
    }
};

/**
 * Get all transactions with optional filters
 */
export const getTransactions = async (filters = {}) => {
    try {
        let query = supabase
            .from('jobboard_transactions')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply status filter
        if (filters.status && filters.status !== 'all') {
            query = query.eq('payment_status', filters.status);
        }

        // Apply payment method filter
        if (filters.method && filters.method !== 'all') {
            query = query.eq('payment_method', filters.method);
        }

        // Apply payment account filter
        if (filters.account && filters.account !== 'all') {
            query = query.eq('payment_account', filters.account);
        }

        // Apply search filter
        if (filters.search) {
            query = query.or(`jb_id.ilike.%${filters.search}%,email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

/**
 * Get transaction statistics
 */
export const getTransactionStats = async () => {
    try {
        const { data: allTransactions, error } = await supabase
            .from('jobboard_transactions')
            .select('*');

        if (error) throw error;

        const stats = {
            total: allTransactions.length,
            success: allTransactions.filter(t => t.payment_status === 'success').length,
            failed: allTransactions.filter(t => t.payment_status === 'failed').length,
            pending: allTransactions.filter(t => t.payment_status === 'pending').length,
            totalRevenue: allTransactions
                .filter(t => t.payment_status === 'success')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0),
            byMethod: {
                paypal: allTransactions.filter(t => t.payment_method === 'paypal' && t.payment_status === 'success').length,
                stripe: allTransactions.filter(t => t.payment_method === 'stripe' && t.payment_status === 'success').length,
            },
            byAccount: {
                dubai: allTransactions.filter(t => t.payment_account === 'dubai' && t.payment_status === 'success').length,
                india: allTransactions.filter(t => t.payment_account === 'india' && t.payment_status === 'success').length,
            },
            byPlan: {
                monthly: allTransactions.filter(t => t.plan_id === 'monthly' && t.payment_status === 'success').length,
                '3-months': allTransactions.filter(t => t.plan_id === '3-months' && t.payment_status === 'success').length,
                '6-months': allTransactions.filter(t => t.plan_id === '6-months' && t.payment_status === 'success').length,
            }
        };

        return stats;
    } catch (error) {
        console.error('Error fetching transaction stats:', error);
        throw error;
    }
};

/**
 * Get transaction by JB-ID
 */
export const getTransactionById = async (jbId) => {
    try {
        const { data, error } = await supabase
            .from('jobboard_transactions')
            .select('*')
            .eq('jb_id', jbId)
            .single();

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
    }
};
