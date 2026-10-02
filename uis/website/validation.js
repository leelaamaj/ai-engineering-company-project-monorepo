(() => {
  "use strict";
  const form = document.getElementById("inquiry-form");
  const summary = document.getElementById("error-summary");
  const success = document.getElementById("success-message");
  const warning = document.getElementById("low-volume-warning");
  const confirm = document.getElementById("confirm-low-volume");
  const names = [
    "company_name",
    "contact_person",
    "email",
    "phone",
    "website",
    "country",
    "product_type",
    "monthly_volume",
    "services",
    "current_3pl",
    "comments",
    "privacy",
  ];
  const touched = new Set();
  let attempted = false;
  const messages = {
    en: {
      company_name: "Company name must have at least 2 characters",
      contact_person: "Enter first and last name of contact",
      email: "Enter a valid corporate email (example: name@company.com)",
      phone: "Phone must include country code (example: +1 213 555 0147)",
      website: "If you include website, it must be a valid URL",
      country: "Select main operating country",
      product_type: "Select the type of product you handle",
      monthly_volume: "Select estimated monthly volume",
      services: "Select at least one service of interest",
      current_3pl:
        "Indicate if you currently work with another logistics provider",
      comments: "Comments cannot exceed 500 characters",
      privacy: "You must accept the privacy policy to continue",
      summary: "Please correct the highlighted fields before continuing.",
      remaining: "remaining",
    },
    es: {
      company_name: "El nombre de la empresa debe tener al menos 2 caracteres",
      contact_person:
        "Introduce el nombre y apellido de la persona de contacto",
      email:
        "Introduce un correo corporativo válido (ejemplo: nombre@empresa.com)",
      phone:
        "El teléfono debe incluir el código de país (ejemplo: +34 976 123 456)",
      website: "Si incluyes un sitio web, debe ser una URL válida",
      country: "Selecciona el país principal de operación",
      product_type: "Selecciona el tipo de producto que manejas",
      monthly_volume: "Selecciona el volumen mensual estimado",
      services: "Selecciona al menos un servicio de interés",
      current_3pl:
        "Indica si trabajas actualmente con otro proveedor logístico",
      comments: "Los comentarios no pueden superar los 500 caracteres",
      privacy: "Debes aceptar la política de privacidad para continuar",
      summary: "Corrige los campos destacados antes de continuar.",
      remaining: "restantes",
    },
  };
  const controls = (name) => [...form.querySelectorAll(`[name="${name}"]`)];
  const value = (name) => controls(name)[0].value.trim();
  function invalid(name) {
    switch (name) {
      case "company_name":
        return value(name).length < 2;
      case "contact_person":
        return value(name).split(/\s+/).filter(Boolean).length < 2;
      case "email":
        return (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value(name)) ||
          controls(name)[0].validity.typeMismatch
        );
      case "phone":
        return !/^\+[1-9]\d{0,2}[ -]?\d[\d ()-]{5,17}$/.test(value(name));
      case "website": {
        if (!value(name)) return false;
        try {
          const url = new URL(value(name));
          return (
            !["http:", "https:"].includes(url.protocol) ||
            !url.hostname ||
            !/^https?:\/\//i.test(value(name))
          );
        } catch {
          return true;
        }
      }
      case "country":
        return !["United States", "Spain", "Both", "Other"].includes(
          value(name),
        );
      case "product_type":
        return ![
          "Fashion",
          "Electronics",
          "Cosmetics",
          "Food",
          "Other",
        ].includes(value(name));
      case "monthly_volume":
        return !["0-100", "101-500", "501-2000", "2000+", "Not sure"].includes(
          value(name),
        );
      case "services":
        return !controls(name).some(
          (el) =>
            el.checked &&
            ["Warehousing", "Last mile", "Reverse logistics"].includes(
              el.value,
            ),
        );
      case "current_3pl":
        return !controls(name).some(
          (el) =>
            el.checked &&
            ["Yes", "No", "Evaluating options"].includes(el.value),
        );
      case "comments":
        return controls(name)[0].value.length > 500;
      case "privacy":
        return !controls(name)[0].checked;
      default:
        return false;
    }
  }
  function validate(name) {
    const bad = invalid(name);
    const error = document.getElementById(`${name}-error`);
    const lang = document.documentElement.lang;
    error.textContent = bad
      ? messages[lang][name] +
        (name === "comments"
          ? ` (${500 - controls(name)[0].value.length} ${messages[lang].remaining})`
          : "")
      : "";
    error.hidden = !bad;
    controls(name).forEach((el) =>
      el.setAttribute("aria-invalid", String(bad)),
    );
    return !bad;
  }
  function updateSummary() {
    summary.hidden = !attempted || !names.some(invalid);
    summary.textContent = summary.hidden
      ? ""
      : messages[document.documentElement.lang].summary;
  }
  function updateCounter() {
    document.getElementById("comments-counter").textContent =
      `${controls("comments")[0].value.length} / 500`;
  }
  function updateWarning() {
    const relevant =
      value("monthly_volume") === "0-100" && !invalid("product_type");
    warning.hidden = !relevant;
    if (!relevant) confirm.checked = false;
  }
  form.addEventListener("focusout", (event) => {
    const name = event.target.name;
    if (!names.includes(name)) return;
    // Do not mark a group invalid while moving between its own choices.
    if (
      ["services", "current_3pl"].includes(name) &&
      event.relatedTarget?.name === name
    )
      return;
    touched.add(name);
    validate(name);
    updateSummary();
  });
  function onEdit(event) {
    success.hidden = true;
    const name = event.target.name;
    if (!names.includes(name)) return;
    if (touched.has(name) || attempted) validate(name);
    if (name === "comments") updateCounter();
    if (["monthly_volume", "product_type"].includes(name)) {
      confirm.checked = false;
      updateWarning();
    }
    updateSummary();
  }
  form.addEventListener("input", onEdit);
  form.addEventListener("change", onEdit);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    attempted = true;
    success.hidden = true;
    const errors = names.filter((name) => {
      touched.add(name);
      return !validate(name);
    });
    updateSummary();
    updateWarning();
    if (errors.length) {
      controls(errors[0])[0].focus();
      return;
    }
    if (!warning.hidden && !confirm.checked) {
      confirm.focus();
      return;
    }
    success.hidden = false;
    success.focus();
  });
  form.addEventListener("reset", () => {
    attempted = false;
    touched.clear();
    names.forEach((name) => {
      const error = document.getElementById(`${name}-error`);
      error.hidden = true;
      error.textContent = "";
      controls(name).forEach((el) => el.removeAttribute("aria-invalid"));
    });
    summary.hidden = true;
    summary.textContent = "";
    success.hidden = true;
    warning.hidden = true;
    confirm.checked = false;
    document.getElementById("comments-counter").textContent = "0 / 500";
  });
  document.addEventListener("languagechange", () => {
    touched.forEach(validate);
    updateSummary();
    updateCounter();
  });
  // Clear browser-restored form entries: only language preference is persisted.
  window.addEventListener("pageshow", () => form.reset());
  updateCounter();
})();
