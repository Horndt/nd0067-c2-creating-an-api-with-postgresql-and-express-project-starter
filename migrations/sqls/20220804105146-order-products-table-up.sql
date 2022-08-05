CREATE TABLE order_products (
    o_p_id SERIAL PRIMARY KEY,
    p_quantity integer,
    o_id bigint REFERENCES orders(o_id), 
    p_id bigint REFERENCES products(p_id)
    );