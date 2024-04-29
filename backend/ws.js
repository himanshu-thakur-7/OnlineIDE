const { Server, Socket } = require("socket.io");
const { path } = require("path")


const initWs = (httpServer) => {
    console.log('hi line 6')
    const io = new Server(httpServer, {
        cors: {
            // Should restrict this more!
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    try {
        io.on("connection", async (socket) => {
            // Auth checks should happen here
            const replId = socket.handshake.query.roomId;
            console.log(replId);
            // console.log(socket)

            if (!replId) {
                socket.disconnect();
                return;
            }

        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports = { initWs }