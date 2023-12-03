import type { NextApiRequest, NextApiResponse } from "next";

export function validateAuthAPIToken(req: NextApiRequest) {
  // Extract the Authorization header
  const authorizationHeader = req.headers.apikey;
  // Check
  if (!authorizationHeader) {
    return {
      isValid: false,
      code: 401,
      reason: "Unauthorized - Authorization token 'apikey' missing in header",
    };
  } else if (
    authorizationHeader !== process.env.NEXT_PUBLIC_API_AUTHORIZATION_TOKEN
  ) {
    return {
      isValid: false,
      code: 401,
      reason: "Unauthorized - Invalid Authorization token",
    };
  } else {
    return {
      isValid: true,
      code: 200,
      reason: "Authorized - Successfully validated Authorization token",
    };
  }
}

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Check if API is running
 *     description: Checking whether API is running.
 *     security: []
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *          text/plain:
 *            example:
 *             "API is running"
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *          application/json:
 *            example:
 *             code: 500
 *             reason: "Internal Server Error"
 *     tags:
 *       - Default
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).send("API is running");
  } else {
    res.status(500).send("Internal Server Error");
  }
}
