import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import RoutesUsers from "./handlers/users";
import RoutesProducts from "./handlers/products";
import RoutesOrders from "./handlers/orders";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("<h1>Project Storefront Backend Project</h1>");
});

RoutesProducts(app);
RoutesUsers(app);
RoutesOrders(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
