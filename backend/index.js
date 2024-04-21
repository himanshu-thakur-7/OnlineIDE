const express = require("express");
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');

const PORT = 8000 | process.env.PORT;
const storage = new Storage({
    keyFilename: "./keys/gcp_key.json"
});
const app = express();

app.use(express.json());

app.post("/initiateEnv", async (req, res) => {

    const id = req.body["id"] + '/';
    const env = req.body["env"];
    const name = uuidv4() + '/';

    const directoryName = id + name;
    console.log(directoryName);
    console.log(env)
    // Creates a client

    const bucketName = "ide7781"
    const SOURCE_FOLDER_NAME = "boilerplate/" + env + "/";
    const bucket = await storage.bucket(bucketName);
    const file = bucket.file(directoryName);
    console.log(file)

    try {
        await bucket.file(directoryName).save('')
        console.log(`Directory ${directoryName} created in bucket ${bucketName}`);

        const [files] = await bucket.getFiles({
            prefix: SOURCE_FOLDER_NAME,
        });

        // Copy each file to the destination folder
        const copyPromises = files.map(async (file) => {
            const destinationName = file.name.replace(SOURCE_FOLDER_NAME, directoryName);
            const destinationFile = bucket.file(destinationName);

            // Copy the file
            await file.copy(destinationFile);

            console.log(`Copied ${file.name} to ${destinationName}`);
        });

        // Wait for all copy operations to complete
        await Promise.all(copyPromises);

        console.log(`All ${env} files copied to ${directoryName} successfully.`);

    } catch (error) {
        console.log(error);
        if (error.code === 409) {
            console.log(`Directory ${directoryName} already exists in bucket ${bucketName}`);
            // The directory already exists, so do nothing.
        } else {
            throw error;
        }
    }
    // async function listFiles() {
    //     const bucketName = "ide7781"
    //     // Lists files in the bucket
    //     const [files] = await storage.bucket(bucketName).getFiles();

    //     console.log('Files:');
    //     files.forEach(file => {
    //         console.log(file.name);
    //     });
    // }

    // listFiles().catch(console.error);
    res.json({ "res": "Hello" })
})

app.listen(PORT, () => {
    console.log(`Listening on PORT: `, PORT);
})