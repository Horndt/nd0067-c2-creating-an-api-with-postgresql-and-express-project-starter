import express, { Request, Response } from "express";
import { User, UserStore } from "../models/users";
import jwt from "jsonwebtoken";
import verifyAuthToken from "../middleware/authenticateJWT";

const store = new UserStore();

const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    if (!users) {
      return res.status(400).json({ error: "users doesnt exist" });
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const show = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).send({ error: "user id doesnt exist" });
  }
  try {
    const id = parseInt(req.params.id);
    const user = await store.show(id);
    if (!user) {
      return res.status(404).json({ error: "user doesnt exist" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  if (!req.body.first_name) {
    return res.status(400).send({ error: "first_name doesnt exist" });
  }
  if (!req.body.last_name) {
    return res.status(400).send({ error: "last_name doesnt exist" });
  }
  if (!req.body.user_password) {
    return res.status(400).send({ error: "user_password doesnt exist" });
  }

  try {
    const users: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      user_password: req.body.user_password,
    };
    const SetNewUser = await store.create(users);
    const token = jwt.sign({ user: SetNewUser }, `${process.env.TOKEN_SECRET}`);
    return res.status(201).send({ user: SetNewUser, token });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const RoutesUsers = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users", create);
};

export default RoutesUsers;
