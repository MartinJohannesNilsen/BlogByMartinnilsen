import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseAdmin } from "../../../lib/supabase-admin";
import { validateAuthAPIToken } from "..";

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     description: Fetches all notifications.
 *     tags:
 *       - Notifications
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              [
 *                {
 *                  "id": 1,
 *                  "created_at": "2023-12-26T17:56:37.351648+00:00",
 *                  "title": "Test",
 *                  "content": "This is a test",
 *                  "action": {
 *                    "href": "/",
 *                    "caption": "read more"
 *                  },
 *                  "important": false
 *                }
 *              ]
 *
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 *   post:
 *     summary: Create notification
 *     description: Create notification. Key 'CreatedAt' defaults to now(), but could be set as time-date format string.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               createdAt:
 *                type: string
 *                format: date-time
 *                nullable: true
 *               title:
 *                type string
 *               content:
 *                type string
 *               action:
 *                  href:
 *                    type: string
 *                  caption:
 *                    type: string
 *               important:
 *                type boolean
 *             example:
 *               title: "Test"
 *               content: "Hello world"
 *               action:
 *                  href: "/"
 *                  caption: "read more"
 *               important: false
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *               id: "0"
 *               createdAt: "2023-12-26T17:56:37.351648+00:00"
 *               title: "Test"
 *               content: "Hello world"
 *               action:
 *                  href: "/"
 *                  caption: "read more"
 *               important: false
 *       '404':
 *         description: Post not found.
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
    const { data } = await SupabaseAdmin.from("notifications").select(
      "id, createdAt, title, content, action, important"
    );

    if (data) {
      // let notifications = {};
      // data.map((row) => (viewCounts[row.postId] = row.viewCount));
      return res.status(200).json(data);
    } else {
      return res
        .status(500)
        .json({ code: 500, reason: "Internal server error" });
    }
  } else if (req.method === "POST") {
    if (req.body.id)
      return res.status(400).json({
        code: 400,
        reason: "Post not followed through. Id is set automatically!",
      });

    // Insert data in database
    const { data, error } = await SupabaseAdmin.from("notifications")
      .insert(req.body)
      .select()
      .single();
    return error || !data
      ? res
          .status(500)
          .json({ code: 500, reason: "Could not insert to database" })
      : res.status(200).json(data);
  } else {
    return res.status(501).json({ code: 501, reason: "Method not supported" });
  }
}
