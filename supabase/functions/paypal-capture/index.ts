// PayPal Capture Payment - Shared for both Dubai and India
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
        const { jbId, account, orderId } = await req.json();

        if (!jbId || !account || !orderId) {
            throw new Error('Missing required parameters');
        }

        // Get PayPal credentials based on account
        const clientId = account === 'dubai'
            ? Deno.env.get('PAYPAL_DUBAI_CLIENT_ID')
            : Deno.env.get('PAYPAL_INDIA_CLIENT_ID');

        const secret = account === 'dubai'
            ? Deno.env.get('PAYPAL_DUBAI_SECRET')
            : Deno.env.get('PAYPAL_INDIA_SECRET');

        // FORCE SANDBOX for testing if variable is missing
        const PAYPAL_API_URL = Deno.env.get('PAYPAL_API_URL') || 'https://api-m.sandbox.paypal.com';

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get PayPal access token
        const authResponse = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${clientId}:${secret}`)}`,
            },
            body: 'grant_type=client_credentials',
        });

        const authData = await authResponse.json();
        const accessToken = authData.access_token;

        // Capture PayPal order
        const captureResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const captureData = await captureResponse.json();

        if (!captureResponse.ok) {
            // Check if error is "Order already captured"
            const errorName = captureData.name || captureData.error;
            const errorDetails = captureData.details?.[0]?.issue || '';

            if (errorName === 'UNPROCESSABLE_ENTITY' && errorDetails === 'ORDER_ALREADY_CAPTURED') {
                console.log('Order already captured, retrieving details...');
                // If already captured, we can consider this a success or fetch the capture details
                // Ideally we should fetch the order details to get the capture ID
                // For now, we will return a success status, assuming the previous capture worked
                // Better: Check if our DB already has it marked as success

                // Fetch transaction status from DB
                const { data: currentTxn } = await supabase
                    .from('jobboard_transactions')
                    .eq('jb_id', jbId)
                    .single();

                if (currentTxn && currentTxn.payment_status === 'success') {
                    return new Response(
                        JSON.stringify({
                            success: true,
                            status: 'success',
                            captureId: currentTxn.transaction_id,
                            message: 'Order already captured'
                        }),
                        { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
                    );
                }
            }

            throw new Error(`PayPal capture error: ${JSON.stringify(captureData)}`);
        }

        const status = captureData.status === 'COMPLETED' ? 'success' : 'failed';
        const now = new Date().toISOString();

        // Get transaction to calculate plan dates
        const { data: transaction } = await supabase
            .from('jobboard_transactions')
            .select('*')
            .eq('jb_id', jbId)
            .single();

        // Calculate plan end date
        let planEnded = null;
        if (status === 'success' && transaction) {
            const planConfigs = {
                'monthly': 1,
                '3-months': 3,
                '6-months': 6,
            };
            const months = planConfigs[transaction.plan_id] || 1;
            const endDate = new Date(now);
            endDate.setMonth(endDate.getMonth() + months);
            planEnded = endDate.toISOString();
        }

        // Update transaction
        const { error: updateError } = await supabase
            .from('jobboard_transactions')
            .update({
                payment_status: status,
                plan_started: status === 'success' ? now : null,
                plan_ended: planEnded,
                payment_details: captureData,
                updated_at: now,
            })
            .eq('jb_id', jbId);

        if (updateError) throw updateError;

        // Fetch the updated transaction to ensure email has correct dates/status
        const { data: updatedTransaction } = await supabase
            .from('jobboard_transactions')
            .select('*')
            .eq('jb_id', jbId)
            .single();

        // Send email notification and get result
        const emailResult = await sendEmailNotification(supabase, jbId, status, updatedTransaction);

        return new Response(
            JSON.stringify({
                success: true,
                status,
                captureId: captureData.id,
                emailSent: emailResult.success,
                emailError: emailResult.error
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    } catch (error: any) {
        console.error('Error:', error);

        // RETURN 200 with success: false so frontend can see the error message
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'Unknown error',
                details: error.stack
            }),
            {
                status: 200, // Changed from 400 to 200 for debugging
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
});

async function sendEmailNotification(supabase: any, jbId: string, status: string, transaction: any) {
    try {
        // Get transaction details if not provided
        if (!transaction) {
            const { data } = await supabase
                .from('jobboard_transactions')
                .select('*')
                .eq('jb_id', jbId)
                .single();
            transaction = data;
        }

        // Call email edge function using direct fetch to ensure headers are correct
        // This mimics the successful curl command
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

        const response = await fetch(`${supabaseUrl}/functions/v1/send-payment-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`
            },
            body: JSON.stringify({
                to: transaction.email,
                jbId,
                status,
                transaction,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Email function failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error: any) {
        console.error('Email notification error:', error);
        return { success: false, error: error.message || JSON.stringify(error) };
    }
}
