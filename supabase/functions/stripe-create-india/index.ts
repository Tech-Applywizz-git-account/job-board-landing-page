// Stripe Create Payment Intent - India Account
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.11.0?target=deno';

const STRIPE_INDIA_SECRET_KEY = 'sk_test_51SpVTU1iNiSyT7uLOFWCKGgicXqxGqGCprI9bVBdaYcTge0vGUEVkZ0ERn6yF9vdQlQuq8lj4vzPUOSdmbp0gaMJ000ofCouXE';

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

        // Initialize Stripe
        const stripe = new Stripe(STRIPE_INDIA_SECRET_KEY!, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        });

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

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(transaction.amount * 100), // Convert to cents
            currency: transaction.currency.toLowerCase(),
            metadata: {
                jbId,
                planId: transaction.plan_id,
                customerEmail: transaction.email,
                customerName: transaction.full_name,
            },
            description: `Job Board Subscription - ${transaction.plan_id}`,
            receipt_email: transaction.email,
        });

        // Update transaction with Stripe payment intent ID
        await supabase
            .from('jobboard_transactions')
            .update({
                payment_method: 'stripe',
                payment_account: 'india',
                transaction_id: paymentIntent.id,
                updated_at: new Date().toISOString(),
            })
            .eq('jb_id', jbId);

        return new Response(
            JSON.stringify({
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
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
