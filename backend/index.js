const express = require("express");
const PORT = 8000 | process.env.PORT;

const app = express();

app.use(express.json());

app.get("/", (res, req) => {
    res.json("Hello world")
})

app.listen(PORT, () => {
    console.log(`Listening on PORT: `, PORT);
})