const { s3 } = require("../DATA/awsConfig");

async function sendSintegraAws (empresa , file , mesAno) {

    const arquivo = await s3.upload({

        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: `Sintegra/${mesAno}/${empresa[0].nome_empresa}.zip`,
        Body: file,
        ContentType: 'application/zip',
        ContentDisposition: 'attachment'
    
    }).promise();

    return arquivo
};

module.exports = sendSintegraAws;