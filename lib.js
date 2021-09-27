const vj_root = document.querySelector("#vj-root");
const vj_page_script = document.createElement("script");
document.body.appendChild(vj_page_script);
const vj_page_style = document.createElement("style");
document.head.appendChild(vj_page_style);

function vj_loadpage(page) {
  vj_root.innerHTML = window.atob(pages[page].html);
  let js = window.atob(pages[page].js);
  vj_page_script.innerHTML = js;
  let css = window.atob(pages[page].css);
  vj_page_style.innerHTML = css;
}

vj_loadpage("home");
