import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseAdmin } from "../../../lib/supabase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Query the pages table in the database where slug equals the request params slug.
    const { data, error } = await SupabaseAdmin.from("posts").select(
      "post_id, view_count"
    );

    if (data) {
      let view_counts = {};
      data.map((row) => (view_counts[row.post_id] = row.view_count));
      return res.status(200).json(view_counts || null);
    } else if (error) {
      console.log("Error:", error);
    }
  }

  return res.status(400).json({
    message: "Unsupported Request",
  });
}
