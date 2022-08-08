import Client from "../../database";
import { ProductStore } from "../../models/products";

const deleteProducts = `DELETE FROM products;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
UPDATE products SET id = DEFAULT`;

const store = new ProductStore();
describe("model products", () => {
  beforeEach(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteProducts);
      conn.release();
    } catch (error) {
      throw new Error(`cant delete beforeEach test: ${error}`);
    }
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
  it("should have create method", () => {
    expect(store.create).toBeDefined();
  });
  it("Should create product", async () => {
    const result = await store.create({
      p_name: "shirt",
      p_price: 15,
    });
    expect(result).toEqual({
      id: 1,
      p_name: "shirt",
      p_price: 15,
    });
  });

  it("should have index method", () => {
    expect(store.index).toBeDefined();
  });
  it("index method should return Products", async () => {
    const newProduct = await store.create({
      p_name: "shirt",
      p_price: 15,
    });

    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        p_name: "shirt",
        p_price: 15,
      },
    ]);
  });

  it("should have show method", () => {
    expect(store.show).toBeDefined();
  });
  it("Should get product with specific id", async () => {
    const newProduct = await store.create({
      p_name: "shirt",
      p_price: 15,
    });
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      p_name: "shirt",
      p_price: 15,
    });
  });
});
