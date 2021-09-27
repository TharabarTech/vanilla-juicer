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

Finally, use the **vj build** command to build the project. In the PAGE-NAME field, enter the name of the page you want to open at the beginning of the application.

```
    vj build PAGE-NAME
```

The created html and javascript files can be found in the **dist** folder.

```
dist
|__ index.html
|__ index.js
```
