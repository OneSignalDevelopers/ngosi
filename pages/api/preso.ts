import { NextApiRequest, NextApiResponse } from "next";

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
    res.status(200).json({ message: "ok" });
  } catch (error) {
    const { message } = error as Error;
    res.status(500).json({ error: message });
  }
}
