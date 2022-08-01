import Client from '../database';

export type Order = {
    order_id?: number,
    user_id: number,
    order_status: string}
  
  export type products_order = {
    product_order_id?: number,
    order_id: number,
    product_id: number,
    product_quantity: number}
  
  export class OrderStore {
    async show(id: number): Promise<Order> {
      try {
        const conn = await Client.connect();
        const sql = `SELECT * FROM orders WHERE user_id=($1) AND order_status='active'`;
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
      } catch (err) {
        throw new Error(`Cant show the current order by ${id}. Error: ${err}`);
      }
    }
  }