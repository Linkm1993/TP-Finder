-- Schema
DROP DATABASE IF EXISTS tp_db;
CREATE DATABASE tp_db;
USE tp_db;

CREATE TABLE posts (
  id INT NOT NULL AUTO_INCREMENT,
  author VARCHAR(65) NULL,
  msg VARCHAR(65) NULL,
  store_id VARCHAR(65) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE store (
  id INT NOT NULL AUTO_INCREMENT,
  store_name VARCHAR(65) NULL,
  stock INT
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
    created_at DATETIME,
   email VARCHAR(65),
   password VARCHAR(65),
   updatedAt DATETIME,
  PRIMARY KEY (id)
);

