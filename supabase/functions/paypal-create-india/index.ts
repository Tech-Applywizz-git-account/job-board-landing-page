// PayPal Create Order - India Account
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PAYPAL_INDIA_CLIENT_ID = Deno.env.get('PAYPAL_INDIA_CLIENT_ID');
const PAYPAL_INDIA_SECRET = Deno.env.get('PAYPAL_INDIA_SECRET');
const PAYPAL_API_URL = Deno.env.get('PAYPAL_API_URL') || 'https://api-m.paypal.com';

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            },
        });
    }

    try {
        const { jbId } = await req.json();

        if (!jbId) {
            throw new Error('JB ID is required');
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get transaction details
        const { data: transaction, error: txError } = await supabase
            .from('jobboard_transactions')
            .select('*')
            .eq('jb_id', jbId)
            .single();

        if (txError) throw txError;

        // Get PayPal access token
        const authResponse = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${PAYPAL_INDIA_CLIENT_ID}:${PAYPAL_INDIA_SECRET}`)}`,
            },
            body: 'grant_type=client_credentials',
        });

        const authData = await authResponse.json();
        const accessToken = authData.access_token;

        // Create PayPal order
        const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    reference_id: jbId,
                    amount: {
                        currency_code: transaction.currency,
                        value: transaction.amount.toFixed(2),
                    },
                    description: `Job Board Subscription - ${transaction.plan_id}`,
                }],
                application_context: {
                    brand_name: 'Apply Wizz Job Board',
                    landing_page: 'BILLING',
                    user_action: 'PAY_NOW',
                    return_url: `${req.headers.get('origin')}/payment/success?jbId=${jbId}`,
                    cancel_url: `${req.headers.get('origin')}/payment/cancel?jbId=${jbId}`,
                },
            }),
        });

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
            throw new Error(`PayPal API error: ${JSON.stringify(orderData)}`);
        }

        // Update transaction with PayPal order ID
        await supabase
            .from('jobboard_transactions')
            .update({
                payment_method: 'paypal',
                payment_account: 'india',
                transaction_id: orderData.id,
                updated_at: new Date().toISOString(),
            })
            .eq('jb_id', jbId);

        // Get approval URL
        const approvalUrl = orderData.links.find((link: any) => link.rel === 'approve')?.href;

        return new Response(
            JSON.stringify({
                success: true,
                orderId: orderData.id,
                approvalUrl,
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
});
