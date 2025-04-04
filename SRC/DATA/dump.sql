CREATE DATABASE SIAD

CREATE TABLE IF NOT EXISTS usuarios (
id SERIAL PRIMARY KEY,
nome varchar (50) NOT NULL,
email varchar (50) unique not null,
senha varchar (150) not null
);

CREATE TABLE IF NOT EXISTS empresas (
id SERIAL PRIMARY KEY,
nome_empresa varchar (50) NOT NULL,
cnpj varchar(14) NOT NULL
);

CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  rel_empresa INTEGER NOT NULL REFERENCES empresas(id),
  email VARCHAR(50) NOT NULL
);