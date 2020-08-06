const checks = document.querySelectorAll("ul.apps li label");
const title = document.querySelector("div.container h1.title");
const subtitle = document.querySelector("div.container h2.subtitle");
const terminal = document.querySelector("div.terminal");
const command = document.querySelector("div.terminal p.command");
const apps = [];

let appCode = "";

async function getAppCode() {
  code = await fetch("/apps", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({apps: apps}),
  })
    .then((response) => response.text())
    .then((response) => {
      appCode = response;
      command.innerHTML = "curl http://localhost:8080/" + response;
      testREST(response);
    });
}

async function testREST(code) {
  resp = await fetch("/" + code, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  })
    .then((response) => response.text())
    .then((response) => {
      console.log(response);
    });
}

checks.forEach((currentValue) => {
  currentValue.addEventListener("change", () => {
    if (apps) {
      terminal.hidden = false;
    } else {
      terminal.hidden = true;
    }
    if (currentValue.children[0].checked) {
      apps.push(currentValue.children[2].innerHTML);
      getAppCode();
    } else {
      apps.pop(currentValue.children[2].innerHTML);
      getAppCode();
    }
  });
});
