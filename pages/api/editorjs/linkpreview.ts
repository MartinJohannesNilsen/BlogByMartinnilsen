import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/editorjs/linkpreview:
 *   get:
 *     summary: Fetch link preview attributes
 *     description: Fetches link preview attributes for a given URL.
 *     tags:
 *       - EditorJS
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL for which link preview attributes are to be fetched.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              success: 1
 *              meta: {
 *               title: "Sample Link",
 *               description: "This is a sample link.",
 *               image: "https://example.com/sample.jpg",
 *               url: https://example.com
 *              }
 *
 *       '400':
 *         description: Bad request. URL parameter is missing or invalid.
 *       '500':
 *         description: Internal server error.
 *       '501':
 *         description: Method not supported.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Removed due to editorjs component not supporting additional parameters
  // Check for secret to confirm this is a valid request
  // if (!req.query.secret) {
  //   return res.status(400).json({ code: 400, reason: "Missing token" });
  // } else if (req.query.secret !== process.env.NEXT_PUBLIC_LINKPREVIEW_API_KEY) {
  //   return res.status(400).json({ code: 400, reason: "Invalid token" });
  // }

  // Check if url is set
  if (!req.query.url) {
    return res.status(400).json({ code: 400, reason: "Missing url" });
  }

  if (req.method === "GET") {
    try {
      const api = await fetch(
        "http://api.linkpreview.net/?key=" +
          process.env.NEXT_PUBLIC_LINKPREVIEW_API_KEY +
          "&q=" +
          req.query.url
      ).then((data) => data.json());
      if (api.error === undefined) {
        return res.json({ success: 1, meta: api });
      } else {
        return res.status(400).json({ code: 400, reason: "Invalid url" });
      }
    } catch (err) {
      return res.status(500).json({ code: 401, reason: err });
    }
  } else {
    return res.status(501).json({ code: 501, reason: "Method not supported" });
  }
}
