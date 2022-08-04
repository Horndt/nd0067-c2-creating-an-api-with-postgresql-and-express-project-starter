import express, { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import verifyAuthToken from "../middleware/authenticateJWT";
import { User, UserStore } from "../models/users";

dotenv.config();
let token = " ";
const store = new UserStore();
const index = async (req: Request, res: Response) => {
  try {
    const users: User[] = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user: User = await store.show(req.body.user_id);
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      user_name: req.body.user_name,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      user_password: req.body.user_password,
    };

    const newUser = await store.create(user);
    if (process.env.TOKEN_SECRET) {
      token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET);
      res.json(token);
    }
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const signIn = async (req: Request, res: Response) => {
  const user: User = {
    user_name: req.body.user_name,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_password: req.body.user_password,
  };
  try {
    const usr = await store.authenticate(user.user_name, user.user_password);
    if (usr) {
      if (process.env.TOKEN_SECRET) {
        token = jwt.sign({ user: usr }, process.env.TOKEN_SECRET);
        res.json(token);
      }
    } else {
      res.send("Invalid attempt, either username or password ");
    }
  } catch (error) {
    res.status(401);
    res.json({ error });
  }
};

const RoutesUsers = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users/create", create);
  app.post("/users/signIn", signIn);
};

export default RoutesUsers;
