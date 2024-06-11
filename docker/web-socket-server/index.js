const express = require("express");
const { createServer } = require("http");
const { initWs } = require("./ws");
const cors = require("cors");
const PORT = 6000 | process.env.PORT;

const app = express();
app.use(cors())
app.use(express.json());

const httpServer = createServer(app);

initWs(httpServer);


httpServer.listen(PORT, () => {
    console.log(`Listening on PORT: `, PORT);
})