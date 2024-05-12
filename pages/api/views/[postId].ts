import { SupabaseAdmin } from "@/lib/supabaseAdmin";
import { validateAuthAPIToken } from "@/utils/validateAuthTokenPagesRouter";
import { NextApiRequest, NextApiResponse } from "next";

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
 *            viewCount: 1
 *       '404':
 *         description: View count not found.
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 *   post:
 *     summary: Increment or insert view count of post
 *     description: Registers a new visitor on post with id equal to parameter 'postId'.
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
 *   put:
 *     summary: Update view count of post
 *     description: Set new view count on post with id equal to parameter 'postId'.
 *     tags:
 *       - Views
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post.
 *       - name: viewCount
 *         in: query
 *         description: The new view count value.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Successful response.
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 *   delete:
 *     summary: Delete view count of post
 *     description: Delete view count for post with id equal to parameter 'postId'.
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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = validateAuthAPIToken(req);
	if (!authValidation.isValid) {
		return res.status(authValidation.code).json({ code: authValidation.code, reason: authValidation.reason });
	}

	// Check if id is provided
	const { postId } = req.query;
	if (!postId || postId == "{postId}" || postId == "," || postId === "" || typeof postId !== "string") {
		return res.status(400).json({ code: 400, reason: "Missing postId" });
	}

	if (req.method === "GET") {
		// Query the pages table in the database where slug equals the request params slug.
		const { data } = await SupabaseAdmin.from("views").select("viewCount").filter("postId", "eq", postId);
		// Return
		if (!data) return res.status(404).json({ code: 500, reason: "View count not found" });
		return data.length === 1
			? res.status(200).json({
					viewCount: data[0]?.viewCount || null,
			  })
			: res.status(500).json({ code: 500, reason: "Multiple view counts found, should be unique" });
	} else if (req.method === "POST") {
		// Call our stored procedure with the postId set by the request params slug
		await SupabaseAdmin.rpc("increment_post_view_count", {
			input_id: postId,
		}).then((db_res) => {
			if (db_res.status === 204) return res.status(db_res.status).send("");
			return res.status(db_res.status).json({ code: db_res.status, reason: db_res.statusText });
		});
	} else if (req.method === "PUT") {
		// Check if id is provided
		if (!req.query.viewCount) {
			return res.status(400).json({ code: 400, reason: "Missing view count" });
		}
		// Update view count for post with postId
		const { error } = await SupabaseAdmin.from("views")
			.update({ viewCount: req.query.viewCount })
			.eq("postId", postId)
			.single();
		return error
			? res.status(400).json({
					code: 400,
					reason: `Could not update view count for post '${postId}'`,
			  })
			: res.status(200).json({
					code: 200,
					reason: `Updated view count of post '${postId}' to ${req.query.viewCount}`,
			  });
	} else if (req.method === "DELETE") {
		// Delete row where postId equal query parameter postId
		const { error } = await SupabaseAdmin.from("views").delete().eq("postId", postId).single();
		return error
			? res.status(400).json({
					code: 400,
					reason: `Could not delete view count of post '${postId}'`,
			  })
			: res.status(200).json({
					code: 200,
					reason: `Deleted view count of post '${postId}'`,
			  });
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}
