import express, { Request, Response } from "express";
import { User, UserStore } from "../models/users";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import verifyAuthToken from "../middleware/authenticateJWT";

dotenv.config();
let verifytoken = " ";
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
    const user: User = await store.show(req.body.id);
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

    const SetNewUser = await store.create(user);
    if (process.env.TOKEN_SECRET) {
      verifytoken = jwt.sign({ user: SetNewUser }, process.env.TOKEN_SECRET);
      res.json(verifytoken);
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
        verifytoken = jwt.sign({ user: usr }, process.env.TOKEN_SECRET);
        res.json(verifytoken);
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
