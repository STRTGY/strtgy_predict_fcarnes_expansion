/**
 * Componentes de branding STRTGY para FCarnes
 * Hero, callouts y elementos de marca
 * v2.0 - Diseño mejorado basado en mejores prácticas Observable
 */

/**
 * Colores de la marca
 */
export const BRAND_COLORS = {
  primary: "#C41E3A",
  primaryDark: "#8B0000",
  secondary: "#1565C0",
  accent: "#FF9800",
  success: "#2E7D32",
  text: "#333",
  textLight: "#666",
  bg: "#FAFAFA"
};

/**
 * Colores por región
 */
export const REGION_COLORS = {
  "NORESTE": "#C41E3A",
  "CENTRO": "#1565C0",
  "GOLFO_SURESTE": "#2E7D32",
  "OCCIDENTE": "#7B1FA2",
  "BAJIO": "#F57C00",
  "PENINSULA": "#00838F",
  "FRONTERA_NORTE": "#5D4037",
  "NOROESTE": "#546E7A",
  "OTRA": "#9E9E9E"
};

/**
 * Crea el hero compacto del dashboard con métricas integradas
 * @param {Object} options - Opciones del hero
 * @returns {HTMLElement} Hero element
 */
export function heroFCarnes(options = {}) {
  const {
    title = "Censo Estratégico Nacional",
    subtitle = "Expansión comercial basada en datos",
    context = "",
    metrics = [] // Array de {value, label}
  } = options;

  const hero = document.createElement("div");
  hero.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 1.75rem 2rem;
    background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryDark} 100%);
    color: white;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 20px rgba(196, 30, 58, 0.3);
  `;

  // Contenido principal
  const mainContent = document.createElement("div");
  mainContent.style.cssText = "flex: 1; min-width: 280px;";
  
  mainContent.innerHTML = `
    <h1 style="margin: 0; font-size: 1.85rem; font-weight: 700; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">
      ${title}
    </h1>
    <p style="margin: 0.35rem 0 0; font-size: 1rem; opacity: 0.9;">${subtitle}</p>
    ${context ? `<p style="margin: 0.75rem 0 0; font-size: 0.85rem; opacity: 0.8; max-width: 500px; line-height: 1.4;">${context}</p>` : ''}
  `;

  hero.appendChild(mainContent);

  // Métricas en el hero (si se proporcionan)
  if (metrics.length > 0) {
    const metricsContainer = document.createElement("div");
    metricsContainer.style.cssText = `
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    `;

    for (const metric of metrics) {
      const metricEl = document.createElement("div");
      metricEl.style.cssText = `
        text-align: center;
        padding: 0 1rem;
        border-left: 1px solid rgba(255,255,255,0.3);
      `;
      metricEl.innerHTML = `
        <div style="font-size: 1.75rem; font-weight: 700;">${metric.value}</div>
        <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.85;">${metric.label}</div>
      `;
      metricsContainer.appendChild(metricEl);
    }

    hero.appendChild(metricsContainer);
  }

  return hero;
}

/**
 * Crea un callout de decisión/acción mejorado
 * @param {Object} options - Opciones
 * @returns {HTMLElement} Callout element
 */
export function decisionCallout(options = {}) {
  const {
    title = "¿Qué decidir con este análisis?",
    items = [],
    icon = "🎯"
  } = options;

  const callout = document.createElement("div");
  callout.className = "card";
  callout.style.cssText = `
    border-left: 4px solid ${BRAND_COLORS.primary};
    background: linear-gradient(135deg, #fff 0%, #fef5f5 100%);
    border-radius: 0 12px 12px 0;
  `;

  const titleEl = document.createElement("h3");
  titleEl.style.cssText = `
    margin: 0 0 1rem;
    color: ${BRAND_COLORS.primary};
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `;
  titleEl.innerHTML = `<span style="font-size: 1.3rem;">${icon}</span> ${title}`;

  const list = document.createElement("ul");
  list.style.cssText = `
    margin: 0;
    padding-left: 0;
    list-style: none;
    color: #444;
  `;

  for (const item of items) {
    const li = document.createElement("li");
    li.style.cssText = `
      margin-bottom: 0.6rem;
      padding-left: 1.5rem;
      position: relative;
      line-height: 1.5;
      font-size: 0.95rem;
    `;
    li.innerHTML = `<span style="position: absolute; left: 0; color: ${BRAND_COLORS.primary};">→</span> ${item}`;
    list.appendChild(li);
  }

  callout.appendChild(titleEl);
  callout.appendChild(list);

  return callout;
}

/**
 * Crea un callout de insight destacado
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
    highlight: { bg: "#FFF8E1", border: "#FFC107", icon: "💡", titleColor: "#F57F17" },
    warning: { bg: "#FFF3E0", border: "#FF9800", icon: "⚠️", titleColor: "#E65100" },
    success: { bg: "#E8F5E9", border: "#4CAF50", icon: "✅", titleColor: "#2E7D32" },
    info: { bg: "#E3F2FD", border: "#2196F3", icon: "ℹ️", titleColor: "#1565C0" }
  };

  const style = colors[type] || colors.highlight;

  const callout = document.createElement("div");
  callout.className = "insight-callout";
  callout.style.cssText = `
    background: ${style.bg};
    border-left: 4px solid ${style.border};
    padding: 1rem 1.25rem;
    margin: 1rem 0;
    border-radius: 0 8px 8px 0;
  `;

  callout.innerHTML = `
    <strong style="display: flex; align-items: center; gap: 0.5rem; color: ${style.titleColor}; margin-bottom: 0.5rem;">
      <span>${style.icon}</span> ${title}
    </strong>
    <span style="color: #555; line-height: 1.5; font-size: 0.95rem;">${content}</span>
  `;

  return callout;
}

/**
 * Crea una sección de cobertura geográfica mejorada
 * @param {Object} regiones - Objeto con regiones y estados
 * @returns {HTMLElement} Sección de cobertura
 */
export function coberturaGeografica(regiones = {}) {
  const container = document.createElement("div");
  container.className = "card";
  container.style.cssText = `
    border-left: 4px solid ${BRAND_COLORS.secondary};
    border-radius: 0 12px 12px 0;
  `;

  const title = document.createElement("h3");
  title.style.cssText = `
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
  `;
  title.innerHTML = `<span style="font-size: 1.2rem;">📍</span> Cobertura Geográfica`;

  const list = document.createElement("div");
  list.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.6rem;
  `;

  for (const [region, estados] of Object.entries(regiones)) {
    const item = document.createElement("div");
    item.style.cssText = `
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.9rem;
    `;

    const dot = document.createElement("span");
    dot.style.cssText = `
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${REGION_COLORS[region] || "#666"};
      margin-top: 5px;
      flex-shrink: 0;
    `;

    const text = document.createElement("span");
    text.innerHTML = `<strong style="color: #333;">${region}:</strong> <span style="color: #666;">${estados}</span>`;

    item.appendChild(dot);
    item.appendChild(text);
    list.appendChild(item);
  }

  container.appendChild(title);
  container.appendChild(list);

  return container;
}

/**
 * Crea tarjetas de navegación con hover effects
 * @param {Array} cards - Array de {href, icon, title, description, badge?}
 * @returns {HTMLElement} Contenedor de tarjetas
 */
export function navigationCards(cards = []) {
  const container = document.createElement("div");
  container.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  `;

  for (const card of cards) {
    const cardEl = document.createElement("a");
    cardEl.href = card.href || "#";
    cardEl.className = "card nav-card";
    cardEl.style.cssText = `
      text-decoration: none;
      color: inherit;
      display: block;
      padding: 1.5rem;
      transition: all 0.25s ease;
      cursor: pointer;
      border-radius: 12px;
      border: 1px solid #eee;
      position: relative;
      overflow: hidden;
    `;

    cardEl.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 1rem;">
        <div style="
          font-size: 2.25rem;
          line-height: 1;
          background: linear-gradient(135deg, #FEF5F5 0%, #fff 100%);
          padding: 0.75rem;
          border-radius: 12px;
        ">${card.icon || "📊"}</div>
        <div style="flex: 1;">
          <h3 style="margin: 0; color: ${BRAND_COLORS.primary}; font-size: 1.1rem; font-weight: 700;">
            ${card.title || "Título"}
          </h3>
          <p style="margin: 0.35rem 0 0; color: #666; font-size: 0.85rem; line-height: 1.4;">
            ${card.description || ""}
          </p>
          ${card.badge ? `<span style="
            display: inline-block;
            margin-top: 0.5rem;
            padding: 2px 8px;
            background: ${BRAND_COLORS.primary}15;
            color: ${BRAND_COLORS.primary};
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
          ">${card.badge}</span>` : ''}
        </div>
        <div style="color: ${BRAND_COLORS.primary}; font-size: 1.25rem; transition: transform 0.2s;">→</div>
      </div>
    `;

    // Hover effects
    cardEl.addEventListener('mouseenter', () => {
      cardEl.style.transform = 'translateY(-4px)';
      cardEl.style.boxShadow = `0 12px 30px rgba(196, 30, 58, 0.15)`;
      cardEl.style.borderColor = `${BRAND_COLORS.primary}40`;
    });
    cardEl.addEventListener('mouseleave', () => {
      cardEl.style.transform = 'translateY(0)';
      cardEl.style.boxShadow = '';
      cardEl.style.borderColor = '#eee';
    });

    container.appendChild(cardEl);
  }

  return container;
}

/**
 * Crea un resumen de métricas en línea
 * @param {Array} metrics - Array de {label, value, color?}
 * @returns {HTMLElement} Metrics bar
 */
export function metricsBar(metrics = []) {
  const bar = document.createElement("div");
  bar.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 1rem 0;
  `;

  for (const metric of metrics) {
    const item = document.createElement("div");
    item.style.cssText = `
      text-align: center;
      padding: 0 1rem;
    `;
    item.innerHTML = `
      <div style="font-size: 1.5rem; font-weight: 700; color: ${metric.color || BRAND_COLORS.primary};">
        ${metric.value}
      </div>
      <div style="font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
        ${metric.label}
      </div>
    `;
    bar.appendChild(item);
  }

  return bar;
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
    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
      <span style="font-weight: 700; color: ${BRAND_COLORS.primary};">STRTGY</span>
      <span>—</span>
      <span>Transformando complejidad en certeza</span>
    </div>
    <span style="font-size: 0.8rem;">Proyecto FCarnes | Enero 2026</span>
  `;

  return footer;
}

/**
 * Crea un divisor visual con texto
 * @param {string} text - Texto del divisor
 * @returns {HTMLElement} Divider element
 */
export function divider(text = "") {
  const div = document.createElement("div");
  div.style.cssText = `
    display: flex;
    align-items: center;
    margin: 2rem 0;
    gap: 1rem;
  `;

  if (text) {
    div.innerHTML = `
      <div style="flex: 1; height: 1px; background: #ddd;"></div>
      <span style="color: #888; font-size: 0.85rem; font-weight: 500;">${text}</span>
      <div style="flex: 1; height: 1px; background: #ddd;"></div>
    `;
  } else {
    div.innerHTML = `<div style="flex: 1; height: 1px; background: #ddd;"></div>`;
  }

  return div;
}
