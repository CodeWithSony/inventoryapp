import dbConnect from "@/lib/db";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(product);
      } catch (error) {
        console.log(error, "error");
        return res.status(500).json({ error: "Server error" });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
