import * as express from "express";

const app = express();
const port = 8080;

app.set("view engine", "pug");
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(port, () => {
    console.log(`Serving app on http://localhost:${port}/`);
});
