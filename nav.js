(() => {
  const home = location.pathname === "/cnc-manufacturing-preview/" || location.pathname === "/cnc-manufacturing-preview/index.html";
  function routeLegacyQuote() {
    if (home && location.hash === "#quote") location.replace("/cnc-manufacturing-preview/quote/" + location.search);
  }
  routeLegacyQuote();
  window.addEventListener("hashchange", routeLegacyQuote);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".home-hero");
  if (header) {
    const trigger = header.querySelector("#nav-toggle");
    const nav = header.querySelector("#primary-menu");
    const disclosure = nav.querySelector("details");
    const summary = disclosure.querySelector("summary");
    const small = window.matchMedia("(max-width: 800px)");
    let previousY = window.scrollY;
    let directionStart = previousY;
    let previousDirection = 0;
    let scheduled = false;
    function showHeader() { header.classList.remove("is-hidden"); }
    function closeMobile(returnFocus = false) {
      nav.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      disclosure.open = false;
      if (returnFocus) trigger.focus();
    }
    function adapt() { closeMobile(); trigger.hidden = !small.matches; showHeader(); }
    header.classList.add("enhanced");
    adapt();
    small.addEventListener("change", adapt);
    trigger.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) closeMobile();
      else { nav.classList.add("is-open"); trigger.setAttribute("aria-expanded", "true"); showHeader(); }
    });
    disclosure.addEventListener("toggle", () => { if (disclosure.open) showHeader(); });
    nav.addEventListener("click", event => { if (event.target.closest("a")) closeMobile(); });
    header.addEventListener("focusin", showHeader);
    header.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        if (disclosure.open) { disclosure.open = false; summary.focus(); }
        else if (small.matches && nav.classList.contains("is-open")) closeMobile(true);
      }
      if (event.key === "ArrowDown" && event.target === summary) { event.preventDefault(); disclosure.open = true; disclosure.querySelector("a").focus(); }
    });
    document.addEventListener("click", event => {
      if (!header.contains(event.target)) closeMobile();
      else if (!disclosure.contains(event.target)) disclosure.open = false;
    });
    document.addEventListener("focusin", event => {
      if (!header.contains(event.target)) closeMobile();
      else if (!disclosure.contains(event.target)) disclosure.open = false;
    });
    const normalizedPath = value => value.replace(/\/$/, "") || "/cnc-manufacturing-preview/";
    for (const link of header.querySelectorAll("a[href]")) {
      if (!link.hash && normalizedPath(link.pathname) === normalizedPath(location.pathname)) link.setAttribute("aria-current", "page");
    }
    function updateScroll() {
      const y = Math.max(0, window.scrollY);
      const direction = Math.sign(y - previousY);
      if (direction && direction !== previousDirection) directionStart = previousY;
      const travel = Math.abs(y - directionStart);
      const headerInUse = nav.classList.contains("is-open") || disclosure.open || header.contains(document.activeElement);
      header.classList.toggle("is-scrolled", y > 20);
      if (y < 90 || headerInUse || (direction < 0 && travel > 8)) showHeader();
      else if (direction > 0 && travel > 14 && y > 160) header.classList.add("is-hidden");
      if (hero) {
        const progress = y - hero.offsetTop;
        hero.classList.toggle("hero--leaving", progress > 90 && !reducedMotion.matches);
        hero.classList.toggle("hero--departed", progress > 290 && !reducedMotion.matches);
      }
      previousY = y;
      if (direction) previousDirection = direction;
      scheduled = false;
    }
    window.addEventListener("scroll", () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
    reducedMotion.addEventListener("change", updateScroll);
    updateScroll();
  }

  // Tabs are added only after JavaScript is ready; without it, all stages remain readable.
  for (const group of document.querySelectorAll("[data-process-tabs]")) {
    const tablist = group.querySelector(".process-switcher");
    const tabs = [...tablist.querySelectorAll("button[data-stage]")];
    const panels = tabs.map(tab => document.getElementById("stage-" + tab.dataset.stage));
    if (panels.some(panel => !panel)) continue;
    tablist.setAttribute("role", "tablist");
    tabs.forEach((tab, index) => {
      tab.id = "tab-" + tab.dataset.stage;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panels[index].id);
      panels[index].setAttribute("role", "tabpanel");
      panels[index].setAttribute("aria-labelledby", tab.id);
      panels[index].tabIndex = 0;
    });
    function activate(index, focus = false) {
      tabs.forEach((tab, current) => {
        const selected = current === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[current].hidden = !selected;
      });
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(index));
      tab.addEventListener("keydown", event => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); activate(next, true); }
      });
    });
    activate(0);
    group.classList.add("process-tabs-enhanced");
  }

  const revealElements = [...document.querySelectorAll("[data-reveal]")];
  let observer;
  function revealAll() {
    observer?.disconnect();
    revealElements.forEach(element => { element.classList.remove("reveal-ready"); element.classList.add("is-visible"); });
  }
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }, { threshold: .08, rootMargin: "0px 0px -28px 0px" });
    for (const element of revealElements) {
      if (element.getBoundingClientRect().top < window.innerHeight) element.classList.add("is-visible");
      else { element.classList.add("reveal-ready"); observer.observe(element); }
    }
  }
  reducedMotion.addEventListener("change", event => { if (event.matches) revealAll(); });
  window.addEventListener("beforeprint", revealAll);
})();
