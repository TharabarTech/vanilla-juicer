module.exports = class Page {
  html = "";
  css = "";
  js = "";
  bind = "";
  varArr = [];

  constructor(pageName, html, css, js) {
    this.pageName = pageName;
    this.rawHTML = html;
    this.rawCSS = css;
    this.rawJS = js;

    // Binding
    this.bindVar();
  }

  bindVar() {
    this.html = this.rawHTML.replace(
      /\{\{([a-zA-Z0-9-_]+)\}\}/g,
      (match, varName) => {
        this.varArr.push(varName);
        return `<span id="${varName}"></span>`;
      }
    );

    // Add all variable declaration
    for (const varName of this.varArr) {
      this.bind += `const ${varName} = document.getElementById("${varName}");`;
    }
    // Then add the user written JS
    this.js += this.rawJS;

    // Nothing to do with CSS for now!
    this.css = this.rawCSS;
  }

  getBase64() {
    return [
      Buffer.from(this.html).toString("base64"),
      Buffer.from(this.css).toString("base64"),
      Buffer.from(this.js).toString("base64"),
      Buffer.from(this.bind).toString("base64"),
    ];
  }
};
