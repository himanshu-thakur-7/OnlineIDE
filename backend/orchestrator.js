const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { startContainer, stopContainer, terminals } = require('./dockerService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Track socket connections by container ID
const connections = {};

io.on('connection', socket => {
    console.log('New client connected');

    socket.on('startContainer', async (containerName) => {
        try {
            const containerId = await startContainer(containerName);
            socket.emit('containerStarted', { containerId });

            // Track connections by container ID
            connections[containerId] = connections[containerId] || [];
            connections[containerId].push(socket);

            // Attach the socket to the pseudo-terminal session
            const terminal = terminals[containerId];
            terminal.on('data', data => {
                connections[containerId].forEach(conn => conn.emit('output', data));
            });

            socket.on('input', input => {
                terminal.write(input);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
                connections[containerId] = connections[containerId].filter(conn => conn !== socket);
                if (connections[containerId].length === 0) {
                    delete connections[containerId];
                }
            });

        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('stopContainer', async (containerId) => {
        try {
            await stopContainer(containerId);
            socket.emit('containerStopped', { containerId });

            // Clean up connections
            if (connections[containerId]) {
                connections[containerId].forEach(conn => conn.disconnect());
                delete connections[containerId];
            }
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('joinContainer', async (containerId) => {
        if (terminals[containerId]) {
            // Track connections by container ID
            connections[containerId] = connections[containerId] || [];
            connections[containerId].push(socket);

            // Attach the socket to the pseudo-terminal session
            const terminal = terminals[containerId];
            terminal.on('data', data => {
                connections[containerId].forEach(conn => conn.emit('output', data));
            });

            socket.on('input', input => {
                terminal.write(input);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
                connections[containerId] = connections[containerId].filter(conn => conn !== socket);
                if (connections[containerId].length === 0) {
                    delete connections[containerId];
                }
            });

            socket.emit('containerJoined', { containerId });
        } else {
            socket.emit('error', 'Container not found');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
