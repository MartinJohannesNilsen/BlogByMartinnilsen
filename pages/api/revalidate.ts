import type { NextApiRequest, NextApiResponse } from "next";
import { validateAuthAPIToken } from ".";

/**
 * @swagger
 * /api/revalidate:
 *   get:
 *     summary: Revalidate NextJS page
 *     description: Revalidates a Next.js page.
 *     parameters:
 *       - name: path
 *         in: query
 *         description: The path of the Next.js page to revalidate.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              revalidated: true
 *       '400':
 *         description: Bad request. URL parameter is missing or invalid.
 *     tags:
 *       - Default
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

  // Check if query variable 'path' exists
  if (!req.query.path) {
    return res
      .status(400)
      .json({ code: 400, reason: "Missing path to revalidate" });
  }

  // Revalidate page
  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/idOfBlogPost"
    await res.revalidate(req.query.path as string);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue to show the last successfully generated page
    return res
      .status(400)
      .json({ code: 400, reason: "Error during revalidation" });
  }
}
