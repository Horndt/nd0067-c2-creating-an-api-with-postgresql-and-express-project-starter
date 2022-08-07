import express, { Request, Response } from "express";
import { Order, OrderStore } from "../models/orders";
import verifyAuthToken from "../middleware/authenticateJWT";

const Store = new OrderStore();

const show = async (req: Request, res: Response) => {
  try {
    const order: Order = await Store.show(req.body.id);
    res.json(order);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      u_id: req.body.u_id,
      o_status: req.body.o_status,
    };

    const SetNewOrder: Order = await Store.create(order);
    res.json(SetNewOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const addProduct = async (req: Request, res: Response) => {
  const o_id: number = parseInt(req.body.o_id);
  const p_id: number = parseInt(req.body.p_id);
  const quantity: number = parseInt(req.body.quantity);

  try {
    const addedProduct = await Store.addProduct(o_id, p_id, quantity);
    res.status(201).json(addedProduct);
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
