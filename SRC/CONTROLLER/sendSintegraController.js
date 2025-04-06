const sendSintegra = () => {

    try {
        const { periodo , razao , cnpj , data_geracao } = req.body
        const { nome } = req.user;


    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}; 