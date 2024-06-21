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
  if (req.method === "POST") {
    const { query, userId } = req.body;

    if (!query || !userId) {
      return res.status(400).json({ message: "Query and userId are required" });
    }

    try {
      // Start a transaction
      const { data, error } = await supabase.rpc('save_query_and_update_count', {
        p_query: query,
        p_user_id: userId
      });

      if (error) {
        console.error("Error saving query:", error);
        return res.status(500).json({ message: "Error saving query" });
      }

      console.log("Query saved successfully");
      return res.status(200).json({ message: "Query saved successfully", queryCount: data });
    } catch (error) {
      console.error("Error saving query:", error);
      return res.status(500).json({ message: "Error saving query" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}