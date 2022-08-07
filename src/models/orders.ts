import Client from "../database";

export type Order = {
  id?: number;
  u_id: number;
  o_status: string;
};

export type products_order = {
  id?: number;
  o_id: number;
  u_id: number;
  o_status: string;
  p_id: number;
  p_quantity: number;
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
      throw new Error(`unable to get orders: ${error}`);
    }
  }

  async show(userId: number): Promise<products_order> {
    try {
      const sql =
        "SELECT * from orders JOIN order_products ON (o.id = order_products.o_id) WHERE u_id=($1)";
      const conn = await Client.connect();
      const result = await conn.query(sql, [userId]);
      const order = result.rows[0] as products_order;

      conn.release();
      return order;
    } catch (error) {
      throw new Error(`Cannot get order: ${error}`);
    }
  }
  async create(order: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO orders (u_id, o_status) VALUES($1, $2) RETURNING *";
      const result = await conn.query(sql, [order.u_id, order.o_status]);
      const newOrder = result.rows[0] as Order;
      conn.release();
      return newOrder;
    } catch (err) {
      throw new Error(`Cannot create order: ${err}`);
    }
  }

  async addProduct(
    o_id: number,
    p_id: number,
    quantity: number
  ): Promise<{ id: number; o_id: number; p_id: number; quantity: number }> {
    try {
      const sql =
        "INSERT INTO order_products (o_id, p_id, quantity) VALUES($1, $2, $3) RETURNING *";
      const conn = await Client.connect();
      const result = await conn.query(sql, [o_id, p_id, quantity]);
      const orderProduct = result.rows[0];

      conn.release();
      return orderProduct;
    } catch (err) {
      throw new Error(`Could not add product ${p_id} to order ${o_id}: ${err}`);
    }
  }
}
