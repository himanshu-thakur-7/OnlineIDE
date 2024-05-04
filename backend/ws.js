const { Server, Socket } = require("socket.io");
const { path } = require("path")
const { saveFilesFromGCP } = require("./gcp");
const { fetchDir } = require("./fs");
const initWs = (httpServer) => {
    console.log('hi line 6')
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    try {
        io.on("connection", async (socket) => {
            // Auth checks should happen here
            const replId = socket.handshake.query.roomId;
            console.log(replId);
            const DIRECTORY_NAME = replId + '/';
            // console.log(socket)
            await saveFilesFromGCP(DIRECTORY_NAME);

            if (!replId) {
                socket.disconnect();
                return;
            }
            const LOCALPATH = "./tmp/" + DIRECTORY_NAME;
            socket.emit("loaded", {
                rootContent: await fetchDir(LOCALPATH, '')
            });

        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports = { initWs }