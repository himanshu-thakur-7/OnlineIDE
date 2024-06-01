const { Server, Socket } = require("socket.io");
const path = require("path")
const { saveFilesFromGCP } = require("./gcp");
const { fetchDir, fetchFileContent } = require("./fs");
const { TerminalManager } = require("./pty");
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

    // socket.on("requestTerminal", async () => {
    //     console.log("Terminal Requested")
    //     const terminalManager = new TerminalManager();
    //     terminalManager.createPty(socket.id, replId, (data, id) => {
    //         socket.emit('terminal', {
    //             data: Buffer.from(data, "utf-8")
    //         });
    //     });
    // });

    // socket.on("terminalData", async ({ data }) => {
    //     const terminalManager = new TerminalManager();

    //     terminalManager.write(socket.id, data);
    // });

    const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';

    process.env.HOME = path.join(process.cwd(), `tmp/${replId}`);
    console.log(process.env.HOME);

    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 25,
        cwd: process.env.HOME,
        env: process.env,
    });

    ptyProcess.on('data', (data) => {
        socket.emit('output', data);
    });

    socket.on('terminalInput', (input) => {
        ptyProcess.write(input);
    });



    socket.on('disconnect', () => {
        console.log('Client disconnected');
        ptyProcess.kill();
    });
    // pty = new PTYService(this.socket);

    // // Attach event listener for socket.io
    // socket.on("input", input => {
    //     // Runs this listener when socket receives "input" events from socket.io client.
    //     // input event is emitted on client side when user types in terminal UI
    //     pty.write(input);
    // });
}

module.exports = { initWs }