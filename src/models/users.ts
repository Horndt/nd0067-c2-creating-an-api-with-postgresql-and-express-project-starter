import bcrypt from 'bcrypt';
import Client from '../database';

const saltRounds = process.env.SALT_ROUNDS;
export type User = {
  id?: number,
  user_name: string,
  first_name: string,
  last_name: string,
  user_password: string}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cant get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql =
        'SELECT * FROM users WHERE user_id=($1)';
        
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`cant get user ${id}. Error: ${err}`);
    }
  }

  async create(usr: User): Promise<User> {
    try {
      if (saltRounds) {
        const hash = bcrypt.hashSync(
            usr.user_password + process.env.BCRYPT_PASSWORD,
          parseInt(saltRounds)
        );
        
        const conn = await Client.connect();
        const sql =
          'INSERT INTO users (user_name, first_name, last_name, user_password) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await conn.query(sql, [usr.user_name, usr.first_name, usr.last_name, hash]);
        const user = result.rows[0];
        conn.release();
        return user;
      } else {
        throw new Error('env.SALT_ROUNDS cant found');
      }
    } catch (err) {
      throw new Error(`cant add user (${usr.user_name}): ${err}`);
    }
  }
   async authenticate(
    user_name: string,
    user_password: string): Promise<User | null> {
    const conn = await Client.connect();
    const sql = 'SELECT user_password FROM users WHERE user_name=($1)';
    const result = await conn.query(sql, [user_name]);
    if (result.rows.length) {
      const user = result.rows[0];
      if (
        bcrypt.compareSync(
          user_password + process.env.BCRYPT_PASSWORD,
          user.user_password
        )
      ) {
        return user;
      } else {
        throw new Error('Invalid login attempt, Try it again, Capslock aktive?.');
      }
    }
    conn.release();
    return null;
  }
}