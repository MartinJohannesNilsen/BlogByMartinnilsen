import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseAdmin } from "../../../lib/supabase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if id is provided
  if (!req.query) {
    return res.status(401).json({ message: "Missing id" });
  }
  const { postId } = req.query;

  if (req.method === "POST") {
    // Call our stored procedure with the post_id set by the request params slug
    await SupabaseAdmin.rpc("increment_post_view_count", {
      input_id: postId,
    }).then((db_res) => {
      return res.status(db_res.status).json({ statusText: db_res.statusText });
    });
  }

  if (req.method === "GET") {
    // Query the pages table in the database where slug equals the request params slug.
    const { data } = await SupabaseAdmin.from("posts")
      .select("view_count")
      .filter("post_id", "eq", postId);

    if (data) {
      return res.status(200).json({
        view_count: data[0]?.view_count || null,
      });
    }
  }

  return res.status(400).json({
    message: "Unsupported Request",
  });
}
