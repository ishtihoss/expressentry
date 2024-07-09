import { supabase } from "@/lib/supabaseClient";
import { openai, supabaseAdmin } from "@/utils";
import { rateLimiter } from "@/utils/rateLimiter";
import { NextResponse } from "next/server";

export const config = {
    runtime: "edge",
};

const handler = async (req: Request) => {
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }
    
    try {

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
    console.log("🚀 ~ handler ~ accessToken:", accessToken)

    const { data : {user}} = await supabase.auth.getUser(accessToken);
    console.log("🚀 ~ handler ~ data:", user)


    if (!user) {
        return NextResponse.json("User not found", { status: 404 });
    }

    const subscription = await supabaseAdmin.from('subscriptions')
    .select('*').eq('status', 'active')
    .eq('customer_id', user.id).single();

    if (!subscription || subscription.error) {
        return NextResponse.json( {
            isSubscribed : false,
            subscription : null
        },{status: 404})
    }

        const formData = await req.formData();
        const file = formData.get("file") as File;
    
        // Do something with the file
        console.log("🚀 ~ file:", file);

       const res = await supabaseAdmin.storage
            .from("resume")
            .upload(file.name, file, {
                cacheControl: "public, max-age=31536000, immutable",
            });

        console.log("🚀 ~ res:", res);

        const assisstant = await openai.beta.assistants.create({
            name : 'Feedback',
            instructions : 'Please provide feedback on how to align this document with canada express entry immigration system in under 100 words.',
            model : 'gpt-4o',
            tools : [
                {
                    type : 'file_search'
                }
            ]
        });

        const openAiFile = await openai.files.create({
            purpose : 'assistants',
            file
        });



        const thread = await openai.beta.threads.create({

            messages : [
                {
                    role : 'user',
                    content : 'I need feedback on this document to improve my chances of getting ITA in Canada express entry program. Keep feedback under 100 words.',
                    attachments : [ 
                        {
                            file_id : openAiFile.id,
                            tools : [
                                {
                                    type : 'file_search'
                                }
                            ]
                        }
                    ]
                }
            ]

        });

        console.log("🚀 ~ feedback:", thread);

            const run = await openai.beta.threads.runs.createAndPoll(thread.id,{
                assistant_id : assisstant.id
            })

            const messages = await openai.beta.threads.messages.list(thread.id,{
                run_id : run.id
            });


            const message = messages.data.pop()!;
            // console.log("🚀 ~ message:", message);

            let citations : string[] = [];
            let textArray : string[] = [];
            
            if (message.content[0].type === "text") {

                console.log("🚀 ~ message: here");
                const { text } = message.content[0];


                //make the text into an array of strings
                
                textArray = text.value.split("\n");

                // console.log(textArray);

                //find the citations
                textArray.forEach((line : string) => {
                    if (line.includes("Citation")) {
                        citations.push(line);
                    }
                });
                
                // console.log(text.value);
                console.log(citations.join("\n"));
              }


            
        
        return NextResponse.json({ success: true, 

            message : message.content ,
            citations,
            textArray
         }, { status: 200 });
    } catch (error : any) {
        console.error("Error processing request", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export default handler;