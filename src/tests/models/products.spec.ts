import { ProductStore } from "../../models/products";

const store = new ProductStore();
const products = [{ p_name: "short", p_price: 15 }];

describe("Model Product", () => {
  it("should contain create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should contain index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should contain show method", () => {
    expect(store.show).toBeDefined();
  });

  it("add a product", async () => {
    const result = await store.create(products[0]);
    expect(result).toBeTruthy;
  });

  it("return the entire list of products", async () => {
    const result = await store.index();
    const product = jasmine.objectContaining(products[0]);
    expect(result).toContain(product);
  });

  it("return the selected product", async () => {
    const result = await store.show(2);
    const product = jasmine.objectContaining(products[0]);
    expect(result).toEqual(product);
  });
});
