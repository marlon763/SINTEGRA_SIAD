CREATE DATABASE SIAD

CREATE TABLE IF NOT EXISTS usuarios (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
nome varchar (50) NOT NULL,
email varchar (50) unique not null,
senha varchar (150) not null
);