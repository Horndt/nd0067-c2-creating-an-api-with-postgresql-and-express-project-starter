import Client from "../../database";
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

const request = supertest(app);

describe("Test /users/", () => {
  beforeEach(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteUsers);
      await conn.query(deleteProducts);
      await conn.query(deleteOrders);
      conn.release();
    } catch (error) {
      throw new Error(`cant delete beforeEach test: ${error}`);
    }
  });

  afterEach(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteUsers);
      await conn.query(deleteProducts);
      await conn.query(deleteOrders);
      conn.release();
    } catch (error) {
      throw new Error(`cant delete afterEach test: ${error}`);
    }
  });

  describe("Test POST /users/", () => {
    it("should be 400 when first name is missing", async () => {
      const body = {
        last_name: "Big",
        user_password: "Paulspassword",
      };
      const response = await request.post("/users").send(body);
      expect(response.status).toBe(400);
    });
    it("err msg should be first name is required", async () => {
      const body = {
        last_name: "Big",
        user_password: "Paulspassword",
      };
      const response = await request.post("/users").send(body);
      expect(response.body).toEqual({ error: "first_name doesnt exist" });
    });

    it("should be 400 when lastname is missing", async () => {
      const body = {
        first_name: "Paul",
        user_password: "Paulspassword",
      };
      const response = await request.post("/users").send(body);
      expect(response.status).toBe(400);
    });
    it("err msg should be last_name is required", async () => {
      const body = {
        first_name: "Paul",
        user_password: "Paulspassword",
      };
      const response = await request.post("/users").send(body);
      expect(response.body).toEqual({ error: "last_name doesnt exist" });
    });
    it("should be 400 when password is missing", async () => {
      const body = {
        first_name: "Paul",
        last_name: "Big",
      };
      const response = await request.post("/users").send(body);
      expect(response.status).toBe(400);
    });
    it("err msg should be password is required", async () => {
      const body = {
        first_name: "Paul",
        last_name: "Big",
      };
      const response = await request.post("/users").send(body);
      expect(response.body).toEqual({ error: "user_password doesnt exist" });
    });

    it("Should create a user", async () => {
      const body = {
        is: 1,
        first_name: "Paul",
        last_name: "Big",
        user_password: "Paulspassword",
      };
      const response = await request.post("/users").send(body);
      expect(response.status).toBe(201);
      expect(response.body.user).toEqual({
        id: 1,
        first_name: "Paul",
        last_name: "Big",
        user_password: response.body.user.user_password,
      });
    });
  });

  describe("Test GET /users/", () => {
    it("should get all users", async () => {
      const body = {
        id: 1,
        first_name: "Paul",
        last_name: "Big",
        user_password: "Paulspassword",
      };

      const token = await (await request.post("/users").send(body)).body.token;

      const response = await request
        .get("/users")
        .set("Authorization", "Bearer " + token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          first_name: "Paul",
          last_name: "Big",
          user_password: response.body[0].user_password,
        },
      ]);
    });
  });

  describe("Test GET /users/:id", () => {
    it("Should get user with specific id", async () => {
      const body = {
        first_name: "Paul",
        last_name: "Big",
        user_password: "Paulspassword",
      };
      const token = await (await request.post("/users").send(body)).body.token;
      const userId = 1;
      const response = await request
        .get(`/users/${userId}`)
        .set("Authorization", "Crypt " + token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        first_name: "Paul",
        last_name: "Big",
        user_password: response.body.user_password,
      });
    });
  });
});
