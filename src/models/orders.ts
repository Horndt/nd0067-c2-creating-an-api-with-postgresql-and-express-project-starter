import Client from "../database";

export type Order = {
  id?: number;
  user_id: number;
  o_status: "active" | "complete";
};

export type OrderProducts = {
  id: number;
  user_id: number;
  o_id: number;
  p_id: number;
  quantity: number;
  o_status: "active" | "completed";
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM orders";
      const result = await conn.query(sql);
      const products = result.rows as Order[];

      conn.release();
      return products;
    } catch (error) {
      throw new Error(`cant get orders: ${error}`);
    }
  }

  async show(userId: number): Promise<OrderProducts> {
    try {
      const sql =
        "SELECT * from orders JOIN order_products ON (orders.id = order_products.o_id) WHERE user_id=($1)";
      const conn = await Client.connect();
      const result = await conn.query(sql, [userId]);
      const order = result.rows[0] as OrderProducts;

      conn.release();
      return order;
    } catch (error) {
      throw new Error(`Cant get orders: ${error}`);
    }
  }
  async create(order: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO orders (user_id, o_status) VALUES($1, $2) RETURNING *";
      const result = await conn.query(sql, [order.user_id, order.o_status]);
      const SetNewOrder = result.rows[0] as Order;
      conn.release();
      return SetNewOrder;
    } catch (err) {
      throw new Error(`Cant create order: ${err}`);
    }
  }

  async addProduct(
    o_id: number,
    p_id: number,
    quantity: number
  ): Promise<{
    id: number;
    o_id: number;
    p_id: number;
    quantity: number;
  }> {
    try {
      const sql =
        "INSERT INTO order_products (o_id, p_id, quantity) VALUES($1, $2, $3) RETURNING *";
      const conn = await Client.connect();
      const result = await conn.query(sql, [o_id, p_id, quantity]);
      const order_Product = result.rows[0];

      conn.release();
      return order_Product;
    } catch (err) {
      throw new Error(`Cant add product ${p_id} to order ${o_id}: ${err}`);
    }
  }
}
