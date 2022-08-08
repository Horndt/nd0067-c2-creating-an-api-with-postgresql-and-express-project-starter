import Client from "../../database";
import { User } from "../../models/users";
import supertest from "supertest";
import app from "../../server";

const deleteUsers = `DELETE FROM users;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
UPDATE users SET id = DEFAULT`;
const deleteProducts = `DELETE FROM products;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
UPDATE products SET id = DEFAULT`;
const deleteOrders = `DELETE FROM orders;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
UPDATE orders SET id = DEFAULT`;
const deleteOrderProducts = `DELETE FROM order_products;
ALTER SEQUENCE order_products_id_seq RESTART WITH 1;
UPDATE orders SET id = DEFAULT`;

const request = supertest(app);
let user: User;
let token: string;

describe("Test orders", () => {
  beforeAll(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteUsers);
      await conn.query(deleteProducts);
      await conn.query(deleteOrders);
      await conn.query(deleteOrderProducts);
      conn.release();

      const body = {
        first_name: "Paul",
        last_name: "Big",
        user_password: "Paulspassword",
      };
      const result = await (await request.post("/users").send(body)).body;
      user = result.user;
      token = result.token;
    } catch (error) {
      throw new Error(`Cant delete beforeEach test: ${error}`);
    }
  });

  beforeEach(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteProducts);
      await conn.query(deleteOrders);
      await conn.query(deleteOrderProducts);

      conn.release();
    } catch (error) {
      throw new Error(`Cant delete afterEach test: ${error}`);
    }
  });

  afterAll(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteUsers);
      await conn.query(deleteProducts);
      await conn.query(deleteOrders);
      await conn.query(deleteOrderProducts);

      conn.release();
    } catch (error) {
      throw new Error(`Cant delete afterEach test: ${error}`);
    }
  });

  describe("TEST POST /orders/", () => {
    it("Should create order with JWT token", async () => {
      await request
        .post("/products")
        .send({
          p_name: "shirt",
          p_price: 15,
        })
        .set("Authorization", "Crypt " + token);

      const SetNewOrder = await request
        .post("/orders")
        .send({
          user_id: user.id,
          o_status: "active",
        })
        .set("Authorization", "Crypt " + token);

      expect(SetNewOrder.statusCode).toBe(200);
      expect(SetNewOrder.body).toEqual({
        id: 1,
        user_id: 1,
        o_status: "active",
      });
    });
  });

  describe("TEST POST /orders/:id/products", () => {
    it("Should add product to an order with a specific o_id with JWT token", async () => {
      const SetNewProduct = await request
        .post("/products")
        .send({
          p_name: "shirt",
          p_price: 15,
        })
        .set("Authorization", "Crypt " + token);

      const SetNewOrder = await request
        .post("/orders")
        .send({
          user_id: user.id,
          o_status: "active",
        })
        .set("Authorization", "Crypt " + token);

      const orderProduct = await request
        .post(`/orders/${SetNewOrder.body.id}/products`)
        .send({
          o_id: parseInt(SetNewOrder.body.id),
          p_id: parseInt(SetNewProduct.body.id),
          quantity: 2,
        })
        .set("Authorization", "Crypt " + token);

      expect(orderProduct.statusCode).toBe(201);
      expect(orderProduct.body).toEqual({
        id: 1,
        o_id: 1,
        p_id: 1,
        quantity: 2,
      });
    });
  });
  describe("TEST GET /orders/:user_id", () => {
    it("Should get order related to a specific user_id with JWT token", async () => {
      const SetNewProduct = await request
        .post("/products")
        .send({
          p_name: "shirt",
          p_price: 15,
        })
        .set("Authorization", "Crypt " + token);

      const SetNewOrder = await request
        .post("/orders")
        .send({
          user_id: user.id,
          o_status: "active",
        })
        .set("Authorization", "Crypt " + token);

      const orderProduct = await request
        .post(`/orders/${SetNewOrder.body.id}/products`)
        .send({
          o_id: parseInt(SetNewOrder.body.id),
          p_id: parseInt(SetNewProduct.body.id),
          quantity: 2,
        })
        .set("Authorization", "Crypt " + token);

      const response = await request
        .get(`/orders/${user.id}`)
        .set("Authorization", "Crypt " + token);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        user_id: 1,
        o_id: 1,
        p_id: 1,
        quantity: 2,
        o_status: "active",
      });
    });
  });
});
