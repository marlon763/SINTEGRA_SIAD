const knex = require("../DATA/connection");

const registerEnterprise = async (req, res) => {
  try {
    const { nome_empresa , cnpj , emails } = req.body;

    const enterpriseExisting = await knex("empresas").where({ cnpj }).first();

    if (enterpriseExisting) {
      return res.status(400).json({ mensagem: "Empresa já cadastrada com esse CNPJ." });
    }

    const newEnterprise = await knex("empresas").insert({ nome_empresa, cnpj }).returning("*");

    // Se vierem e-mails no body, insere na tabela de emails
    if (Array.isArray(emails) && emails.length > 0) {
      const formattedEmails = emails.map((email) => ({
        rel_empresa: newEnterprise[0].id,
        email,
      }));

      await knex("emails").insert(formattedEmails);
    }

    return res.status(201).json({ mensagem: "Empresa cadastrada com sucesso.", empresa: newEnterprise });

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const updateEnterprise = async (req, res) => {
    try {
      const { id_empresa } = req.params;
      const { nome_empresa, cnpj, emails } = req.body;

      if (!id_empresa){
        return res.status(400).json({mensagem : "Empresa a ser alterada não informada"})
      };
  
      const Enterprise  = await knex("empresas").where({ id: id_empresa }).first();

      if (!Enterprise ) {
        return res.status(404).json({ mensagem: "Empresa não encontrada." });
      };
  
      // Verifica se o novo CNPJ já está sendo usado por outra empresa // .whereNot verifica excluindo o proprio registro
      const cnpjExist = await knex("empresas").where({ cnpj }).whereNot({ id: id_empresa }).first();
  
      if (cnpjExist) {
        return res.status(400).json({ mensagem: "Este CNPJ já está cadastrado em outra empresa." });
      }

      await knex("empresas").where({ id: id_empresa }).update({ nome_empresa, cnpj });
  
      // Atualiza os e-mails, se enviados
      if (Array.isArray(emails)) {
        // Remove os e-mails antigos
        await knex("emails").where({ rel_empresa: id_empresa }).del();
  
        // Insere os novos e-mails
        const novosEmails = emails.map((email) => ({
          rel_empresa: id_empresa,
          email,
        }));
  
        await knex("emails").insert(novosEmails);
      }
  
      return res.status(200).json({ mensagem: "Empresa atualizada com sucesso." });
  
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const registerEmail = async (req, res) => {
    try {
      const { id_empresa } = req.params;
      const { email } = req.body;
      
      const existing = await knex("emails").where({ rel_empresa: id_empresa, email }).first();
  
      if (existing) {
        return res.status(400).json({ message: "E-mail já registrado para esta empresa." });
      };
  
      await knex("emails").insert({
        rel_empresa: id_empresa,
        email,
      });
  
      return res.status(200).json();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
};

const deleteEmail = async (req, res) => {
  try {
    const { id_empresa, email } = req.params;

    if (!email || !id_empresa) {
      return res.status(400).json({ mensagem: "Empresa e e-mail são obrigatórios." });
    };

    const emailExistente = await knex("emails")
      .where({ rel_empresa: id_empresa, id : email })
      .first();

    if (!emailExistente) {
      return res.status(404).json({ mensagem: "E-mail não encontrado para esta empresa." });
    };

    await knex("emails")
      .where({ rel_empresa: id_empresa, id : email })
      .del();

    return res.status(200).json({ mensagem: "E-mail removido com sucesso." });

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

module.exports = {
    registerEnterprise,
    updateEnterprise,
    registerEmail,
    deleteEmail
};