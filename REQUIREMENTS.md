# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

app.get("/products", index);
app.get("/products/:id", show);
app.post("/products/create", verifyAuthToken, create);

#### Users

app.get("/users", verifyAuthToken, index);
app.get("/users/:id", verifyAuthToken, show);
app.post("/users/create", create);
app.post("/users/signIn", signIn);

#### Orders

app.get("/orders/:id", verifyAuthToken, show);

## Data Shapes

#### Product

    p_id SERIAL PRIMARY KEY,
    p_name VARCHAR(64) NOT NULL,
    p_price integer NOT NULL

#### User

    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(30),
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    user_password VARCHAR(250)

#### Orders

    o_id SERIAL PRIMARY KEY,
    o_status VARCHAR(15) NOT NULL,
    u_id INTEGER NOT NULL,
    CONSTRAINT my_user
    FOREIGN KEY(u_id)
    REFERENCES users(user_id)
