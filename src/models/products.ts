import Client from "../database";

export type Product = {
  p_id?: number;
  p_name: string;
  p_price: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT p_name, p_price FROM products";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cant get the products. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM products WHERE p_id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cant get the product ${id}. Error: ${err}`);
    }
  }

  async create(prod: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO products (p_name, p_price) VALUES($1, $2) RETURNING *";
      const result = await conn.query(sql, [prod.p_name, prod.p_price]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Cant create new product ${prod.p_name}. Error: ${err}`);
    }
  }
}
