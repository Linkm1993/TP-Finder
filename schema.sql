-- Schema
DROP DATABASE IF EXISTS tp_db;
CREATE DATABASE tp_db;
USE tp_db;

CREATE TABLE store (
  id INT NOT NULL AUTO_INCREMENT,
  created_at DATETIME,
  updatedAt DATETIME,
  store_name VARCHAR(65) NULL,
  uniqueID VARCHAR(80),
  availability INT,
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
   created_at DATETIME,
   store_id VARCHAR(65),
   password VARCHAR(65),
   updatedAt DATETIME,
  PRIMARY KEY (id)
);

