const verifyMulterFiles = async ( req , res , next ) => {

    if ( !req.files || req.files.length < 1 ) {

        return res.status(404).json({ mensagem : "Arquivos sintegra não enviaos!" });

    };

    next()
};

module.exports = verifyMulterFiles