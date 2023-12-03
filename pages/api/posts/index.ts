import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseConfig";
import { validateAuthAPIToken } from "..";

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
    return res.status(405).send("Method not allowed, only GET allowed!");
  }
}
