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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { query, userId } = req.body;

  if (!query || !userId) {
    return res.status(400).json({ message: "Query and userId are required" });
  }

  try {
    const tableName = userId === 'anonymous' ? 'anonymous_queries' : 'user_queries';
    
    // Get the current max query_count for the user or anonymous
    const { data: maxCountData, error: maxCountError } = await supabase
      .from(tableName)
      .select('query_count')
      .eq('user_id', userId)
      .order('query_count', { ascending: false })
      .limit(1)
      .single();

    if (maxCountError && maxCountError.code !== 'PGRST116') {
      console.error("Error fetching max query count:", maxCountError);
      return res.status(500).json({ message: "Error fetching max query count" });
    }

    const newQueryCount = (maxCountData?.query_count || 0) + 1;

    // Save the query with the incremented count
    const { data: savedQuery, error: saveError } = await supabase
      .from(tableName)
      .insert({ user_id: userId, query, query_count: newQueryCount });

    if (saveError) {
      console.error("Error saving query:", saveError);
      return res.status(500).json({ message: "Error saving query" });
    }

    console.log("Query saved successfully");
    return res.status(200).json({ message: "Query saved successfully", queryCount: newQueryCount });
  } catch (error) {
    console.error("Error saving query:", error);
    return res.status(500).json({ message: "Error saving query" });
  }
}