import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseConfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.secret) {
    return res.status(401).json({ message: "Missing token" });
  } else if (req.query.secret !== process.env.NEXT_PUBLIC_POSTS_AUTH_KEY) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (req.method === "GET") {
    try {
      const data = await getDoc(doc(db, "administrative", "overview")).then(
        (data) => data.data().values
      );
      if (!data) return res.status(404).send("Overview not found!");
      return res
        .status(200)
        .send(
          data
            .filter(
              (post) => post.published !== undefined && post.published === true
            )
            .map((post) => post.id)
        );
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    return res
      .status(405)
      .send("Method not allowed, only GET and POST allowed!");
  }
}
