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
      // Save the query
      const { data: savedQuery, error: saveError } = await supabase
        .from('user_queries')
        .insert({ user_id: userId, query });

      if (saveError) {
        console.error("Error saving query:", saveError);
        return res.status(500).json({ message: "Error saving query" });
      }

      // Fetch the updated query count
      const { data: queryCountData, error: countError } = await supabase
        .from('user_queries')
        .select('count')
        .eq('user_id', userId)
        .single();

      if (countError) {
        console.error("Error fetching query count:", countError);
        return res.status(500).json({ message: "Error fetching query count" });
      }

      const queryCount = queryCountData?.count || 0;

      console.log("Query saved successfully");
      return res.status(200).json({ message: "Query saved successfully", queryCount });
    } catch (error) {
      console.error("Error saving query:", error);
      return res.status(500).json({ message: "Error saving query" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}