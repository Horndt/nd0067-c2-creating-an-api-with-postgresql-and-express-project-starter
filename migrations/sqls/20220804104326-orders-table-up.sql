CREATE TABLE orders (
    o_id SERIAL PRIMARY KEY,
    o_status VARCHAR(15) NOT NULL,
    -- u_id bigint REFERENCES users(user_id),
    u_id INTEGER NOT NULL,
    CONSTRAINT my_user
    FOREIGN KEY(u_id)
	REFERENCES users(user_id)
);