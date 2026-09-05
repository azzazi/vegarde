(() => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("[data-contact-form]");
  const planHost = document.querySelector("[data-plan-host]");
  const toolbar = document.querySelector("[data-plan-switch]");
  const callouts = document.querySelectorAll("[data-hot]");
  const desk = document.querySelector("[data-desk]");

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      if (open) closeMenu();
      else {
        toggle.setAttribute("aria-expanded", "true");
        menu.classList.add("is-open");
        document.body.classList.add("nav-open");
      }
    });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const setSite = (name) => {
    if (!planHost) return;
    planHost.querySelectorAll("[data-site-plan]").forEach((group) => {
      if (group.getAttribute("data-site-plan") === name) group.removeAttribute("hidden");
      else group.setAttribute("hidden", "");
    });
    if (toolbar) {
      toolbar.querySelectorAll("button").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.site === name));
      });
    }
  };

  const setHot = (id) => {
    if (!planHost) return;
    planHost.querySelectorAll(".hot").forEach((node) => {
      node.classList.toggle("is-on", node.getAttribute("data-hot") === id);
    });
    callouts.forEach((item) => {
      item.classList.toggle("is-on", item.getAttribute("data-hot") === id);
    });
  };

  const bindPlan = () => {
    if (toolbar) {
      toolbar.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => setSite(btn.dataset.site));
      });
    }
    callouts.forEach((item) => {
      const activate = () => setHot(item.getAttribute("data-hot"));
      item.addEventListener("mouseenter", activate);
      item.addEventListener("focus", activate);
      item.addEventListener("click", activate);
    });
    planHost.querySelectorAll(".hot").forEach((node) => {
      node.style.cursor = "pointer";
      node.addEventListener("click", () => setHot(node.getAttribute("data-hot")));
    });
    setSite(toolbar?.querySelector("[aria-pressed='true']")?.dataset.site || "residence");
    setHot("p1");
  };

  if (planHost) {
    fetch("img/plan-site.svg")
      .then((res) => res.text())
      .then((markup) => {
        planHost.innerHTML = markup;
        bindPlan();
      })
      .catch(() => {
        planHost.textContent = "Plan indisponible.";
      });
  }

  if (desk) {
    const papers = [...desk.querySelectorAll(".paper")];
    const show = (target) => {
      papers.forEach((paper) => paper.classList.toggle("is-front", paper === target));
    };
    papers.forEach((paper) => {
      paper.addEventListener("click", () => show(paper));
      paper.addEventListener("focus", () => show(paper));
    });
    if (papers[0]) show(papers[0]);
  }

  if (form) {
    const status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!form.checkValidity()) {
        if (status) {
          status.hidden = false;
          status.textContent = "Merci de renseigner les champs obligatoires avant l’envoi.";
        }
        form.querySelector(":invalid")?.focus();
        return;
      }
      if (status) {
        status.hidden = false;
        status.textContent =
          "Votre demande a bien été enregistrée. Nous vous recontacterons dès que les coordonnées de contact seront activées.";
      }
      form.reset();
    });
  }
})();
