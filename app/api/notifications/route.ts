import { SupabaseAdmin } from "@/lib/supabaseAdmin";
import { validateAuthAPIToken } from "@/lib/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     description: Fetches all notifications.
 *     tags:
 *       - Notifications
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *              [
 *                {
 *                  "id": 1,
 *                  "created_at": "2023-12-26T17:56:37.351648+00:00",
 *                  "title": "Test",
 *                  "content": "This is a test",
 *                  "action": {
 *                    "href": "/",
 *                    "caption": "read more"
 *                  },
 *                  "important": false
 *                }
 *              ]
 *
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 */
export async function GET(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Query the notifications table
	const { data } = await SupabaseAdmin.from("notifications").select("id, createdAt, title, content, action, important");
	if (data) {
		return Response.json(data, { status: 200 });
	} else {
		return Response.json({ code: 500, reason: "Internal server error" }, { status: 500 });
	}
}

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create notification
 *     description: Create notification. Key 'CreatedAt' defaults to now(), but could be set as time-date format string.
 *     tags:
 *       - Notifications
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
export async function POST(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Post using requestBody
	const requestBody = await request.json();
	if (requestBody.id)
		return Response.json(
			{
				code: 400,
				reason: "Post not followed through. Id is set automatically!",
			},
			{ status: 400 }
		);

	// Insert data in database
	const { data, error } = await SupabaseAdmin.from("notifications").insert(requestBody).select().single();
	return error || !data
		? Response.json({ code: 500, reason: "Could not insert to database" }, { status: 500 })
		: Response.json(data, { status: 200 });
}
