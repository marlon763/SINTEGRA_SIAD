const http = require("http");
const express = require("express");
const cors = require('cors');
const { initSocket } = require("./SERVICES/socketio")

const routers = require("./router");

const app = express();
const server = http.createServer(app);

app.use(cors( {
    cors: {
      origin: process.env.FRONT_URL, // Permitir conexões desta origem
    },
  }))
app.use(express.json());
app.use(routers);

// Inicializar Socket.IO
initSocket(server);

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
