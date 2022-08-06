import app from "../../server";
import supertest from "supertest";
import dotenv from "dotenv";
import { User, UserStore } from "../../models/users";
import { Product } from "../../models/products";
import jwt from "jsonwebtoken";

dotenv.config();

const request = supertest(app);
const store = new UserStore();

const products: Product[] = [
  { p_name: "short", p_price: 15 },
  { p_name: "shirt", p_price: 19 },
  { p_name: "jeans", p_price: 59 },
];

let verifytoken = " ";
describe("Test Endpoints from Products", () => {
  beforeAll(async () => {
    const productUser: User = {
      user_name: "PBIG",
      first_name: "Paul",
      last_name: "Big",
      user_password: "Paulspassword",
    };

    const newProductUser = await store.create(productUser);
    if (process.env.TOKEN_SECRET) {
      verifytoken = jwt.sign(
        { user: newProductUser },
        process.env.TOKEN_SECRET
      );
    }
  });

  it("api create open with status 200", async () => {
    verifytoken = "Crypt " + verifytoken;
    const response = await request
      .post("/products/create")
      .send(products[0])
      .set("Authorization", verifytoken);
    expect(response.status).toBe(200);
  });

  it("api index open with status 200", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
  });

  it("api show open with status 200", async () => {
    const response = await request.get("/products/false");
    expect(response.status).toBe(200);
  });
});
