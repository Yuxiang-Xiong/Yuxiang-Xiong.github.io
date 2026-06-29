(function () {
  var path = window.location.pathname.split("/").pop() || "index.html";
  var page = path.replace(".html", "");
  if (page === "index") {
    page = "home";
  }

  document.querySelectorAll("[data-page]").forEach(function (link) {
    if (link.getAttribute("data-page") === page) {
      link.setAttribute("aria-current", "page");
    }
  });

  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
}());
