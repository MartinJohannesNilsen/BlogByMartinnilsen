import { NextRequest } from "next/server";

/**
 * @swagger
 * /api:
 *   get:
 *     security: []
 *     summary: Check if API is running
 *     description: Checking whether API is running.
 *     tags:
 *       - Default
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: A confirmation message indicating that the API is currently running.
 *             example: "API is running"
 *       '500':
 *         description: Internal Server Error.
 *       '501':
 *         description: Method not supported.
 */
export async function GET(request: NextRequest) {
	return new Response("API is running", { status: 200 });
}
