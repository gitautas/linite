import express from "express";
import categories from "./apps.json";
import Hashids, * as hashids from "hashids";

const appList = [];
const salt = "linite420";
const hasher = new Hashids(salt);
const app = express();
const port = 8080;

generateAppList();

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.render("index", categories);
});

app.post("/app-code", (req, res) => {
  const code = generateAppCode(req.body.apps);
  res.send(code);
});

app.get("/*", (req, res) => {
  const payload = req.url.replace("/", "");

  res.send(osScript(payload));
});

app.post("/distro/*", (req, res) => {
  const decoded = hasher.decode(req.body.CODE);
  let apps = [];
  for (let index of decoded) {
    apps.push(appList[parseInt(index.toString())]);
  }
  res.send(installScript(req.body.PRETTY_NAME, apps));
});

app.listen(port, () => {
  console.log(`Serving app on http://localhost:${port}/`);
});

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

function generateAppList() {
  for (let [category, appArr] of Object.entries(categories.categories)) {
    for (let app of appArr) {
      appList.push(app);
    }
  }
}

function installScript(os, apps) {
  return `
echo You are using ${os}
echo and you want to install ${apps}
`;
}

function osScript(code) {
  return `
#!/usr/bin/env bash

args=()

while read line
do
        args+=("-d" "$line")
done < /etc/os-release
bash -c "$(curl -s \
        "\u0024{args[@]}" \
        -d CODE="${code}" \
                http://localhost:8080/distro/RmUmc7iMFbsmuYYtl9 )"

`;
}
