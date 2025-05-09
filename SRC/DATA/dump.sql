CREATE DATABASE SIAD

CREATE TABLE IF NOT EXISTS usuarios (
id SERIAL PRIMARY KEY,
nome VARCHAR (50) NOT NULL,
email VARCHAR (50) UNIQUE NOT NULL,
senha VARCHAR (150) NOT NULL
);

CREATE TABLE IF NOT EXISTS empresas (
id SERIAL PRIMARY KEY,
nome_empresa varchar (50) NOT NULL,
cnpj varchar(14) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  rel_empresa VARCHAR(14) NOT NULL REFERENCES empresas(CNPJ),
  email VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS movsintegra (
  id SERIAL PRIMARY KEY,
  data VARCHAR(50) NULL,
  usuario VARCHAR(50) NOT NULL,
  rel_empresa VARCHAR(14) NOT NULL REFERENCES empresas(CNPJ),
  nome_arquivo TEXT NOT NULL,
  link_arquivo TEXT NOT NULL
);