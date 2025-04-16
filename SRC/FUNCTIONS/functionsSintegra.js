const knex = require("../DATA/connection");
const archiver = require('archiver');
const stream = require('stream');

async function loadEmpresa ( cnpj_empresa ) {

    const empresa = await knex("empresas").select("nome_empresa", "cnpj").where({ cnpj : cnpj_empresa });

    return empresa
    
};

async function loadEmails( cnpj_empresa ) {

    const emails = await knex("emails").select("email").where({ rel_empresa : cnpj_empresa });

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

async function movSintegra ( userName , datamov , cnpj_empresa , arquivo ) {

    const mov = await knex("movsintegra").insert({ 
    data : datamov,
    usuario : userName,
    rel_empresa : cnpj_empresa,
    nome_arquivo : arquivo.key,
    link_arquivo : arquivo.Location
 });

};

module.exports = {
    loadEmpresa,
    loadEmails,
    compressor,
    movSintegra
};