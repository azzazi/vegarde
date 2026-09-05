(() => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("[data-contact-form]");
  const planHost = document.querySelector("[data-plan-host]");
  const toolbar = document.querySelector("[data-plan-switch]");
  const legend = document.querySelector("[data-legend]");
  const note = document.querySelector("[data-plan-note]");
  const classeur = document.querySelector("[data-classeur]");

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
      else group.setAttribute("hidden", "hidden");
    });
    if (toolbar) {
      toolbar.querySelectorAll("button").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.site === name));
      });
    }
  };

  const setHot = (id) => {
    if (!id) return;
    if (planHost) {
      planHost.querySelectorAll("[data-hot]").forEach((node) => {
        node.classList.toggle("is-on", node.getAttribute("data-hot") === id);
      });
    }
    if (legend) {
      legend.querySelectorAll("[data-hot]").forEach((item) => {
        const on = item.getAttribute("data-hot") === id;
        item.classList.toggle("is-on", on);
        if (on && note) note.innerHTML = item.innerHTML;
      });
    }
  };

  if (toolbar) {
    toolbar.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-site]");
      if (!btn) return;
      setSite(btn.dataset.site);
      const current = legend?.querySelector("[data-hot].is-on")?.getAttribute("data-hot") || "p1";
      setHot(current);
    });
  }

  if (legend) {
    const activate = (event) => {
      const item = event.target.closest("[data-hot]");
      if (item) setHot(item.getAttribute("data-hot"));
    };
    legend.addEventListener("mouseover", activate);
    legend.addEventListener("focusin", activate);
    legend.addEventListener("click", activate);
  }

  if (planHost) {
    const fromPlan = (event) => {
      const hot = event.target.closest("[data-hot]");
      if (hot) setHot(hot.getAttribute("data-hot"));
    };
    planHost.addEventListener("mouseover", fromPlan);
    planHost.addEventListener("click", fromPlan);

    fetch("img/plan-site.svg")
      .then((res) => res.text())
      .then((markup) => {
        planHost.innerHTML = markup;
        const start = toolbar?.querySelector("[aria-pressed='true']")?.dataset.site || "residence";
        setSite(start);
        setHot("p1");
      })
      .catch(() => {
        planHost.textContent = "Plan indisponible.";
      });
  }

  if (classeur) {
    const tabs = [...classeur.querySelectorAll("[data-tab]")];
    const panels = [...classeur.querySelectorAll("[data-panel]")];
    const show = (id) => {
      tabs.forEach((tab) => {
        const on = tab.dataset.tab === id;
        tab.setAttribute("aria-selected", String(on));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== id;
      });
    };
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => show(tab.dataset.tab));
    });
    const current = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
    if (current) show(current.dataset.tab);
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
