import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseAdmin } from "../../../lib/supabase-admin";
import { validateAuthAPIToken } from "..";

/**
 * @swagger
 * /api/views:
 *   get:
 *     summary: Get view counts of all posts
 *     description: Fetches view counts of all posts.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *          application/json:
 *           example:
 *            postId: 1
 *     tags:
 *       - Views
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate authorized access based on header field 'apikey'
  const authValidation = validateAuthAPIToken(req);
  if (!authValidation.isValid) {
    return res
      .status(authValidation.code)
      .json({ code: authValidation.code, reason: authValidation.reason });
  }

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

  return res.status(500).json({
    message: "Unsupported Request",
  });
}
