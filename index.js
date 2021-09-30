#! /usr/bin/env node

const http = require("http");
const chokidar = require("chokidar");
const { program } = require("commander");
const { ncp } = require("ncp");
const path = require("path");
const inquirer = require("inquirer");
const fs = require("fs");
const nodeStatic = require("node-static");
const open = require("open");

// My Classes
const Page = require("./page");

// ----- Config -----
const port = 9000;

// ----- Init Path -----
const cwd = process.cwd();

// Helper Functions
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

const makePagesObject = (arr) => {
  let str = "const pages = {";
  for (const page of arr) {
    let [html, css, js] = page.getBase64();
    str += `${page.pageName}:{html:"${html}",js:"${js}",css:"${css}"},`;
  }
  str += "}; ";
  return str;
};

const getPageArrayFromDir = (pages_dir) => {
  let arr = [];
  let pages = fs.readdirSync(pages_dir);
  for (const page of pages) {
    let filename_arr = page.split(/\.(?=[^\.]+$)/);
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

      arr.push(new Page(filename_arr[0], html, css, js));
    }
  }
  return arr;
};

// ----- Command Functions -----
const newproject = (projectname) => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "template",
        message: "Choose template",
        choices: ["blank", "sidebar"],
      },
    ])
    .then((answers) => {
      fs.mkdirSync(path.join(cwd, projectname));
      let dir = path.join(cwd, projectname);
      let templateDir = path.join(__dirname, "templates", answers.template);
      ncp(templateDir, dir);
      console.log(`${projectname} successfully created!`);
    });
};

let buildNumber = 0;
const buildproject = (pagename) => {
  let pages_arr = getPageArrayFromDir(path.join(process.cwd(), "pages"));

  let script = "<script>";
  script += makePagesObject(pages_arr);
  let globalJS = getGlobal("js");
  script += `const vj_global_js = "${globalJS}";`;
  let globalCSS = getGlobal("css");
  script += `const vj_global_css = "${globalCSS}";`;
  script += fs.readFileSync(path.join(__dirname, "lib.js"), {
    encoding: "utf8",
    flag: "r",
  });
  script += `vj_loadpage("${pagename}");`;
  script += "</script>";

  //Make dir if not exist
  if (!fs.existsSync(path.join(cwd, "dist"))) {
    fs.mkdirSync(path.join(cwd, "dist"));
  }

  // Copy and Generate File in dist folder
  // fs.writeFileSync(path.join(cwd, "dist", "index.js"), script);
  // fs.copyFileSync(
  //   path.join(cwd, "index.html"),
  //   path.join(cwd, "dist", "index.html")
  // );
  let rawIndex = fs.readFileSync(path.join(cwd, "index.html"));
  let pos = rawIndex.toString().match(/<\/body>/).index;
  let index = [rawIndex.slice(0, pos), script, rawIndex.slice(pos)].join("");
  fs.writeFileSync(path.join(cwd, "dist", "index.html"), index);
  if (fs.readdirSync(path.join(cwd, "res")).length > 0) {
    ncp(path.join(cwd, "res"), path.join(cwd, "dist", "res"));
  }
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
  let html = path.join(cwd, "dist", "index.html");
  let js = path.join(cwd, "dist", "index.js");

  let fileServer = new nodeStatic.Server(path.join(cwd, "dist"));

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
        default:
          if (req.url.substring(0, 4) == "/res") {
            fileServer.serve(req, res);
          }
          break;
      }
    })
    .listen(port);

  const watcher = chokidar.watch(process.cwd(), {
    persistent: true,
  });
  watcher
    .on("add", () => buildproject(pagename))
    .on("change", () => buildproject(pagename));

  watcher.unwatch("dist");

  console.log(`Server is running at http://localhost:${port}`);
  open(`http://localhost:${port}`);
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
