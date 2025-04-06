const knex = require("../DATA/connection");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
require("dotenv").config();

const userRegister = async (req, res) => {

    try {

      const { name, email, password } = req.body;
  
      if (await knex("usuarios").where({ email }).first()) {
        return res
          .status(409)
          .json({ mensagem: "Email já cadastrado" });
      }
  
      const passwordEncrypted = await bcrypt.hash(password, 10);
  
      await knex("usuarios").insert({
        nome : name,
        email,
        senha : passwordEncrypted,
      });
  
      res.status(204).json();

    } catch (error) {
      return res.status(500).json({ mensagem: error });
    }
};
  
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await knex("usuarios").where({ email }).first();
  
      if (!user) {
        return res.status(404).json({
          mensagem: "Senha ou email incorretos",
        });
      };
  
      const correctPassword = !(await bcrypt.compare(password, user.senha));
  
      if (correctPassword) {
        return res.status(404).json({
          mensagem: "Senha ou email incorretos",
        });
      };
  
      let { senha : passwordUser, ...UserNoPassword } = user;
  
      const token = sign(
        {
          id: UserNoPassword.id,
        },
        process.env.SENHA_JWT,
        {
          expiresIn: "8h",
        }
      );
  
      return res.status(200).json({
        mensagem: UserNoPassword,
        token,
      });

    } catch (error) {
      console.log(error)
      return res.status(500).json({ mensagem: error.message});
    }
};

const updateUser = async (req, res) => {
    const { name, email, password} = req.body;
    const { id } = req.user;
  
    try {
      const emailReq = await knex("usuarios").where({ email });
      const emailUsuario = await knex("usuarios").select("email").where({ id });
  
      if (emailReq.length > 0 && emailReq[0].email !== emailUsuario[0].email) {
        return res
          .status(400)
          .json({ mensagem: "Já existe um cadastro com esse email" });
      };
  
      const passwordEncrypted = await bcrypt.hash(`${password}`, 10);

      await knex("usuarios").where({ id }).update({
        nome : name,
        email,
        senha: passwordEncrypted,
      });
  
      return res.status(204).json();

    } catch (error) {
      return res.status(500).json({ mensagem: error.message });
    }
};

module.exports = { 
    userRegister,
    login,
    updateUser
};