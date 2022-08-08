import Client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  user_password: string;
};

const Crypt = process.env.BCRYBT_PASSWORD as string;
const saltRounds = process.env.SALT_ROUNDS as string;

export class UserStore {
  destroy(id: any) {
    throw new Error("Method not implemented.");
  }
  delete(id: any) {
    throw new Error("Method not implemented.");
  }
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users";
      const result = await conn.query(sql);
      conn.release();
      return result.rows as User[];
    } catch (error) {
      throw new Error(`Cant get users: ${error}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users WHERE id=($1)";
      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0] as User;
    } catch (error) {
      throw new Error(`Cant get user: ${error}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO users (first_name, last_name, user_password) VALUES($1, $2, $3) RETURNING *";
      const hash = bcrypt.hashSync(
        user.user_password + Crypt,
        parseInt(saltRounds)
      );

      const result = await conn.query(sql, [
        user.first_name,
        user.last_name,
        hash,
      ]);
      const newUser = result.rows[0] as User;

      conn.release();
      return newUser;
    } catch (err) {
      throw new Error(
        `Cant create user (${(user.first_name, user.last_name)}): ${err}`
      );
    }
  }

  async authenticate(
    first_name: string,
    user_password: string
  ): Promise<User | null> {
    const conn = await Client.connect();
    const passwordSql = "SELECT password FROM users WHERE first_name=($1)";
    const result = await conn.query(passwordSql, [first_name]);
    if (result.rows.length > 0) {
      const userSql = "SELECT * FROM users WHERE first_name=($1)";
      const passowrd = result.rows[0];
      if (bcrypt.compareSync(user_password + Crypt, passowrd)) {
        const user = await conn.query(userSql, [first_name]);
        return user.rows[0];
      }
    }
    return null;
  }
}
