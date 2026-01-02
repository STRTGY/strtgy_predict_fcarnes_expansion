/**
 * Componentes de branding STRTGY para FCarnes
 * Hero, callouts y elementos de marca
 */

/**
 * Crea el hero principal del dashboard
 * @param {Object} options - Opciones del hero
 * @returns {HTMLElement} Hero element
 */
export function heroFCarnes(options = {}) {
  const {
    title = "Censo Estratégico Nacional",
    subtitle = "Expansión comercial basada en datos",
    context = ""
  } = options;

  const hero = document.createElement("div");
  hero.style.cssText = `
    text-align: center;
    padding: 2.5rem 1rem;
    background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%);
    color: white;
    border-radius: 8px;
    margin-bottom: 2rem;
  `;

  const titleEl = document.createElement("h1");
  titleEl.style.cssText = `
    margin: 0;
    font-size: 2.2rem;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  `;
  titleEl.textContent = title;

  const subtitleEl = document.createElement("p");
  subtitleEl.style.cssText = `
    margin: 0.5rem 0 0;
    font-size: 1.1rem;
    opacity: 0.9;
  `;
  subtitleEl.textContent = subtitle;

  hero.appendChild(titleEl);
  hero.appendChild(subtitleEl);

  if (context) {
    const contextEl = document.createElement("p");
    contextEl.style.cssText = `
      margin: 1rem auto 0;
      max-width: 700px;
      font-size: 0.95rem;
      opacity: 0.85;
      line-height: 1.5;
    `;
    contextEl.textContent = context;
    hero.appendChild(contextEl);
  }

  return hero;
}

/**
 * Crea un callout de decisión/acción
 * @param {Object} options - Opciones
 * @returns {HTMLElement} Callout element
 */
export function decisionCallout(options = {}) {
  const {
    title = "¿Qué decidir con este análisis?",
    items = []
  } = options;

  const callout = document.createElement("div");
  callout.className = "card";
  callout.style.cssText = `
    border-left: 4px solid #C41E3A;
    background: linear-gradient(135deg, #fff 0%, #fef5f5 100%);
  `;

  const titleEl = document.createElement("h3");
  titleEl.style.cssText = `
    margin: 0 0 1rem;
    color: #C41E3A;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `;
  titleEl.innerHTML = `<span style="font-size: 1.3rem;">🎯</span> ${title}`;

  const list = document.createElement("ul");
  list.style.cssText = `
    margin: 0;
    padding-left: 1.5rem;
    color: #444;
  `;

  for (const item of items) {
    const li = document.createElement("li");
    li.style.cssText = "margin-bottom: 0.5rem; line-height: 1.5;";
    li.textContent = item;
    list.appendChild(li);
  }

  callout.appendChild(titleEl);
  callout.appendChild(list);

  return callout;
}

/**
 * Crea un callout de insight
 * @param {Object} options - Opciones
 * @returns {HTMLElement} Callout element
 */
export function insightCallout(options = {}) {
  const {
    title = "Insight Clave",
    content = "",
    type = "highlight" // highlight, warning, success
  } = options;

  const colors = {
    highlight: { bg: "#FFF8E1", border: "#FFC107", icon: "💡" },
    warning: { bg: "#FFF3E0", border: "#FF9800", icon: "⚠️" },
    success: { bg: "#E8F5E9", border: "#4CAF50", icon: "✅" }
  };

  const style = colors[type] || colors.highlight;

  const callout = document.createElement("div");
  callout.style.cssText = `
    background: ${style.bg};
    border-left: 4px solid ${style.border};
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
    border-radius: 0 8px 8px 0;
  `;

  const titleEl = document.createElement("strong");
  titleEl.style.cssText = "display: block; margin-bottom: 0.5rem;";
  titleEl.textContent = `${style.icon} ${title}`;

  const contentEl = document.createElement("span");
  contentEl.style.cssText = "color: #555; line-height: 1.5;";
  contentEl.textContent = content;

  callout.appendChild(titleEl);
  callout.appendChild(contentEl);

  return callout;
}

/**
 * Crea una sección de cobertura geográfica
 * @param {Object} regiones - Objeto con regiones y estados
 * @returns {HTMLElement} Sección de cobertura
 */
export function coberturaGeografica(regiones = {}) {
  const defaultRegiones = {
    "NORESTE": "Nuevo León, Tamaulipas, Coahuila",
    "FRONTERA_NORTE": "Chihuahua, Baja California, Sonora",
    "BAJIO": "Guanajuato, Querétaro, Aguascalientes",
    "OCCIDENTE": "Jalisco, Colima, Nayarit, Michoacán",
    "NOROESTE": "Sinaloa, Durango, Zacatecas",
    "CENTRO": "CDMX, Estado de México"
  };

  const data = Object.keys(regiones).length ? regiones : defaultRegiones;

  const container = document.createElement("div");
  container.className = "card";
  container.style.cssText = "border-left: 4px solid #2196F3;";

  const title = document.createElement("h3");
  title.style.cssText = `
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `;
  title.innerHTML = `<span style="font-size: 1.2rem;">📍</span> Cobertura Geográfica`;

  const list = document.createElement("ul");
  list.style.cssText = `
    margin: 0;
    padding: 0;
    list-style: none;
  `;

  const regionColors = {
    "NORESTE": "#C41E3A",
    "FRONTERA_NORTE": "#1565C0",
    "BAJIO": "#2E7D32",
    "OCCIDENTE": "#7B1FA2",
    "NOROESTE": "#F57C00",
    "CENTRO": "#00838F",
    "GOLFO_SURESTE": "#6A1B9A",
    "PENINSULA": "#00695C"
  };

  for (const [region, estados] of Object.entries(data)) {
    const li = document.createElement("li");
    li.style.cssText = "margin-bottom: 0.75rem; display: flex; align-items: flex-start; gap: 0.5rem;";

    const dot = document.createElement("span");
    dot.style.cssText = `
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${regionColors[region] || "#666"};
      margin-top: 5px;
      flex-shrink: 0;
    `;

    const text = document.createElement("span");
    text.innerHTML = `<strong>${region}:</strong> ${estados}`;

    li.appendChild(dot);
    li.appendChild(text);
    list.appendChild(li);
  }

  container.appendChild(title);
  container.appendChild(list);

  return container;
}

/**
 * Crea el footer de STRTGY
 * @returns {HTMLElement} Footer element
 */
export function strtgyFooter() {
  const footer = document.createElement("div");
  footer.style.cssText = `
    text-align: center;
    padding: 2rem 0;
    margin-top: 3rem;
    border-top: 1px solid #eee;
    color: #999;
    font-size: 0.85rem;
  `;

  footer.innerHTML = `
    <strong>STRTGY</strong> — Transformando complejidad en certeza<br>
    <span style="font-size: 0.8rem;">Proyecto FCarnes | Enero 2026</span>
  `;

  return footer;
}

