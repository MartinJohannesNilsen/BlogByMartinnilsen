import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseAdmin } from "../../../lib/supabase-admin";
import { validateAuthAPIToken } from "..";

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   get:
 *     summary: Get notification by id
 *     description: Fetches notification object with id equal to parameter 'notificationId'.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              {
 *                "id": 1,
 *                "created_at": "2023-12-26T17:56:37.351648+00:00",
 *                "title": "Test",
 *                "content": "This is a test",
 *                "action": {
 *                  "href": "/",
 *                  "caption": "read more"
 *                },
 *                "important": false
 *              }
 *       '404':
 *         description: Notification not found.
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 *   put:
 *     summary: Update notification with notificationId
 *     description: Update notification with id equal to provided postId.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: notificationId
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
 *   delete:
 *     summary: Delete notification
 *     description: Delete notification with id equal to parameter 'notificationId'.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: notificationId
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
	const { notificationId } = req.query;
	if (
		!notificationId ||
		notificationId == "{notificationId}" ||
		notificationId === "" ||
		typeof notificationId !== "string"
	) {
		return res.status(400).json({ code: 400, reason: "Missing notificationId" });
	}

	if (req.method === "GET") {
		// Query the pages table in the database where slug equals the request params slug.
		const { data, error } = await SupabaseAdmin.from("notifications")
			.select("id, createdAt, title, content, action, important")
			.filter("id", "eq", notificationId)
			.single();
		// Return
		if (data) {
			return res.status(200).json(data);
		} else {
			return res.status(404).json({ code: 404, reason: "Notification not found" });
		}
	} else if (req.method === "PUT") {
		if (req.body.id)
			return res.status(400).json({
				code: 400,
				reason: "Update not followed through. Id should not be updated!",
			});
		const { data, error } = await SupabaseAdmin.from("notifications")
			.update(req.body)
			.eq("id", notificationId)
			.select();
		return data && data.length === 1
			? res.status(200).json({ code: 200, reason: "Notification successfully updated" })
			: res.status(400).json({ code: 400, reason: "No changes made" });
	} else if (req.method === "DELETE") {
		// Delete row where postId equal query parameter postId
		const { error } = await SupabaseAdmin.from("notifications").delete().eq("id", notificationId).single();
		return error
			? res.status(400).json({
					code: 400,
					reason: `Could not delete view count of notification '${notificationId}'`,
			  })
			: res.status(200).json({
					code: 200,
					reason: `Deleted view count of post '${notificationId}'`,
			  });
	} else {
		return res.status(501).json({ code: 501, reason: "Method not supported" });
	}
}
