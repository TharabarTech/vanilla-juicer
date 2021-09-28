# Vanilla-Juicer

light weight single page application framework.

## Installation

```
    npm i -g vanilla-juicer
```

---

## Quick Start

Create new project

```
    vj new PROJECT-NAME
```

Enter into project folder

```
    cd PROJECT-NAME
```

Run web server

```
    vj run home
```

Then you can view your app in browser at http://localhost:9000

---

## Project Structure

After creating a new project with the **vj new** command, there will be index.html and three folders in the project folder.

The pages folder is where the pages are written. Each page must contain three files with the same name: html, css, js.

```
pages
|__ home.html
|__ home.css
|__ home.js
```

You can easily create these 3 files with the **vj create-page** command.

```
    vj create-page PAGE-NAME
```

The css and js file contained in a page only affects its associated html page. For example, code written in home.css and home.js only applies to home.html.

The css and javascript files you want to apply to all pages must be written in global folder.

**Example**

```
global
|__ bootstrap.css
|__ jquery.js
```

---

## Change Page

If you want to move to another page, you can use the **vj_loadpage** function in the javascript code.

```
    vj_loadpage("PAGE-NAME");
```

**Example Code**

```javascript
myButton.addEventListener("click", () => {
  vj_loadpage("about");
});
```

---

## Build & Run

You can use the **vj run** command to preview the project you wrote. In PAGE-NAME, use the page name you want to appear at the beginning of the application.

```
    vj run PAGE-NAME
```

After running the **vj run** command, you can preview it at http://localhost:9000 in your browser. The browser will automatically refresh whenever you make any changes to the project.

If you run the vj run command, you can get the output file in the dist folder whenever you want, as it automatically builds the project in the background.

```
dist
|__ index.html
|__ index.js
```

If you want to build manually without running the vj run command, you can use the vj build command. In PAGE-NAME, use the page name you want to appear at the beginning of the application.

```
    vj build PAGE-NAME
```
