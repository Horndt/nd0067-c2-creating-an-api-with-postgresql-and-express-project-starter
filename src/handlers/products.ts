import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/products";
import verifyAuthToken from "../middleware/authenticateJWT";

const Store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const product: Product[] = await Store.index();
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product: Product = await Store.show(req.body.id);
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      p_name: req.body.p_name,
      p_price: req.body.p_price,
    };

    const SetNewProduct: Product = await Store.create(product);
    res.json(SetNewProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const RoutesProducts = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products/create", verifyAuthToken, create);
};

export default RoutesProducts;
