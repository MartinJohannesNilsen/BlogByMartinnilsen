import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseConfig";
import { validateAuthAPIToken } from "..";
import { deletePost } from "../../../database/posts";
import { deletePostsOverview } from "../../../database/overview";
import { FirestoreFullPost } from "../../../types";

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get post with postId
 *     description: Retrieve details for post with id equal to provided postId.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *       - in: query
 *         name: parseData
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Whether to parse data field of post.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *               title: "Post title"
 *               description: "Post description"
 *               createdAt: 1701103064042
 *               type: "Tutorial"
 *               data: "{\"time\":1701472725450,\"blocks\":[],\"version\":\"2.28.2\"}"
 *               tags: ["Development","Python"]
 *               author: "Martin Johannes Nilsen"
 *               published: false
 *               updatedAt: 1701472730348
 *               readTime: "2 min read"
 *               image: ""
 *       '404':
 *         description: Post not found.
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 *   put:
 *     summary: Update post with postId
 *     description: Update document of post with id equal to provided postId.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                type string
 *               description:
 *                type string
 *               createdAt:
 *                type number
 *               type:
 *                type string
 *               data:
 *                type string
 *               tags:
 *                type list
 *               author:
 *                type string
 *               published:
 *                type boolean
 *               updatedAt:
 *                type number
 *               readTime:
 *                type string
 *               image:
 *                type string
 *             example:
 *               title: ""
 *               description: ""
 *               createdAt: 0
 *               type: ""
 *               data: ""
 *               tags: []
 *               author: ""
 *               published: false
 *               updatedAt: 0
 *               readTime: ""
 *               image: ""
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *               title: "Post title"
 *               description: "Post description"
 *               createdAt: 1701103064042
 *               type: "Tutorial"
 *               data: "{\"time\":1701472725450,\"blocks\":[],\"version\":\"2.28.2\"}"
 *               tags: ["Development","Python"]
 *               author: "Martin Johannes Nilsen"
 *               published: false
 *               updatedAt: 1701472730348
 *               readTime: "2 min read"
 *               image: ""
 *       '404':
 *         description: Post not found.
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 *   delete:
 *     summary: Delete post with postId
 *     description: Delete specific post with id equal to provided postId.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *       - in: query
 *         name: revalidatePages
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to revalidate pages upon deletion.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/plain:
 *             example:
 *              "Successfully deleted post: '7FPz85Fkv8sHN3aAIx0r'"
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

  // Get query parameter if present
  const parseData = req.query.parseData;

  // Get query parameter if present
  const revalidatePagesAfterDeleting = req.query.revalidatePages;

  if (req.method === "GET") {
    // Get post by id
    try {
      const post = await getDoc(doc(db, "posts", String(postId))).then((data) =>
        data.data()
      );
      if (!post) {
        return res.status(404).json({ code: 404, reason: "Post not found" });
      }
      if (
        parseData &&
        typeof parseData === "string" &&
        parseData.toLowerCase() === "true"
      ) {
        return res.status(200).send({ ...post, data: JSON.parse(post.data) });
      }
      return res.status(200).send(post);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "PUT") {
    // Decide which fields to change
    const { data, ...fields } = req.body;
    if (Object.keys(fields).length === 0) {
      return res
        .status(400)
        .json({ code: 400, reason: "Missing fields to update" });
    }

    // TODO Check that fields provided are all part of type FirestoreFullPost

    // Fetch post
    const post = await getDoc(doc(db, "posts", String(postId))).then((data) =>
      data.data()
    );
    if (!post) {
      return res.status(404).json({ code: 404, reason: "Post not found" });
    }

    // Check if 'data' is set to be updated and not already a string, then stringify it
    if (data !== undefined && typeof data !== "string") {
      fields.data = JSON.stringify(data);
    }

    // Alter post
    const updatedPost = { ...post, ...fields };

    // Push updates
    const docRef = doc(db, "posts", String(postId));
    await updateDoc(docRef, updatedPost)
      .then(async () => {
        const updatedPost = await getDoc(doc(db, "posts", String(postId)))
          .then((data) => data.data())
          .catch(() => {
            return res
              .status(500)
              .json({ code: 500, reason: "Retrieval of updated post failed" });
          });
        return res.status(200).json(updatedPost);
      })
      .catch(() => {
        return res.status(500).json({ code: 500, reason: "Update failed" });
      });
  } else if (req.method === "DELETE") {
    // Fetch post
    const post = await getDoc(doc(db, "posts", String(postId))).then((data) =>
      data.data()
    );
    if (!post) {
      return res.status(404).json({ code: 404, reason: "Post not found" });
    }

    deletePost(postId).then((postWasDeleted) => {
      if (postWasDeleted) {
        deletePostsOverview(postId).then(async (overviewWasUpdated) => {
          if (overviewWasUpdated) {
            if (
              revalidatePagesAfterDeleting &&
              typeof revalidatePagesAfterDeleting === "string" &&
              revalidatePagesAfterDeleting.toLowerCase() === "true"
            ) {
              try {
                // this should be the actual path not a rewritten path
                // e.g. for "/blog/[slug]" this should be "/blog/idOfBlogPost"
                await res.revalidate("/");
                await res.revalidate("/tags");
                await res.revalidate("/posts/" + postId);
                return res.status(200).json({
                  code: 200,
                  reason:
                    "Successfully deleted post '" +
                    postId +
                    "' and revalidated pages '/', '/tags' and '/posts/" +
                    postId +
                    "'",
                });
              } catch (err) {
                // If there was an error, Next.js will continue to show the last successfully generated page
                return res
                  .status(500)
                  .json({ code: 500, reason: "Error during revalidation" });
              }
            } else {
              return res.status(200).json({
                code: 200,
                reason:
                  "Successfully deleted post '" +
                  postId +
                  "' without revalidating pages",
              });
            }
          } else {
            return res.status(500).json({
              code: 500,
              reason: "Did not manage to delete from overview",
            });
          }
        });
      } else {
        return res.status(500).json({
          code: 500,
          reason: "Did not manage to delete from posts",
        });
      }
    });
  } else {
    return res.status(501).json({ code: 501, reason: "Method not supported" });
  }
}
