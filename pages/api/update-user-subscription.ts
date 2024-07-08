import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/utils";
import { rateLimiter } from "@/utils/rateLimiter";
import { createRouteHandlerClient,  } from "@supabase/auth-helpers-nextjs";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export const config = {
    runtime: "edge",
};

const handler = async (req: Request) : Promise<Response> => {
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
     
        const clientId = process.env.PAYPAL_CLIENT_ID || 'CLIENT_ID';
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'CLIENT_SECRET';

        const tokenResponse = await fetch( process.env.PAYPAL_API_URL +  '/v1/oauth2/token', {
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

          const body = await req.json();

          const {userId , subscriptionId, orderId, planId} = body;

          const orderDetails = await fetch(
                process.env.PAYPAL_API_URL + '/v2/checkout/orders/' + orderId,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    }
                }
          ).then((res) => res.json());

          console.log('🚀 ~ orderDetails:', orderDetails);

          if(orderDetails.status !== 'APPORVED') {
            const subscription = await supabaseAdmin.from('subscriptions').select('*').eq('customer_id', userId).single();

            if(subscription.error) {
                await supabaseAdmin.from('subscriptions').insert({
                    customer_id: userId,
                    subscription_id: subscriptionId,
                    plan_id: planId,
                    status: 'active'
                });
            } else {
                await supabaseAdmin.from('subscriptions').update({
                    subscription_id: subscriptionId,
                    plan_id: planId,
                    status: 'active'
                }).eq('customer_id', userId);
            }

          }

          return NextResponse.json( {
            success : true,
            orderDetails
        },{status: 200})
        
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        }
        return new Response("An error occurred", { status: 500 });
    }


        
}

export default handler;