const express = require("express");
const { v4: uuidv4 } = require('uuid');

function initHttp(app) {
    app.use(express.json());

    app.post("/project", async (req, res) => {
        const { env } = req.body;

        if (!replId) {
            res.status(400).send("Bad request");
            return;
        }
        const name = uuidv4() + '/';

        const DIRECTORY_NAME = name;
        // Creates a client

        const SOURCE_FOLDER_NAME = "boilerplate/" + env + "/";
        // console.log(file)

        await createDirectory(DIRECTORY_NAME);
        await copyTemplateCode(SOURCE_FOLDER_NAME, DIRECTORY_NAME);
        await saveFilesFromGCP(DIRECTORY_NAME);
        res.status(200).json({ "res": "Project Created", "roomId": name.slice(0, -1) })
    });
}


module.exports = { initHttp }