import express from "express";
import categories from "./apps.json";
import * as jwt from "jsonwebtoken";
const jwtSecret = "linite420";
let jwtHeader = "";
let jwtPayload = "";
let jwtSignature = "";

const app = express();
const port = 8080;

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", categories);
});

app.post("/apps", (req, res) => {
  const tokenArr = jwt.sign(req.body, jwtSecret).split(".");
  jwtHeader = tokenArr[0];
  jwtPayload = tokenArr[1];
  jwtSignature = tokenArr[2];

  console.log(jwtPayload);
  res.send(jwtPayload);
});

app.get("/*", (req, res) => {
  const payload = req.url.replace("/", "");
  const decoded = jwt.verify(
    [jwtHeader, payload, jwtSignature].join("."),
    jwtSecret
  )["apps"];
  res.send(`Dude nice! You're getting ${JSON.stringify(decoded)}`);
});

app.listen(port, () => {
  console.log(`Serving app on http://localhost:${port}/`);
});
