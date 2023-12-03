import { doc, getDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../lib/firebaseConfig";
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
  const { postId } = req.query;

  if (req.method === "GET") {
    // Get post by id
    try {
      const data = await getDoc(doc(db, "posts", String(postId))).then((data) =>
        data.data()
      );
      if (!data) return res.status(422).send("Id not found!");
      if (req.query.stringify === "true") {
        return res.status(200).json({ data: JSON.stringify(data.data) });
      } else {
        return res.status(200).send(data.data);
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    return res
      .status(405)
      .send("Method not allowed, only GET and POST allowed!");
  }
}
