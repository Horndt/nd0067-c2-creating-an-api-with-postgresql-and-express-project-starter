import express, { Request, Response } from "express";
import { ProductStore, Product } from "../models/products";
import verifyAuthToken from "../middleware/authenticateJWT";

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index();
    if (!products) {
      return res.status(404).json({ error: "products are not found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error);
  }
};

const show = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).send({ error: "products id is required" });
  }
  try {
    const products = await store.show(parseInt(req.params.id));
    if (!products) {
      return res.status(404).json({ error: "products is not found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  if (!req.body.p_name) {
    return res.status(400).send({ error: "product p_name is required" });
  }
  if (!req.body.p_price) {
    return res.status(400).send({ error: "product p_price is required" });
  }
  try {
    const products: Product = {
      p_name: req.body.p_name,
      p_price: req.body.p_price,
    };
    const SetNewProduct = await store.create(products);
    res.status(200).json(SetNewProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};

const RoutesProducts = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
};

export default RoutesProducts;
