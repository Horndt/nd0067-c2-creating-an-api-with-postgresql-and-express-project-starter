CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    user_password VARCHAR(250) NOT NULL
    );