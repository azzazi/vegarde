(() => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("[data-contact-form]");
  const scenes = document.querySelectorAll("[data-scene]");
  const zones = document.querySelector("[data-zones]");
  const missions = document.querySelector("[data-missions]");

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

  scenes.forEach((scene) => {
    const img = scene.querySelector("[data-scene-img]");
    const switcher = scene.querySelector("[data-site-switch]");
    const caption = scene.querySelector("[data-scene-caption]");
    if (!switcher) return;
    switcher.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-site]");
      if (!btn) return;
      switcher.querySelectorAll("[data-site]").forEach((node) => {
        node.setAttribute("aria-pressed", String(node === btn));
      });
      if (img && btn.dataset.src) img.src = btn.dataset.src;
      if (caption && btn.dataset.caption) caption.textContent = btn.dataset.caption;
      const notes = {
        chantier: "chantiers",
        residence: "residences",
        commerce: "commerces"
      };
      scene.querySelectorAll(".world-notes").forEach((list) => {
        list.hidden = list.id !== notes[btn.dataset.site];
      });
    });
  });

  if (zones) {
    const items = [...zones.querySelectorAll("li")];
    const setOn = (target) => {
      items.forEach((item) => item.classList.toggle("is-on", item === target));
    };
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => setOn(item));
      item.addEventListener("focus", () => setOn(item));
      item.addEventListener("click", () => setOn(item));
    });
    if (items[0]) setOn(items[0]);
  }

  if (missions) {
    const items = [...missions.querySelectorAll(".mission")];
    const show = (target) => {
      items.forEach((item) => {
        const on = item === target;
        item.classList.toggle("is-open", on);
        item.querySelector("button")?.setAttribute("aria-expanded", String(on));
      });
    };
    items.forEach((item) => {
      item.querySelector("button")?.addEventListener("click", () => show(item));
    });
    if (items[0]) show(items[0]);
  }

  if (form) {
    const status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!form.checkValidity()) {
        if (status) {
          status.hidden = false;
          status.classList.remove("is-ok");
          status.textContent = "Merci de renseigner les champs obligatoires avant l’envoi.";
        }
        form.querySelector(":invalid")?.focus();
        return;
      }
      if (status) {
        status.hidden = false;
        status.classList.add("is-ok");
        status.textContent =
          "Votre demande a bien été enregistrée. Nous vous recontacterons dès que les coordonnées de contact seront activées.";
      }
      form.reset();
    });
  }
})();
