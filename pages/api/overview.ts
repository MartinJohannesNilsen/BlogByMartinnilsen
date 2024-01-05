import { doc, getDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/firebaseConfig";
import { validateAuthAPIToken } from ".";

/**
 * @swagger
 * /api/overview:
 *   get:
 *     summary: Get overview of posts
 *     description: Get all posts without data.
 *     tags:
 *       - Default
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              [
 *                {
 *                  "author": "Martin Johannes Nilsen",
 *                  "createdAt": 1674860419907,
 *                  "updatedAt": 1699721335587,
 *                  "tags": ["Personal"],
 *                  "image": "https://firebasestorage.googleapis.com/v0/b/blogbymartinnilsen.appspot.com/o/Images%2F2023-09-02.154956.png",
 *                  "readTime": "5 min read",
 *                  "id": "yjdttN68e7V3E8SKIupT",
 *                  "published": true,
 *                  "title": "Hello, I'm Martin",
 *                  "description": "Allow me to introduce myself",
 *                  "type": "About me"
 *                 }
 *                ]
 *       '404':
 *         description: Database entry 'tags' not found.
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
    try {
      const data = await getDoc(doc(db, "administrative", "overview")).then(
        (data) => data.data().values
      );
      if (!data) return res.status(404).send("Overview not found!");
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    return res.status(501).json({ code: 501, reason: "Method not supported" });
  }
}
