CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    o_status VARCHAR(15) NOT NULL,
    user_id integer REFERENCES users(id) ON DELETE CASCADE

);