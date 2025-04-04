const transport = require("../../SERVICES/nodemailer");
const compilerHtml = require("../../UTILS/compilerEmail");

const sendEmail = async ( htmlEmail , context , email) => {

    const html = await compilerHtml( htmlEmail , { context });

    transport.sendMail({
        from: `${process.env.MAILTRAP_NAME} <${process.env.MAILTRAP_FROM}>`,
        to: `${contexto.destinatario} <${email}>`,
        subject: "verifi email ✔",
        html, 
    })
};

module.exports = {
    sendEmail
};

