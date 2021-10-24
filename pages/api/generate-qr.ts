// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import QRCode from "qrcode";

export type Response =
  | {
      qrCodeData: string;
    }
  | {
      error: String;
    };

export default async function asynchandler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { slides } = JSON.parse(req.body);

  try {
    const qrCode = await QRCode.toDataURL(slides);
    return res.status(200).json({ qrCodeData: qrCode });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
