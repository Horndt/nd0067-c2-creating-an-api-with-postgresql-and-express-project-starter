CREATE TABLE products (product_id SERIAL PRIMARY KEY, product_name VARCHAR(100), product_price INTEGER NOT NULL);
CREATE TABLE users (user_id SERIAL PRIMARY KEY, user_name VARCHAR(100), first_name VARCHAR(50), last_name VARCHAR(50), user_password VARCHAR(250));
CREATE TABLE orders (order_id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, order_status VARCHAR(50) NOT NULL);
CREATE TABLE products_order (product_order_id SERIAL PRIMARY KEY, product_quantity INTEGER, product_id INTEGER REFERENCES product(id), order_id INTEGER REFERENCES orders(order_id))