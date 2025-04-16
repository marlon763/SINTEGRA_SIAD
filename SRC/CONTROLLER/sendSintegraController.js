const { sendEmail } = require("../UTILS/email");
const { 
    loadEmpresa, 
    loadEmails, 
    compressor,
    movSintegra
} = require("../FUNCTIONS/functionsSintegra");
const sendSintegraAws = require("../FUNCTIONS/functionsAwsSendSintegra");

const sendSintegra = async (req,res) => {

    try {
        const { cnpj_empresa } = req.params
        const { id , nome } = req.user;
        const files = req.files

        if (!cnpj_empresa) {
            return res.status(404).json({mensagem : "CNPJ da empresa não informado"})
        };

        const promisseAll = async (cnpj_empresa) => {
            const [empresa , email] = await Promise.all([
                loadEmpresa( cnpj_empresa ),
                loadEmails( cnpj_empresa )
            ])
            
            return {empresa , email}
        };

        let file = await compressor(files);

        const now = new Date();
        const mesAno = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        const { empresa, email } = await promisseAll( cnpj_empresa , id);

        const arquivo = await sendSintegraAws(empresa , file , mesAno);
        
        file = null;

        const dataHora = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

        const context = {
            nome_empresa : empresa[0].nome_empresa,
            cnpj : empresa[0].cnpj,
            data_geracao : dataHora,
            responsavel : nome,
            link : arquivo.Location,
            destinatarios : email
        };

        const htmlEmail = "./SRC/TAMPLETES/emailContabilSintegra.html";
        const userName = nome
        const dataMov = dataHora; 

        sendEmail( htmlEmail , context );
        movSintegra( userName , dataMov , cnpj_empresa , arquivo );

        return res.status(200).json({ mensagem : "Email enviado com sucesso!" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ mensagem: error.message });
    }
};

module.exports = {
    sendSintegra
};