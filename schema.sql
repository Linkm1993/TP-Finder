DROP DATABASE IF EXISTS tp_db;
CREATE DATABASE tp_db;

USE DATABASE tp_db;

CREATE TABLE stock (
    id INT AUTO_INCREMENT NOT NULL,
    store_name VARCHAR(30),
    availbility INT,
    PRIMARY KEY(id)
);

CREATE TABLE posts(
    id INT AUTO_INCREMENT NOT NULL,
    sotre_id VARCHAR(30),
    author VARCHAR(30),
    msg VARCHAR(55),
    PRIMARY KEY(id)
);