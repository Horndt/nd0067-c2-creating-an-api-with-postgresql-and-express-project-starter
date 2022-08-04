import express, { Request, Response } from 'express';
import verifyAuthToken from '../middleware/authenticateJWT';
import { Product, ProductStore } from '../models/products';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const product: Product[] = await store.index();
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product: Product = await store.show(req.body.id);
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price};

    const newProduct: Product = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const RoutesProducts = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products/create', verifyAuthToken, create);
};

export default RoutesProducts;