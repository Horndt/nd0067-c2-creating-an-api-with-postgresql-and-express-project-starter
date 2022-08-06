import express, { Request, Response } from "express";
import { Order, OrderStore } from "../models/orders";
import verifyAuthToken from "../middleware/authenticateJWT";

const store = new OrderStore();

const show = async (req: Request, res: Response) => {
  try {
    const order: Order = await store.show(req.body.u_id);
    res.json(order);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const RoutesOrders = (app: express.Application) => {
  app.get("/orders/:id", verifyAuthToken, show);
};

export default RoutesOrders;
