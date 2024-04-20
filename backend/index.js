const express = require("express");
const { Storage } = require('@google-cloud/storage');

const PORT = 8000 | process.env.PORT;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {

    // Creates a client
    const storage = new Storage({
        keyFilename: "./keys/gcp_key.json"
    });

    async function listFiles() {
        const bucketName = "ide7781"
        // Lists files in the bucket
        const [files] = await storage.bucket(bucketName).getFiles();

        console.log('Files:');
        files.forEach(file => {
            console.log(file.name);
        });
    }

    listFiles().catch(console.error);
    res.json({ "res": "Hello" })
})

app.listen(PORT, () => {
    console.log(`Listening on PORT: `, PORT);
})