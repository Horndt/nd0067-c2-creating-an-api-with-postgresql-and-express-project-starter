import Client from '../database';

export type Product = {
  product_id?: number,
  product_name: string,
  product_price: number}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cant get products. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE product_id=($1)';
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
      const sql = 'INSERT INTO products (product_name, product_price) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [prod.product_name, prod.product_price]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Cant create new product ${prod.product_name}. Error: ${err}`);
    }
  }
}