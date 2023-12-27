import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseAdmin } from "../../../lib/supabase-admin";
import { validateAuthAPIToken } from "..";

/**
 * @swagger
 * /api/views:
 *   get:
 *     summary: Get view counts of all posts
 *     description: Fetches view counts of all posts.
 *     tags:
 *       - Views
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *          application/json:
 *           example:
 *            2vl7PgaUvfwe3T9R4l3a: 1
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
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
    const { data, error } = await SupabaseAdmin.from("views").select(
      "postId, viewCount"
    );

    if (data) {
      let viewCounts = {};
      data.map((row) => (viewCounts[row.postId] = row.viewCount));
      return res.status(200).json(viewCounts || null);
    } else if (error) {
      console.log("Error:", error);
    }
  } else {
    return res.status(501).json({ code: 501, reason: "Method not supported" });
  }
}
