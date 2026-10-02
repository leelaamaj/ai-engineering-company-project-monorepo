(() => {
  "use strict";
  const copy = {
    t0: {
      en: "Logistics that scales with your e-commerce",
      es: "Logística que crece con tu e-commerce",
    },
    t1: {
      en: "Warehouse management, last-mile deliveries, and reverse logistics in the United States and Spain. Over 15 years helping fashion, electronics, and cosmetics brands grow without worrying about operations.",
      es: "Gestión de almacenes, entregas de última milla y logística inversa en Estados Unidos y España. Más de 15 años ayudando a marcas de moda, electrónica y cosmética a crecer sin preocuparse por las operaciones.",
    },
    t2: { en: "Request information", es: "Solicitar información" },
    t3: { en: "Our services", es: "Nuestros servicios" },
    t4: { en: "Warehouse Management", es: "Gestión de almacenes" },
    t5: {
      en: "Storage, picking and packing",
      es: "Almacenamiento, preparación y embalaje",
    },
    t6: { en: "Real-time inventory", es: "Inventario en tiempo real" },
    t7: {
      en: "We operate warehouses in Los Angeles and Zaragoza",
      es: "Almacenes en Los Ángeles y Zaragoza",
    },
    t8: { en: "Last-Mile Deliveries", es: "Entregas de última milla" },
    t9: {
      en: "Certified carrier network in both countries",
      es: "Red de transportistas certificados en ambos países",
    },
    t10: {
      en: "Unified shipment tracking",
      es: "Seguimiento unificado de envíos",
    },
    t11: {
      en: "Incident and returns management",
      es: "Gestión de incidencias y devoluciones",
    },
    t12: { en: "Reverse Logistics", es: "Logística inversa" },
    t13: {
      en: "Complete returns management",
      es: "Gestión integral de devoluciones",
    },
    t14: {
      en: "Inspection and reconditioning",
      es: "Inspección y reacondicionamiento",
    },
    t15: {
      en: "Integration with your sales platform",
      es: "Integración con tu plataforma de ventas",
    },
    t16: { en: "Coverage", es: "Cobertura" },
    t17: { en: "United States", es: "Estados Unidos" },
    t18: { en: "Warehouse in Los Angeles", es: "Almacén en Los Ángeles" },
    t19: { en: "National coverage", es: "Cobertura nacional" },
    t20: { en: "Carriers", es: "Transportistas" },
    t21: { en: "Spain", es: "España" },
    t22: { en: "Warehouse in Zaragoza", es: "Almacén en Zaragoza" },
    t23: {
      en: "Peninsular and island coverage",
      es: "Cobertura peninsular e insular",
    },
    t24: { en: "Carriers", es: "Transportistas" },
    t25: { en: "Why TrackFlow", es: "Por qué TrackFlow" },
    t26: { en: "Binational operation", es: "Operación binacional" },
    t27: {
      en: "The only operator with own infrastructure in the United States and Spain",
      es: "El único operador con infraestructura propia en Estados Unidos y España",
    },
    t28: { en: "130+ professionals", es: "Más de 130 profesionales" },
    t29: { en: "Dedicated to your logistics", es: "Dedicados a tu logística" },
    t30: { en: "Own technology", es: "Tecnología propia" },
    t31: {
      en: "For total visibility of your inventory",
      es: "Para una visibilidad total de tu inventario",
    },
    t32: {
      en: "E-commerce specialization",
      es: "Especialización en e-commerce",
    },
    t33: {
      en: "Fashion, electronics, and cosmetics",
      es: "Moda, electrónica y cosmética",
    },
    t34: { en: "Let’s talk", es: "Hablemos" },
    t35: {
      en: "Tell us about your logistics needs.",
      es: "Cuéntanos tus necesidades logísticas.",
    },
    t36: { en: "Los Angeles", es: "Los Ángeles" },
    t37: { en: "Request information", es: "Solicitar información" },
    t38: { en: "Home", es: "Inicio" },
    t39: { en: "Services", es: "Servicios" },
    t40: { en: "Coverage", es: "Cobertura" },
    t41: { en: "Contact", es: "Contacto" },
    t42: { en: "Skip to content", es: "Saltar al contenido" },
    t43: {
      en: "© 2025 TrackFlow. All rights reserved.",
      es: "© 2025 TrackFlow. Todos los derechos reservados.",
    },
    t44: { en: "Request information", es: "Solicitar información" },
    t45: {
      en: "Tell us about your business and logistics needs.",
      es: "Cuéntanos sobre tu empresa y tus necesidades logísticas.",
    },
    t46: {
      en: "Demo form: use sample details. Information stays in your browser and is not sent.",
      es: "Formulario de demostración: usa datos de ejemplo. La información permanece en tu navegador y no se envía.",
    },
    t47: {
      en: "Fields marked * are required.",
      es: "Los campos marcados con * son obligatorios.",
    },
    t48: {
      en: "Company and contact details",
      es: "Datos de empresa y contacto",
    },
    t49: { en: "Company name", es: "Nombre de la empresa" },
    t50: { en: "Contact person", es: "Persona de contacto" },
    t51: { en: "Corporate email", es: "Correo corporativo" },
    t52: { en: "Phone", es: "Teléfono" },
    t53: { en: "Company website", es: "Sitio web de la empresa" },
    t54: { en: "(optional)", es: "(opcional)" },
    t55: { en: "Main operating country", es: "País principal de operación" },
    t56: { en: "Select an option", es: "Selecciona una opción" },
    t57: { en: "United States", es: "Estados Unidos" },
    t58: { en: "Spain", es: "España" },
    t59: { en: "Both", es: "Ambos" },
    t60: { en: "Other", es: "Otro" },
    t61: { en: "Logistics needs", es: "Necesidades logísticas" },
    t62: { en: "Product type", es: "Tipo de producto" },
    t63: { en: "Select an option", es: "Selecciona una opción" },
    t64: { en: "Fashion", es: "Moda" },
    t65: { en: "Electronics", es: "Electrónica" },
    t66: { en: "Cosmetics", es: "Cosmética" },
    t67: { en: "Food", es: "Alimentos" },
    t68: { en: "Other", es: "Otro" },
    t69: {
      en: "Estimated monthly shipping volume",
      es: "Volumen mensual estimado de envíos",
    },
    t70: { en: "Select an option", es: "Selecciona una opción" },
    t71: { en: "0-100", es: "0-100" },
    t72: { en: "101-500", es: "101-500" },
    t73: { en: "501-2000", es: "501-2000" },
    t74: { en: "2000+", es: "2000+" },
    t75: { en: "Not sure", es: "No lo sé" },
    t76: { en: "Services of interest", es: "Servicios de interés" },
    t77: { en: "Warehousing", es: "Almacenamiento" },
    t78: { en: "Last mile", es: "Última milla" },
    t79: { en: "Reverse logistics", es: "Logística inversa" },
    t80: {
      en: "Do you currently work with another 3PL?",
      es: "¿Trabajas actualmente con otro proveedor logístico (3PL)?",
    },
    t81: { en: "Yes", es: "Sí" },
    t82: { en: "No", es: "No" },
    t83: { en: "Evaluating options", es: "Evaluando opciones" },
    t84: {
      en: "Comments or specific needs",
      es: "Comentarios o necesidades específicas",
    },
    t85: { en: "(optional)", es: "(opcional)" },
    t86: { en: "Privacy and consent", es: "Privacidad y consentimiento" },
    t87: {
      en: "Read the privacy policy for this demo",
      es: "Lee la política de privacidad de esta demostración",
    },
    t88: {
      en: "This educational prototype validates entries locally. It does not send, save, or share your company or contact details. Only your language preference is stored on this device. Clear the form or leave the page to discard the entries. A production privacy policy and secure submission service are required before collecting real inquiries.",
      es: "Este prototipo educativo valida los datos localmente. No envía, guarda ni comparte los datos de tu empresa o contacto. Solo se guarda tu preferencia de idioma en este dispositivo. Borra el formulario o sal de la página para descartar los datos. Se necesitan una política de privacidad de producción y un servicio de envío seguro antes de recopilar consultas reales.",
    },
    t89: {
      en: "I accept the privacy policy",
      es: "Acepto la política de privacidad",
    },
    t90: {
      en: "For volumes under 100 monthly shipments, our services might not be the most efficient solution. Are you sure you want to continue?",
      es: "Para volúmenes inferiores a 100 envíos mensuales, nuestros servicios podrían no ser la solución más eficiente. ¿Seguro que quieres continuar?",
    },
    t91: {
      en: "Yes, continue with my request",
      es: "Sí, continuar con mi solicitud",
    },
    t92: { en: "Request information", es: "Solicitar información" },
    t93: { en: "Clear form", es: "Borrar formulario" },
    t94: {
      en: "Thank you for your interest in TrackFlow!",
      es: "¡Gracias por tu interés en TrackFlow!",
    },
    t95: {
      en: "We have received your request. Our commercial team will review your information and contact you within the next 24-48 hours to schedule a call and learn about your logistics needs in detail.",
      es: "Hemos recibido tu solicitud. Nuestro equipo comercial revisará tu información y te contactará en las próximas 24-48 horas para programar una llamada y conocer en detalle tus necesidades logísticas.",
    },
    t96: {
      en: "If you have any urgent inquiry, write to us directly at",
      es: "Si tienes alguna consulta urgente, escríbenos directamente a",
    },
    t97: {
      en: "Simulation complete. No request was actually sent.",
      es: "Simulación completada. No se ha enviado ninguna solicitud.",
    },
    t98: { en: "Home", es: "Inicio" },
    t99: { en: "Services", es: "Servicios" },
    t100: { en: "Coverage", es: "Cobertura" },
    t101: { en: "Contact", es: "Contacto" },
    t102: { en: "Skip to content", es: "Saltar al contenido" },
    t103: {
      en: "© 2025 TrackFlow. All rights reserved.",
      es: "© 2025 TrackFlow. Todos los derechos reservados.",
    },
  };
  const labels = {
    en: { nav: "Main navigation", language: "Language" },
    es: { nav: "Navegación principal", language: "Idioma" },
  };
  const metadata = {
    en: {
      homeTitle:
        "TrackFlow | E-commerce logistics in the United States and Spain",
      formTitle: "Request information | TrackFlow",
      homeDescription:
        "Warehouse management, last-mile deliveries, and reverse logistics in the United States and Spain. Request information from TrackFlow.",
      formDescription:
        "Tell TrackFlow about your e-commerce logistics needs in the United States and Spain.",
    },
    es: {
      homeTitle:
        "TrackFlow | Logística para e-commerce en Estados Unidos y España",
      formTitle: "Solicitar información | TrackFlow",
      homeDescription:
        "Gestión de almacenes, entregas de última milla y logística inversa en Estados Unidos y España. Solicita información a TrackFlow.",
      formDescription:
        "Cuéntale a TrackFlow tus necesidades logísticas de e-commerce en Estados Unidos y España.",
    },
  };
  function setLanguage(lang) {
    lang = lang === "es" ? "es" : "en";
    document.documentElement.lang = lang;
    const email = document.getElementById("email");
    if (email)
      email.placeholder =
        lang === "es" ? "nombre@empresa.com" : "name@company.com";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = copy[el.dataset.i18n][lang];
    });
    document
      .querySelectorAll("[data-i18n-aria]")
      .forEach((el) =>
        el.setAttribute("aria-label", labels[lang][el.dataset.i18nAria]),
      );
    document
      .querySelectorAll("[data-language]")
      .forEach((el) =>
        el.setAttribute("aria-pressed", String(el.dataset.language === lang)),
      );
    const form = Boolean(document.getElementById("inquiry-form"));
    document.title = metadata[lang][form ? "formTitle" : "homeTitle"];
    document.querySelector('meta[name="description"]').content =
      metadata[lang][form ? "formDescription" : "homeDescription"];
    try {
      localStorage.setItem("trackflow-language", lang);
    } catch {
      /* Storage is optional. */
    }
    document.dispatchEvent(new CustomEvent("languagechange", { detail: lang }));
  }
  let saved = "en";
  try {
    saved = localStorage.getItem("trackflow-language") || "en";
  } catch {
    /* Default remains English. */
  }
  document
    .querySelectorAll("[data-language]")
    .forEach((el) =>
      el.addEventListener("click", () => setLanguage(el.dataset.language)),
    );
  setLanguage(saved);
})();
