import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/utils";
import { rateLimiter } from "@/utils/rateLimiter";
import { NextResponse } from "next/server";

export const config = {
    runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
    console.log('Entering pages/api/webhook/decipher.ts handler');
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }
    
    try {
        // Apply rate limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        const { success, limit, remaining, reset } = await rateLimiter(ip);

        if (!success) {
            return new Response(JSON.stringify({
                error: "Rate limit exceeded",
                limit,
                remaining,
                reset
            }), {
                status: 429,
                headers: {
                    "Content-Type": "application/json",
                    "X-RateLimit-Limit": limit.toString(),
                    "X-RateLimit-Remaining": remaining.toString(),
                    "X-RateLimit-Reset": reset.toString()
                }
            });
        }

        const webhookData = await req.json();
        const headers = req.headers;
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    console.log('----------------- webhookData: ----------------------', webhookData);
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

        const clientId = process.env.PAYPAL_CLIENT_ID || 'CLIENT_ID';
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'CLIENT_SECRET';
        const webhook_id = process.env.PAYPAL_WEBHOOK_ID || 'WEBHOOK_ID';
        
        const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
          },
          body: 'grant_type=client_credentials'
        });
        
        if (!tokenResponse.ok) {
          throw new Error(`HTTP error! status: ${tokenResponse.status}`);
        }
        
        const tokenData = await tokenResponse.json();

        const accessToken = tokenData.access_token;

        const verifyWebhookSignature = await fetch('https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                "auth_algo": headers.get('paypal-auth-algo'),
                "cert_url": headers.get('paypal-cert-url'),
                "transmission_id": headers.get('paypal-transmission-id'),
                "transmission_sig": headers.get('paypal-transmission-sig'),
                "transmission_time": headers.get('paypal-transmission-time'),
                "webhook_id": webhook_id,
                "webhook_event": webhookData
            })
        });

        const verifyWebhookSignatureData = await verifyWebhookSignature.json();


        if  (webhookData.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
            console.log('Subscription activated');
            const subscriptionId = webhookData.resource.id;
            console.log('Subscription ID:', subscriptionId);

            const userId = webhookData.resource.custom_id;
            console.log('User ID:', userId);

            const planId = webhookData.resource.plan_id;

            const subscription = await supabaseAdmin
                .from('subscriptions')
                .select('*')
                .eq('customer_id', userId)
                .single();
            
            console.log('Subscription:', subscription);

            if (subscription.error) {
                await supabaseAdmin
                    .from('subscriptions')
                    .insert([
                        {
                            customer_id: userId,
                            subscription_id: subscriptionId,
                            plan_id: planId,
                            status: 'active'
                            
                        }
                    ]);
            } else {
                await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        subscription_id: subscriptionId,
                        plan_id: planId,
                        status: 'active'
                    })
                    .eq('customer_id', userId);
            }

        } 

        if(webhookData.event_type === 'BILLING.SUBSCRIPTION.CANCELLED'
            || webhookData.event_type === 'BILLING.SUBSCRIPTION.SUSPENDED'
            || webhookData.event_type === 'BILLING.SUBSCRIPTION.EXPIRED'

        ) {
            console.log('Subscription cancelled');
            const subscriptionId = webhookData.resource.id;
            console.log('Subscription ID:', subscriptionId);

            const userId = webhookData.resource.custom_id;
            console.log('User ID:', userId);

            const subscription = await supabaseAdmin
                .from('subscriptions')
                .select('*')
                .eq('customer_id', userId)
                .single();  

            console.log('Subscription:', subscription);

            if (subscription.error) {
                return NextResponse.json({
                    error: 'Subscription not found'
                }, { status: 404 });
            }

            await supabaseAdmin
                .from('subscriptions')
                .update({
                    status: 'cancelled'
                })
                .eq('customer_id', userId);

                

        }

        return NextResponse.json({
            success: true,
            verificationResult: verifyWebhookSignatureData
        }, { status: 200 });
        
    } catch (error: unknown) {
        console.error("Error in /api/webhook/decipher:", error);
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        }
        return NextResponse.json({
            error: "An unknown error occurred"
        }, { status: 500 });
    }
};

export default handler;