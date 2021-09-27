#! /usr/bin/env node

const http = require("http");
const chokidar = require("chokidar");
const { program } = require("commander");
const { exec } = require("child_process");
const { ncp } = require("ncp");
const fs = require("fs");
const path = require("path");
const { Console } = require("console");

// ----- Config -----
const port = 9000;

const getGlobal = (ext) => {
  let data = "";
  let dir = path.join(process.cwd(), "global");
  let files = fs.readdirSync(dir);
  for (const file of files) {
    const [fileName, fileExt] = file.split(/\.(?=[^\.]+$)/);
    if (fileExt == ext) {
      data += fs.readFileSync(path.join(dir, file), {
        encoding: "utf8",
        flag: "r",
      });
    }
  }
  let base64 = Buffer.from(data).toString("base64");
  return base64;
};

const copyIndexHTML = () => {
  let source = path.join(__dirname, "template", "index.html");
  let target = path.join(process.cwd(), "dist", "index.html");
  fs.copyFileSync(source, target);
};

const makePagesObject = (arr) => {
  let str = "const pages = {";
  for (const item of arr) {
    let html = Buffer.from(item.html).toString("base64");
    let js = Buffer.from(item.js).toString("base64");
    let css = Buffer.from(item.css).toString("base64");
    str += `${item.name}:{html:"${html}",js:"${js}",css:"${css}"},`;
  }
  str += "}; ";
  return str;
};

const getPageArrayFromDir = (pages_dir) => {
  let arr = [];
  let pages = fs.readdirSync(pages_dir);
  for (const page of pages) {
    let filename_arr = page.split(".");
    if (filename_arr[1] == "html") {
      let html = fs.readFileSync(path.join(pages_dir, page), {
        encoding: "utf8",
        flag: "r",
      });
      let js = fs.readFileSync(path.join(pages_dir, `${filename_arr[0]}.js`), {
        encoding: "utf8",
        flag: "r",
      });
      let css = fs.readFileSync(
        path.join(pages_dir, `${filename_arr[0]}.css`),
        {
          encoding: "utf8",
          flag: "r",
        }
      );

      arr.push({
        name: filename_arr[0],
        html,
        js,
        css,
      });
    }
  }
  return arr;
};

// ----- Command Functions -----
const newproject = (projectname) => {
  fs.mkdirSync(projectname);
  let dir = path.join(process.cwd(), projectname);
  let templateDir = path.join(__dirname, "template");
  ncp(templateDir, dir);
  exec(`npm init -y`, { cwd: dir }, (err, stdout, stderr) => {
    console.log(`${projectname} successfully created!`);
  });
};

let buildNumber = 0;
const buildproject = (pagename) => {
  let pages_arr = getPageArrayFromDir(path.join(process.cwd(), "pages"));

  let script = makePagesObject(pages_arr);
  let globalJS = getGlobal("js");
  script += `const vj_global_js = "${globalJS}";`;
  let globalCSS = getGlobal("css");
  script += `const vj_global_css = "${globalCSS}";`;
  script += fs.readFileSync(path.join(__dirname, "lib.js"), {
    encoding: "utf8",
    flag: "r",
  });
  script += `vj_loadpage("${pagename}");`;

  const distDir = path.join(process.cwd(), "dist");
  fs.writeFileSync(path.join(distDir, "index.js"), script);
  copyIndexHTML();
  buildNumber++;
};

const createPage = (pagename) => {
  let pages_dir = path.join(process.cwd(), "pages");
  fs.writeFileSync(path.join(pages_dir, `${pagename}.html`), "");
  fs.writeFileSync(path.join(pages_dir, `${pagename}.js`), "");
  fs.writeFileSync(path.join(pages_dir, `${pagename}.css`), "");
  console.log(`${pagename} page created!`);
};

const runServer = (pagename) => {
  let html = path.join(process.cwd(), "dist", "index.html");
  let js = path.join(process.cwd(), "dist", "index.js");
  http
    .createServer(function (req, res) {
      switch (req.url) {
        case "/buildnumber":
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.write(buildNumber.toString());
          res.end();
          break;
        case "/":
          fs.readFile(html, function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
          });
          break;
        case "/index.js":
          fs.readFile(js, function (err, data) {
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(data);
            return res.end();
          });
          break;
      }
    })
    .listen(port);

  const watcher = chokidar.watch(process.cwd(), { persistent: true });
  watcher
    .on("add", () => buildproject(pagename))
    .on("change", () => buildproject(pagename))
    .on("unlink", () => buildproject(pagename));

  console.log(`Server is running at http://localhost:${port}`);
};

program
  .command("new <projectname>")
  .description("Create new project")
  .action(newproject);

program
  .command("build")
  .description("Build project")
  .action(() => {
    buildproject("home");
    console.log("Build successful!");
  });

program.command("run <pagename>").description("Run Server").action(runServer);

program
  .command("create-page <pagename>")
  .description("Create New Page")
  .action(createPage);

program.parse();
