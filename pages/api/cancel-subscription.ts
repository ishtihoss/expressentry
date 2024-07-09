import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/utils";
import { rateLimiter } from "@/utils/rateLimiter";
import { NextResponse } from "next/server";

export const config = {
    runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
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

        const accessToken = req.headers.get('Authorization')?.replace('Bearer ', '');
        if (!accessToken) {
            return NextResponse.json("Authorization token is missing", { status: 401 });
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return NextResponse.json("User not found", { status: 404 });
        }

        // Get the current subscription
        const { data: subscription, error: subscriptionError } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('customer_id', user.id)
            .eq('status', 'active')
            .single();

        if (subscriptionError || !subscription) {
            console.error("Error fetching subscription:", subscriptionError);
            return NextResponse.json("No active subscription found", { status: 404 });
        }

        // Update the subscription status to 'canceled'
        const { data: updatedSubscription, error: updateError } = await supabaseAdmin
            .from('subscriptions')
            .update({
                status: 'canceled',
                canceled_at: new Date().toISOString()
            })
            .eq('id', subscription.id)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating subscription:", updateError);
            return NextResponse.json("Failed to cancel subscription", { status: 500 });
        }

        return NextResponse.json({
            success: true,
            subscription: updatedSubscription
        }, { status: 200 });
    }
    catch (error: unknown) {
        console.error("Unexpected error in cancel-subscription:", error);
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        }
        return new Response("An unexpected error occurred", { status: 500 });
    }
}

export default handler;