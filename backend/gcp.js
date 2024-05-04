const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
let LOCAL_FOLDER_PATH = './tmp/';  // Local folder where files will be saved

const storage = new Storage({
    keyFilename: "./keys/gcp_key.json"
});

const BUCKET_NAME = "ide7781";
const bucket = storage.bucket(BUCKET_NAME);


const createDirectory = async (directoryName) => {
    try {
        await bucket.file(directoryName).save('')
        console.log(`Directory ${directoryName} created in bucket ${BUCKET_NAME}`);
    }
    catch (error) {
        if (error.code === 409) {
            console.log(`Directory ${directoryName} already exists in bucket ${bucketName}`);
            // The directory already exists, so do nothing.
        } else {
            throw error;
        }
    }

}

const copyTemplateCode = async (SOURCE_FOLDER_NAME, directoryName) => {
    try {

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

        console.log(`All files copied to ${directoryName} successfully.`);

    } catch (error) {
        throw error;
    }
}

const saveFilesFromGCP = async (FOLDER_NAME) => {
    // Creates a client
    LOCAL_FOLDER_PATH += FOLDER_NAME;
    try {
        const [files] = await bucket.getFiles({
            prefix: FOLDER_NAME,
        });

        // Create local folder if it doesn't exist


        // Save each file to local folder
        const savePromises = files.map(async (file) => {
            if (!file.name.endsWith('/')) {
                console.log(file.name)
                const localFilePath = path.join(LOCAL_FOLDER_PATH, file.name.replace(FOLDER_NAME, ''));

                const fileContent = await file.download();
                console.log(fileContent[0].toString());

                const directory = path.dirname(localFilePath);

                if (!fs.existsSync(directory)) {
                    fs.mkdirSync(directory, { recursive: true });
                }
                // Write file content to local file
                console.log(localFilePath)
                fs.writeFileSync(localFilePath, fileContent[0]);

                console.log(`File saved to ${localFilePath}`);
            }
        });

        // Wait for all save operations to complete
        await Promise.all(savePromises).catch(e => console.log(e));

        console.log('All files saved successfully.');
    } catch (error) {
        console.error(`Error reading files: ${error}`);
    }
}

module.exports = { createDirectory, copyTemplateCode, saveFilesFromGCP }