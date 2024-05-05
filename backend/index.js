const express = require("express");
const { v4: uuidv4 } = require('uuid');
const { createServer } = require("http");
const { initWs } = require("./ws");
const cors = require("cors");
const { initHttp } = require("./http");
const PORT = 8000 | process.env.PORT;

const app = express();
app.use(cors())
app.use(express.json());

const httpServer = createServer(app);

initHttp(app);
initWs(httpServer);

// app.post("/initiateEnv", async (req, res) => {

//     const env = req.body["env"];
//     const name = uuidv4() + '/';

//     const DIRECTORY_NAME = name;
//     // Creates a client

//     const SOURCE_FOLDER_NAME = "boilerplate/" + env + "/";
//     // console.log(file)

//     await createDirectory(DIRECTORY_NAME);
//     await copyTemplateCode(SOURCE_FOLDER_NAME, DIRECTORY_NAME);
//     await saveFilesFromGCP(DIRECTORY_NAME);
//     res.json({ "res": "Hello" })
// })

httpServer.listen(PORT, () => {
    console.log(`Listening on PORT: `, PORT);
})