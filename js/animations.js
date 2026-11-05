/* Scroll reveals + rotating role text. Content is never hidden if JS or IntersectionObserver is unavailable. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Stagger children of [data-reveal-group]
  document.querySelectorAll("[data-reveal-group]").forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (child, i) {
      child.setAttribute("data-reveal", "");
      child.style.setProperty("--i", i);
    });
  });

  var items = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  // Role text
  var el = document.querySelector("[data-roles]");
  if (!el) return;
  var roles = ["Aspiring Software Developer", "C++ Programmer", "Frontend Developer", "Problem Solver"];
  var caret = document.querySelector(".caret");
  if (reduce) { el.textContent = roles[0]; if (caret) caret.hidden = true; return; }

  var r = 0, c = 0, deleting = false;
  function tick() {
    if (document.hidden) { setTimeout(tick, 600); return; }
    var word = roles[r];
    if (!deleting) {
      c++;
      el.textContent = word.slice(0, c);
      if (c === word.length) { deleting = true; setTimeout(tick, 1700); return; }
      setTimeout(tick, 65);
    } else {
      c--;
      el.textContent = word.slice(0, c);
      if (c === 0) { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 350); return; }
      setTimeout(tick, 32);
    }
  }
  setTimeout(tick, 1800);
})();
