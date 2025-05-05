const multer = require('./SERVICES/multerConf');
const { Router } = require("express");
const routers = Router();

const {
    userRegister,
    login,
    updateUser
} = require("./CONTROLLER/userController");

const {
    registerEnterprise,
    updateEnterprise,
    registerEmail,
    deleteEmail
} = require("./CONTROLLER/enterpriseController");

const {
    sendSintegra
} = require("./CONTROLLER/sendSintegraController");

const {
    initializeClient
} = require("./VENOM/initVenom")

const {
    createVenom,
    getCanais
} = require("./VENOM/functionsVenom")

const {handleTickets} = require("./CONTROLLER/tickets")

const loginSchema = require("./SCHEMA/userLoginSchema");
const userSchema = require("./SCHEMA/userSchema");
const { EnterpriseSchema , EmailSchema } = require("./SCHEMA/enterpriseSchema");


const { authenticateLoggedInUser } = require("./INTERMEDIARIES/loggedUser");
const validateRequestBody = require("./INTERMEDIARIES/validateRequestBody");
const verifyMulterFiles  = require("./INTERMEDIARIES/verifyFilesReq");


//CRIACAO DE ROTAS SEM NECESSIDADE DE LOGIN DO USUARIO
routers.post("/usuario",  validateRequestBody (userSchema), userRegister);
routers.post("/login",  validateRequestBody (loginSchema), login);

//VERIFICADOR DE USUARIO LOGADO
routers.use(authenticateLoggedInUser);

routers.put("/usuario",  validateRequestBody (userSchema), updateUser);

routers.post("/empresa", validateRequestBody(EnterpriseSchema) , registerEnterprise);
routers.put("/empresa/:id_empresa", validateRequestBody(EnterpriseSchema) , updateEnterprise);
routers.post("/empresa/email/:id_empresa", validateRequestBody(EmailSchema) , registerEmail);
routers.delete("/emails/:id_empresa/:email", validateRequestBody(EmailSchema) , deleteEmail);

routers.post("/teste/:cnpj_empresa", multer.array("files"), verifyMulterFiles , sendSintegra);

routers.get("/canais" , getCanais)
routers.post("/registrarcanais" , createVenom);

routers.get("/atendimento/:id" , initializeClient);

routers.get("/tickets",handleTickets)

module.exports = routers