import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or service role key");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    try {
      const isAnonymous = userId === 'anonymous';
      const tableName = isAnonymous ? 'anonymous_queries' : 'user_queries';
      
      // Get the IP address for anonymous users
      const ipAddress = isAnonymous ? req.headers['x-forwarded-for'] || req.socket.remoteAddress : null;

      const { data, error } = await supabase
        .from(tableName)
        .select("query_count")
        .eq("user_id", isAnonymous ? ipAddress : userId)
        .order('query_count', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching user stats:", error);
        return res.status(500).json({ message: "Error fetching user stats" });
      }

      return res.status(200).json({ queryCount: data?.query_count || 0 });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return res.status(500).json({ message: "Error fetching user stats" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}