import { validateAuthAPIToken } from "@/lib/tokenValidationAPI";
import { NextRequest } from "next/server";
import { SupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

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
 */
export async function GET(request: NextRequest, { params }: { params: { notificationId: string } }) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Check if id is provided
	const notificationId = params.notificationId;
	if (
		!notificationId ||
		notificationId == "{notificationId}" ||
		notificationId === "" ||
		typeof notificationId !== "string"
	) {
		return Response.json({ code: 400, reason: "Missing notificationId" }, { status: 400 });
	}

	// Query the pages table in the database where slug equals the request params slug.
	const { data, error } = await SupabaseAdmin.from("notifications")
		.select("id, createdAt, title, content, action, important")
		.filter("id", "eq", notificationId)
		.single();
	// Return
	if (data) {
		return Response.json(data, { status: 200 });
	} else {
		return Response.json({ code: 404, reason: "Notification not found" }, { status: 400 });
	}
}

/**
 * @swagger
 * /api/notifications/{notificationId}:
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
 */
export async function PUT(request: NextRequest, { params }: { params: { notificationId: string } }) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Check if id is provided
	const notificationId = params.notificationId;
	if (
		!notificationId ||
		notificationId == "{notificationId}" ||
		notificationId === "" ||
		typeof notificationId !== "string"
	) {
		return Response.json({ code: 400, reason: "Missing notificationId" }, { status: 400 });
	}

	// Update using requestBody
	const requestBody = await request.json();
	if (requestBody.id)
		return Response.json(
			{
				code: 400,
				reason: "Update not followed through. Id should not be updated!",
			},
			{ status: 400 }
		);
	const { data, error } = await SupabaseAdmin.from("notifications")
		.update(requestBody)
		.eq("id", notificationId)
		.select();
	return data && data.length === 1
		? Response.json({ code: 200, reason: "Notification successfully updated" }, { status: 200 })
		: Response.json({ code: 400, reason: "No changes made" }, { status: 400 });
}

/**
 * @swagger
 * /api/notifications/{notificationId}:
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
export async function DELETE(request: NextRequest, { params }: { params: { notificationId: string } }) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Check if id is provided
	const notificationId = params.notificationId;
	if (
		!notificationId ||
		notificationId == "{notificationId}" ||
		notificationId === "" ||
		typeof notificationId !== "string"
	) {
		return Response.json({ code: 400, reason: "Missing notificationId" }, { status: 400 });
	}

	// Delete row where postId equal query parameter postId
	const { error } = await SupabaseAdmin.from("notifications").delete().eq("id", notificationId).single();
	return error
		? Response.json(
				{
					code: 400,
					reason: `Could not delete notification with id '${notificationId}'`,
				},
				{ status: 400 }
		  )
		: Response.json(
				{
					code: 200,
					reason: `Deleted notification with id '${notificationId}'`,
				},
				{ status: 200 }
		  );
}
