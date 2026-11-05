/* Contact form: client-side validation + real submission (Formspree-compatible). Never fakes success. */
(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var cfg = window.SITE_CONFIG || {};
  var endpoint = typeof cfg.formEndpoint === "string" ? cfg.formEndpoint.trim() : "";
  var configured = /^https:\/\/\S+$/i.test(endpoint);

  var status = form.querySelector("[data-form-status]");
  var submit = form.querySelector('button[type="submit"]');
  var notice = document.querySelector("[data-form-notice]");
    var siteKey = typeof cfg.recaptchaSiteKey === "string" ? cfg.recaptchaSiteKey.trim() : "";
  var captchaWrap = form.querySelector("[data-captcha]");
  var widgetId = null;
  if (siteKey && captchaWrap) {
    captchaWrap.hidden = false;
    window.onCaptchaLoad = function () {
      widgetId = grecaptcha.render("captcha-box", { sitekey: siteKey });
    };
    var s = document.createElement("script");
    s.src = "https://www.google.com/recaptcha/api.js?onload=onCaptchaLoad&render=explicit";
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }

  if (!configured) {
    if (notice) notice.hidden = false;
    submit.disabled = true;
  }

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters)."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."; },
    subject: function (v) { return v.trim().length >= 3 ? "" : "Please add a short subject (at least 3 characters)."; },
    message: function (v) { return v.trim().length >= 10 ? "" : "Please write a message (at least 10 characters)."; }
  };

  function check(name) {
    var input = form.elements[name];
    var err = form.querySelector('[data-error-for="' + name + '"]');
    var msg = rules[name](input.value);
    err.textContent = msg;
    if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    return !msg;
  }

  Object.keys(rules).forEach(function (n) {
    form.elements[n].addEventListener("blur", function () { check(n); });
    form.elements[n].addEventListener("input", function () {
      if (form.elements[n].getAttribute("aria-invalid")) check(n);
    });
  });

  function show(kind, text) {
    status.hidden = false;
    status.className = "form-status form-status--" + kind;
    status.textContent = text;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!configured) {
      show("error", "The contact form is not connected to a service yet, so nothing was sent.");
      return;
    }
    var firstBad = null;
    Object.keys(rules).forEach(function (n) { if (!check(n) && !firstBad) firstBad = form.elements[n]; });
    if (firstBad) { firstBad.focus(); show("error", "Please fix the highlighted fields and try again."); return; }

    // Honeypot: bots fill this hidden field; real visitors never see it.
    if (form.elements["_gotcha"] && form.elements["_gotcha"].value) return;
        if (siteKey) {
      var token = (window.grecaptcha && widgetId !== null) ? grecaptcha.getResponse(widgetId) : "";
      if (!token) { show("error", "Please tick “I’m not a robot” first."); return; }
    }

    submit.disabled = true;
    var original = submit.textContent;
    submit.textContent = "Sending…";

    fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    }).then(function (res) {
      if (res.ok) {
        form.reset();
                if (siteKey && widgetId !== null) grecaptcha.reset(widgetId);
        show("ok", "Thanks — your message was sent.");
      } else {
        return res.json().catch(function () { return {}; }).then(function (data) {
          var detail = data && data.errors && data.errors[0] && data.errors[0].message;
          show("error", detail || "The message could not be sent. Please try again later.");
        });
      }
    }).catch(function () {
      show("error", "Network error — the message was not sent. Please check your connection and try again.");
    }).then(function () {
      submit.disabled = false;
      submit.textContent = original;
    });
  });
})();
