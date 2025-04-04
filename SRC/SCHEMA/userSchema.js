const joi = require('joi');

const userSchema = joi.object({
    name: joi.string().min(3).max(50).required().messages({
      "string.base": "O nome deve ser um texto.",
      "string.min": "O nome deve ter pelo menos 3 caracteres.",
      "string.max": "O nome pode ter no máximo 50 caracteres.",
      "any.required": "O nome é obrigatório."
    }),
    email: joi.string().email().required().messages({
      "string.email": "O email deve ser válido.",
      "any.required": "O email é obrigatório."
    }),
    password: joi.string().min(6).max(100).required().messages({
      "string.min": "A senha deve ter pelo menos 6 caracteres.",
      "string.max": "A senha pode ter no máximo 100 caracteres.",
      "any.required": "A senha é obrigatória."
    })
  });
  
module.exports = userSchema;