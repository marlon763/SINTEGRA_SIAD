const transport = require("../SERVICES/nodeMailerConnection");
const compilerHtml = require("../UTILS/compilerEmail");

const sendEmail = async ( htmlEmail , context) => {

    const html = await compilerHtml( htmlEmail , {
        nome_empresa : context.nome_empresa,
        cnpj : context.cnpj,
        data_geracao : context.data_geracao,
        responsavel : context.responsavel,
        link : context.link,
        destinatarios : context.destinatarios
    } );

    transport.sendMail({
        from: `${process.env.MAILTRAP_NAME} <${process.env.MAILTRAP_FROM}>`,
        to: context.destinatarios.map(dest => dest.email),
        subject: "verifi email ✔",
        html, 
    })
};

module.exports = {
    sendEmail
};

