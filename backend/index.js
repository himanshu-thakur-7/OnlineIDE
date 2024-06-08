const express = require("express");
const { v4: uuidv4 } = require('uuid');
const { createServer } = require("http");
// const { initWs } = require("./ws");
const cors = require("cors");
// const { initHttp } = require("./http");
const { initOrchestrator } = require("./wsserver1");
const PORT = 8000 | process.env.PORT;

const app = express();
app.use(cors())
app.use(express.json());

const httpServer = createServer(app);

// initHttp(app);
initOrchestrator(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Listening on PORT: `, PORT);
})