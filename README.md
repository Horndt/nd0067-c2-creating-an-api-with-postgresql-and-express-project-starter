# Storefront Backend Project

## 1. STEP (clone Repo)

- clone the Repo

## 2. STEP (install dependencies)

- npm install

## 3. STEP (create a .env file)

- create a .env file with the following structure:

POSTGRES_HOST = localhost
POSTGRES_PORT = 5432
POSTGRES_DB = store_dev
POSTGRES_TEST_DB = store_test
POSTGRES_USER = store_user
POSTGRES_PASSWORD = 'YOUR_PASSWORD'
ENV = dev
BCRYPT_PASSWORD = 'YOUR_PASSWORD'
SALT_ROUNDS = 10
TOKEN_SECRET = 'YOUR_PASSWORD'

## 4. STEP (connect to a postgres database)

- the API connects to a postgres database

* 1 STEP: create databases (store_dev and store_test),
* 2 Step: create a user (store_user), and grant him all priviliges on the databases,
* 3 Step: run the command "psql -U postgres" in a terminal and then run the following:

- CREATE USER store_user WITH PASSWORD 'YOUR_PASSWORD';
- CREATE DATABASE store_dev;
- \c store_dev;
- GRANT ALL PRIVILEGES ON DATABASE store_dev TO store_user;
- CREATE DATABASE store_test;
- \c store_test;
- GRANT ALL PRIVILEGES ON DATABASE store_test TO store_user;
- \q

## 5. STEP (run Server and tests)

### start Server in watching mode

- npm run watch

### compile from TS to JS

- npm run build

### start tests

- npm run test

### drop tables

- npm run migratereset
