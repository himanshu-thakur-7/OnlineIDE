const { Storage } = require('@google-cloud/storage');

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


module.exports = { createDirectory, copyTemplateCode }