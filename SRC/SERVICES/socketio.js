const { Server } = require("socket.io");

let io // Variável para guardar o io

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Permitir conexões desta origem
    },
  });
  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO não foi inicializado.");
  }
  return io;
};

module.exports = { initSocket, getIo };
