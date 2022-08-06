import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

const verifyAuthToken = (req: Request, res: Response, next: () => void) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (typeof authorizationHeader !== "undefined") {
      const verifytoken = authorizationHeader.split(" ")[1];
      if (process.env.TOKEN_SECRET) {
        jwt.verify(verifytoken, process.env.TOKEN_SECRET);
        next();
      }
    }
  } catch (err) {
    res.status(401);
    res.json("Access failed, invalid token");
  }
};

export default verifyAuthToken;
