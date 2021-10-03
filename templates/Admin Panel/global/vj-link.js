document.querySelectorAll(".vj-link").forEach((element) => {
  element.onclick = () => {
    let page = element.dataset.page;
    document.getElementById("vj-sidebar").classList.remove("show");
    vj_loadpage(page, "from sidebar");
  };
});
