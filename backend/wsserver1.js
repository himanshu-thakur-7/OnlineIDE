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
            const replId = socket.handshake.query.roomId;
            const env = socket.handshake.query.env;
            console.log(replId, env);
            let { containerId, webSocketPort } = await startContainer(replId, env);
            console.log(webSocketPort)
            if (webSocketPort === -1) {
                webSocketPort = connections[containerId][0]['PORT'];
            }
            console.log(`Container Id: ${containerId}`);
            connections[containerId] = connections[containerId] || [];
            connections[containerId].push({ 'socketId': socket.id, 'PORT': webSocketPort });

            const CONTAINER_URL = `http://localhost:${webSocketPort}`
            console.log(webSocketPort);
            console.log(connections);
            socket.emit('containerCreated', webSocketPort);

            // relayEvents(socket,webServer2,terminal);
            // terminal.on('data', (data) => {
            //     socket.emit('output', data);
            // });

            // terminal.on('terminalInput', (input) => {
            //     terminal.write(input); ``
            // });

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