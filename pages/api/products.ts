import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/db";
import { Product } from "../../models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { search } = req.query;

      const query: any = {};
      if (search) {
        query.name = { $regex: new RegExp(search as string, "i") };
      }

      const products = await Product.find(query);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch products." });
    }
  } else if (req.method === "POST") {
    const {
      name,
      supplierName,
      category,
      quantity,
      purchasePrice,
      sellingPrice,
      stockAvailable,
      expiryDate,
      dateOfPurchase,
      dateOfSale,
    } = req.body;

    try {
      const newProduct = new Product({
        name,
        supplierName,
        category,
        quantity: {
          amount: Number(quantity.amount),
          unit: quantity.unit,
        },
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        stockAvailable: Number(stockAvailable),
        expiryDate: expiryDate,
        dateOfPurchase: dateOfPurchase,
        dateOfSale: dateOfSale,
      });

      await newProduct.save();
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create the product" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    try {
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete the Product" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
