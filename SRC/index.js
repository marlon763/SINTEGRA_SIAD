const http = require("http");
const express = require("express");
const routers = require("./router");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(routers);

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});