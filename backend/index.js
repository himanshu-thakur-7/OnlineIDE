const express = require("express");
const { v4: uuidv4 } = require('uuid');
const { createDirectory, copyTemplateCode } = require("./gcp");

const PORT = 8000 | process.env.PORT;

const app = express();

app.use(express.json());

app.post("/initiateEnv", async (req, res) => {

    const id = req.body["id"] + '/';
    const env = req.body["env"];
    const name = uuidv4() + '/';

    const DIRECTORY_NAME = id + name;
    // Creates a client

    const SOURCE_FOLDER_NAME = "boilerplate/" + env + "/";
    // console.log(file)

    await createDirectory(DIRECTORY_NAME);
    await copyTemplateCode(SOURCE_FOLDER_NAME, DIRECTORY_NAME);

    res.json({ "res": "Hello" })
})

app.listen(PORT, () => {
    console.log(`Listening on PORT: `, PORT);
})