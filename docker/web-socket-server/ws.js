const { Server } = require("socket.io");
const path = require("path")
const { saveFilesFromGCP, updateFileS3, createDirectory, copyTemplateCode, directoryExists } = require("./gcp");
const { fetchDir, fetchFileContent, saveFile } = require("./fs");
const pty = require('node-pty');


const initWs = (httpServer) => {
    // Initialize Web Socket Server
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    try {
        io.on("connection", async (socket) => {
            // Auth checks should happen here
            const roomId = socket.handshake.query.roomId;
            const env = socket.handshake.query.env;

            const DIRECTORY_NAME = roomId + '/';
            const SOURCE_FOLDER_NAME = "boilerplate/" + env + "/";

            if (!await directoryExists(DIRECTORY_NAME)) {
                await createDirectory(DIRECTORY_NAME);
                await copyTemplateCode(SOURCE_FOLDER_NAME, DIRECTORY_NAME);
            }
            else {
                console.log(`Directory ${DIRECTORY_NAME} already exists in GCP bucket!`)
            }
            await saveFilesFromGCP(DIRECTORY_NAME);

            if (!roomId) {
                socket.disconnect();
                return;
            }
            const LOCALPATH = "tmp/" + DIRECTORY_NAME;
            socket.emit("loaded", {
                rootContent: await fetchDir(LOCALPATH, '')
            });

            helper(socket, roomId);

        })

    }
    catch (e) {
        console.log(e)
    }
}

const helper = (socket, roomId) => {
    socket.on("disconnect", () => {
        console.log("Disconnected")
    })

    // Listening to fetch directory events
    socket.on('fetchDir', async (dirname, cb) => {
        console.log(dirname['path']);
        const contents = await fetchDir(`tmp/${roomId}${dirname['path']}`, dirname['path']);
        cb(contents);
    })
    // Listening to fetch contents events
    socket.on('fetchContent', async (filePath, cb) => {
        console.log(filePath['path']);
        const contents = await fetchFileContent(`tmp/${roomId}${filePath['path']}`);
        cb(contents);
    })
    // Listening to update contents event
    socket.on("updateContent", async ({ path, content }) => {

        await saveFile(`tmp/${roomId}${path}`, content);
        await updateFileS3(`${roomId}${path}`, content);

    });

    const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';

    // specifying home directory 
    process.env.HOME = path.join(process.cwd(), `tmp/${roomId}`);
    console.log(process.env.HOME);

    // spawning a pseudo-terminal
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 40,
        cwd: process.env.HOME,
        env: process.env,
    });

    // When there is some output on the terminal, emit output event
    ptyProcess.on('data', (data) => {
        socket.emit('output', data);
    });

    // when there is terminal input, write to the psuedo terminal  
    socket.on('terminalInput', (input) => {
        ptyProcess.write(input);
    });


    // when user disconnects stop the terminal 
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        ptyProcess.kill();
    });

}

module.exports = { initWs }