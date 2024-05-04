const { fetchDir } = require("./fs");

const main = async () => {
    const files = await fetchDir("./tmp/a5a25aba-ae11-4743-a0ea-a1c13c573954", "")

    console.log(files);

}
main();