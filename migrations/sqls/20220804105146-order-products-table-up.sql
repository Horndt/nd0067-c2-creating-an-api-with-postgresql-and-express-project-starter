CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity integer NOT NULL,
    o_id bigint REFERENCES orders(id) ON DELETE CASCADE, 
    p_id bigint REFERENCES products(id) ON DELETE CASCADE
    );