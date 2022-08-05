import { ProductStore } from "../../models/products";

const store = new ProductStore();
const products = [{ p_name: "shirt", p_price: 19 }];

describe("Product Model", () => {
  it("should contain create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should add a product through create method", async () => {
    const result = await store.create(products[0]);
    expect(result).toBeTruthy;
  });

  it("should contain index method", () => {
    expect(store.index).toBeDefined();
  });

  it("index method should return the entire list of products", async () => {
    const result = await store.index();
    const prod = jasmine.objectContaining(products[0]);
    expect(result).toContain(prod);
  });

  it("should contain show method", () => {
    expect(store.show).toBeDefined();
  });

  it("show method should return the selected product", async () => {
    const result = await store.show(2);
    const prod = jasmine.objectContaining(products[0]);
    expect(result).toEqual(prod);
  });
});
