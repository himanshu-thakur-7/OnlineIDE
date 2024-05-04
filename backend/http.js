const express = require("express");
const { v4: uuidv4 } = require('uuid');
const { createDirectory, copyTemplateCode } = require("./gcp");
function initHttp(app) {
    app.use(express.json());
    app.get("/", (req, res) => {
        res.status(200).send("Hii");
    })
    app.post("/project", async (req, res) => {
        const { env } = req.body;

        const name = uuidv4() + '/';

        const DIRECTORY_NAME = name;
        // Creates a client

        const SOURCE_FOLDER_NAME = "boilerplate/" + env + "/";
        // console.log(file)

        await createDirectory(DIRECTORY_NAME);
        await copyTemplateCode(SOURCE_FOLDER_NAME, DIRECTORY_NAME);
        res.status(200).json({ "res": "Project Created", "roomId": name.slice(0, -1) })
    });
}


module.exports = { initHttp }