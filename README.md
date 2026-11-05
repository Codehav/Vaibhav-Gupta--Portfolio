# Vaibhav Gupta — Portfolio

A single-page portfolio (HTML, CSS, vanilla JavaScript) plus a case-study page for CodeNest. No build step, no frameworks, no external requests.

## Run locally

Double-click `index.html`, or serve the folder for a more realistic test:

```bash
cd vaibhav-portfolio
python3 -m http.server 8000   # then open http://localhost:8000
```

## What is configured where

| What | File |
| --- | --- |
| Email, GitHub, LinkedIn, LeetCode, resume, photo, form endpoint, college details | `js/site-config.js` |
| Projects (cards on the homepage) | `data/projects.js` |
| Colours, fonts, spacing, radii, shadows, motion | `css/variables.css` |
| Skills, About copy, timeline | `index.html` |
| CodeNest case study text | `projects/codenest.html` |

Anything left as `""` in `site-config.js` is simply not shown. No placeholder text is published as if it were real.

## Set up links, resume and photo

1. Open `js/site-config.js`.
2. Fill in `github`, `linkedin`, `leetcode` (full `https://` URLs) and `email`.
3. Put your resume PDF in `assets/resume/` and set `resume: "assets/resume/<your-file>.pdf"`. The Resume buttons appear automatically.
4. Put a portrait in `assets/images/profile/` and set `profileImage`.
5. Fill `education.college`, `education.expectedGraduation`, `education.semester` when you want them shown. Leave out CGPA unless you decide to add it yourself.

## Contact form

The form posts to a service you configure, and never shows a fake "sent" message. Until an endpoint is set, the form shows a notice and the button is disabled.

1. Create a free form at [formspree.io](https://formspree.io) and copy its endpoint (`https://formspree.io/f/xxxxxxx`).
2. Paste it into `formEndpoint` in `js/site-config.js`.
3. Send a test message and confirm it arrives.

Spam protection: the form includes a hidden honeypot field. Also enable the reCAPTCHA / spam filtering options in your Formspree dashboard, and restrict submissions to your domain.

## Keep CodeNest honest

`projects/codenest.html` was written from your brief, not from your source code (none was supplied). It lists only: interface built, project/account-style flows being debugged, everything else as **Planned**. Before publishing:

- Compare each item with your actual code. Move features from "Planned" to "Worked on so far" only when they work.
- Do not describe online code execution as working until a compiler backend is connected and tested.
- Add real screenshots to `assets/images/projects/`, then update `image` in `data/projects.js` and the `<img>` in the case-study page.
- Add `repo` and `demo` URLs in `data/projects.js`. Buttons and links appear automatically.

## Add a project

Add an object to the array in `data/projects.js` (copy the CodeNest entry). For a detail page, copy `projects/codenest.html` and point `caseStudy` to it. Remember to set `data-project-id` on the new page's `<body>`.

## Not included (on purpose)

Git/GitHub and MySQL Workbench are not listed as tools because use wasn't confirmed. Add them to the Developer Tools list in `index.html` once confirmed. Likewise for any framework.

## Publish on GitHub

```bash
cd vaibhav-portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

## Deploy (free options)

- **GitHub Pages:** repo → Settings → Pages → deploy from `main` / root.
- **Netlify or Cloudflare Pages:** connect the repo, no build command, publish directory `/`.

After deploying, replace `YOUR-DOMAIN` in `sitemap.xml` and `robots.txt` with your real address. Optionally add `og:url`, a canonical link and an `og:image` to `index.html`.

## Design and tech notes

- Burgundy + cream palette with a charcoal-wine dark theme, all driven by CSS variables. Theme choice persists in `localStorage`.
- **GSAP and Lucide were deliberately not added.** CSS transitions and IntersectionObserver cover every animation, and inline SVG icons cover the iconography, so there are zero dependencies.
- Fonts are system stacks, so the site loads fast and needs no network.
- CSS is five files rather than seven: responsive rules live beside the components they affect (mobile-first media queries).
- Motion respects `prefers-reduced-motion`. Content is never hidden if JavaScript fails.

## Testing checklist

- [ ] All nav and footer anchors scroll to the right section; active indicator follows
- [ ] Mobile menu opens, closes (link click, Esc, resize) and is keyboard operable
- [ ] Theme toggle works and persists after reload
- [ ] CodeNest card → case study → back link works; repo/demo links appear only when set
- [ ] Resume buttons appear only when a real PDF path is set and the file downloads
- [ ] Contact form: validation errors, notice when unconfigured, real test message once configured
- [ ] Tab through the page: focus is always visible
- [ ] No horizontal scroll at 360, 390, 768, 1024, 1440 px
- [ ] Reduced-motion setting disables animation
- [ ] Browser console shows no errors; no broken images
- [ ] Run Lighthouse yourself before quoting any scores
