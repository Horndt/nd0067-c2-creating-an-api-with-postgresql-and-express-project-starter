import Client from "../../database";
import supertest from "supertest";
import app from "../../server";

const deleteUsers = `DELETE FROM users;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
UPDATE users SET id = DEFAULT`;
const deleteProducts = `DELETE FROM products;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
UPDATE products SET id = DEFAULT`;

const request = supertest(app);
let user;
let token: string;

describe("Test /products/ ", () => {
  beforeAll(async () => {
    user = {
      first_name: "Paul",
      last_name: "Big",
      user_password: "Paulspassword",
    };
    token = await (await request.post("/users").send(user)).body.token;
  });

  afterEach(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteProducts);
      conn.release();
    } catch (error) {
      throw new Error(`cant delete afterEach test: ${error}`);
    }
  });
  afterAll(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteUsers);
      await conn.query(deleteProducts);

      conn.release();
    } catch (error) {
      throw new Error(`cant delete afterEach test: ${error}`);
    }
  });

  describe("Test GET /products/", () => {
    it("Should get all products", async () => {
      await request
        .post("/products")
        .send({
          p_name: "shirt",
          p_price: 15,
        })
        .set("Authorization", "Crypt " + token);

      const response = await request.get("/products/");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          p_name: "shirt",
          p_price: 15,
        },
      ]);
    });
  });

  describe("Test GET /products/:id", () => {
    it("Should get product with a specific id", async () => {
      await request
        .post("/products")
        .send({
          p_name: "shirt",
          p_price: 15,
        })
        .set("Authorization", "Crypt " + token);

      const product_id = 1;
      const response = await request.get(`/products/${product_id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        p_name: "shirt",
        p_price: 15,
      });
    });
  });

  describe("Test POST /products/", () => {
    it("Should create product with authenticateJWT", async () => {
      const response = await request
        .post("/products")
        .send({
          p_name: "shirt",
          p_price: 15,
        })
        .set("Authorization", "Crypt " + token);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        p_name: "shirt",
        p_price: 15,
      });
    });
  });
});
