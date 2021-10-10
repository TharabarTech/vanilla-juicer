const vj_root = document.querySelector("#vj-root");
appendGlobal();
appendPageObject();
const vj_page_style = document.createElement("style");
document.head.appendChild(vj_page_style);

function getClassName(page) {
  return page.charAt(0).toUpperCase() + page.slice(1) + "Page";
}

function appendGlobal() {
  let style = document.createElement("style");
  let css = window.atob(vj_global_css);
  style.innerHTML = css;
  document.head.appendChild(style);

  let script = document.createElement("script");
  let js = window.atob(vj_global_js);
  script.innerHTML = js;
  document.body.appendChild(script);
}

function appendPageObject() {
  let script = document.createElement("script");
  let js = "";
  let cl = "const classes = {";
  for (const page in pages) {
    js += window.atob(pages[page].js);
    let className = getClassName(page);
    cl += `${page} : ${className},`;
  }
  cl += "}";
  js += cl;
  script.innerHTML = js;
  document.body.appendChild(script);
}

let vj_buildNumber = 0;
let vj_isFirstTime = true;
if (window.location.host == "localhost:9000") {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      buildNumber = parseInt(xhttp.responseText);
      if (vj_isFirstTime) {
        vj_buildNumber = buildNumber;
        vj_isFirstTime = false;
      } else {
        if (buildNumber > vj_buildNumber) {
          window.location.reload();
        }
      }
      setTimeout(() => {
        xhttp.open("GET", "http://localhost:9000/buildnumber", true);
        xhttp.send();
      }, 1000);
    }
  };

  xhttp.open("GET", "http://localhost:9000/buildnumber", true);
  xhttp.send();
}

let pageObj = undefined;

function vj_loadpage(page, data) {
  pageObj = undefined;
  let deltatime = 0;
  let speed = 50;
  let duration = 500;
  let half = duration / 2;
  let isChanged = false;
  let timer = setInterval(() => {
    deltatime += speed;
    if (deltatime > duration) {
      clearInterval(timer);
      pageObj = new classes[page](data);
      for (const bind of pages[page].bind) {
        pageObj[bind] = document.getElementById(bind);
      }
    } else if (deltatime < half) {
      let opacity = (half - deltatime) / half;
      vj_root.style.opacity = opacity;
    } else if (deltatime > half) {
      if (!isChanged) {
        isChanged = true;
        let css = "";
        try {
          css = window.atob(pages[page].css);
        } catch (e) {}
        vj_page_style.innerHTML = css;
        vj_root.innerHTML = window.atob(pages[page].html);
        document.body.removeChild(document.body.lastChild);
      }
      opacity = (deltatime - half) / half;
      vj_root.style.opacity = opacity;
    }
  }, speed);
}
