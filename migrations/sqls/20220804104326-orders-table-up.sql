CREATE TABLE orders (
    o_id SERIAL PRIMARY KEY,
    o_status VARCHAR(15),
    u_id bigint REFERENCES users(user_id)
);