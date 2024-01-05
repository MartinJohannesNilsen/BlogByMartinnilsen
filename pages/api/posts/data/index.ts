import type { NextApiRequest, NextApiResponse } from "next";
import { validateAuthAPIToken } from "../..";

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
  if (!req.query) {
    return res.status(400).json({ code: 400, reason: "Missing postId" });
  }

  if (req.method === "POST") {
    // Set field of post
    const { data } = req.body;
    if (!data) res.status(400).send("data is required");
    if (typeof data === "string") {
      return res.status(200).json({ data: JSON.parse(data) });
    } else {
      return res.status(200).json({ data: JSON.stringify(data) });
    }
  } else {
    return res.status(501).json({ code: 501, reason: "Method not supported" });
  }
}
