DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first != ''),
    last VARCHAR(255) NOT NULL CHECK (last != ''),
    email VARCHAR(255) NOT NULL CHECK (email != '') UNIQUE,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    bio VARCHAR(5000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
