 /* Renders project cards from data/projects.js; fills project links on case-study pages. */
(function () {
  var projects = window.PROJECTS || [];
  var base = document.documentElement.getAttribute("data-base") || "";
  function isHttps(v) { return typeof v === "string" && /^https:\/\/\S+$/i.test(v.trim()); }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function iconUse(name, cls) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon " + (cls || ""));
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }
  function link(label, href, ghost, icon, external) {
    var a = el("a", "btn btn--sm" + (ghost ? " btn--ghost" : ""));
    a.href = href;
    if (external) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    a.appendChild(document.createTextNode(label));
    if (icon) a.appendChild(iconUse(icon, icon === "arrow-right" ? "icon-arrow" : ""));
    return a;
  }

  var grid = document.querySelector("[data-project-grid]");
  if (grid) {
    projects.forEach(function (p, i) {
      var card = el("article", "project-card" + (p.featured ? " project-card--featured" : ""));
      card.setAttribute("data-reveal", "");

      var media = el("div", "project-media");
      var img = el("img");
      img.src = base + p.image;
      img.alt = p.imageAlt || p.title + " preview";
      img.loading = i === 0 ? "eager" : "lazy";
      img.width = 1280; img.height = 800;
      img.addEventListener("error", function () { media.hidden = true; });
      media.appendChild(img);

      var body = el("div", "project-body");
      var head = el("div", "project-head");
      head.appendChild(el("span", "status status--progress", p.status));
      body.appendChild(head);
      var h = el("h3", null, p.title);
      body.appendChild(h);
      if (p.subtitle) body.appendChild(el("p", "project-sub", p.subtitle));
      body.appendChild(el("p", null, p.description));

      var tags = el("ul", "tag-list");
      tags.setAttribute("aria-label", "Technologies used");
      (p.tags || []).forEach(function (t) { tags.appendChild(el("li", "tag", t)); });
      body.appendChild(tags);

      var actions = el("div", "project-actions");
      actions.appendChild(link("View case study", base + p.caseStudy, false, "arrow-right", false));
      if (isHttps(p.repo)) actions.appendChild(link("GitHub", p.repo.trim(), true, "github", true));
      if (isHttps(p.demo)) actions.appendChild(link("Live demo", p.demo.trim(), true, "external", true));
      body.appendChild(actions);

      card.appendChild(media);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  // Case-study page: fill repo/demo links for the matching project
  var pageId = document.body.getAttribute("data-project-id");
  if (pageId) {
    var p = projects.filter(function (x) { return x.id === pageId; })[0];
    document.querySelectorAll("[data-project-link]").forEach(function (a) {
      var key = a.getAttribute("data-project-link");
      var v = p && p[key];
      var wrap = a.closest("[data-project-link-row]") || a;
      if (isHttps(v)) { a.href = v.trim(); a.target = "_blank"; a.rel = "noopener noreferrer"; wrap.hidden = false; }
      else wrap.hidden = true;
    });
  }
})();