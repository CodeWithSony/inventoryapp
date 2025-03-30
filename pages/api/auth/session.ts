import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decoded = verify(
        token,
        process.env.JWT_SECRET as string
      ) as unknown;
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
