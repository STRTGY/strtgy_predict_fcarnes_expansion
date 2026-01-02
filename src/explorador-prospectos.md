---
title: Explorador de Prospectos
toc: false
---

```js
import {kpi, formatNumber, formatPercent, tierBadge, regionBadge, zonaBadge} from "./components/ui.js";
import {decisionCallout} from "./components/brand.js";
import {createBaseMap, addGeoJsonLayer, createLegend, fitBounds, createProspectPopup, getColorForTier, getRadiusForTier, TIER_COLORS, L} from "./components/maps.js";

// CSS de Leaflet
const leafletCss = html`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css">`;

// Cargar datos
const prospectosRaw = await FileAttachment("data/prospectos_sample.json").json();
const tamRegion = await FileAttachment("data/tam_por_macroregion.csv").csv({typed: true});

// Mapeo de campos abreviados a completos
function expandProps(p) {
  const lat = p.geometry?.coordinates?.[1] || 0;
  const lon = p.geometry?.coordinates?.[0] || 0;
  return {
    nombre: p.properties?.n || p.properties?.nombre || "Sin nombre",
    ciudad: p.properties?.c || p.properties?.ciudad || "N/A",
    estado: p.properties?.e || p.properties?.estado || "N/A",
    macro_region: p.properties?.r || p.properties?.macro_region || "N/A",
    zona_logistica: p.properties?.z || p.properties?.zona_logistica || "N/A",
    categoria_fcarnes: p.properties?.cat || p.properties?.categoria_fcarnes || "N/A",
    tier: p.properties?.t || p.properties?.tier || "C_MEDIA",
    score_total: p.properties?.s || p.properties?.score_total || 50,
    distancia_planta_km: p.properties?.d || p.properties?.distancia_planta_km || 0,
    telefono: p.properties?.tel || p.properties?.telefono || "",
    abre_sabado: p.properties?.sab === 1 || p.properties?.abre_sabado || false,
    ai_analizado: p.properties?.ai === 1 || p.properties?.ai_analizado || false,
    ai_confidence: p.properties?.aic || p.properties?.ai_confidence || 0,
    ai_scene_vitality: p.properties?.aiv || p.properties?.ai_scene_vitality || 0,
    ai_target_visibility: p.properties?.aivis || p.properties?.ai_target_visibility || 0,
    ai_target_facade: p.properties?.aif || p.properties?.ai_target_facade || 0,
    ai_score_promedio: p.properties?.ai_score_promedio || ((p.properties?.aiv || 0) + (p.properties?.aivis || 0) + (p.properties?.aif || 0)) / 3,
    url_streetview: `https://www.google.com/maps/@${lat},${lon},3a,90y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`,
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
  <span style="font-size: 1.5rem;">🗺️</span> Explorador de Prospectos
</h1>

<p style="color: #666; margin-top: 0;">
  Filtra, explora y valida prospectos visualmente. Cada punto incluye link a <strong>Street View</strong> para validación visual.
</p>

---

```js
display(decisionCallout({
  title: "Cómo usar este explorador",
  items: [
    "Usa los filtros para segmentar por región, zona logística, categoría o tier",
    "Haz clic en cualquier punto del mapa para ver la ficha completa del prospecto",
    "El botón 'Ver en Street View' te permite validar visualmente el establecimiento",
    "La tabla inferior muestra los prospectos filtrados ordenados por score"
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
  return true;
});

const totalFiltrados = prospectosFiltrados.length;
const totalProspectos = features.length;
const scorePromedio = totalFiltrados > 0
  ? prospectosFiltrados.reduce((s, f) => s + (f.properties?.score_total || 0), 0) / totalFiltrados
  : 0;

const tierA = prospectosFiltrados.filter(f => f.properties?.tier === "A_PREMIUM").length;
const tierB = prospectosFiltrados.filter(f => f.properties?.tier === "B_ALTA").length;
```

```js
display(kpi([
  { label: "Prospectos Filtrados", value: formatNumber(totalFiltrados), subtitle: `de ${formatNumber(totalProspectos)} totales` },
  { label: "Score Promedio", value: scorePromedio.toFixed(1), subtitle: "Puntuación 0-100" },
  { label: "Tier A + B", value: formatNumber(tierA + tierB), subtitle: "Alta prioridad" },
  { label: "% del Total", value: formatPercent(totalProspectos > 0 ? (totalFiltrados / totalProspectos) * 100 : 0), subtitle: "Selección actual" }
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
mapContainer.style.height = "550px";
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

  // Agregar capa de prospectos si hay datos
  if (geoJsonFiltrado.features && geoJsonFiltrado.features.length > 0) {
    const prospectosLayer = L.geoJSON(geoJsonFiltrado, {
      pointToLayer: (feature, latlng) => {
        const tier = feature.properties?.tier || "C_MEDIA";
        const color = getColorForTier(tier);
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
        const popupContent = createProspectPopup(feature.properties || {});
        layer.bindPopup(popupContent, { maxWidth: 350 });
      }
    }).addTo(map);

    // Ajustar vista
    fitBounds(map, prospectosLayer, 40);
  }

  // Crear leyenda
  createLegend(map, [
    { type: "header", label: "Tier de Prioridad" },
    { type: "circle", color: TIER_COLORS.A_PREMIUM, label: "A_PREMIUM (Máxima)" },
    { type: "circle", color: TIER_COLORS.B_ALTA, label: "B_ALTA (Alta)" },
    { type: "circle", color: TIER_COLORS.C_MEDIA, label: "C_MEDIA (Media)" },
    { type: "circle", color: TIER_COLORS.D_BAJA, label: "D_BAJA (Baja)" }
  ], { position: "bottomright", title: "Leyenda" });
} else {
  mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #666;">⚠️ Error cargando el mapa. Recarga la página.</div>';
}
```

<div class="grid grid-cols-2" style="gap: 1rem; margin-bottom: 1rem;">
  <div class="note" style="background: #E3F2FD; border-left: 4px solid #2196F3; padding: 1rem; margin: 0;">
    <strong>💡 Tip:</strong> Haz clic en cualquier punto para ver la ficha completa con <strong>botón de Street View</strong> para validación visual antes de la visita comercial.
  </div>
  <div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 1rem; margin: 0;">
    <strong>🤖 Análisis IA:</strong> Cada prospecto fue analizado con visión por computadora. 
    <strong>Vitalidad</strong> = actividad comercial | <strong>Visibilidad</strong> = exposición del negocio | <strong>Fachada</strong> = estado del local
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
      categoria: p.categoria_fcarnes || "N/A",
      tier: p.tier || "N/A",
      score: typeof p.score_total === 'number' ? p.score_total : 0,
      ai_score: typeof p.ai_score_promedio === 'number' ? p.ai_score_promedio : 0,
      ai_conf: typeof p.ai_confidence === 'number' ? p.ai_confidence : 0,
      distancia_km: typeof p.distancia_planta_km === 'number' ? p.distancia_planta_km : 0,
      abre_sabado: p.abre_sabado ? "✅" : "—",
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
  columns: ["nombre", "ciudad", "macro_region", "zona_logistica", "tier", "score", "ai_score", "ai_conf", "distancia_km", "abre_sabado"],
  header: {
    nombre: "Establecimiento",
    ciudad: "Ciudad",
    macro_region: "Región",
    zona_logistica: "Zona",
    tier: "Tier",
    score: "Score",
    ai_score: "🤖 IA",
    ai_conf: "Conf. IA",
    distancia_km: "Dist.",
    abre_sabado: "Sáb"
  },
  format: {
    score: d => typeof d === 'number' ? d.toFixed(1) : "—",
    ai_score: d => d > 0 ? d.toFixed(1) : "—",
    ai_conf: d => d > 0 ? `${(d * 100).toFixed(0)}%` : "—",
    distancia_km: d => `${Math.round(d)} km`
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

## Próximos Pasos con la Selección

<div class="grid grid-cols-2">
  <div class="card">
    <h4 style="margin-top: 0;">📋 Para el Equipo Comercial</h4>
    <ol style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #555;">
      <li>Filtra por <strong>Tier A + B</strong> para máxima prioridad</li>
      <li>Filtra por <strong>zona LOCAL</strong> para menor costo de visita</li>
      <li>Usa Street View para validar antes de agendar</li>
      <li>Prioriza prospectos que <strong>abren sábado</strong> si hay disponibilidad</li>
    </ol>
  </div>
  <div class="card">
    <h4 style="margin-top: 0;">🚚 Para Operaciones/Logística</h4>
    <ol style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #555;">
      <li>Agrupa prospectos por <strong>macro-región</strong></li>
      <li>Planifica rutas por <strong>zona logística</strong></li>
      <li>Considera horarios para optimizar entregas</li>
      <li>Evalúa CEDIS regional para zonas FORÁNEAS</li>
    </ol>
  </div>
</div>

---

<small style="color: #999; display: block; text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
  <strong>Base completa:</strong> ${formatNumber(totalProspectos)} prospectos a nivel nacional | Datos DENUE + Google Maps + Análisis IA<br>
  <strong>STRTGY</strong> — Transformando complejidad en certeza | Proyecto FCarnes | Diciembre 2025
</small>

