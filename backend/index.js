const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const { initOrchestrator } = require("./orchestrator");
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