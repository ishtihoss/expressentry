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

  const { completedTasks, userId } = req.body;

  if (!completedTasks || !userId) {
    return res.status(400).json({ message: "Completed tasks and userId are required" });
  }

  try {
    const { error } = await supabase
      .from('completed_tasks')
      .upsert({ user_id: userId, completed_tasks: completedTasks });

    if (error) {
      console.error("Error saving progress:", error);
      return res.status(500).json({ message: "Error saving progress" });
    }

    console.log("Progress saved successfully");
    return res.status(200).json({ message: "Progress saved successfully" });
  } catch (error) {
    console.error("Error saving progress:", error);
    return res.status(500).json({ message: "Error saving progress" });
  }
}