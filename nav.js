(() => {
  const home = location.pathname === "/cnc-manufacturing-preview/" || location.pathname === "/cnc-manufacturing-preview/index.html";
  function routeLegacyQuote() {
    if (home && location.hash === "#quote") location.replace("/cnc-manufacturing-preview/quote/" + location.search);
  }
  routeLegacyQuote();
  window.addEventListener("hashchange", routeLegacyQuote);

  const header = document.querySelector(".site-header");
  if (!header) return;
  const trigger = header.querySelector("#nav-toggle");
  const nav = header.querySelector("#primary-menu");
  const disclosure = nav.querySelector("details");
  const summary = disclosure.querySelector("summary");
  const small = window.matchMedia("(max-width: 800px)");

  function closeMobile(returnFocus = false) {
    nav.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    disclosure.open = false;
    if (returnFocus) trigger.focus();
  }
  function adapt() {
    closeMobile();
    trigger.hidden = !small.matches;
  }
  header.classList.add("enhanced");
  adapt();
  small.addEventListener("change", adapt);
  trigger.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) closeMobile();
    else {
      nav.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
  nav.addEventListener("click", event => {
    if (event.target.closest("a")) closeMobile();
  });
  header.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (disclosure.open) {
        disclosure.open = false;
        summary.focus();
      } else if (small.matches && nav.classList.contains("is-open")) closeMobile(true);
    }
    if (event.key === "ArrowDown" && event.target === summary) {
      event.preventDefault();
      disclosure.open = true;
      disclosure.querySelector("a").focus();
    }
  });
  document.addEventListener("click", event => {
    if (!header.contains(event.target)) closeMobile();
    else if (!disclosure.contains(event.target)) disclosure.open = false;
  });
  document.addEventListener("focusin", event => {
    if (!header.contains(event.target)) closeMobile();
    else if (!disclosure.contains(event.target)) disclosure.open = false;
  });
  for (const link of header.querySelectorAll("a[href]")) {
    if (!link.hash && link.pathname === location.pathname) link.setAttribute("aria-current", "page");
  }
})();
