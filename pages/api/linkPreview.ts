import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  // if (!req.query.secret) {
  //   return res.status(401).json({ message: "Missing token" });
  // } else if (req.query.secret !== process.env.NEXT_PUBLIC_LINKPREVIEW_API_KEY) {
  //   return res.status(401).json({ message: "Invalid token" });
  // }

  // Check if url is set
  if (!req.query.url) {
    return res.status(401).json({ message: "Missing url" });
  }

  try {
    const api = await fetch(
      "http://api.linkpreview.net/?key=" +
        process.env.NEXT_PUBLIC_LINKPREVIEW_API_KEY +
        "&q=" +
        req.query.url
    ).then((data) => data.json());
    return res.json({ success: 1, link: req.query.link, meta: api });
  } catch (err) {
    return res.status(500).send("Server error");
  }
}
