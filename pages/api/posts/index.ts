import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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
    // Get all posts
    try {
      const response = {
        posts: [],
        overview: [],
      };
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
        response.posts.push({ id: doc.id, data: doc.data() });
      });
      const postOverviewSnapshot = await getDoc(
        doc(db, "administrative", "overview")
      );
      response.overview = postOverviewSnapshot.data().values;
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "POST") {
    // Post new post
    return res.status(500).send("Not implemented yet!");
  } else {
    return res
      .status(405)
      .send("Method not allowed, only GET and POST allowed!");
  }
}
