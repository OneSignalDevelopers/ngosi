import { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      navigateToUrl: string;
    }
  | {
      error: string;
    };

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { url } = JSON.parse(req.body);
    if (!url) {
      res.status(500).json({ error: "No url given." });
    }

    res.status(200).json({ navigateToUrl: url });
  } catch (error) {
    const { message } = error as Error;
    res.status(500).json({ error: message });
  }
}
