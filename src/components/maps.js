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
 * Colores por macro-región (sincronizado con brand.js)
 */
export const REGION_COLORS = {
  "NORESTE": "#C41E3A",        // Rojo FCarnes - mercado principal
  "CENTRO": "#1565C0",         // Azul - megalópolis
  "GOLFO_SURESTE": "#2E7D32",  // Verde - emergente
  "OCCIDENTE": "#7B1FA2",      // Púrpura
  "BAJIO": "#F57C00",          // Naranja - industrial
  "PENINSULA": "#00838F",      // Teal
  "FRONTERA_NORTE": "#5D4037", // Café
  "NOROESTE": "#546E7A",       // Gris azul
  "OTRA": "#9E9E9E"            // Gris - sin clasificar
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

// =============================================================================
// RUTAS LOGÍSTICAS
// =============================================================================

/**
 * Colores por zona logística para rutas
 */
export const ROUTE_COLORS = {
  "LOCAL": "#22c55e",      // Verde
  "REGIONAL": "#3b82f6",   // Azul 
  "FORANEA": "#f59e0b",    // Naranja
  "LEJANA": "#ef4444",     // Rojo
  "default": "#6b7280"     // Gris
};

/**
 * Obtiene el color de una ruta según su zona logística
 * @param {string} zona - Zona logística
 * @returns {string} Color hex
 */
export function getRouteColor(zona) {
  return ROUTE_COLORS[zona] || ROUTE_COLORS.default;
}

/**
 * Crea una capa de rutas logísticas
 * @param {Object} routesGeoJSON - GeoJSON de rutas (LineStrings)
 * @param {Object} options - Opciones de estilo
 * @returns {L.GeoJSON} Capa de rutas
 */
export function createRoutesLayer(routesGeoJSON, options = {}) {
  const {
    weight = 3,
    opacity = 0.8,
    highlightWeight = 5,
    colorBy = "zona_logistica"
  } = options;

  return L.geoJSON(routesGeoJSON, {
    style: (feature) => {
      const zona = feature.properties[colorBy] || "default";
      return {
        color: getRouteColor(zona),
        weight: weight,
        opacity: opacity,
        lineJoin: "round",
        lineCap: "round"
      };
    },
    onEachFeature: (feature, layer) => {
      const props = feature.properties;
      // Support both Spanish (distancia_km) and English (distance_km) property names
      const distanciaKm = props.distancia_km ?? props.distance_km;
      
      // Popup con información de la ruta
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px;">
          <h4 style="margin: 0 0 8px; color: ${getRouteColor(props.zona_logistica)}; border-bottom: 2px solid ${getRouteColor(props.zona_logistica)}; padding-bottom: 6px;">
            🚚 Ruta a ${props.destino}
          </h4>
          <table style="width: 100%; font-size: 0.85rem;">
            <tr>
              <td style="color: #666; padding: 3px 0;"><strong>Distancia:</strong></td>
              <td style="text-align: right;">${distanciaKm?.toLocaleString("es-MX")} km</td>
            </tr>
            <tr>
              <td style="color: #666; padding: 3px 0;"><strong>Tiempo:</strong></td>
              <td style="text-align: right;">${props.tiempo_horas?.toFixed(1) || "—"} hrs</td>
            </tr>
            <tr>
              <td style="color: #666; padding: 3px 0;"><strong>Casetas:</strong></td>
              <td style="text-align: right;">$${props.costo_casetas?.toLocaleString("es-MX") || 0}</td>
            </tr>
            <tr>
              <td style="color: #666; padding: 3px 0;"><strong>Combustible:</strong></td>
              <td style="text-align: right;">$${props.costo_combustible?.toLocaleString("es-MX") || 0}</td>
            </tr>
            <tr style="border-top: 1px solid #eee;">
              <td style="color: #333; padding: 6px 0 3px;"><strong>Costo Total:</strong></td>
              <td style="text-align: right; font-weight: 700; font-size: 1rem; color: ${getRouteColor(props.zona_logistica)};">
                $${props.costo_total?.toLocaleString("es-MX")} MXN
              </td>
            </tr>
          </table>
          <div style="margin-top: 8px; padding: 4px 8px; background: ${getRouteColor(props.zona_logistica)}20; border-radius: 4px; text-align: center; font-size: 0.8rem;">
            Zona: <strong>${props.zona_logistica}</strong>
          </div>
        </div>
      `;
      
      layer.bindPopup(popupContent);
      
      // Highlight on hover
      layer.on("mouseover", function() {
        this.setStyle({ weight: highlightWeight, opacity: 1 });
        this.bringToFront();
      });
      
      layer.on("mouseout", function() {
        this.setStyle({ weight: weight, opacity: opacity });
      });
    }
  });
}

/**
 * Crea una capa de nodos logísticos (planta + destinos)
 * @param {Object} nodesGeoJSON - GeoJSON de puntos
 * @returns {L.GeoJSON} Capa de nodos
 */
export function createNodesLayer(nodesGeoJSON) {
  return L.geoJSON(nodesGeoJSON, {
    pointToLayer: (feature, latlng) => {
      const props = feature.properties;
      const isOrigin = props.type === "planta_principal";
      
      if (isOrigin) {
        // Marcador especial para la planta
        return L.marker(latlng, {
          icon: L.divIcon({
            className: "plant-marker",
            html: `<div style="
              width: 36px; height: 36px;
              background: linear-gradient(135deg, #C41E3A, #8B0000);
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 3px 10px rgba(0,0,0,0.4);
              font-size: 18px;
            ">🏭</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18]
          })
        });
      } else {
        // Destinos como círculos con tamaño según distancia
        const zona = props.zona_logistica || "default";
        const radius = zona === "LOCAL" ? 6 : zona === "FORANEA" ? 8 : 10;
        return L.circleMarker(latlng, {
          radius: radius,
          fillColor: getRouteColor(zona),
          color: "#fff",
          weight: 2,
          fillOpacity: 0.9
        });
      }
    },
    onEachFeature: (feature, layer) => {
      const props = feature.properties;
      const isOrigin = props.type === "planta_principal";
      
      const popup = isOrigin 
        ? `<div style="text-align: center; font-family: system-ui, sans-serif; min-width: 200px;">
            <div style="font-size: 2rem; margin-bottom: 8px;">🏭</div>
            <strong style="font-size: 1.2rem; color: #C41E3A;">${props.name || "Planta FCarnes"}</strong>
            <div style="margin-top: 8px; padding: 8px; background: #FFF5F5; border-radius: 6px;">
              <div style="color: #666; font-size: 0.85rem;">Centro de Distribución Principal</div>
              <div style="color: #333; font-weight: 600; margin-top: 4px;">Monterrey, Nuevo León</div>
            </div>
            <div style="margin-top: 8px; font-size: 0.8rem; color: #888;">
              Origen de todas las rutas logísticas
            </div>
          </div>`
        : `<div style="font-family: system-ui, sans-serif; min-width: 220px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid ${getRouteColor(props.zona_logistica)};">
              <span style="font-size: 1.5rem;">${props.icon || "📍"}</span>
              <strong style="font-size: 1.1rem; color: ${getRouteColor(props.zona_logistica)};">${props.name}</strong>
            </div>
            <table style="width: 100%; font-size: 0.85rem;">
              <tr>
                <td style="color: #666; padding: 3px 0;"><strong>Zona:</strong></td>
                <td style="text-align: right;">
                  <span style="background: ${getRouteColor(props.zona_logistica)}20; color: ${getRouteColor(props.zona_logistica)}; padding: 2px 8px; border-radius: 4px; font-weight: 600;">
                    ${props.zona_logistica || "N/A"}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="color: #666; padding: 3px 0;"><strong>Distancia:</strong></td>
                <td style="text-align: right; font-weight: 600;">${props.distancia_km?.toLocaleString("es-MX") || "—"} km</td>
              </tr>
              ${props.costo_total ? `
              <tr>
                <td style="color: #666; padding: 3px 0;"><strong>Costo Viaje:</strong></td>
                <td style="text-align: right; font-weight: 700; color: #C41E3A;">$${Math.round(props.costo_total).toLocaleString("es-MX")} MXN</td>
              </tr>
              ` : ""}
            </table>
            ${props.distancia_km ? `
            <div style="margin-top: 10px; padding: 8px; background: #f5f5f5; border-radius: 6px; font-size: 0.8rem; color: #666;">
              <strong>Tiempo estimado:</strong> ${(props.distancia_km / 70).toFixed(1)} hrs
              <br><strong>Costo/km:</strong> $${(props.costo_total / props.distancia_km).toFixed(2)} MXN
            </div>
            ` : ""}
          </div>`;
      
      layer.bindPopup(popup, { maxWidth: 280 });
    }
  });
}

// =============================================================================
// HEATMAP
// =============================================================================

/**
 * Crea datos para capa de heatmap
 * @param {Array} prospects - Array de prospectos con lat/lon
 * @param {Object} options - Opciones de configuración
 * @returns {Array} Array de [lat, lon, intensity] para heatmap
 */
export function createHeatmapData(prospects, options = {}) {
  const {
    intensityField = "score_total",
    maxIntensity = 100,
    filterFn = null
  } = options;

  let data = prospects;
  
  if (filterFn) {
    data = prospects.filter(filterFn);
  }

  return data.map(p => {
    const lat = p.lat || p.latitud || p.geometry?.coordinates?.[1];
    const lon = p.lon || p.longitud || p.geometry?.coordinates?.[0];
    const intensity = p[intensityField] ? p[intensityField] / maxIntensity : 0.5;
    
    return [lat, lon, Math.min(intensity, 1)];
  }).filter(d => d[0] && d[1]);
}

/**
 * Crea una capa de heatmap (requiere leaflet.heat)
 * @param {L.Map} map - Instancia del mapa
 * @param {Array} heatData - Array de [lat, lon, intensity]
 * @param {Object} options - Opciones del heatmap
 * @returns {Object} Capa de heatmap
 */
export function createHeatmapLayer(map, heatData, options = {}) {
  const {
    radius = 20,
    blur = 15,
    maxZoom = 12,
    max = 1,
    gradient = {
      0.2: "#22c55e",  // Verde
      0.4: "#eab308",  // Amarillo
      0.6: "#f97316",  // Naranja
      0.8: "#ef4444",  // Rojo
      1.0: "#7c2d12"   // Rojo oscuro
    }
  } = options;

  // Verificar si L.heatLayer existe (leaflet.heat plugin)
  if (typeof L.heatLayer !== "function") {
    console.warn("leaflet.heat plugin not loaded. Heatmap not available.");
    return null;
  }

  return L.heatLayer(heatData, {
    radius,
    blur,
    maxZoom,
    max,
    gradient
  });
}

// =============================================================================
// LAYER CONTROL
// =============================================================================

/**
 * Crea un control de capas personalizado
 * @param {L.Map} map - Instancia del mapa
 * @param {Object} baseLayers - Capas base
 * @param {Object} overlays - Capas overlay
 * @param {Object} options - Opciones
 * @returns {L.Control.Layers} Control de capas
 */
export function createLayerControl(map, baseLayers = {}, overlays = {}, options = {}) {
  const {
    position = "topright",
    collapsed = false
  } = options;

  const control = L.control.layers(baseLayers, overlays, {
    position,
    collapsed
  });

  control.addTo(map);
  return control;
}

/**
 * Crea leyenda de rutas logísticas
 * @param {L.Map} map - Instancia del mapa
 * @returns {L.Control} Control de leyenda
 */
export function createRoutesLegend(map) {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    const div = L.DomUtil.create("div", "legend routes-legend");
    div.style.cssText = `
      background: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-family: system-ui, sans-serif;
      font-size: 0.85rem;
    `;

    div.innerHTML = `
      <strong style="display: block; margin-bottom: 8px;">🚚 Red Logística</strong>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <span style="display: inline-block; width: 24px; height: 3px; background: ${ROUTE_COLORS.LOCAL};"></span>
        <span>Local (&lt;50 km)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <span style="display: inline-block; width: 24px; height: 3px; background: ${ROUTE_COLORS.FORANEA};"></span>
        <span>Foránea (50-400 km)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-block; width: 24px; height: 3px; background: ${ROUTE_COLORS.LEJANA};"></span>
        <span>Lejana (&gt;400 km)</span>
      </div>
    `;

    return div;
  };

  legend.addTo(map);
  return legend;
}

/**
 * Filtra prospectos por proximidad a rutas
 * @param {Array} prospects - Array de prospectos
 * @param {number} maxDistance - Distancia máxima en km
 * @returns {Array} Prospectos filtrados
 */
export function filterProspectsInCorridor(prospects, maxDistance = 25) {
  return prospects.filter(p => {
    const distRuta = p.dist_ruta_km || p.distancia_ruta_km;
    return distRuta !== undefined && distRuta <= maxDistance;
  });
}

/**
 * Obtiene color para proximidad a ruta
 * @param {number} distKm - Distancia en km
 * @returns {string} Color hex
 */
export function getProximityColor(distKm) {
  if (distKm <= 5) return "#22c55e";   // Verde - muy cerca
  if (distKm <= 15) return "#84cc16";  // Lima
  if (distKm <= 25) return "#eab308";  // Amarillo
  if (distKm <= 50) return "#f97316";  // Naranja
  return "#9ca3af";                     // Gris - lejos
}

