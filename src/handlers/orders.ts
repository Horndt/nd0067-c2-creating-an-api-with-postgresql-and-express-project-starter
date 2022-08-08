import express, { Request, Response } from "express";
import { OrderStore } from "../models/orders";
import verifyAuthToken from "../middleware/authenticateJWT";

const store = new OrderStore();

const show = async (req: Request, res: Response) => {
  try {
    const orders = await store.show(parseInt(req.params.id));
    if (!orders) {
      return res.status(400).json({ error: "orders doesnt exist" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const orders = await store.create({
      user_id: parseInt(req.body.user_id),
      o_status: req.body.o_status,
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const addProduct = async (req: Request, res: Response) => {
  const o_id: number = parseInt(req.body.o_id);
  const p_id: number = parseInt(req.body.p_id);
  const quantity: number = parseInt(req.body.quantity);

  try {
    const AddNewProduct = await store.addProduct(o_id, p_id, quantity);
    res.status(201).json(AddNewProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

const RoutesOrders = (app: express.Application) => {
  app.get("/orders/:id", verifyAuthToken, show);
  app.post("/orders", verifyAuthToken, create);
  app.post("/orders/:id/products", verifyAuthToken, addProduct);
};

export default RoutesOrders;
