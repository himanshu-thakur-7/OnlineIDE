const { Server } = require("socket.io");
const { startContainer, stopContainer } = require('./dockerService');


const connections = {};
const initOrchestrator = (httpServer) => {
    const wsServer1 = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    try {
        wsServer1.on("connection", async (socket) => {
            console.log(socket);
            const replId = socket.handshake.query.roomId;
            const env = socket.handshake.query.env;

            console.log(replId, env);
            let { containerId, webSocketPort, devPort } = await startContainer(replId, env);
            console.log(webSocketPort)
            if (webSocketPort === -1) {
                webSocketPort = connections[containerId][0]['WS_PORT'];
            }
            if (devPort === -1) {
                devPort = connections[containerId][0]['DEV_PORT'];
            }
            console.log(`Container Id: ${containerId}`);
            connections[containerId] = connections[containerId] || [];
            connections[containerId].push({ 'socketId': socket.id, 'WS_PORT': webSocketPort, 'DEV_PORT': devPort });

            console.log(webSocketPort);
            console.log(connections);
            socket.emit('containerCreated', { 'webSocketPort': webSocketPort, 'devPort': devPort });

            // relayEvents(socket,webServer2,terminal);
            // terminal.on('data', (data) => {
            //     socket.emit('output', data);
            // });

            // terminal.on('terminalInput', (input) => {
            //     terminal.write(input); ``
            // });

            socket.on('disconnect', async () => {
                console.log('Client disconnected');
                connections[containerId] = connections[containerId].filter(conn => conn['socketId'] !== socket);
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