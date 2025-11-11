// index.js placeholder for socket
const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', (socket) => {
        console.log('Nouvelle connexion socket :', socket.id);

        socket.on('disconnect', () => {
            console.log('Déconnexion socket :', socket.id);
        });
    });
};

const getIO = () => {
    if (!io) throw new Error('Socket.io non initialisé');
    return io;
};

module.exports = { initSocket, getIO };
