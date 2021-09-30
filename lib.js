const vj_root = document.querySelector("#vj-root");
appendGlobal();
const vj_page_style = document.createElement("style");
document.head.appendChild(vj_page_style);

// Append Global
function appendGlobal() {
  // Append CSS
  let style = document.createElement("style");
  let css = window.atob(vj_global_css);
  style.innerHTML = css;
  document.head.appendChild(style);

  // Append JS
  let script = document.createElement("script");
  let js = window.atob(vj_global_js);
  script.innerHTML = js;
  document.body.appendChild(script);
}

// Auto refresh on server changes
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

function vj_loadpage(page, data) {
  let deltatime = 0;
  let speed = 50;
  let duration = 500;
  let half = duration / 2;
  let isChanged = false;
  let timer = setInterval(() => {
    deltatime += speed;
    if (deltatime > duration) {
      clearInterval(timer);
      if (typeof vj_onload == "function") {
        vj_onload(data);
      }
    } else if (deltatime < half) {
      let opacity = (half - deltatime) / half;
      vj_root.style.opacity = opacity;
    } else if (deltatime > half) {
      if (!isChanged) {
        isChanged = true;
        // CSS
        let css = window.atob(pages[page].css);
        vj_page_style.innerHTML = css;
        // HTML
        vj_root.innerHTML = window.atob(pages[page].html);
        // JS
        document.body.removeChild(document.body.lastChild);
        let js = window.atob(pages[page].js);
        let script = document.createElement("script");
        script.innerHTML = js;
        document.body.appendChild(script);
      }
      opacity = (deltatime - half) / half;
      vj_root.style.opacity = opacity;
    }
  }, speed);
}
