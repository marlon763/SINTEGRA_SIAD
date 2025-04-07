const multerConf = require('multer');

const storage = multerConf.memoryStorage();
const multer = multerConf({ storage: storage });

module.exports = multer;