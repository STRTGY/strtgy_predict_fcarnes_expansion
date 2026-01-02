/**
 * Componentes de UI para el Dashboard FCarnes
 * KPIs, tablas, formatters y badges
 * v2.0 - Diseño mejorado basado en mejores prácticas Observable
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
 * Formatea número compacto (K, M)
 * @param {number} value - Valor a formatear
 * @returns {string} Número compacto
 */
export function formatCompact(value) {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString("es-MX");
}

/**
 * Paleta de colores semánticos
 */
export const COLORS = {
  primary: { value: "#C41E3A", bg: "#FEF5F5", border: "#C41E3A", light: "#FFEBEE" },
  success: { value: "#2E7D32", bg: "#E8F5E9", border: "#4CAF50", light: "#C8E6C9" },
  info: { value: "#1565C0", bg: "#E3F2FD", border: "#2196F3", light: "#BBDEFB" },
  warning: { value: "#E65100", bg: "#FFF3E0", border: "#FF9800", light: "#FFE0B2" },
  neutral: { value: "#455A64", bg: "#ECEFF1", border: "#78909C", light: "#CFD8DC" }
};

/**
 * Crea tarjetas de KPI con colores semánticos y contexto
 * @param {Array} kpis - Array de objetos {label, value, subtitle?, color?, trend?, icon?}
 * @returns {HTMLElement} Contenedor de KPIs
 */
export function kpi(kpis) {
  const container = document.createElement("div");
  container.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  `;

  for (const item of kpis) {
    const colors = COLORS[item.color || "primary"];
    
    const card = document.createElement("div");
    card.className = "card kpi-card";
    card.style.cssText = `
      text-align: center;
      padding: 1.25rem 1rem;
      background: linear-gradient(135deg, ${colors.bg} 0%, #fff 100%);
      border-left: 4px solid ${colors.border};
      border-radius: 0 8px 8px 0;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    `;

    // Indicador de tendencia
    let trendHtml = '';
    if (item.trend !== undefined && item.trend !== null) {
      const trendColor = item.trend > 0 ? '#4CAF50' : item.trend < 0 ? '#F44336' : '#9E9E9E';
      const trendIcon = item.trend > 0 ? '↑' : item.trend < 0 ? '↓' : '→';
      trendHtml = `<span style="
        font-size: 0.85rem;
        color: ${trendColor};
        margin-left: 0.5rem;
        font-weight: 600;
      ">${trendIcon} ${Math.abs(item.trend)}%</span>`;
    }

    // Icono opcional
    const iconHtml = item.icon ? `<span style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;">${item.icon}</span>` : '';

    card.innerHTML = `
      ${iconHtml}
      <div style="font-size: 2rem; font-weight: 700; color: ${colors.value}; line-height: 1.2;">
        ${item.value}${trendHtml}
      </div>
      <div style="font-size: 0.8rem; color: #555; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0.5rem;">
        ${item.label}
      </div>
      ${item.subtitle ? `<div style="font-size: 0.75rem; color: #888; margin-top: 0.25rem;">${item.subtitle}</div>` : ''}
    `;

    container.appendChild(card);
  }

  return container;
}

/**
 * Crea un "Big Number" prominente con contexto opcional
 * @param {Object} options - {value, label, subtitle?, color?, icon?}
 * @returns {HTMLElement} Big number element
 */
export function bigNumber(options = {}) {
  const {
    value = "0",
    label = "Métrica",
    subtitle = "",
    color = "primary",
    icon = ""
  } = options;

  const colors = COLORS[color] || COLORS.primary;

  const container = document.createElement("div");
  container.className = "card";
  container.style.cssText = `
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, ${colors.bg} 0%, #fff 100%);
    border-bottom: 4px solid ${colors.border};
  `;

  container.innerHTML = `
    ${icon ? `<div style="font-size: 2rem; margin-bottom: 0.5rem;">${icon}</div>` : ''}
    <div style="font-size: 3rem; font-weight: 800; color: ${colors.value}; line-height: 1;">
      ${value}
    </div>
    <div style="font-size: 1rem; color: #555; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 0.75rem;">
      ${label}
    </div>
    ${subtitle ? `<div style="font-size: 0.85rem; color: #888; margin-top: 0.5rem;">${subtitle}</div>` : ''}
  `;

  return container;
}

/**
 * Crea una mini-stat card horizontal
 * @param {Object} options - {value, label, color?, icon?}
 * @returns {HTMLElement} Mini stat element
 */
export function miniStat(options = {}) {
  const { value = "0", label = "", color = "primary", icon = "" } = options;
  const colors = COLORS[color] || COLORS.primary;

  const stat = document.createElement("div");
  stat.style.cssText = `
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: ${colors.bg};
    border-radius: 8px;
    border-left: 3px solid ${colors.border};
  `;

  stat.innerHTML = `
    ${icon ? `<span style="font-size: 1.25rem;">${icon}</span>` : ''}
    <div>
      <div style="font-size: 1.25rem; font-weight: 700; color: ${colors.value};">${value}</div>
      <div style="font-size: 0.7rem; color: #666; text-transform: uppercase;">${label}</div>
    </div>
  `;

  return stat;
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
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.5px;
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
    "CENTRO": { bg: "#1565C0", text: "#fff" },
    "GOLFO_SURESTE": { bg: "#2E7D32", text: "#fff" },
    "OCCIDENTE": { bg: "#7B1FA2", text: "#fff" },
    "BAJIO": { bg: "#F57C00", text: "#fff" },
    "PENINSULA": { bg: "#00838F", text: "#fff" },
    "FRONTERA_NORTE": { bg: "#5D4037", text: "#fff" },
    "NOROESTE": { bg: "#546E7A", text: "#fff" },
    "OTRA": { bg: "#9E9E9E", text: "#fff" }
  };

  const style = colors[region] || { bg: "#e0e0e0", text: "#333" };

  const badge = document.createElement("span");
  badge.style.cssText = `
    background: ${style.bg};
    color: ${style.text};
    padding: 4px 10px;
    border-radius: 12px;
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
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  `;
  badge.textContent = zona || "N/A";

  return badge;
}

/**
 * Crea una nota/callout informativa mejorada
 * @param {string} type - Tipo: info, warning, success, tip
 * @param {string} title - Título
 * @param {string} content - Contenido
 * @returns {HTMLElement} Note element
 */
export function note(type, title, content) {
  const styles = {
    info: { bg: "#E3F2FD", border: "#2196F3", icon: "💡", titleColor: "#1565C0" },
    warning: { bg: "#FFF3E0", border: "#FF9800", icon: "⚠️", titleColor: "#E65100" },
    success: { bg: "#E8F5E9", border: "#4CAF50", icon: "✅", titleColor: "#2E7D32" },
    tip: { bg: "#F3E5F5", border: "#9C27B0", icon: "🎯", titleColor: "#7B1FA2" },
    highlight: { bg: "#FFF8E1", border: "#FFC107", icon: "⭐", titleColor: "#F57F17" }
  };

  const style = styles[type] || styles.info;

  const noteEl = document.createElement("div");
  noteEl.className = "note-callout";
  noteEl.style.cssText = `
    background: ${style.bg};
    border-left: 4px solid ${style.border};
    padding: 1rem 1.25rem;
    margin: 1rem 0;
    border-radius: 0 8px 8px 0;
  `;

  noteEl.innerHTML = `
    <p style="margin: 0; font-weight: 600; color: ${style.titleColor}; display: flex; align-items: center; gap: 0.5rem;">
      <span>${style.icon}</span> ${title}
    </p>
    <p style="margin: 0.5rem 0 0 0; color: #555; line-height: 1.5;">${content}</p>
  `;

  return noteEl;
}

/**
 * Crea una tarjeta de navegación con hover effect
 * @param {Object} options - {href, icon, title, description, stats?}
 * @returns {HTMLElement} Nav card element
 */
export function navCard(options = {}) {
  const { href = "#", icon = "📊", title = "Título", description = "", stats = "" } = options;

  const card = document.createElement("a");
  card.href = href;
  card.className = "card nav-card";
  card.style.cssText = `
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    border-radius: 8px;
  `;

  card.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 1rem;">
      <div style="font-size: 2.5rem; line-height: 1;">${icon}</div>
      <div style="flex: 1;">
        <h3 style="margin: 0; color: #C41E3A; font-size: 1.1rem; font-weight: 700;">${title}</h3>
        <p style="margin: 0.25rem 0 0; color: #666; font-size: 0.85rem; line-height: 1.4;">${description}</p>
        ${stats ? `<div style="margin-top: 0.75rem; font-size: 0.8rem; color: #888; font-weight: 500;">${stats}</div>` : ''}
      </div>
      <div style="color: #C41E3A; font-size: 1.25rem;">→</div>
    </div>
  `;

  // Hover effects via JS (CSS would be better but this works)
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
    card.style.boxShadow = '0 8px 25px rgba(196, 30, 58, 0.15)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '';
  });

  return card;
}

/**
 * Crea un separador con título
 * @param {string} title - Título de la sección
 * @param {string} subtitle - Subtítulo opcional
 * @returns {HTMLElement} Section header
 */
export function sectionHeader(title, subtitle = "") {
  const header = document.createElement("div");
  header.style.cssText = `
    margin: 2rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #eee;
  `;

  header.innerHTML = `
    <h2 style="margin: 0; color: #333; font-size: 1.4rem; font-weight: 700;">${title}</h2>
    ${subtitle ? `<p style="margin: 0.25rem 0 0; color: #666; font-size: 0.9rem;">${subtitle}</p>` : ''}
  `;

  return header;
}
