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

  // Check if id is provided
  if (!req.query) {
    return res.status(401).json({ message: "Missing id" });
  }
  const { postId } = req.query;

  if (req.method === "GET") {
    // Get post by id
    try {
      const data = await getDoc(doc(db, "posts", String(postId))).then((data) =>
        data.data()
      );
      if (!data) return res.status(422).send("Id not found!");
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "PUT") {
    // Set field of post
    const { data, ...fields } = req.body;
    if (Object.keys(fields).length === 0) {
      return res.status(400).send("Need to have some fields for update!");
    }

    // Fetch post
    let post = await getDoc(doc(db, "posts", String(postId)))
      .then((docSnapshot) => docSnapshot.data())
      .catch((error) => {
        console.error("Error fetching document:", error);
        return null;
      });
    if (!post) return res.status(422).send("Id not found!");

    // Check if 'data' is set to be updated and not already a string, then stringify it
    if (data !== undefined && typeof data !== "string") {
      fields.data = JSON.stringify(data);
    }

    // Alter post
    const updatedPost = { ...post, ...fields };

    // Push updates
    const docRef = doc(db, "posts", String(postId));
    await updateDoc(docRef, updatedPost)
      .then((data) => {
        return res.status(200).send("");
      })
      .catch((error) => {
        return res.status(400).send("Update failed");
      });
  } else {
    return res
      .status(405)
      .send("Method not allowed, only GET and POST allowed!");
  }
}
