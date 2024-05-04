const { Server, Socket } = require("socket.io");
const { path } = require("path")
const { saveFilesFromGCP } = require("./gcp");
const { fetchDir, fetchFileContent } = require("./fs");
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

        helper(socket, replId);
    }
    catch (e) {
        console.log(e)
    }
}

const helper = (socket, replId) => {
    socket.on("disconnect", () => {
        console.log("Disconnected")
    })

    socket.on('fetchDir', async (dirname, cb) => {
        const contents = await fetchDir(`./tmp/${replId}/${dirname}`, dirname);
        cb(contents);
    })
    socket.on('fetchContent', async (filePath, cb) => {
        const contents = await fetchFileContent(`./tmp/${replId}/${filePath}`);
        cb(contents);
    })
}

module.exports = { initWs }