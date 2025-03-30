import { NextApiRequest, NextApiResponse } from "next";

interface LogData {
  message: string;
  level: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const logData: LogData = req.body;

    console.log("Received log data:", logData);

    return res.status(200).json({ message: "Log received successfully" });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
