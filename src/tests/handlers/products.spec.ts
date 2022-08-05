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
  { p_name: "jacket", p_price: 26 },
  { p_name: "shirt", p_price: 19 },
  { p_name: "jeans", p_price: 59 },
];

let token = " ";
describe("Products Test Endpoints", () => {
  beforeAll(async () => {
    const admin: User = {
      user_name: "PBIG",
      first_name: "Paul",
      last_name: "Big",
      user_password: "Paulspassword",
    };

    const newAdmin = await store.create(admin);
    if (process.env.TOKEN_SECRET) {
      token = jwt.sign({ user: newAdmin }, process.env.TOKEN_SECRET);
    }
  });

  it("api create should open with status 200", async () => {
    token = "Crypt " + token;
    const response = await request
      .post("/products/create")
      .send(products[0])
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("api index should open with status 200", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
  });

  it("api show must open with status 200", async () => {
    const response = await request.get("/products/1");
    expect(response.status).toBe(200);
  });
});
