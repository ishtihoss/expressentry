// pages/api/save-query.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or anon key");
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Entering pages/api/save-query.ts handler');
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { query } = req.body;
    console.log('Received query:', query);
    console.log("Received query:", query);

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    try {
      const { data, error } = await supabase
        .from("user_queries")
        .insert({ query });

      if (error) {
        console.error("Error saving query:", error);
        return res.status(500).json({ message: "Error saving query" });
      }

      console.log("Query saved successfully");
      return res.status(200).json({ message: "Query saved successfully" });
    } catch (error) {
      console.error("Error saving query:", error);
      return res.status(500).json({ message: "Error saving query" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
