// Stripe Capture Payment - Shared for both Dubai and India
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.11.0?target=deno';

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
        const { jbId, account, paymentIntentId } = await req.json();

        if (!jbId || !account || !paymentIntentId) {
            throw new Error('Missing required parameters');
        }

        // Get Stripe secret key based on account
        const secretKey = account === 'dubai'
            ? Deno.env.get('STRIPE_DUBAI_SECRET_KEY')
            : Deno.env.get('STRIPE_INDIA_SECRET_KEY');

        // Initialize Stripe
        const stripe = new Stripe(secretKey!, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        });

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Retrieve payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        const status = paymentIntent.status === 'succeeded' ? 'success' : 'failed';
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
                payment_details: {
                    id: paymentIntent.id,
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    status: paymentIntent.status,
                    created: paymentIntent.created,
                },
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
                paymentIntentId: paymentIntent.id,
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
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'Unknown error',
                details: error.stack
            }),
            {
                status: 200, // Return 200 for easier frontend debugging
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
