const {  v4 : uuidv4  } = require ( 'uuid' );
const knex = require("../DATA/connection");

const createVenom = async (req,res) => {

    try {

        const {nome} = req.body

        const canal = await knex("canais").insert({
            id : uuidv4(),
            nome,
            telefone : "Sem numero",
            status : "sincronize"
        }).returning("*");

        return res.status(200).json({canal});
    } catch (error) {
        //console.log(error)
        return res.status(500).json({mensagem : "Erro interno do servidor"});
    }

};

const getCanais = async (req,res) =>{
    try {

        const canais  = await knex("canais");
        return res.status(200).json(canais)
        
    } catch (error) {
        return res.status(500).json({mensagem : "Erro interno do servidor"});
    }
}

module.exports = {
    createVenom,
    getCanais
}