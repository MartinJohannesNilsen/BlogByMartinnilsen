import type { NextApiRequest, NextApiResponse } from "next";
import { getAllPostIds } from "../../../database/overview";

type Data = {
  numberOfPosts: number;
  listOfIds: string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  getAllPostIds(process.env.NEXT_PUBLIC_LOCALHOST !== "true")
    .then((data) => {
      res.status(200).json({ numberOfPosts: data.length, listOfIds: data });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}
