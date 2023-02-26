import type { NextApiRequest, NextApiResponse } from "next";
import { number } from "prop-types";

type Data = {
  status: string | number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ status: 200 });
}
