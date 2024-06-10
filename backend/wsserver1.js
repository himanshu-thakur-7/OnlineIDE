const { Server } = require("socket.io");
const { startContainer, stopContainer } = require('./dockerService');
const { _ } = require("lodash")

const connections = {};

const stopContainerDebounced = _.debounce(async (containerId) => {
    if (connections[containerId] && connections[containerId]['sockets'].length === 0) {
        await stopContainer(containerId);
        delete connections[containerId];
        console.log(`Container ${containerId} stopped and removed from connections.`);
    }
}, 10000);
const initOrchestrator = (httpServer) => {
    const wsServer1 = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    try {
        wsServer1.on("connection", async (socket) => {
            const replId = socket.handshake.query.roomId;
            const env = socket.handshake.query.env;

            console.log(replId, env);
            let { containerId, webSocketPort, devPort } = await startContainer(replId, env);
            console.log(webSocketPort)

            connections[containerId] = connections[containerId] || { 'sockets': [], 'WS_PORT': webSocketPort, 'DEV_PORT': devPort };
            if (webSocketPort === -1) {
                webSocketPort = connections[containerId]['WS_PORT'];
            }
            if (devPort === -1) {
                devPort = connections[containerId]['DEV_PORT'];
            }
            console.log(`Container Id: ${containerId}`);
            connections[containerId] = { 'sockets': [...connections[containerId]['sockets'], socket.id], 'WS_PORT': webSocketPort, 'DEV_PORT': devPort };

            console.log(webSocketPort);
            console.log(connections);
            socket.emit('containerCreated', { 'webSocketPort': webSocketPort, 'devPort': devPort });

            socket.on('disconnect', async () => {
                console.log('Client disconnected!');
                connections[containerId]['sockets'] = connections[containerId]['sockets'].filter(conn => conn !== socket.id);
                console.log(connections);
                
                stopContainerDebounced(containerId);
            });
        })
    }
    catch (error) {
        socket.emit('error', error.message);
    }
}

module.exports = { initOrchestrator };