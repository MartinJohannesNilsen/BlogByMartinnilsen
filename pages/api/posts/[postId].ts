import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseConfig";
import { validateAuthAPIToken } from "..";

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get post details by postId
 *     description: Retrieve details for a specific post by providing the post ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: false
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *               postId: "123"
 *               postTitle: "Sample Post"
 *       '404':
 *         description: Post not found.
 *         content:
 *           application/json:
 *             example:
 *               code: 400
 *               reason: "Post not found"
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               reason: "Internal Server Error"
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
  if (!postId || postId == "{postId}" || postId === "") {
    return res.status(400).json({ code: 400, reason: "Missing postId" });
  }

  if (req.method === "GET") {
    // Get post by id
    try {
      const data = await getDoc(doc(db, "posts", String(postId))).then((data) =>
        data.data()
      );
      if (!data)
        return res.status(404).json({ code: 404, reason: "Post not found" });
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "PUT") {
    // Set field of post
    const { data, ...fields } = req.body;
    if (Object.keys(fields).length === 0) {
      return res.status(400).send("Need to have some fields for update!");
    }

    // Fetch post
    let post = await getDoc(doc(db, "posts", String(postId)))
      .then((docSnapshot) => docSnapshot.data())
      .catch((error) => {
        console.error("Error fetching document:", error);
        return null;
      });
    if (!post) return res.status(422).send("Id not found!");

    // Check if 'data' is set to be updated and not already a string, then stringify it
    if (data !== undefined && typeof data !== "string") {
      fields.data = JSON.stringify(data);
    }

    // Alter post
    const updatedPost = { ...post, ...fields };

    // Push updates
    const docRef = doc(db, "posts", String(postId));
    await updateDoc(docRef, updatedPost)
      .then((data) => {
        return res.status(200).send("");
      })
      .catch((error) => {
        return res.status(400).send("Update failed");
      });
  } else {
    return res
      .status(405)
      .send("Method not allowed, only GET and POST allowed!");
  }
}
