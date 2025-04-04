const { Router } = require("express");
const routers = Router();

const {
    userRegister,
    login,
    updateUser
} = require("./CONTROLLER/userController");

const loginSchema = require("./SCHEMA/userLoginSchema");
const userSchema = require("./SCHEMA/userSchema")
 
const { authenticateLoggedInUser } = require("./INTERMEDIARIES/loggedUser");
const validateRequestBody = require("./INTERMEDIARIES/validateRequestBody");

//CRIACAO DE ROTAS SEM NECESSIDADE DE LOGIN DO USUARIO
routers.post("/usuario",  validateRequestBody (userSchema), userRegister);
routers.post("/login",  validateRequestBody (loginSchema), login);


//VERIFICADOR DE USUARIO LOGADO
routers.use(authenticateLoggedInUser);

routers.put("/usuario",  validateRequestBody (userSchema), updateUser);

module.exports = routers