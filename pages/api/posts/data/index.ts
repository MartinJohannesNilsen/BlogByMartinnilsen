import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.secret) {
    return res.status(401).json({ message: "Missing token" });
  } else if (req.query.secret !== process.env.NEXT_PUBLIC_POSTS_AUTH_KEY) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Check if id is provided
  if (!req.query) {
    return res.status(401).json({ message: "Missing id" });
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
    return res
      .status(405)
      .send("Method not allowed, only GET and POST allowed!");
  }
}
