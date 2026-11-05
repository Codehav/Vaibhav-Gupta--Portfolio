/* Theme toggle with persistence. Initial theme is set by an inline script in <head> to avoid a flash. */
(function () {
  var root = document.documentElement;
  var btns = document.querySelectorAll("[data-theme-toggle]");
  var meta = document.querySelector('meta[name="theme-color"]');

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    btns.forEach(function (b) {
      b.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      b.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
    if (meta) meta.setAttribute("content", theme === "dark" ? "#171214" : "#faf5ee");
  }

  apply(root.getAttribute("data-theme") || "light");

  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem("vg-theme", next); } catch (e) { /* storage unavailable */ }
    });
  });
})();
