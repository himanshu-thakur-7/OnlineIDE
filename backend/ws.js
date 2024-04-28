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
            console.log('hi')
            // Auth checks should happen here
            const replId = socket.handshake.query.roomId;
            console.log(replId);
            console.log(socket)

            // if (!replId) {
            //     socket.disconnect();
            //     return;
            // }

            // await createDirectory(DIRECTORY_NAME);
            // await copyTemplateCode(SOURCE_FOLDER_NAME, DIRECTORY_NAME);
            // await saveFilesFromGCP(DIRECTORY_NAME);

        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports = { initWs }