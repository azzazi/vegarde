(() => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("[data-contact-form]");

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
