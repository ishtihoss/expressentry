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
      const { data, error } = await supabase
        .from("user_queries")
        .select("count")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user stats:", error);
        return res.status(500).json({ message: "Error fetching user stats" });
      }

      return res.status(200).json({ queryCount: data?.count || 0 });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return res.status(500).json({ message: "Error fetching user stats" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}