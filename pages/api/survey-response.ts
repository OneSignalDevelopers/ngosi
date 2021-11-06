// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      message: string;
    }
  | {
      error: string;
    };

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log(req.body);
    res.status(200).json({ message: "completed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
}
