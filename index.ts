import express from "express";
import categories from "./apps.json";
import Hashids, * as hashids from "hashids";
import * as jwt from "jsonwebtoken";

const appList = [];
const salt = "linite420";

const hasher = new Hashids(salt);

const app = express();
const port = 8080;

for (let [category, appArr] of Object.entries(categories.categories)) {
  for (let app of appArr) {
    appList.push(app);
  }
}

function generateAppCode(selectedList) {
  let appToken = [];
  for (const app of appList) {
    for (const selectedApp of selectedList) {
      if (app === selectedApp) {
        appToken.push(appList.indexOf(selectedApp));
      }
    }
  }
  appToken = appToken.sort((a, b) => {
    return a - b;
  });
  return hasher.encode(appToken);
}

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", categories);
});

app.post("/app-code", (req, res) => {
  const code = generateAppCode(req.body.apps);
  res.send(code);
});

app.get("/*", (req, res) => {
  const payload = req.url.replace("/", "");
  const decoded = hasher.decode(payload);
  let apps = [];
  for (let index of decoded) {
    apps.push(appList[parseInt(index.toString())]);
  }
  res.send(`Dude nice! You're getting ${JSON.stringify(apps)}`);
});

app.listen(port, () => {
  console.log(`Serving app on http://localhost:${port}/`);
});
