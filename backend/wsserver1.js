const { Server } = require("socket.io");
const { startContainer, stopContainer, terminals } = require('./dockerService');

const connections = {};
const initOrchestrator = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    try {
        io.on("connection", async (socket) => {
            const replId = socket.handshake.query.roomId;
            const env = socket.handshake.query.env;
            console.log(replId, env);
            const containerId = await startContainer(replId, env);
            console.log(`Container Id: ${containerId}`);
            connections[containerId] = connections[containerId] || [];
            connections[containerId].push(socket);
            const terminal = terminals[containerId];

            terminal.on('data', (data) => {
                socket.emit('output', data);
            });

            terminal.on('terminalInput', (input) => {
                terminal.write(input); ``
            });

            socket.on('disconnect', async () => {
                console.log('Client disconnected');
                connections[containerId] = connections[containerId].filter(conn => conn !== socket);
                if (connections[containerId].length === 0) {
                    delete connections[containerId];
                    await stopContainer(containerId);
                }
            });
        })
    }
    catch (error) {
        socket.emit('error', error.message);
    }
}

module.exports = { initOrchestrator };