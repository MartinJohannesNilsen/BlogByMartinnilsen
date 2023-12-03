import type { NextApiRequest, NextApiResponse } from "next";
import { validateAuthAPIToken } from ".";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     description: Get all available tags.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              ["Tag1"]
 *       '404':
 *         description: Database entry 'tags' not found.
 *       '500':
 *         description: Internal Server Error.
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

  // Get tags
  try {
    const data = await getDoc(doc(db, "administrative", "tags")).then(
      (data) => data.data().values
    );
    if (!data) return res.status(404).send("Tags not found!");
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ code: 400, reason: error });
  }
}
