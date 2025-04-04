const jwt = require('jsonwebtoken')
require('dotenv').config()
const knex = require('../DATA/connection')

const authenticateLoggedInUser = async (req, res, next) => {
   
    const authorization = req.headers.authorization

    if (!authorization) {

        return res.status(401).json({
            mensagem: "Você precisa estar logado para acessar esta página."
        })
    }

    const token = authorization.split(' ')[1]

    try {

        const { id } = jwt.verify(token, process.env.SENHA_JWT)
        const user = await knex('usuarios').where({ id }).first()

        if (!user) {

            return res.status(401).json({
                mensagem: "Usuário não autorizado."
            })
        }

        req.user = user

        next()        

    } catch (error) {
        
        return res.status(401).json({
            mensagem: "Usuário não autorizado."
        });
    }
};

module.exports = {authenticateLoggedInUser}