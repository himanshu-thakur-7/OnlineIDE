const { Server } = require("socket.io");
const { startContainer, stopContainer } = require('./dockerService');
const { _ } = require("lodash")

// For saving connections and containers status
const connections = {};
// For saving debounced stop container functions for each container
const debounceMap = {};

const initOrchestrator = (httpServer) => {
    // Initialize Socket IO server
    const orchestrator = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    try {
        orchestrator.on("connection", async (socket) => {

            // Get room id and env from query params
            const roomId = socket.handshake.query.roomId;
            const env = socket.handshake.query.env;

            // Initialize and start the container
            let { containerId, webSocketPort, devPort } = await startContainer(roomId, env);

            // Initialize container info object
            connections[containerId] = connections[containerId] || { 'sockets': [], 'WS_PORT': webSocketPort, 'DEV_PORT': devPort };

            console.log(`Container Id: ${containerId}`);
            connections[containerId] = { 'sockets': [...connections[containerId]['sockets'], socket.id], 'WS_PORT': webSocketPort, 'DEV_PORT': devPort };
            console.log(connections);
            // Emit container created event and sending ports info
            socket.emit('containerCreated', { 'webSocketPort': webSocketPort, 'devPort': devPort });

            // Initialize debounce map
            if (!debounceMap[containerId]) {
                debounceMap[containerId] = _.debounce(async () => {
                    // If no one has connected to the container for more than 10 secs , delete it.
                    if (connections[containerId] && connections[containerId]['sockets'].length === 0) {
                        await stopContainer(containerId);
                        delete connections[containerId];
                        delete debounceMap[containerId];
                        console.log(`Container ${containerId} stopped and removed from connections.`);
                    }
                }, 10000); // 10 seconds
            }
            // On client disconnect perform cleanup
            socket.on('disconnect', async () => {
                console.log('Client disconnected!');
                connections[containerId]['sockets'] = connections[containerId]['sockets'].filter(conn => conn !== socket.id);
                console.log(connections);

                debounceMap[containerId]();
            });
        })
    }
    catch (error) {
        socket.emit('error', error.message);
    }
}

module.exports = { initOrchestrator };