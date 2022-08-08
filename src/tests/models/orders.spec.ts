import Client from "../../database";
import { OrderStore } from "../../models/orders";
import { ProductStore } from "../../models/products";
import { User, UserStore } from "../../models/users";

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

const userStore = new UserStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();

let SetNewUser: User;

describe("models orders", () => {
  beforeAll(async () => {
    SetNewUser = await userStore.create({
      first_name: "Paul",
      last_name: "Big",
      user_password: "Paulspassword",
    });
  });

  beforeEach(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteProducts);
      await conn.query(deleteOrders);
      await conn.query(deleteOrderProducts);
      conn.release();
    } catch (error) {
      throw new Error(`cant delete beforeEach test: ${error}`);
    }
  });

  afterEach(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteProducts);
      await conn.query(deleteOrders);
      await conn.query(deleteOrderProducts);
      conn.release();
    } catch (error) {
      throw new Error(`cant delete afterEach test: ${error}`);
    }
  });

  afterAll(async () => {
    try {
      const conn = await Client.connect();
      await conn.query(deleteOrderProducts);
      await conn.query(deleteUsers);
      conn.release();
    } catch (error) {
      throw new Error(`cant delete afterAll test: ${error}`);
    }
  });
  it("should have create method", () => {
    expect(orderStore.create).toBeDefined();
  });
  it("should have index method", () => {
    expect(orderStore.index).toBeDefined();
  });
  it("should have show method", () => {
    expect(orderStore.show).toBeDefined();
  });
  it("should have SetNewProduct method", () => {
    expect(orderStore.addProduct).toBeDefined();
  });

  it("should create order", async () => {
    const order = await orderStore.create({
      user_id: SetNewUser.id as number,
      o_status: "active",
    });

    expect(order).toEqual({
      id: 1,
      user_id: 1,
      o_status: "active",
    });
  });

  it("index return list of order", async () => {
    await orderStore.create({
      user_id: SetNewUser.id as number,
      o_status: "active",
    });

    const result = await orderStore.index();
    expect(result).toEqual([
      {
        id: 1,
        user_id: 1,
        o_status: "active",
      },
    ]);
  });

  it("add product to cart", async () => {
    const SetNewProduct = await productStore.create({
      p_name: "shirt",
      p_price: 15,
    });

    const SetNewOrder = await orderStore.create({
      user_id: SetNewUser.id as number,
      o_status: "active",
    });

    const result = await orderStore.addProduct(
      SetNewOrder.id as number,
      SetNewProduct.id as number,
      4
    );

    expect(result).toEqual({
      id: 1,
      o_id: 1,
      p_id: 1,
      quantity: 4,
    });
  });

  it("get an order with specific user_id", async () => {
    const newProduct = await productStore.create({
      p_name: "shirt",
      p_price: 15,
    });

    const newOrder = await orderStore.create({
      user_id: SetNewUser.id as number,
      o_status: "active",
    });

    await orderStore.addProduct(
      newOrder.id as number,
      newProduct.id as number,
      4
    );

    const result = await orderStore.show(1);

    expect(result).toEqual({
      id: 1,
      user_id: 1,
      o_status: "active",
      o_id: 1,
      p_id: 1,
      quantity: 4,
    });
  });
});
