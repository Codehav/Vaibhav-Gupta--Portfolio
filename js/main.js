/* Applies SITE_CONFIG to the page: shows links only when real values exist. */
(function () {
  var cfg = window.SITE_CONFIG || {};
  var base = document.documentElement.getAttribute("data-base") || "";

  function isHttps(v) { return typeof v === "string" && /^https:\/\/\S+$/i.test(v.trim()); }
  function isEmail(v) { return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

  var values = {
    github: isHttps(cfg.github) ? cfg.github.trim() : "",
    linkedin: isHttps(cfg.linkedin) ? cfg.linkedin.trim() : "",
    leetcode: isHttps(cfg.leetcode) ? cfg.leetcode.trim() : "",
    email: isEmail(cfg.email) ? "mailto:" + cfg.email.trim() : "",
    resume: cfg.resume ? base + cfg.resume.trim() : ""
  };

  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    var href = values[key];
    if (href) {
      el.setAttribute("href", href);
      if (key !== "email" && key !== "resume") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
      if (key === "resume" && cfg.resume) {
        el.setAttribute("download", "");
      }
      el.hidden = false;
      var li = el.closest("li");
      if (li) li.hidden = false;
    } else {
      el.hidden = true;
      var parentLi = el.closest("li");
      if (parentLi) parentLi.hidden = true;
    }
  });

  // Show a quiet fallback when a link group ended up with nothing visible
  document.querySelectorAll("[data-link-group]").forEach(function (group) {
    var any = group.querySelector("[data-link]:not([hidden])");
    var fallback = document.querySelector('[data-link-fallback="' + group.getAttribute("data-link-group") + '"]');
    if (fallback) fallback.hidden = !!any;
    group.hidden = !any;
  });

  // Education rows
  var edu = cfg.education || {};
  document.querySelectorAll("[data-edu]").forEach(function (el) {
    var v = edu[el.getAttribute("data-edu")];
    var row = el.closest("[data-edu-row]");
    if (v) { el.textContent = v; if (row) row.hidden = false; }
    else if (row) row.hidden = true;
  });

  // Profile photo
  var img = document.querySelector("[data-profile-img]");
  if (img && cfg.profileImage) {
    img.src = base + cfg.profileImage;
    img.alt = cfg.profileImageAlt || "Portrait of Vaibhav Gupta";
    img.hidden = false;
    img.addEventListener("error", function () { img.hidden = true; });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
