---
title: Explorador de Prospectos
toc: false
---

```js
import {kpi, formatNumber, formatPercent, tierBadge, regionBadge, zonaBadge} from "./components/ui.js";
import {decisionCallout} from "./components/brand.js";
import {
  createBaseMap, addGeoJsonLayer, createLegend, fitBounds, 
  createProspectPopup, getColorForTier, getRadiusForTier, 
  TIER_COLORS, ROUTE_COLORS, L,
  createRoutesLayer, createNodesLayer,
  getRouteColor, filterProspectsInCorridor, getProximityColor
} from "./components/maps.js";

// CSS de Leaflet
const leafletCss = html`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css">`;


// Cargar datos
const prospectosRaw = await FileAttachment("data/prospectos_sample.json").json();
const tamRegion = await FileAttachment("data/tam_por_macroregion.csv").csv({typed: true});

// Cargar datos de red logística
const rutasLogisticas = await FileAttachment("data/rutas_logisticas.json").json();
const nodosLogisticos = await FileAttachment("data/nodos_logisticos.json").json();

// Mapeo de regiones truncadas a nombres completos
const REGION_EXPAND = {
  "GOLFO_SURE": "GOLFO_SURESTE",
  "FRONTERA_N": "FRONTERA_NORTE",
  "SIN_REGION": "OTRA"
};

// Mapeo de campos abreviados a completos
function expandProps(p) {
  const lat = p.geometry?.coordinates?.[1] || 0;
  const lon = p.geometry?.coordinates?.[0] || 0;
  const rawRegion = p.properties?.r || p.properties?.macro_region || "N/A";
  const expandedRegion = REGION_EXPAND[rawRegion] || rawRegion;
  
  // Mapear tier abreviado a formato completo
  const tierMap = {"A": "A_PREMIUM", "B": "B_ALTA", "C": "C_MEDIA", "D": "D_BAJA"};
  const rawTier = p.properties?.t || p.properties?.tier || "B";
  const tier = tierMap[rawTier] || rawTier;
  
  return {
    nombre: p.properties?.n || p.properties?.nombre || "Sin nombre",
    ciudad: p.properties?.c || p.properties?.ciudad || "N/A",
    estado: p.properties?.e || p.properties?.estado || "N/A",
    macro_region: expandedRegion,
    zona_logistica: p.properties?.z || p.properties?.zona_logistica || "N/A",
    categoria_fcarnes: p.properties?.cat || p.properties?.categoria_fcarnes || "N/A",
    tier: tier,
    score_total: p.properties?.s || p.properties?.score_total || 50,
    distancia_planta_km: p.properties?.d || p.properties?.distancia_planta_km || 0,
    telefono: p.properties?.tel || p.properties?.telefono || "",
    nivel_confianza: p.properties?.conf || p.properties?.nivel_confianza || "MEDIA",
    reviews_google: p.properties?.rev || p.properties?.reviews_google || 0,
    rating_google: p.properties?.rat || p.properties?.rating_google || 0,
    abre_sabado: p.properties?.sab === 1 || p.properties?.abre_sabado || false,
    ai_analizado: p.properties?.ai === 1 || p.properties?.ai_analizado || false,
    ai_confidence: p.properties?.aic || p.properties?.ai_confidence || 0,
    ai_scene_vitality: p.properties?.aiv || p.properties?.ai_scene_vitality || 0,
    ai_target_visibility: p.properties?.aivis || p.properties?.ai_target_visibility || 0,
    ai_target_facade: p.properties?.aif || p.properties?.ai_target_facade || 0,
    ai_score_promedio: p.properties?.ai_score_promedio || ((p.properties?.aiv || 0) + (p.properties?.aivis || 0) + (p.properties?.aif || 0)) / 3,
    url_streetview: `https://www.google.com/maps/@${lat},${lon},3a,90y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`,
    // Datos de proximidad a rutas
    dist_ruta_km: p.properties?.dist_ruta_km || null,
    ruta_cercana: p.properties?.ruta_cercana || null,
    en_corredor: p.properties?.en_corredor === 1 || p.properties?.en_corredor === true,
    lat, lon
  };
}

// Asegurar que prospectos tiene la estructura correcta y expandir propiedades
const rawFeatures = prospectosRaw?.features || prospectosRaw || [];
const features = rawFeatures.map(f => ({
  type: "Feature",
  geometry: f.geometry,
  properties: expandProps(f)
}));

const prospectos = {
  type: "FeatureCollection",
  features: features
};

// Extraer opciones únicas para filtros
const macroRegiones = ["Todas", ...new Set(features.map(f => f.properties?.macro_region).filter(Boolean)).values()].sort();
const zonas = ["Todas", "LOCAL", "REGIONAL", "FORANEA", "LEJANA"];
const categorias = ["Todas", ...new Set(features.map(f => f.properties?.categoria_fcarnes).filter(Boolean)).values()].sort();
const tiers = ["Todos", "A_PREMIUM", "B_ALTA", "C_MEDIA", "D_BAJA"];
```

<h1 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
  <span style="font-size: 1.5rem;">🗺️</span> Explorador de Prospectos Verificados
</h1>

<p style="color: #666; margin-top: 0;">
  <strong>Solo prospectos de alta calidad</strong> — Filtrados por tier (A+B), score, completitud y contacto verificable. Cada punto incluye link a <strong>Street View</strong> para validación visual.
</p>

<div class="card" style="background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%); color: white; border: none; margin: 1rem 0;">
  <h3 style="margin-top: 0; color: #7dd3fc;">
    🎯 ¿Cómo usar este explorador?
  </h3>
  <p style="margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.6;">
    Este mapa interactivo permite <strong>explorar, filtrar y validar</strong> prospectos de alto potencial. 
    Cada punto representa un negocio verificado con información de contacto real.
  </p>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-top: 0.75rem;">
    <div style="background: rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 6px; text-align: center;">
      <span style="font-size: 1.25rem;">1️⃣</span>
      <div style="font-size: 0.75rem; margin-top: 0.25rem;">Filtra por región o zona logística</div>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 6px; text-align: center;">
      <span style="font-size: 1.25rem;">2️⃣</span>
      <div style="font-size: 0.75rem; margin-top: 0.25rem;">Haz clic en un prospecto</div>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 6px; text-align: center;">
      <span style="font-size: 1.25rem;">3️⃣</span>
      <div style="font-size: 0.75rem; margin-top: 0.25rem;">Abre Street View para validar</div>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 6px; text-align: center;">
      <span style="font-size: 1.25rem;">4️⃣</span>
      <div style="font-size: 0.75rem; margin-top: 0.25rem;">Exporta o agenda visita</div>
    </div>
  </div>
</div>

<div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem; margin: 0.5rem 0; font-size: 0.85rem;">
  ✅ <strong>Filtro de Calidad Aplicado:</strong> Estos prospectos han pasado filtros estrictos: Tier A/B únicamente, score ≥50, datos de contacto verificables, y nombres identificables (sin genéricos como "CARNICERIA").
</div>

---

```js
display(decisionCallout({
  title: "Prospectos de Alta Calidad",
  items: [
    "Todos los prospectos tienen contacto verificable (teléfono, reviews o web)",
    "Solo tier A (Premium) y B (Alta prioridad) — Sin tier C ni D",
    "Nombres identificables — Excluidos genéricos sin identidad comercial",
    "Haz clic en cualquier punto para ver ficha completa + Street View"
  ]
}));
```

---

## Filtros

<div class="grid grid-cols-4">

```js
const regionFiltro = view(Inputs.select(macroRegiones, {
  label: "Macro-Región",
  value: "Todas"
}));
```

```js
const zonaFiltro = view(Inputs.select(zonas, {
  label: "Zona Logística",
  value: "Todas"
}));
```

```js
const categoriaFiltro = view(Inputs.select(categorias, {
  label: "Categoría",
  value: "Todas"
}));
```

```js
const tierFiltro = view(Inputs.select(tiers, {
  label: "Tier (Prioridad)",
  value: "Todos"
}));
```

</div>

### Capas del Mapa

<div class="grid grid-cols-4" style="margin-top: 0.5rem;">

```js
const mostrarProspectos = view(Inputs.toggle({
  label: "📍 Prospectos",
  value: true
}));
```

```js
const mostrarRutas = view(Inputs.toggle({
  label: "🚚 Red Logística",
  value: true
}));
```

```js
const soloEnCorredor = view(Inputs.toggle({
  label: "🛤️ Solo en Corredor",
  value: false
}));
```

```js
const distanciaCorredor = view(Inputs.range([5, 50], {
  label: "Dist. Corredor (km)",
  value: 25,
  step: 5
}));
```

</div>

---

## Resultados

```js
// Aplicar filtros
const prospectosFiltrados = features.filter(f => {
  const p = f.properties || {};
  if (regionFiltro !== "Todas" && p.macro_region !== regionFiltro) return false;
  if (zonaFiltro !== "Todas" && p.zona_logistica !== zonaFiltro) return false;
  if (categoriaFiltro !== "Todas" && p.categoria_fcarnes !== categoriaFiltro) return false;
  if (tierFiltro !== "Todos" && p.tier !== tierFiltro) return false;
  
  // Filtro de corredor logístico
  if (soloEnCorredor) {
    const distRuta = p.dist_ruta_km;
    if (distRuta === null || distRuta === undefined || distRuta > distanciaCorredor) return false;
  }
  
  return true;
});

const totalFiltrados = prospectosFiltrados.length;
const totalProspectos = features.length;
const scorePromedio = totalFiltrados > 0
  ? prospectosFiltrados.reduce((s, f) => s + (f.properties?.score_total || 0), 0) / totalFiltrados
  : 0;

const tierA = prospectosFiltrados.filter(f => f.properties?.tier === "A_PREMIUM").length;
const tierB = prospectosFiltrados.filter(f => f.properties?.tier === "B_ALTA").length;

// Stats del corredor
const enCorredor = features.filter(f => f.properties?.en_corredor).length;
```

```js
display(kpi([
  { label: "Prospectos Filtrados", value: formatNumber(totalFiltrados), subtitle: `de ${formatNumber(totalProspectos)} totales` },
  { label: "Score Promedio", value: scorePromedio.toFixed(1), subtitle: "Puntuación 0-100" },
  { label: "Tier A + B", value: formatNumber(tierA + tierB), subtitle: "Alta prioridad" },
  { label: "En Corredor (<25km)", value: formatNumber(enCorredor), subtitle: `${formatPercent((enCorredor / totalProspectos) * 100)} cerca de ruta` }
]));
```

<div class="note" style="background: #FFF3E0; border-left: 4px solid #FF9800; padding: 0.75rem; margin: 1rem 0; font-size: 0.9rem;">
  ⚡ <strong>Nota:</strong> Mostrando ${formatNumber(totalFiltrados)} prospectos filtrados. El mapa muestra todos los puntos, pero la tabla está limitada a los top 500 por rendimiento.
</div>

---

## Mapa de Prospectos

```js
// Crear GeoJSON filtrado
const geoJsonFiltrado = {
  type: "FeatureCollection",
  features: prospectosFiltrados
};
```

```js
const mapContainer = display(document.createElement("div"));
mapContainer.style.height = "600px";
mapContainer.style.width = "100%";
mapContainer.style.borderRadius = "8px";
mapContainer.style.overflow = "hidden";
mapContainer.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
mapContainer.style.marginBottom = "1rem";

// Verificar que L está disponible
if (typeof L !== 'undefined' && L.map) {
  // Crear mapa
  const map = createBaseMap(mapContainer, {
    center: [24.5, -102.5],
    zoom: 5
  });

  // ============================================
  // CAPA 1: Rutas Logísticas (abajo)
  // ============================================
  let rutasLayer = null;
  let nodosLayer = null;
  
  if (mostrarRutas && rutasLogisticas?.features?.length > 0) {
    rutasLayer = createRoutesLayer(rutasLogisticas, {
      weight: 3,
      opacity: 0.75,
      highlightWeight: 5
    }).addTo(map);
    
    // Nodos logísticos (planta + destinos)
    if (nodosLogisticos?.features?.length > 0) {
      nodosLayer = createNodesLayer(nodosLogisticos).addTo(map);
    }
  }

  // ============================================
  // CAPA 2: Prospectos
  // ============================================
  let prospectosLayer = null;
  
  if (mostrarProspectos && geoJsonFiltrado.features && geoJsonFiltrado.features.length > 0) {
    prospectosLayer = L.geoJSON(geoJsonFiltrado, {
      pointToLayer: (feature, latlng) => {
        const p = feature.properties;
        const tier = p.tier || "C_MEDIA";
        
        // Color: si está en modo corredor, colorear por proximidad
        let color;
        if (soloEnCorredor && p.dist_ruta_km !== null) {
          color = getProximityColor(p.dist_ruta_km);
        } else {
          color = getColorForTier(tier);
        }
        
        const radius = getRadiusForTier(tier);
        
        return L.circleMarker(latlng, {
          radius: radius,
          fillColor: color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85
        });
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        // Agregar info de ruta al popup si está disponible
        const rutaInfo = p.dist_ruta_km !== null 
          ? `<tr>
              <td style="padding: 4px 8px 4px 0; color: #666;"><strong>🚚 Ruta más cercana:</strong></td>
              <td style="padding: 4px 0;">${p.ruta_cercana || "N/A"} (${p.dist_ruta_km?.toFixed(1)} km)</td>
            </tr>`
          : "";
        
        const popupContent = createProspectPopup(p);
        // Insertar info de ruta en el popup
        const enhancedPopup = popupContent.replace(
          '<tr>\n          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Distancia:</strong></td>',
          `${rutaInfo}<tr>\n          <td style="padding: 4px 8px 4px 0; color: #666;"><strong>Distancia:</strong></td>`
        );
        
        layer.bindPopup(enhancedPopup, { maxWidth: 350 });
      }
    }).addTo(map);

    // Ajustar vista a prospectos si no hay rutas
    if (prospectosLayer && (!mostrarRutas || !rutasLayer)) {
      fitBounds(map, prospectosLayer, 40);
    }
  }
  
  // Ajustar a rutas si están visibles
  if (rutasLayer) {
    fitBounds(map, rutasLayer, 30);
  } else if (!prospectosLayer) {
    // Si no hay ninguna capa visible, centrar en México
    map.setView([24.5, -102.5], 5);
  }

  // ============================================
  // Leyenda dinámica
  // ============================================
  const legendItems = [];
  
  // Leyenda de prospectos (solo si están visibles)
  if (mostrarProspectos) {
    if (soloEnCorredor) {
      legendItems.push({ type: "header", label: "📍 Proximidad a Ruta" });
      legendItems.push({ type: "circle", color: "#22c55e", label: "< 5 km" });
      legendItems.push({ type: "circle", color: "#84cc16", label: "5-15 km" });
      legendItems.push({ type: "circle", color: "#eab308", label: "15-25 km" });
      legendItems.push({ type: "circle", color: "#f97316", label: "25-50 km" });
    } else {
      legendItems.push({ type: "header", label: "📍 Tier de Prioridad" });
      legendItems.push({ type: "circle", color: TIER_COLORS.A_PREMIUM, label: "A_PREMIUM (Máxima)" });
      legendItems.push({ type: "circle", color: TIER_COLORS.B_ALTA, label: "B_ALTA (Alta)" });
      legendItems.push({ type: "circle", color: TIER_COLORS.C_MEDIA, label: "C_MEDIA (Media)" });
      legendItems.push({ type: "circle", color: TIER_COLORS.D_BAJA, label: "D_BAJA (Baja)" });
    }
  }
  
  
  // Leyenda de rutas
  if (mostrarRutas) {
    if (legendItems.length > 0) legendItems.push({ type: "separator" });
    legendItems.push({ type: "header", label: "🚚 Rutas Logísticas" });
    legendItems.push({ type: "square", color: ROUTE_COLORS.LOCAL, label: "Local (< 50 km)" });
    legendItems.push({ type: "square", color: ROUTE_COLORS.FORANEA, label: "Foránea (50-400 km)" });
    legendItems.push({ type: "square", color: ROUTE_COLORS.LEJANA, label: "Lejana (> 400 km)" });
  }
  
  if (legendItems.length > 0) {
    createLegend(map, legendItems, { position: "bottomright", title: "Leyenda" });
  }
  
} else {
  mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #666;">⚠️ Error cargando el mapa. Recarga la página.</div>';
}
```

<div class="grid grid-cols-3" style="gap: 0.75rem; margin-bottom: 1rem;">
  <div class="note" style="background: #E3F2FD; border-left: 4px solid #2196F3; padding: 0.75rem; margin: 0; font-size: 0.85rem;">
    <strong>💡 Tip:</strong> Haz clic en cualquier punto para ver la ficha completa con <strong>Street View</strong> para validación visual.
  </div>
  <div class="note" style="background: #FFF3E0; border-left: 4px solid #FF9800; padding: 0.75rem; margin: 0; font-size: 0.85rem;">
    <strong>🚚 Rutas:</strong> Muestra las <strong>rutas reales</strong> de distribución desde Monterrey. Clic en ruta = costos logísticos.
  </div>
  <div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem; margin: 0; font-size: 0.85rem;">
    <strong>🛤️ Corredor:</strong> Filtra prospectos <strong>cerca de rutas existentes</strong> para optimizar costos de distribución.
  </div>
</div>

---

## Tabla de Prospectos

```js
const tablaData = prospectosFiltrados
  .map(f => {
    const p = f.properties || {};
    return {
      nombre: p.nombre || "Sin nombre",
      ciudad: p.ciudad || "N/A",
      macro_region: p.macro_region || "N/A",
      zona_logistica: p.zona_logistica || "N/A",
      tier: p.tier || "N/A",
      score: typeof p.score_total === 'number' ? p.score_total : 0,
      telefono: p.telefono || "—",
      dist_planta: typeof p.distancia_planta_km === 'number' ? p.distancia_planta_km : 0,
      dist_ruta: p.dist_ruta_km ?? null,
      ruta_cercana: p.ruta_cercana || "—",
      lat: p.lat || 0,
      lon: p.lon || 0
    };
  })
  .sort((a, b) => b.score - a.score);
```

```js
// Limitar a top 500 para rendimiento
const tablaLimitada = tablaData.slice(0, 500);

display(Inputs.table(tablaLimitada, {
  columns: ["nombre", "ciudad", "zona_logistica", "tier", "score", "dist_planta", "dist_ruta", "ruta_cercana"],
  header: {
    nombre: "Establecimiento",
    ciudad: "Ciudad",
    zona_logistica: "Zona",
    tier: "Tier",
    score: "Score",
    dist_planta: "Dist. Planta",
    dist_ruta: "Dist. Ruta",
    ruta_cercana: "Ruta Cercana"
  },
  format: {
    score: d => typeof d === 'number' ? d.toFixed(1) : "—",
    dist_planta: d => `${Math.round(d)} km`,
    dist_ruta: d => d !== null ? `${d.toFixed(1)} km` : "—"
  },
  sort: "score",
  reverse: true,
  rows: 20
}));
```

<small style="color: #666; display: block; margin-top: 0.5rem;">
  Mostrando top 500 de ${formatNumber(tablaData.length)} prospectos filtrados (ordenados por score)
</small>

---

## Distribución por Tier (Selección Actual)

```js
const tierCounts = {
  "A_PREMIUM": prospectosFiltrados.filter(f => f.properties?.tier === "A_PREMIUM").length,
  "B_ALTA": prospectosFiltrados.filter(f => f.properties?.tier === "B_ALTA").length,
  "C_MEDIA": prospectosFiltrados.filter(f => f.properties?.tier === "C_MEDIA").length,
  "D_BAJA": prospectosFiltrados.filter(f => f.properties?.tier === "D_BAJA").length
};

const tierData = Object.entries(tierCounts).map(([tier, count]) => ({ tier, count }));
```

```js
import * as Plot from "npm:@observablehq/plot";

display(resize((width) => Plot.plot({
  width: Math.min(width, 500),
  height: 200,
  marginLeft: 100,
  x: { label: "Cantidad", grid: true },
  y: { label: null },
  marks: [
    Plot.barX(tierData, {
      y: "tier",
      x: "count",
      fill: d => TIER_COLORS[d.tier] || "#666",
      sort: { y: "x", reverse: true }
    }),
    Plot.text(tierData, {
      y: "tier",
      x: "count",
      text: d => formatNumber(d.count),
      dx: 5,
      textAnchor: "start",
      fontWeight: "600"
    }),
    Plot.ruleX([0])
  ]
})));
```

---

## 🎯 Cómo Interpretar los Prospectos

<div class="card" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 4px solid #d97706; margin-bottom: 1rem;">
  <h4 style="margin-top: 0; color: #92400e;">📊 Qué Significa Cada Indicador</h4>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 0.75rem; font-size: 0.9rem;">
    <div>
      <strong style="color: #b45309;">Score (0-100):</strong>
      <p style="margin: 0.25rem 0 0; color: #78350f;">Puntuación compuesta basada en: canal (mayorista vs retail), tamaño del negocio, completitud de datos y presencia en Google Maps. <strong>&gt;70 = alta prioridad</strong>.</p>
    </div>
    <div>
      <strong style="color: #b45309;">Tier (A/B/C/D):</strong>
      <p style="margin: 0.25rem 0 0; color: #78350f;"><strong>A_PREMIUM:</strong> Mayoristas, alto volumen. <strong>B_ALTA:</strong> Carnicerías establecidas con potencial. Este explorador solo muestra A y B.</p>
    </div>
    <div>
      <strong style="color: #b45309;">Dist. Ruta (km):</strong>
      <p style="margin: 0.25rem 0 0; color: #78350f;">Distancia al corredor logístico más cercano. Prospectos <strong>&lt;10 km</strong> se pueden atender sin desvío significativo.</p>
    </div>
    <div>
      <strong style="color: #b45309;">Nivel de Confianza:</strong>
      <p style="margin: 0.25rem 0 0; color: #78350f;"><strong>ALTA:</strong> Validado con IA + teléfono + reseñas. <strong>MEDIA:</strong> Teléfono o reseñas. <strong>PENDIENTE:</strong> Solo datos básicos.</p>
    </div>
  </div>
</div>

---

## Próximos Pasos con la Selección

<div class="grid grid-cols-2">
  <div class="card" style="border-left: 4px solid #3b82f6;">
    <h4 style="margin-top: 0; color: #1d4ed8;">📋 Para el Equipo Comercial</h4>
    <ol style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #555; line-height: 1.6;">
      <li>Filtra por <strong>Tier A_PREMIUM</strong> para mayoristas de alto volumen</li>
      <li>Usa el filtro de <strong>Corredor</strong> para prospectos en rutas existentes</li>
      <li><strong>Valida visualmente</strong> con Street View antes de agendar visita</li>
      <li>Prioriza prospectos con <strong>reseñas en Google</strong> (negocio activo confirmado)</li>
      <li>Exporta la tabla filtrada para tu CRM o agenda de visitas</li>
    </ol>
  </div>
  <div class="card" style="border-left: 4px solid #16a34a;">
    <h4 style="margin-top: 0; color: #15803d;">🚚 Para Operaciones/Logística</h4>
    <ol style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #555; line-height: 1.6;">
      <li>Activa <strong>"🚚 Red Logística"</strong> para ver rutas actuales</li>
      <li>Usa <strong>"🛤️ Solo en Corredor"</strong> para densificar rutas existentes</li>
      <li>Agrupa prospectos en <strong>&lt;15 km</strong> del corredor para entregas eficientes</li>
      <li>Identifica <strong>clusters de alta densidad</strong> para justificar nuevas rutas</li>
      <li>Evalúa prospectos <strong>FORÁNEOS</strong> para CEDIS regional</li>
    </ol>
  </div>
</div>

<div class="card" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #22c55e; margin-top: 1rem;">
  <h4 style="margin-top: 0; color: #166534;">💡 Estrategia de Validación Recomendada</h4>
  <p style="margin: 0; font-size: 0.9rem; color: #14532d; line-height: 1.6;">
    <strong>Antes de visitar físicamente</strong>, valida cada prospecto con Street View para confirmar: (1) que el negocio existe físicamente, 
    (2) que tiene una fachada visible de carnicería/obrador, (3) que el acceso es viable para entrega. 
    Esta validación de 30 segundos puede ahorrarte horas de visitas fallidas.
  </p>
</div>

---

<small style="color: #999; display: block; text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
  <strong>Prospectos verificados:</strong> ${formatNumber(totalProspectos)} (filtrados por calidad) | Datos DENUE + Google Maps + Validación IA<br>
  <strong>Filtros aplicados:</strong> Tier A/B, Score ≥50, Contacto verificable, Sin nombres genéricos<br>
  <strong>STRTGY</strong> — Transformando complejidad en certeza | Proyecto FCarnes | Enero 2026
</small>

