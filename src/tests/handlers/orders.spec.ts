import app from "../../server";
import dotenv from "dotenv";
import Client from "../../database";
import supertest from "supertest";
import { User, UserStore } from "../../models/users";
import jwt from "jsonwebtoken";

dotenv.config();
const request = supertest(app);
const userStore = new UserStore();

let verifytoken = " ";

describe("Test Endpoints from Orders", () => {
  beforeAll(async () => {
    const orderUser: User = {
      user_name: "PBIG",
      first_name: "Paul",
      last_name: "Big",
      user_password: "Paulspassword",
    };

    const newOrderUser = await userStore.create(orderUser);
    if (process.env.TOKEN_SECRET) {
      verifytoken = jwt.sign({ user: newOrderUser }, process.env.TOKEN_SECRET);
    }

    const conn = await Client.connect();
    const sql =
      "INSERT INTO orders (id, u_id, o_status) VALUES($1, $2, $3) RETURNING *";
    const result = await conn.query(sql, [36, newOrderUser.id, "active"]);
    const order = result.rows[0];
    conn.release();
    return order;
  });

  it("api show should open with status 200", async () => {
    verifytoken = "Crypt " + verifytoken;
    const response = await request
      .get("/orders/1")
      .set("Authorization", verifytoken);
    expect(response.status).toBe(200);
  });
});
