module.exports = class Page {
  html = "";
  css = "";
  js = "";
  bind = "";
  bindArr = [];

  constructor(pageName, html, css, js) {
    this.pageName = pageName;
    this.rawHTML = html.replace(/\s+/g, " ");
    this.rawCSS = css;
    this.rawJS = js;

    // To leave the original code in Raw Variables
    this.html = this.rawHTML;
    this.css = this.rawCSS;
    this.js = this.rawJS;

    // Binding
    this.bindSpan();
    this.bindSharp();
    this.bindEvent();
    this.bindVar();
  }

  bindEvent() {
    let matches = this.html.match(/<[^/].*?>/g);
    if (matches !== null) {
      for (const match of matches) {
        let i = match.match(/.*id="([\w-]+)".*/);
        let m = match.match(/<.*\((\w+)\)="(\w+)".*>/);
        if (m !== null && i !== null) {
          this.bindArr.push({
            type: "event",
            id: i[1],
            event: m[1],
            handler: m[2],
          });
        }
      }
    }
  }

  bindSharp() {
    this.html = this.html.replace(/<(.*)#(\w+)\s?\/?>/g, (match, str, id) => {
      this.bindArr.push({ type: "sharp", id: id });
      return `<${str} id="${id}">`;
    });
  }

  bindSpan() {
    this.html = this.html.replace(/\{\{([a-zA-Z0-9-_]+)\}\}/g, (match, id) => {
      this.bindArr.push({ type: "span", id: id });
      return `<span id="${id}"></span>`;
    });
  }

  bindVar() {
    // Add all variable declaration
    this.bind = "[";
    for (const b of this.bindArr) {
      switch (b.type) {
        case "span":
          this.bind += `{type:"${b.type}", id: "${b.id}" },`;
          break;
        case "event":
          this.bind += `{ type: "event", id: "${b.id}", event: "${b.event}", handler: "${b.handler}" },`;
          break;
      }
    }
    this.bind += "]";
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
