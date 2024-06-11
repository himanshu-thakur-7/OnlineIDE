const fs = require("fs");
// fetch all directories and file names present inside a given directory
const fetchDir = (dir, baseDir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            } else {
                files = files.filter((file) => (!(file.name.startsWith("."))))
                resolve(files.map((file) => {
                    console.log(file.name)
                    return ({
                        type: file.isDirectory() ? "folder" : "file",
                        name: file.name,
                        path: `${baseDir}/${file.name}`,
                        files: [],
                        content: false
                    })

                }));
            }
        });
    });
}

// fetch the content of a given file
const fetchFileContent = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}

// save the updated contents of a file
const saveFile = async (file, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, content, "utf8", (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

module.exports = { fetchDir, fetchFileContent, saveFile }