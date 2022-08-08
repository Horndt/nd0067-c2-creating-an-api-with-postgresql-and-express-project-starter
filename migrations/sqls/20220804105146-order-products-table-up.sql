CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    o_id integer REFERENCES orders(id) ON DELETE CASCADE,
    p_id integer REFERENCES products(id) ON DELETE CASCADE,
    quantity integer NOT NULL
);