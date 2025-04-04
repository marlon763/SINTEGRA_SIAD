const validateRequestBody = joiSchema => async (req, res, next) => {
    
    try {

        if (!joiSchema) {
            return res.status(500).json({
                mensagem: 'Esquema Joi não fornecido.'
            });
        }

        await joiSchema.validateAsync(req.body) 

        next()
        
    } catch (error) {

        return res.status(400).json({
            mensagem: error.message
        })    
    }
}

module.exports = validateRequestBody