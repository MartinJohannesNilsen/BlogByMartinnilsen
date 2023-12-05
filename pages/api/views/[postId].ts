import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseAdmin } from "../../../lib/supabase-admin";
import { validateAuthAPIToken } from "..";

/**
 * @swagger
 * /api/views/{postId}:
 *   get:
 *     summary: Get view counts of post
 *     description: Fetches view counts of post with id equal to parameter 'postId'.
 *     tags:
 *       - Views
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *          application/json:
 *           example:
 *            postId: 1
 *       '404':
 *         description: View count not found.
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 *   put:
 *     summary: Increment view counts of post
 *     description: Increments view counts of post with id equal to parameter 'postId'.
 *     tags:
 *       - Views
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *     responses:
 *       '204':
 *         description: Successful response.
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

  // Check if id is provided
  const { postId } = req.query;
  if (
    !postId ||
    postId == "{postId}" ||
    postId === "" ||
    typeof postId !== "string"
  ) {
    return res.status(400).json({ code: 400, reason: "Missing postId" });
  }

  if (req.method === "GET") {
    // Query the pages table in the database where slug equals the request params slug.
    const { data } = await SupabaseAdmin.from("posts")
      .select("view_count")
      .filter("post_id", "eq", postId);
    // Return
    if (data) {
      return res.status(200).json({
        view_count: data[0]?.view_count || null,
      });
    } else {
      return res
        .status(404)
        .json({ code: 500, reason: "View count not found" });
    }
  } else if (req.method === "PUT") {
    // Call our stored procedure with the post_id set by the request params slug
    await SupabaseAdmin.rpc("increment_post_view_count", {
      input_id: postId,
    }).then((db_res) => {
      return res.status(db_res.status).json({ statusText: db_res.statusText });
    });
  } else {
    return res.status(501).json({ code: 501, reason: "Method not supported" });
  }
}
