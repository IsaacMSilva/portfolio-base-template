/* Portfólio — renderização a partir de DATA (js/data.js) e I18N (js/i18n.js). */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  let lang = (() => {
    try { const l = localStorage.getItem("lang"); if (l === "pt" || l === "en") return l; } catch (e) {}
    return (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";
  })();

  const i = k => I18N[lang][k] ?? k;
  const t = v => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.pt ?? "" : v ?? "");
  const esc = v => String(t(v)).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const arr = v => (Array.isArray(v) ? v.filter(x => x != null && x !== "") : []);
  // Aceita http(s), mailto e caminhos relativos; bloqueia outros esquemas (ex.: "javascript:")
  const safeUrl = v => {
    const u = String(t(v) || "").trim();
    if (/^(https?:|mailto:)/i.test(u)) return u;
    return u && !/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(u) ? u : "";
  };
  const validEmail = v => /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(String(v || "").trim());
  const initials = v => String(t(v) || "").split(/\s+/).filter(Boolean).map(w => [...w][0]).join("").slice(0, 3).toUpperCase() || "◈";
  const ext = (href, label, cls = "btn") => {
    const url = safeUrl(href);
    return url ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}<span class="sr"> (${i("newTab")})</span>${icon.out}</a>` : "";
  };

  // Valores padrão para que campos ausentes em data.js não quebrem a página
  DATA.name ||= "";
  DATA.contact ||= {};
  const email = validEmail(DATA.contact.email) ? DATA.contact.email.trim() : "";

  const svg = (d, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
  const icon = {
    out: svg('<path d="M7 17 17 7M9 7h8v8"/>'),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    down: svg('<path d="M12 5v14M6 13l6 6 6-6"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    copy: svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'),
    github: svg('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'),
    linkedin: svg('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>'),
    print: svg('<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'),
    pin: svg('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
    cap: svg('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>'),
    target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>')
  };

  // Abreviações exibidas no selo de cada tecnologia (mantidas da versão anterior)
  const abbr = { Python: "Py", Java: "Jv", JavaScript: "JS", HTML: "</>", CSS: "{}", React: "Re", "Node.js": "No" };
  const badge = name => { const n = String(t(name)); return esc(abbr[n] || n.slice(0, 2)); };

  const sections = [
    { id: "sobre", key: "nav_about" },
    { id: "projetos", key: "nav_projects" },
    { id: "trajetoria", key: "nav_path" },
    { id: "competencias", key: "nav_skills" },
    { id: "console", key: "nav_console" },
    { id: "contato", key: "nav_contact" }
  ];

  const head = (n, id, title, lead) =>
    `<header class="sec-head reveal"><span class="idx" aria-hidden="true">${String(n).padStart(2, "0")}</span>` +
    `<div><h2 id="t-${id}">${title}</h2><p class="lead">${lead}</p></div></header>`;

  const filled = arr => Array.isArray(arr) && arr.length > 0;
  const skillGroups = () => arr(DATA.skills).filter(g => filled(arr(g.items))).map(g => ({ group: g.group, items: arr(g.items) }));

  /* ---------- Seções ---------- */

  let activeId = "";
  function markActive() {
    $$("[data-spy]").forEach(a => {
      const on = a.dataset.spy === activeId;
      a.classList.toggle("on", on);
      on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
    });
  }

  function renderNav() {
    $("#navlist").innerHTML = sections.map((s, n) =>
      `<li><a href="#${s.id}" data-spy="${s.id}"><span class="n" aria-hidden="true">0${n + 1}</span>${i(s.key)}</a></li>`).join("");
    markActive();
  }

  function renderHero(animate) {
    $("#hey").textContent = i("hello");
    const hn = $("#hn");
    let k = 0;
    hn.innerHTML = `<span class="sr">${esc(DATA.name)}</span><span aria-hidden="true">` +
      String(t(DATA.name)).split(/\s+/).filter(Boolean).map(w => `<span class="w">${[...w].map(c => `<span class="ch" style="--i:${k++}">${esc(c)}</span>`).join("")}</span>`).join(" ") +
      "</span>";
    if (animate && !reduced.matches) requestAnimationFrame(() => hn.classList.add("go"));
    else hn.classList.add("go", "done");

    // Marca do topo: primeira palavra de shortName em branco, o resto em destaque
    const [first = "", ...rest] = String(t(DATA.shortName || DATA.name)).toUpperCase().split(/\s+/);
    $(".brand span").innerHTML = `${esc(first)}<b>${esc(rest.join(" "))}</b>`;

    $("#hrole").textContent = t(DATA.title);
    $("#hintro").textContent = t(DATA.intro);
    $("#hloc").textContent = t(DATA.location);

    // Foto: sem arquivo (ou com arquivo quebrado) mostra as iniciais na moldura
    const photo = $("#hphoto"), src = safeUrl(DATA.photo);
    $(".portrait-fallback").textContent = initials(DATA.name);
    photo.alt = i("photoAlt") + " " + t(DATA.name);
    if (!src) photo.hidden = true;
    else if (photo.getAttribute("src") !== src) photo.src = src;
    if (photo.complete && !photo.naturalWidth) photo.hidden = true;

    $("#hmeta").innerHTML = DATA.available ? `<span class="status"><i aria-hidden="true"></i>${esc(DATA.available)}</span>` : "";

    const social = (href, label, ic) => {
      const url = safeUrl(href);
      return url ? `<a class="icon-btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${label} (${i("newTab")})">${ic}</a>` : "";
    };
    $("#hcta").innerHTML =
      `<a class="btn btn-primary" href="#projetos">${i("ctaProjects")}${icon.arrow}</a>` +
      `<a class="btn" href="#contato">${i("ctaContact")}</a>` +
      ext(DATA.resumePdf, i("ctaResume")) +
      `<span class="hero-social">` + social(DATA.contact.github, "GitHub", icon.github) + social(DATA.contact.linkedin, "LinkedIn", icon.linkedin) + `</span>`;
  }

  function renderAbout() {
    const ed = arr(DATA.education)[0];
    const fact = (ic, label, value) =>
      value ? `<li class="fact card reveal">${ic}<span class="fact-label">${label}</span><span class="fact-value">${value}</span></li>` : "";
    $("#about").innerHTML = head(1, "sobre", i("about_t"), i("about_lead")) +
      `<div class="about-grid">
        ${t(DATA.intro) ? `<p class="statement reveal">${esc(DATA.intro)}</p>` : ""}
        ${t(DATA.goals) ? `<div class="goals reveal"><h3>${i("goals")}</h3><p>${esc(DATA.goals)}</p></div>` : ""}
      </div>
      <ul class="facts" role="list">
        ${fact(icon.pin, i("loc"), esc(DATA.location))}
        ${ed ? fact(icon.cap, i("edu"), `${esc(ed.course)}${t(ed.school) ? ` <span class="mut">· ${esc(ed.school)}</span>` : ""}`) : ""}
        ${fact(icon.target, i("focus"), esc(DATA.focus))}
      </ul>`;
  }

  function projectCard(p) {
    const meta = [t(p.category), t(p.period), t(p.status)].filter(Boolean).map(esc).join(" · ");
    const tech = arr(p.tech), features = arr(p.features), cover = safeUrl(p.cover);
    const more = features.length || t(p.problem) || t(p.learnings);
    // As iniciais ficam sempre por baixo: se a capa faltar ou falhar, elas aparecem
    return `<article class="project card reveal${p.featured ? " featured" : ""}" data-cat="${esc(p.category)}">
      <div class="cover"><span class="cover-mark" aria-hidden="true">${esc(initials(p.name))}</span>${cover ? `<img src="${esc(cover)}" alt="" loading="lazy" decoding="async">` : ""}</div>
      <div class="project-body">
        ${meta ? `<p class="meta">${meta}</p>` : ""}
        <h3>${esc(p.name)}</h3>
        ${t(p.description) ? `<p>${esc(p.description)}</p>` : ""}
        ${tech.length ? `<ul class="tags" role="list">${tech.map(x => `<li class="tag">${esc(x)}</li>`).join("")}</ul>` : ""}
        ${more ? `<details><summary>${i("details")}<span class="sr">: ${esc(p.name)}</span></summary>
          ${t(p.problem) ? `<h4>${i("problem")}</h4><p>${esc(p.problem)}</p>` : ""}
          ${features.length ? `<h4>${i("features")}</h4><ul>${features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
          ${t(p.learnings) ? `<h4>${i("learn")}</h4><p>${esc(p.learnings)}</p>` : ""}
        </details>` : ""}
        <div class="links">${ext(p.demo, `${i("demo")}<span class="sr">: ${esc(p.name)}</span>`, "btn btn-primary btn-sm")}${ext(p.github, `${i("code")}<span class="sr">: ${esc(p.name)}</span>`, "btn btn-sm")}</div>
      </div>
    </article>`;
  }

  function renderProjects() {
    // Projetos sem nome são ignorados
    const list = arr(DATA.projects).filter(p => typeof p === "object" && String(t(p.name)).trim());
    let body;
    if (!list.length) {
      body = `<div class="empty card reveal">
        <svg class="hex" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,6 90,28 90,72 50,94 10,72 10,28"/><polygon points="50,24 74,38 74,62 50,76 26,62 26,38"/><circle cx="50" cy="50" r="5"/></svg>
        <div><p class="eyebrow">${i("buildTag")}</p><h3>${i("emptyT")}</h3><p class="mut">${i("emptyD")}</p>
        ${ext(DATA.contact.github, `${icon.github} ${i("emptyCta")}`)}</div>
      </div>`;
    } else {
      const sorted = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      const cats = [...new Set(list.map(p => t(p.category)).filter(Boolean))];
      body = `<div class="tools reveal">
          <label class="search"><span class="sr">${i("search")}</span><input id="pq" type="search" placeholder="${i("search")}" autocomplete="off"></label>
          ${cats.length > 1 ? `<div class="filters" role="group" aria-label="${i("filterBy")}">
            <button class="chip on" type="button" data-cat="" aria-pressed="true">${i("all")}</button>
            ${cats.map(c => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("")}
          </div>` : ""}
        </div>
        <div class="projects" id="plist">${sorted.map(projectCard).join("")}</div>
        <p class="mut count" id="pcount" role="status"></p>`;
    }
    $("#projects").innerHTML = head(2, "projetos", i("projects_t"), i("projects_lead")) + body;
    if (list.length) bindProjectFilters();
  }

  function bindProjectFilters() {
    let cat = "";
    const apply = () => {
      const q = ($("#pq").value || "").trim().toLowerCase();
      let shown = 0;
      $$("#plist .project").forEach(el => {
        const ok = (!cat || el.dataset.cat === cat) && (!q || el.textContent.toLowerCase().includes(q));
        el.hidden = !ok;
        shown += ok;
      });
      // Anuncia o resultado só depois que o usuário filtra
      $("#pcount").textContent = q || cat ? (shown ? i(shown === 1 ? "count1" : "countN").replace("{n}", shown) : i("none")) : "";
    };
    $("#pq").addEventListener("input", apply);
    $$("#projects .filters .chip").forEach(b => b.addEventListener("click", () => {
      cat = b.dataset.cat;
      $$("#projects .filters .chip").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
      apply();
    }));
  }

  function renderPath() {
    const item = (title, org, period, note) => `<li class="tl-item reveal">
      <span class="tl-period">${esc(period)}</span><h4>${esc(title)}</h4><p>${esc(org)}</p>${note ? `<p class="mut">${esc(note)}</p>` : ""}</li>`;
    const extra = (title, list) => (list = arr(list)).length ? `<div class="card extra reveal"><h3>${title}</h3><ul>${list.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : "";
    const col = (title, list, fn) => (list = arr(list)).length ? `<h3 class="col-t">${title}</h3><ol class="timeline">${list.map(fn).join("")}</ol>` : "";
    const exp = col(i("exp"), DATA.experience, e => item(e.role, e.org, e.period, e.note));
    const side = col(i("edu"), DATA.education, e => item(e.course, e.school, e.period)) +
      extra(i("courses"), DATA.courses) + extra(i("certs"), DATA.certs) + extra(i("langs"), DATA.languages);
    $("#path").innerHTML = head(3, "trajetoria", i("path_t"), i("path_lead")) +
      `<div class="path-grid">${exp ? `<div>${exp}</div>` : ""}${side ? `<div>${side}</div>` : ""}</div>
      <div class="path-actions reveal">
        <button class="btn" type="button" data-print>${icon.print}${i("print")}</button>
        ${ext(DATA.resumePdf, i("pdf"))}
      </div>`;
  }

  function renderSkills() {
    const groups = skillGroups();
    $("#skills").innerHTML = head(4, "competencias", i("skills_t"), i("skills_lead")) +
      (groups.length ? `<div class="skill-grid">${groups.map((g, n) => `<div class="card skill-group reveal" style="--d:${n}">
          <h3><span class="mut" aria-hidden="true">${String(n + 1).padStart(2, "0")} /</span> ${esc(g.group)}</h3>
          <ul class="skills" role="list">${g.items.map(s => `<li class="skill"><i aria-hidden="true">${badge(s)}</i>${esc(s)}</li>`).join("")}</ul>
        </div>`).join("")}</div>` : `<p class="mut">${i("termNoSkill")}</p>`);
  }

  function renderContact() {
    const c = DATA.contact;
    const links = (email ? `<button class="btn" type="button" data-copy="${esc(email)}">${icon.copy}<span>${i("copy")}</span></button>` : "") +
      ext(c.github, `${icon.github} GitHub`) + ext(c.linkedin, `${icon.linkedin} LinkedIn`) +
      arr(c.other).filter(o => t(o.label)).map(o => ext(o.url, esc(o.label))).join("");
    $("#contact").innerHTML = head(6, "contato", i("contact_t"), i("contact_lead")) +
      `<div class="contact-card card reveal">
        ${email ? `<a class="mail" href="mailto:${esc(email)}">${icon.mail}<span>${esc(email)}</span></a>` : ""}
        ${links ? `<div class="contact-actions">${links}</div>` : `<p class="mut">${i("noContact")}</p>`}
      </div>`;
    $("#foot").innerHTML = `<p><svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3l11 6.3v13.4L16 29 5 22.7V9.3z"/><circle cx="16" cy="16" r="3"/></svg>
      © ${new Date().getFullYear()} ${esc(DATA.name)} · <span class="mut">${i("made")}</span></p><a href="#top" class="to-top">${i("top")} ↑</a>`;
  }

  /* ---------- Currículo para impressão ---------- */

  function resumeHTML() {
    const block = (title, list, fn) => ((list = arr(list)).length ? `<h2>${title}</h2>${list.map(fn).join("")}` : "");
    const c = DATA.contact;
    return `<h1>${esc(DATA.name)}</h1><p>${[t(DATA.title), t(DATA.location)].filter(Boolean).map(esc).join(" · ")}</p>` +
      `<p>${[email, safeUrl(c.github), safeUrl(c.linkedin)].filter(Boolean).map(esc).join(" · ")}</p>` +
      (t(DATA.intro) ? `<h2>${i("sum")}</h2><p>${esc(DATA.intro)}</p>` : "") +
      block(i("edu"), DATA.education, e => `<p><b>${esc(e.course)}</b> — ${esc(e.school)} (${esc(e.period)})</p>`) +
      block(i("exp"), DATA.experience, e => `<p><b>${esc(e.role)}</b> — ${esc(e.org)}<br>${esc(e.period)}${e.note ? " · " + esc(e.note) : ""}</p>`) +
      block(i("tech"), skillGroups(), g => `<p><b>${esc(g.group)}:</b> ${g.items.map(esc).join(", ")}</p>`) +
      block(i("projs"), arr(DATA.projects).filter(p => t(p.name)), p => `<p><b>${esc(p.name)}</b>${t(p.description) ? " — " + esc(p.description) : ""}</p>`) +
      block(i("courses"), DATA.courses, x => `<p>${esc(x)}</p>`) +
      block(i("certs"), DATA.certs, x => `<p>${esc(x)}</p>`) +
      block(i("langs"), DATA.languages, x => `<p>${esc(x)}</p>`);
  }

  /* ---------- Console ---------- */

  const termHistory = [];
  const termUser = () => (String(t(DATA.shortName || DATA.name)).split(/\s+/)[0] || "dev").toLowerCase();

  function renderTerm() {
    $("#term").innerHTML = head(5, "console", i("console_t"), i("console_lead")) +
      `<div class="terminal reveal">
        <div class="term-bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(termUser())}@portfolio: ~</span></div>
        <div class="term-out" id="tout" aria-live="polite"><pre>${i("termHi")}</pre></div>
        <label class="term-row"><span class="prompt" aria-hidden="true">$</span><span class="sr">${i("termLabel")}</span>
          <input id="tin" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" placeholder="help"></label>
      </div>`;
    bindTerm();
  }

  const goto = id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth" });
    history.replaceState(null, "", "#" + id);
  };

  const sectionAlias = { about: "sobre", projects: "projetos", resume: "trajetoria", skills: "competencias", contact: "contato", terminal: "console", top: "top" };

  const commands = {
    help: () => ({ html: `<pre>${Object.entries(i("cmds")).map(([c, d]) => `<span class="cm">${c.padEnd(10)}</span><span class="mut">${esc(d)}</span>`).join("\n")}\n\n<span class="mut">${i("keys")}</span></pre>` }),
    about: () => `${DATA.name}\n${t(DATA.title)} · ${t(DATA.location)}\n${t(DATA.intro)}`,
    whoami: () => `${DATA.name} — ${t(DATA.title)}`,
    projects: () => { const ps = arr(DATA.projects).filter(p => t(p.name)); return ps.length ? ps.map(p => "• " + t(p.name)).join("\n") : i("termNoProj"); },
    skills: () => (skillGroups().length ? skillGroups().map(g => `${t(g.group)}: ${g.items.map(t).join(", ")}`).join("\n") : i("termNoSkill")),
    resume: () => { setTimeout(() => goto("trajetoria"), 400); return arr(DATA.education).map(e => `${t(e.course)} — ${t(e.school)} (${t(e.period)})`).concat(i("opening")).join("\n"); },
    contact: () => [email, safeUrl(DATA.contact.github), safeUrl(DATA.contact.linkedin)].filter(Boolean).join("\n") || i("noContact"),
    github: () => safeUrl(DATA.contact.github) || "—",
    date: () => new Date().toLocaleString(lang === "en" ? "en-US" : "pt-BR"),
    open: arg => {
      const id = sectionAlias[arg] || (sections.some(s => s.id === arg) ? arg : null);
      if (!id) return "open <" + Object.keys(sectionAlias).join("|") + ">";
      setTimeout(() => goto(id), 300);
      return "→ #" + id;
    },
    neofetch: () => {
      const vals = [DATA.name, t(DATA.title), t(DATA.location), t(arr(DATA.education)[0]?.course), skillGroups().flatMap(g => g.items.map(t)).join(", "), i("nfLang")];
      const art = ["       ▄▄▀▀▄▄       ", "    ▄▀▀      ▀▀▄    ", "   █            █   ", "   █     ██     █   ", "   █            █   ", "    ▀▄▄      ▄▄▀    ", "       ▀▀▄▄▀▀       ", "                    ", "     >_ " + termUser()].join("\n");
      return { html: `<div class="nf"><pre class="art">${art}</pre><pre><b class="cm">Portfolio - ${esc(termUser())}.dev</b>\n${"-".repeat(21)}\n${i("nfLabels").map((l, n) => `<span class="cm">${l}</span>: ${esc(vals[n])}`).join("\n")}\n\n<span class="mut">${i("nfNote")}</span></pre></div>` };
    }
  };

  function bindTerm() {
    const out = $("#tout"), inp = $("#tin");
    let pos = termHistory.length;
    $(".terminal").addEventListener("click", e => { if (!e.target.closest("a") && !getSelection().toString()) inp.focus({ preventScroll: true }); });
    inp.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        // Só completa quando há algo a completar; caso contrário o Tab segue para o próximo elemento
        const v = inp.value.toLowerCase();
        const m = Object.keys(commands).concat("clear").filter(c => v && c.startsWith(v));
        if (m.length === 1 && m[0] !== v) { e.preventDefault(); inp.value = m[0]; }
      } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault(); out.innerHTML = "";
      } else if (e.key === "Enter") {
        const raw = inp.value.trim().toLowerCase();
        inp.value = "";
        if (!raw) return;
        termHistory.push(raw); pos = termHistory.length;
        if (raw === "clear") { out.innerHTML = ""; return; }
        const [cmd, arg] = raw.split(/\s+/);
        const res = Object.hasOwn(commands, cmd) ? commands[cmd](arg) : i("unk").replace("{c}", raw);
        out.insertAdjacentHTML("beforeend", `<pre><span class="cm">$ ${esc(raw)}</span></pre>` + (res.html || `<pre>${esc(res)}</pre>`));
        out.scrollTop = out.scrollHeight;
      } else if (e.key === "ArrowUp" && termHistory.length) {
        e.preventDefault(); pos = Math.max(0, pos - 1); inp.value = termHistory[pos];
      } else if (e.key === "ArrowDown") {
        e.preventDefault(); pos = Math.min(termHistory.length, pos + 1); inp.value = termHistory[pos] || "";
      }
    });
  }

  /* ---------- Comportamentos ---------- */

  let revealObs;
  function observeReveals(instant) {
    const els = $$(".reveal:not(.in)");
    if (instant || reduced.matches || !("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
    revealObs ??= new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); revealObs.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    // Atraso escalonado para itens irmãos que entram juntos
    els.forEach(el => {
      const sibs = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
      el.style.setProperty("--stagger", Math.min(sibs.indexOf(el), 6) * 70 + "ms");
      revealObs.observe(el);
    });
  }

  function scrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { activeId = en.target.id; markActive(); }
    }), { rootMargin: "-45% 0px -50% 0px" });
    // O hero não tem item no menu: ao voltar para o topo, nenhum link fica ativo
    new IntersectionObserver(([en]) => { if (en.isIntersecting) { activeId = ""; markActive(); } }, { rootMargin: "-45% 0px -50% 0px" }).observe($(".hero"));
    sections.forEach(s => obs.observe(document.getElementById(s.id)));
    // Pausa a animação das fitas quando o hero sai da tela
    new IntersectionObserver(([en]) => document.body.classList.toggle("hero-off", !en.isIntersecting)).observe($(".hero"));
  }

  function bindScroll() {
    const bar = $("#bar"), prog = $(".progress i");
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      bar.classList.toggle("scrolled", scrollY > 12);
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  function bindMenu() {
    const btn = $("#menubtn"), nav = $("#nav");
    const set = open => {
      document.body.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", open);
      syncMenuLabel();
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
    // Toque fora do menu aberto fecha o menu
    document.addEventListener("click", e => {
      if (document.body.classList.contains("menu-open") && !e.target.closest("#nav, #menubtn")) set(false);
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) { set(false); btn.focus(); }
    });
    matchMedia("(min-width: 1000px)").addEventListener("change", e => e.matches && set(false));
  }

  // Brilho que acompanha o cursor nos cards (apenas mouse/caneta)
  function bindGlow() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.addEventListener("pointermove", e => {
      const card = e.target.closest?.(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    }, { passive: true });
  }

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("on"), 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((ok, fail) => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta); ta.select();
      try { document.execCommand("copy") ? ok() : fail(); } catch (e) { fail(e); }
      ta.remove();
    });
  }

  document.addEventListener("click", e => {
    const el = e.target.closest("button, a");
    if (!el) return;
    if (el.dataset.copy) {
      const label = $("span", el);
      copyText(el.dataset.copy).then(() => {
        toast(i("copied"));
        if (label) { label.textContent = i("copied"); setTimeout(() => (label.textContent = i("copy")), 1800); }
      }, () => toast(i("copyFail").replace("{e}", el.dataset.copy)));
    } else if (el.hasAttribute("data-print")) {
      print();
    } else if (el.id === "langbtn") {
      setLang(lang === "pt" ? "en" : "pt");
      try { localStorage.setItem("lang", lang); } catch (e) {} // salva só a escolha explícita
    }
  });

  // Imagem quebrada: esconde e deixa aparecer o fallback (iniciais) que fica por baixo
  document.addEventListener("error", e => {
    if (e.target.tagName === "IMG") e.target.hidden = true;
  }, true);

  function syncMenuLabel() {
    $("#menubtn .sr").textContent = i(document.body.classList.contains("menu-open") ? "closeMenu" : "menu");
  }

  function setLang(next, first) {
    lang = next;
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    document.title = i("docTitle");
    $('meta[name="description"]').content = i("docDesc");
    $("#langbtn").innerHTML = `<span aria-hidden="true">${i("langLabel")}</span><span class="sr" lang="${lang === "pt" ? "en" : "pt-BR"}">${i("langSwitch")}</span>`;
    $$("[data-i]").forEach(el => (el.textContent = i(el.dataset.i)));
    $("#nav").setAttribute("aria-label", i("navLabel"));
    syncMenuLabel();
    renderNav(); renderHero(first); renderAbout(); renderProjects(); renderPath(); renderSkills(); renderTerm(); renderContact();
    // Mantém o currículo de impressão sempre pronto, inclusive para Ctrl+P
    $("#printdoc").innerHTML = resumeHTML();
    observeReveals(!first);
  }

  setLang(lang, true);
  scrollSpy();
  bindScroll();
  bindMenu();
  bindGlow();
})();
