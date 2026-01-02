/**
 * Componentes de UI para el Dashboard FCarnes
 * KPIs, tablas, formatters y badges
 */

/**
 * Formatea un número con separador de miles
 * @param {number} value - Valor a formatear
 * @returns {string} Número formateado
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  return value.toLocaleString("es-MX");
}

/**
 * Formatea un porcentaje
 * @param {number} value - Valor entre 0-100
 * @param {number} decimals - Decimales
 * @returns {string} Porcentaje formateado
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formatea distancia en km
 * @param {number} value - Distancia en km
 * @returns {string} Distancia formateada
 */
export function formatDistance(value) {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  return `${Math.round(value)} km`;
}

/**
 * Crea una tarjeta de KPI
 * @param {Array} kpis - Array de objetos {label, value, subtitle?}
 * @returns {HTMLElement} Contenedor de KPIs
 */
export function kpi(kpis) {
  const container = document.createElement("div");
  container.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
  `;

  for (const item of kpis) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.cssText = `
      text-align: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
      border-left: 4px solid #C41E3A;
    `;

    const valueEl = document.createElement("div");
    valueEl.style.cssText = `
      font-size: 2rem;
      font-weight: 700;
      color: #C41E3A;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    `;
    valueEl.textContent = item.value;

    const labelEl = document.createElement("div");
    labelEl.style.cssText = `
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;
    labelEl.textContent = item.label;

    card.appendChild(valueEl);
    card.appendChild(labelEl);

    if (item.subtitle) {
      const subtitleEl = document.createElement("div");
      subtitleEl.style.cssText = `
        font-size: 0.8rem;
        color: #999;
        margin-top: 0.25rem;
      `;
      subtitleEl.textContent = item.subtitle;
      card.appendChild(subtitleEl);
    }

    container.appendChild(card);
  }

  return container;
}

/**
 * Crea un badge de tier/categoría
 * @param {string} tier - Tier (A_PREMIUM, B_ALTA, C_MEDIA, D_BAJA)
 * @returns {HTMLElement} Badge element
 */
export function tierBadge(tier) {
  const colors = {
    "A_PREMIUM": { bg: "#C41E3A", text: "#fff" },
    "B_ALTA": { bg: "#FF9800", text: "#fff" },
    "C_MEDIA": { bg: "#2196F3", text: "#fff" },
    "D_BAJA": { bg: "#9E9E9E", text: "#fff" }
  };

  const style = colors[tier] || { bg: "#e0e0e0", text: "#333" };

  const badge = document.createElement("span");
  badge.style.cssText = `
    background: ${style.bg};
    color: ${style.text};
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  `;
  badge.textContent = tier || "N/A";

  return badge;
}

/**
 * Crea un badge de macro-región
 * @param {string} region - Nombre de la macro-región
 * @returns {HTMLElement} Badge element
 */
export function regionBadge(region) {
  const colors = {
    "NORESTE": { bg: "#C41E3A", text: "#fff" },
    "FRONTERA_NORTE": { bg: "#1565C0", text: "#fff" },
    "BAJIO": { bg: "#2E7D32", text: "#fff" },
    "OCCIDENTE": { bg: "#7B1FA2", text: "#fff" },
    "NOROESTE": { bg: "#F57C00", text: "#fff" },
    "CENTRO": { bg: "#00838F", text: "#fff" },
    "OTRA": { bg: "#757575", text: "#fff" }
  };

  const style = colors[region] || { bg: "#e0e0e0", text: "#333" };

  const badge = document.createElement("span");
  badge.style.cssText = `
    background: ${style.bg};
    color: ${style.text};
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  `;
  badge.textContent = region || "N/A";

  return badge;
}

/**
 * Crea un badge de zona logística
 * @param {string} zona - Zona logística
 * @returns {HTMLElement} Badge element
 */
export function zonaBadge(zona) {
  const colors = {
    "LOCAL": { bg: "#4CAF50", text: "#fff" },
    "REGIONAL": { bg: "#2196F3", text: "#fff" },
    "FORANEA": { bg: "#FF9800", text: "#fff" },
    "LEJANA": { bg: "#F44336", text: "#fff" }
  };

  const style = colors[zona] || { bg: "#e0e0e0", text: "#333" };

  const badge = document.createElement("span");
  badge.style.cssText = `
    background: ${style.bg};
    color: ${style.text};
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  `;
  badge.textContent = zona || "N/A";

  return badge;
}

/**
 * Crea una nota/callout informativa
 * @param {string} type - Tipo: info, warning, success
 * @param {string} title - Título
 * @param {string} content - Contenido
 * @returns {HTMLElement} Note element
 */
export function note(type, title, content) {
  const styles = {
    info: { bg: "#E3F2FD", border: "#2196F3", icon: "💡" },
    warning: { bg: "#FFF3E0", border: "#FF9800", icon: "⚠️" },
    success: { bg: "#E8F5E9", border: "#4CAF50", icon: "✅" },
    tip: { bg: "#F3E5F5", border: "#9C27B0", icon: "🎯" }
  };

  const style = styles[type] || styles.info;

  const noteEl = document.createElement("div");
  noteEl.style.cssText = `
    background: ${style.bg};
    border-left: 4px solid ${style.border};
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0 4px 4px 0;
  `;

  const titleEl = document.createElement("p");
  titleEl.style.cssText = "margin: 0; font-weight: 600;";
  titleEl.textContent = `${style.icon} ${title}`;

  const contentEl = document.createElement("p");
  contentEl.style.cssText = "margin: 0.5rem 0 0 0; color: #555;";
  contentEl.textContent = content;

  noteEl.appendChild(titleEl);
  noteEl.appendChild(contentEl);

  return noteEl;
}

