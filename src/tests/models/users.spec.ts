import Client from "../../database";
import { UserStore } from "../../models/users";

const userStore = new UserStore();

const deleteUsers = `DELETE FROM users;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
UPDATE users SET id = DEFAULT`;
const deleteProducts = `DELETE FROM products;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
UPDATE products SET id = DEFAULT`;
const deleteOrders = `DELETE FROM orders;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
UPDATE orders SET id = DEFAULT`;

describe("model users", () => {
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

  it("should have create method", () => {
    expect(userStore.create).toBeDefined();
  });
  it("Should create user", async () => {
    const newUser = await userStore.create({
      first_name: "Max",
      last_name: "Mustermann",
      user_password: "Maxspassword",
    });
    expect(newUser).toEqual({
      id: 1,
      first_name: "Max",
      last_name: "Mustermann",
      user_password: newUser.user_password,
    });
  });

  it("should have index method", () => {
    expect(userStore.index).toBeDefined();
  });
  it("index method should return list of users", async () => {
    const result = await userStore.index();
    expect(result).toEqual([]);
  });

  it("should have show method", () => {
    expect(userStore.show).toBeDefined();
  });
  it("Should get user with specific id", async () => {
    const newUser = await userStore.create({
      first_name: "Paul",
      last_name: "Small",
      user_password: "Smallspassword",
    });

    const result = await userStore.show(1);

    expect(result).toEqual({
      id: 1,
      first_name: "Paul",
      last_name: "Small",
      user_password: result.user_password,
    });
  });
});
