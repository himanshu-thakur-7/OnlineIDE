const { Server, Socket } = require("socket.io");
const path = require("path")
const { saveFilesFromGCP, updateFileS3 } = require("./gcp");
const { fetchDir, fetchFileContent, saveFile } = require("./fs");
const pty = require('node-pty');
process.env.HOME = process.cwd();
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
            const LOCALPATH = "tmp/" + DIRECTORY_NAME;
            socket.emit("loaded", {
                rootContent: await fetchDir(LOCALPATH, '')
            });

            helper(socket, replId);

        })

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
        const contents = await fetchDir(`tmp/${replId}/${dirname}`, dirname);
        cb(contents);
    })
    socket.on('fetchContent', async (filePath, cb) => {
        console.log(filePath['path']);
        const contents = await fetchFileContent(`tmp/${replId}${filePath['path']}`);
        cb(contents);
    })


    const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';

    process.env.HOME = path.join(process.cwd(), `tmp/${replId}`);
    console.log(process.env.HOME);

    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 40,
        cwd: process.env.HOME,
        env: process.env,
    });

    ptyProcess.on('data', (data) => {
        socket.emit('output', data);
    });

    socket.on('terminalInput', (input) => {
        ptyProcess.write(input);
    });

    socket.on("updateContent", async ({ path, content }) => {
        console.log(content);
        // const fullPath = path.join(__dirname, `../tmp/${replId}/${filePath}`);
        await saveFile(`tmp/${replId}${path}`, content);
        await updateFileS3(`${replId}${path}`, content);
        // await saveToS3(`code/${replId}`, filePath, content);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        ptyProcess.kill();
    });

}

module.exports = { initWs }