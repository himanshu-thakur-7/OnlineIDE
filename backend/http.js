const express = require("express");
const { v4: uuidv4 } = require('uuid');
const { createDirectory, copyTemplateCode, directoryExists } = require("./gcp");
function initHttp(app) {
    app.use(express.json());
    app.get("/", (req, res) => {
        res.status(200).send("Hii");
    })
    app.post("/project", async (req, res) => {
        const { env, replId } = req.body;


        const name = replId + '/';

        const DIRECTORY_NAME = name;
        // Creates a client

        const SOURCE_FOLDER_NAME = "boilerplate/" + env + "/";
        // console.log(file)

        if (!await directoryExists(DIRECTORY_NAME)) {
            await createDirectory(DIRECTORY_NAME);
            await copyTemplateCode(SOURCE_FOLDER_NAME, DIRECTORY_NAME);
        }
        else {
            console.log(`Directory ${DIRECTORY_NAME} already exists in GCP bucket!`)
        }
        res.status(200).json({ "res": "Project Created", "roomId": name.slice(0, -1) })
    });
}


module.exports = { initHttp }