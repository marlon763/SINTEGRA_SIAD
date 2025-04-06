const Joi = require("joi");

const EnterpriseSchema = Joi.object({
  nome_empresa: Joi.string().min(2).max(50).required(),
  cnpj: Joi.string().length(14).pattern(/^\d+$/).required(),
  emails: Joi.array().items(
    Joi.string().email().max(50)
  ).optional()
});
  
const EmailSchema = Joi.object({
    email: Joi.string().email().required()
});

module.exports = {
    EnterpriseSchema,
    EmailSchema
};