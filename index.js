#! /usr/bin/env node

const { program } = require("commander");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const newproject = (projectname) => {
  fs.mkdirSync(projectname);
  let dir = path.join(process.cwd(), projectname);
  exec(`npm init -y`, { cwd: dir });
};

program
  .command("new <projectname>")
  .description("Create new project")
  .action(newproject);

program.parse();
