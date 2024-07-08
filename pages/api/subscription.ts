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
    if (req.method !== "GET") {
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


        const { data : {user}} = await supabase.auth.getUser(accessToken);


        if (!user) {
            return NextResponse.json("User not found", { status: 404 });
        }

        const data = await supabaseAdmin.from
        
        ('subscriptions').select('*').eq('status', 'active').eq('customer_id', user.id).single();


        const userRemainingQueries = await supabaseAdmin.from('user_queries')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)

        console.log('userRemainingQueries', userRemainingQueries)

        if (!data || data.error) {

            return NextResponse.json( {
                isSubscribed : false,
                subscription : null,
                count : userRemainingQueries.count
            },{status: 200})
        }
        
        return NextResponse.json( {
            isSubscribed : true,
            count : userRemainingQueries.count,
            subscription : data
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