module.exports = class Page {
  html = "";
  css = "";
  js = "";
  bind = "";
  varArr = [];

  constructor(pageName, html, css, js) {
    this.pageName = pageName;
    this.rawHTML = html.replace(/\s+/g, " ");
    this.rawCSS = css;
    this.rawJS = js;

    // Binding
    this.bindEvent();
    this.bindVar();
  }

  bindEvent() {
    let matches = this.rawHTML.match(/<[^/].*?>/g);
    if (matches !== null) {
      for (const match of matches) {
        let i = match.match(/.*id="([\w-]+)".*/);
        let m = match.match(/<.*\((\w+)\)="(\w+)".*>/);
        if (m !== null && i !== null) {
          console.log(
            `Id : ${i[1]} , Event Name : ${m[1]} , Handler : ${m[2]}`
          );
        }
      }
    }
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
    this.bind = "[";
    for (const varName of this.varArr) {
      this.bind += `"${varName}",`;
    }
    this.bind += "]";
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
      this.bind,
    ];
  }
};
