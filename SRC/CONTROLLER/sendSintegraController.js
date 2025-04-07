const { sendEmail } = require("../UTILS/email");
const knex = require("../DATA/connection");
const { s3 } = require("../DATA/awsConfig")

const archiver = require('archiver');
const stream = require('stream');

async function loadEmpresa (id_empresa , id) {

    const empresa = await knex("empresas").select("nome_empresa", "cnpj").where({ id : id_empresa , rel_usuario : id });

    return empresa
    
};

async function loadEmails( id_empresa ) {

    const emails = await knex("emails").select("email").where({ rel_empresa : id_empresa });

    return emails
    
};

async function compressor(files) {
    return new Promise((resolve, reject) => {
        const zipStream = new stream.PassThrough();
        const archive = archiver('zip', { zlib: { level: 9 } });

        const chunks = [];

        zipStream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        zipStream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer); // Aqui está seu arquivo zip final
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(zipStream);

        files.forEach(file => {
            archive.append(file.buffer, { name: file.originalname });
        });

        archive.finalize();
    });
};

const sendSintegra = async (req,res) => {

    try {
        const { id_empresa } = req.params
        const { id , nome } = req.user;
        const files = req.files

        const promisseAll = async (id_empresa , id) => {
            const [empresa , email] = await Promise.all([
                loadEmpresa( id_empresa , id ),
                loadEmails( id_empresa )
            ])
            
            return {empresa , email}
        };

        const { empresa, email } = await promisseAll( id_empresa , id);

        let file = await compressor(files);

        const now = new Date();
        const mesAno = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

        const arquivo = await s3.upload({

            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: `Sintegra/${mesAno}/${empresa[0].nome_empresa}.zip`,
            Body: file,
            ContentType: 'application/zip',
            ContentDisposition: 'attachment'
        
        }).promise();

        file = null;

        const context = {
            nome_empresa : empresa[0].nome_empresa,
            cnpj : empresa[0].cnpj,
            data_geracao : new Date(),
            responsavel : nome,
            link : arquivo.Location,
            destinatarios : email
        };

        const htmlEmail = "./SRC/TAMPLETES/emailContabilSintegra.html";

        sendEmail( htmlEmail , context)

        console.log("ok")

        return res.status(200)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ mensagem: error.message });
    }
};

module.exports = {
    sendSintegra
};