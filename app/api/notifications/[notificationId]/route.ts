import { deleteNotification, getNotificationById, updateNotification } from "@/data/middleware/notifications/actions";
import { validateAuthAPIToken } from "@/data/middleware/tokenValidationAPI";
import { NextRequest } from "next/server";

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
 *                "id": "1",
 *                "createdAt": "2023-12-26T17:56:37.351Z",
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

	try {
		const notification = await getNotificationById(notificationId);
		if (notification) {
			return Response.json(notification, { status: 200 });
		} else {
			return Response.json({ code: 404, reason: "Notification not found" }, { status: 404 });
		}
	} catch (error) {
		return Response.json({ code: 500, reason: "Internal server error" }, { status: 500 });
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
 *                type: string
 *               content:
 *                type: string
 *               action:
 *                  href:
 *                    type: string
 *                  caption:
 *                    type: string
 *               important:
 *                type: boolean
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
 *               createdAt: "2023-12-26T17:56:37.351Z"
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

	try {
		const requestBody = await request.json();
		if (requestBody.id) {
			return Response.json(
				{
					code: 400,
					reason: "Updating the 'id' field is not allowed. Please omit this field from your update request.",
				},
				{ status: 400 }
			);
		}

		const success = await updateNotification(notificationId, requestBody);
		return success
			? Response.json({ code: 200, reason: "Notification successfully updated" }, { status: 200 })
			: Response.json({ code: 400, reason: "No changes made" }, { status: 400 });
	} catch (error) {
		return Response.json({ code: 500, reason: "Internal server error" }, { status: 500 });
	}
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

	try {
		const success = await deleteNotification(notificationId);
		return success
			? Response.json({ code: 200, reason: `Deleted notification with id '${notificationId}'` }, { status: 200 })
			: Response.json(
					{ code: 400, reason: `Could not delete notification with id '${notificationId}'` },
					{ status: 400 }
			  );
	} catch (error) {
		return Response.json({ code: 500, reason: "Internal server error" }, { status: 500 });
	}
}
