/**
 * Utilidades para mapas Leaflet en el Dashboard FCarnes
 */

// Importar Leaflet desde npm
import * as L from "npm:leaflet@1.9.4";
export { L };

/**
 * Configuración por defecto del mapa
 */
export const MAP_CONFIG = {
  center: [23.6345, -102.5528], // Centro de México
  zoom: 5,
  minZoom: 4,
  maxZoom: 18,
  tileUrl: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
};

/**
 * Colores por tier de prospecto
 */
export const TIER_COLORS = {
  "A_PREMIUM": "#C41E3A",
  "B_ALTA": "#FF9800",
  "C_MEDIA": "#2196F3",
  "D_BAJA": "#9E9E9E"
};

/**
 * Colores por macro-región
 */
export const REGION_COLORS = {
  "NORESTE": "#C41E3A",
  "FRONTERA_NORTE": "#1565C0",
  "BAJIO": "#2E7D32",
  "OCCIDENTE": "#7B1FA2",
  "NOROESTE": "#F57C00",
  "CENTRO": "#00838F",
  "OTRA": "#757575"
};

/**
 * Colores por zona logística
 */
export const ZONA_COLORS = {
  "LOCAL": "#4CAF50",
  "REGIONAL": "#2196F3",
  "FORANEA": "#FF9800",
  "LEJANA": "#F44336"
};

/**
 * Crea un mapa base Leaflet
 * @param {HTMLElement} container - Contenedor del mapa
 * @param {Object} options - Opciones de configuración
 * @returns {L.Map} Instancia del mapa
 */
export function createBaseMap(container, options = {}) {
  const config = { ...MAP_CONFIG, ...options };

  const map = L.map(container, {
    center: config.center,
    zoom: config.zoom,
    minZoom: config.minZoom,
    maxZoom: config.maxZoom,
    scrollWheelZoom: true,
    zoomControl: true
  });

  // Agregar capa de tiles
  L.tileLayer(config.tileUrl, {
    attribution: config.tileAttribution,
    subdomains: "abcd",
    maxZoom: config.maxZoom
  }).addTo(map);

  return map;
}

/**
 * Agrega una capa GeoJSON al mapa
 * @param {L.Map} map - Instancia del mapa
 * @param {Object} geojson - Datos GeoJSON
 * @param {Object} options - Opciones de estilo y popup
 * @returns {L.GeoJSON} Capa GeoJSON
 */
export function addGeoJsonLayer(map, geojson, options = {}) {
  const {
    style = null,
    pointToLayer = null,
    onEachFeature = null,
    popupContent = null
  } = options;

  const layerOptions = {};

  if (style) {
    layerOptions.style = style;
  }

  if (pointToLayer) {
    layerOptions.pointToLayer = pointToLayer;
  }

  if (onEachFeature) {
    layerOptions.onEachFeature = onEachFeature;
  } else if (popupContent) {
    layerOptions.onEachFeature = (feature, layer) => {
      const content = typeof popupContent === "function"
        ? popupContent(feature.properties)
        : popupContent;
      layer.bindPopup(content);
    };
  }

  const layer = L.geoJSON(geojson, layerOptions).addTo(map);

  return layer;
}

/**
 * Crea un marcador circular estilizado
 * @param {Array} latlng - Coordenadas [lat, lng]
 * @param {Object} options - Opciones del marcador
 * @returns {L.CircleMarker} Marcador circular
 */
export function createCircleMarker(latlng, options = {}) {
  const {
    radius = 6,
    fillColor = "#C41E3A",
    color = "#fff",
    weight = 2,
    opacity = 1,
    fillOpacity = 0.8
  } = options;

  return L.circleMarker(latlng, {
    radius,
    fillColor,
    color,
    weight,
    opacity,
    fillOpacity
  });
}

/**
 * Genera el contenido del popup para un prospecto
 * @param {Object} props - Propiedades del prospecto
 * @returns {string} HTML del popup
 */
export function createProspectPopup(props) {
  // Generar URL de Street View correcto
  const lat = props.lat || props.latitud || 0;
  const lon = props.lon || props.longitud || 0;
  const streetViewUrl = props.url_streetview ||
    `https://www.google.com/maps/@${lat},${lon},3a,90y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`;

  const tierColor = TIER_COLORS[props.tier] || "#666";
  
  // Verificar si tiene análisis de IA
  const hasAI = props.ai_analizado === true || props.ai_confidence > 0;
  
  // Colores para scores de IA
  const getAIScoreColor = (score) => {
    if (score >= 8) return "#4CAF50";
    if (score >= 6) return "#FF9800";
    if (score >= 4) return "#FF5722";
    return "#9E9E9E";
  };

  // Sección de análisis de IA
  const aiSection = hasAI ? `
    <tr>
      <td colspan="2" style="padding: 8px 0 4px 0;">
        <div style="background: linear-gradient(135deg, #E8F5E9 0%, #fff 100%); border: 1px solid #4CAF50; border-radius: 6px; padding: 10px; margin-top: 8px;">
          <strong style="color: #2E7D32; display: flex; align-items: center; gap: 4px;">
            🤖 Análisis de IA (Street View)
          </strong>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
            <div style="text-align: center; padding: 6px; background: #fff; border-radius: 4px;">
              <div style="font-size: 1.2rem; font-weight: 700; color: ${getAIScoreColor(props.ai_scene_vitality || 0)};">
                ${props.ai_scene_vitality?.toFixed(1) || "—"}
              </div>
              <div style="font-size: 0.7rem; color: #666;">Vitalidad</div>
            </div>
            <div style="text-align: center; padding: 6px; background: #fff; border-radius: 4px;">
              <div style="font-size: 1.2rem; font-weight: 700; color: ${getAIScoreColor(props.ai_target_visibility || 0)};">
                ${props.ai_target_visibility?.toFixed(1) || "—"}
              </div>
              <div style="font-size: 0.7rem; color: #666;">Visibilidad</div>
            </div>
            <div style="text-align: center; padding: 6px; background: #fff; border-radius: 4px;">
              <div style="font-size: 1.2rem; font-weight: 700; color: ${getAIScoreColor(props.ai_target_facade || 0)};">
                ${props.ai_target_facade?.toFixed(1) || "—"}
              </div>
              <div style="font-size: 0.7rem; color: #666;">Fachada</div>
            </div>
            <div style="text-align: center; padding: 6px; background: #fff; border-radius: 4px;">
              <div style="font-size: 1.2rem; font-weight: 700; color: #1565C0;">
                ${(props.ai_confidence * 100)?.toFixed(0) || "—"}%
              </div>
              <div style="font-size: 0.7rem; color: #666;">Confianza</div>
            </div>
          </div>
          ${props.ai_score_promedio ? `
          <div style="text-align: center; margin-top: 8px; padding: 4px; background: ${getAIScoreColor(props.ai_score_promedio)}; border-radius: 4px; color: white; font-weight: 600;">
            Score IA: ${props.ai_score_promedio}/10
          </div>
          ` : ""}
        </div>
      </td>
    </tr>
  ` : `
    <tr>
      <td colspan="2" style="padding: 8px 0 4px 0;">
        <div style="background: #FFF3E0; border: 1px solid #FFB74D; border-radius: 6px; padding: 8px; margin-top: 8px; text-align: center; color: #E65100; font-size: 0.8rem;">
          ⏳ Pendiente de análisis IA
        </div>
      </td>
    </tr>
  `;

  return `
    <div style="min-width: 300px; font-family: system-ui, -apple-system, sans-serif; font-size: 0.9rem;">
      <h4 style="margin: 0 0 10px; color: #C41E3A; font-size: 1.1rem; border-bottom: 2px solid #C41E3A; padding-bottom: 8px;">
        ${props.nombre || props.nom_estab || "Sin nombre"}
      </h4>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 8px 4px 0; color: #666; width: 40%;"><strong>Categoría:</strong></td>
          <td style="padding: 4px 0;">${props.categoria_fcarnes || props.categoria || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Ciudad:</strong></td>
          <td style="padding: 4px 0;">${props.ciudad || props.nom_loc || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Región:</strong></td>
          <td style="padding: 4px 0;">${props.macro_region || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Zona:</strong></td>
          <td style="padding: 4px 0;">${props.zona_logistica || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Distancia:</strong></td>
          <td style="padding: 4px 0;">${props.distancia_planta_km ? Math.round(props.distancia_planta_km) + " km" : "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Tier:</strong></td>
          <td style="padding: 4px 0;">
            <span style="background: ${tierColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">
              ${props.tier || "N/A"}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Score:</strong></td>
          <td style="padding: 4px 0;"><strong style="font-size: 1.1rem;">${props.score_total != null ? props.score_total.toFixed(1) : "N/A"}</strong></td>
        </tr>
        ${props.telefono ? `
        <tr>
          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Teléfono:</strong></td>
          <td style="padding: 4px 0;">${props.telefono}</td>
        </tr>
        ` : ""}
        ${props.abre_sabado ? `
        <tr>
          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Sábado:</strong></td>
          <td style="padding: 4px 0;">✅ Abre</td>
        </tr>
        ` : ""}
        ${aiSection}
      </table>
      <div style="margin-top: 12px; text-align: center;">
        <a href="${streetViewUrl}" target="_blank" rel="noopener noreferrer"
           style="display: inline-block; background: #4285F4; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; transition: background 0.2s;">
          📍 Ver en Street View
        </a>
      </div>
    </div>
  `;
}

/**
 * Crea una leyenda para el mapa
 * @param {L.Map} map - Instancia del mapa
 * @param {Array} items - Items de la leyenda
 * @param {Object} options - Opciones de posición
 * @returns {L.Control} Control de leyenda
 */
export function createLegend(map, items, options = {}) {
  const { position = "bottomright", title = "Leyenda" } = options;

  const legend = L.control({ position });

  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "legend");
    div.style.cssText = `
      background: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 0.85rem;
      line-height: 1.6;
    `;

    let html = `<strong style="display: block; margin-bottom: 8px; font-size: 0.9rem;">${title}</strong>`;

    for (const item of items) {
      if (item.type === "circle") {
        html += `
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${item.color}; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
            <span>${item.label}</span>
          </div>
        `;
      } else if (item.type === "square") {
        html += `
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="display: inline-block; width: 14px; height: 14px; background: ${item.color}; border: 1px solid #ddd;"></span>
            <span>${item.label}</span>
          </div>
        `;
      } else if (item.type === "header") {
        html += `<div style="margin-top: 10px; margin-bottom: 6px; font-weight: 600; color: #555;">${item.label}</div>`;
      } else if (item.type === "separator") {
        html += `<hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">`;
      }
    }

    div.innerHTML = html;
    return div;
  };

  legend.addTo(map);
  return legend;
}

/**
 * Ajusta el mapa para mostrar todos los elementos de una capa
 * @param {L.Map} map - Instancia del mapa
 * @param {L.Layer} layer - Capa a ajustar
 * @param {number} padding - Padding en píxeles
 */
export function fitBounds(map, layer, padding = 50) {
  try {
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [padding, padding] });
    }
  } catch (e) {
    console.warn("No se pudo ajustar bounds:", e);
  }
}

/**
 * Obtiene el color para un tier específico
 * @param {string} tier - Tier del prospecto
 * @returns {string} Color hex
 */
export function getColorForTier(tier) {
  return TIER_COLORS[tier] || "#666";
}

/**
 * Obtiene el color para una región específica
 * @param {string} region - Nombre de la macro-región
 * @returns {string} Color hex
 */
export function getColorForRegion(region) {
  return REGION_COLORS[region] || "#666";
}

/**
 * Obtiene el radio del marcador según el tier
 * @param {string} tier - Tier del prospecto
 * @returns {number} Radio en píxeles
 */
export function getRadiusForTier(tier) {
  const radii = {
    "A_PREMIUM": 10,
    "B_ALTA": 8,
    "C_MEDIA": 6,
    "D_BAJA": 4
  };
  return radii[tier] || 5;
}

