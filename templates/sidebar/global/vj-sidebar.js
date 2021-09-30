document.getElementById("vj-menu-icon").addEventListener("click", () => {
  document.getElementById("vj-sidebar").classList.add("show");
});

window.addEventListener("mousedown", (e) => {
  let sidebar = document.getElementById("vj-sidebar");
  if (sidebar.classList.contains("show")) {
    if (e.clientX > sidebar.clientWidth) {
      sidebar.classList.remove("show");
    }
  }
});
