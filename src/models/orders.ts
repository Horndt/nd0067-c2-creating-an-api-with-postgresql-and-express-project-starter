import Client from "../database";

export type Order = {
  o_id?: number;
  u_id: number;
  o_status: string;
};

export type products_order = {
  o_p_id?: number;
  o_id: number;
  p_id: number;
  p_quantity: number;
};

export class OrderStore {
  async show(id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE u_id=($1) AND o_status='active'`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cant show the current order by ${id}. Error: ${err}`);
    }
  }
}
