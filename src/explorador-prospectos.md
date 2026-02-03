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
  getRouteColor, filterProspectsInCorridor, getProximityColor,
  // v4: Tipos de cliente
  TIPO_CLIENTE_COLORS, TIPO_CLIENTE_LABELS,
  getColorForTipoCliente, getLabelForTipoCliente,
  getColorForScore, getRadiusForScore, getRadiusForTipoCliente
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
  
  // Mapear tier abreviado a formato completo (legacy)
  const tierMap = {"A": "A_PREMIUM", "B": "B_ALTA", "C": "C_MEDIA", "D": "D_BAJA"};
  const rawTier = p.properties?.t || p.properties?.tier || "B";
  const tier = tierMap[rawTier] || rawTier;
  
  // Tipo de cliente v4 (nuevo sistema)
  const tipoCliente = p.properties?.tipo || p.properties?.tipo_cliente_fcarnes || null;
  const tierFcarnes = p.properties?.tier_fc || p.properties?.tier_fcarnes || null;
  const scoreBaseTipo = p.properties?.s_tipo || p.properties?.score_base_tipo || 0;
  const colorTipo = p.properties?.color || p.properties?.color_tipo || null;
  const razonClasificacion = p.properties?.raz_tipo || p.properties?.razon_clasificacion || "";
  
  // v4: Score v4 (sv4) es el principal, score_ajustado como fallback
  const scoreV4 = p.properties?.sv4 || p.properties?.score_v4 || p.properties?.sadj || p.properties?.score_ajustado || 50;
  
  return {
    nombre: p.properties?.n || p.properties?.nombre || "Sin nombre",
    ciudad: p.properties?.c || p.properties?.ciudad || "N/A",
    estado: p.properties?.e || p.properties?.estado || "N/A",
    macro_region: expandedRegion,
    zona_logistica: p.properties?.z || p.properties?.zona_logistica || "N/A",
    categoria_fcarnes: p.properties?.cat || p.properties?.categoria_fcarnes || "N/A",
    tier: tier,
    score_total: p.properties?.s || p.properties?.score_total || 50,
    score_ajustado: scoreV4,  // v4: Usar score v4 como principal
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
    // === CAMPOS: Cadenas y Scoring Diferenciado ===
    es_cadena: p.properties?.cad === 1 || p.properties?.es_cadena || false,
    nombre_cadena: p.properties?.cad_nom || p.properties?.nombre_cadena || null,
    num_sucursales: p.properties?.cad_suc || p.properties?.num_sucursales || 1,
    metodo_deteccion_cadena: p.properties?.cad_met || p.properties?.metodo_deteccion_cadena || "NINGUNO",
    // es_prioritario: Redefinido como Tier 1 o 2 por TIPO de cliente (no por score)
    es_prioritario: tierFcarnes === 1 || tierFcarnes === 2,
    razon_prioridad: p.properties?.prio_raz || p.properties?.razon_prioridad || "",
    zona_scoring: p.properties?.zona_sc || p.properties?.zona_scoring || "EXTERIOR",
    // === NUEVOS CAMPOS v4: Tipos de Cliente FCarnes ===
    tipo_cliente_fcarnes: tipoCliente,
    tier_fcarnes: tierFcarnes,
    score_base_tipo: scoreBaseTipo,
    color_tipo: colorTipo,
    razon_clasificacion: razonClasificacion,
    // v4: Tier final del scoring (TIER_1_PREMIUM, TIER_2_ALTA, etc.)
    tier_final: p.properties?.t_fin || p.properties?.tier_final || null,
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

// v4: Usar tipo_cliente_fcarnes en lugar de categoria_fcarnes
const tiposClienteV4 = ["Todos", ...new Set(features.map(f => f.properties?.tipo_cliente_fcarnes).filter(Boolean)).values()].sort();

// Tiers v4 por tipo de cliente (tier_fcarnes: 1=Alto Valor, 2=Alta, 3=Media, 4=Baja)
const tiersPorTipo = ["Todos", 1, 2, 3, 4];
// Legacy tiers para compatibilidad
const tiers = ["Todos", "A_PREMIUM", "B_ALTA", "C_MEDIA", "D_BAJA"];

// === NUEVOS FILTROS: Estado y Ciudad ===
const estados = ["Todos", ...new Set(features.map(f => f.properties?.estado).filter(Boolean)).values()].sort();

// Crear mapa de ciudades por estado para filtro cascading
const ciudadesPorEstado = {};
for (const f of features) {
  const estado = f.properties?.estado;
  const ciudad = f.properties?.ciudad;
  if (estado && ciudad) {
    if (!ciudadesPorEstado[estado]) ciudadesPorEstado[estado] = new Set();
    ciudadesPorEstado[estado].add(ciudad);
  }
}
// Convertir sets a arrays ordenados
for (const estado in ciudadesPorEstado) {
  ciudadesPorEstado[estado] = [...ciudadesPorEstado[estado]].sort();
}

// === SCORING DIFERENCIADO: Ahora se lee del pipeline (pre-calculado) ===
// Los campos vienen del JSON generado por step_09 (cadenas) y step_10 (scoring)
// Campos disponibles: prio (es_prioritario), prio_raz (razon), cad (es_cadena), 
// cad_nom (nombre_cadena), cad_suc (num_sucursales), zona_sc (zona_scoring)

// NOTA: La lógica de scoring ahora está en el pipeline Python (config_cadenas.py, 
// step_09_detect_chains.py, step_10_scoring_diferenciado.py)

// Municipios ZM Monterrey (solo para referencia visual)
const ZM_MONTERREY_MUNICIPIOS = [
  "Monterrey", "San Nicolás de los Garza", "Guadalupe", "Apodaca",
  "San Pedro Garza García", "Santa Catarina", "General Escobedo",
  "Juárez", "García", "Cadereyta Jiménez", "Santiago", "Salinas Victoria",
  "Ciénega de Flores", "General Zuazua", "Pesquería", "El Carmen"
];

// Función wrapper para compatibilidad - lee datos del pipeline
function obtenerPrioridad(prospecto) {
  const props = prospecto.properties || {};
  // Leer campos pre-calculados del pipeline
  const esPrioritario = props.es_prioritario || props.prio === 1 || props.prio === true;
  const razon = props.razon_prioridad || props.prio_raz || "Sin clasificar";
  return { prioritario: esPrioritario, razon: razon };
}

// Info de cadena desde pipeline
function obtenerInfoCadena(prospecto) {
  const props = prospecto.properties || {};
  return {
    esCadena: props.es_cadena || props.cad === 1 || props.cad === true,
    nombreCadena: props.nombre_cadena || props.cad_nom || null,
    numSucursales: props.num_sucursales || props.cad_suc || 1,
    zonaScoring: props.zona_scoring || props.zona_sc || "EXTERIOR"
  };
}

// Territorios de interés estratégico
const TERRITORIOS_ESTRATEGICOS = [
  { id: "todos", label: "Todos", estado: null, filtroEspecial: null },
  { id: "slp", label: "San Luis Potosí", estado: "San Luis Potosí", filtroEspecial: null },
  { id: "qro", label: "Querétaro", estado: "Querétaro", filtroEspecial: null },
  { id: "bc", label: "Baja California", estado: "Baja California", filtroEspecial: null },
  { id: "coah", label: "Coahuila", estado: "Coahuila de Zaragoza", filtroEspecial: null },
  { id: "zm_mty", label: "ZM Monterrey", estado: "Nuevo León", filtroEspecial: "ZM_MTY" }
];
```

<h1 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
  <span style="font-size: 1.5rem;">🗺️</span> Explorador de Prospectos Verificados
</h1>

<p style="color: #666; margin-top: 0;">
  <strong>Prospectos verificados de alta calidad</strong> — Filtrados por score, completitud y contacto verificable. Incluye <strong>scoring v4 con 15 tipos de cliente</strong> basado en valor comercial real para FCarnes. Cada punto incluye link a <strong>Street View</strong> para validación visual.
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
  ✅ <strong>Filtro de Calidad v4:</strong> Rastros y pollerias eliminados automaticamente. <strong>15 tipos de cliente</strong> con scoring basado en valor comercial (Mayoristas > Cadenas > Empacadoras > HORECA > Carniceria Consolidada > Micro).
</div>

---

```js
display(decisionCallout({
  title: "Prospectos Verificados con Scoring v4",
  items: [
    "Todos los prospectos tienen contacto verificable (teléfono, reviews o web)",
    "Sistema dual: Tier por tipo de cliente (1-4) + Tier por score percentil",
    "⭐ Prioritarios: Tier 1 y 2 por tipo (mayoristas, cadenas, supermercados regionales, carnicerias premium)",
    "Haz clic en cualquier punto para ver ficha completa + Street View"
  ]
}));
```

---

## Acceso Rápido a Territorios Estratégicos

```js
// Botones de acceso rápido
const territorioSeleccionado = view(Inputs.radio(
  TERRITORIOS_ESTRATEGICOS.map(t => t.id),
  {
    label: "Territorio:",
    value: "todos",
    format: id => TERRITORIOS_ESTRATEGICOS.find(t => t.id === id)?.label || id
  }
));
```

<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.5rem 0 1rem;">
  <span style="font-size: 0.8rem; color: #666;">💡 Territorios de expansión prioritarios:</span>
  <span style="background: #dbeafe; color: #1e40af; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">San Luis Potosí</span>
  <span style="background: #dbeafe; color: #1e40af; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Querétaro</span>
  <span style="background: #fee2e2; color: #991b1b; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">ZM Monterrey (Bodegones)</span>
</div>

---

## Filtros Detallados

<div class="grid grid-cols-3">

```js
// Obtener estado del territorio seleccionado
const territorioConfig = TERRITORIOS_ESTRATEGICOS.find(t => t.id === territorioSeleccionado);
const estadoDesdeTerritorioVal = territorioConfig?.estado || null;

// Filtro de Estado (reactivo al territorio seleccionado)
const estadoFiltro = view(Inputs.select(estados, {
  label: "Estado",
  value: estadoDesdeTerritorioVal ? estadoDesdeTerritorioVal : "Todos"
}));
```

```js
// Ciudades disponibles según el estado seleccionado
const ciudadesDisponibles = estadoFiltro === "Todos" 
  ? ["Todas", ...new Set(features.map(f => f.properties?.ciudad).filter(Boolean))].sort()
  : ["Todas", ...(ciudadesPorEstado[estadoFiltro] || [])];

const ciudadFiltro = view(Inputs.select(ciudadesDisponibles, {
  label: "Ciudad/Municipio",
  value: "Todas"
}));
```

```js
const regionFiltro = view(Inputs.select(macroRegiones, {
  label: "Macro-Región",
  value: "Todas"
}));
```

</div>

<div class="grid grid-cols-4">

```js
const zonaFiltro = view(Inputs.select(zonas, {
  label: "Zona Logística",
  value: "Todas"
}));
```

```js
// v4: Filtro por Tipo de Cliente (15 categorías específicas FCarnes)
const tipoClienteFiltro = view(Inputs.select(tiposClienteV4, {
  label: "Tipo Cliente v4",
  value: "Todos"
}));
```

```js
// v4: Filtro por Tier basado en tipo de cliente (tier_fcarnes)
const tierTipoFiltro = view(Inputs.select(tiersPorTipo, {
  label: "Tier por Tipo",
  value: "Todos",
  format: t => t === "Todos" ? "Todos" : `T${t} - ${["", "Alto Valor", "Alta", "Media", "Baja"][t]}`
}));
```

```js
const soloPrioritarios = view(Inputs.toggle({
  label: "⭐ Solo Prioritarios",
  value: false
}));

const soloCadenas = view(Inputs.toggle({
  label: "🔗 Solo Cadenas (4+ suc)",
  value: false
}));
```

</div>

<div class="note" style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 0.75rem; margin: 0.75rem 0; font-size: 0.85rem;">
  <strong>⭐ Criterios de "Prioritario":</strong><br>
  • <strong>ZM Monterrey:</strong> Bodegones y retailers medianos/grandes. Se excluyen procesadoras de carne.<br>
  • <strong>Fuera de ZM NL:</strong> Cadenas, multi-ubicación, mayoristas (ej: El Florido, Las Nenas, El Tío, Omerca, La Cabaña).<br>
  <span style="font-size: 0.8rem; color: #92400e;">📖 Ver criterios completos en <a href="./metodologia" style="color: #1d4ed8;">Metodología → Priorización por Zona Geográfica</a></span>
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
// Aplicar filtros incluyendo Estado, Ciudad y Prioritarios
const prospectosFiltrados = features.filter(f => {
  const p = f.properties || {};
  
  // Filtros geográficos nuevos
  if (estadoFiltro !== "Todos" && p.estado !== estadoFiltro) return false;
  if (ciudadFiltro !== "Todas" && p.ciudad !== ciudadFiltro) return false;
  
  // Filtro especial de ZM Monterrey
  if (territorioConfig?.filtroEspecial === "ZM_MTY") {
    const enZMMTY = p.estado === "Nuevo León" && ZM_MONTERREY_MUNICIPIOS.some(m => 
      (p.ciudad || "").toLowerCase().includes(m.toLowerCase())
    );
    if (!enZMMTY) return false;
  }
  
  // Filtros existentes
  if (regionFiltro !== "Todas" && p.macro_region !== regionFiltro) return false;
  if (zonaFiltro !== "Todas" && p.zona_logistica !== zonaFiltro) return false;
  
  // v4: Filtrar por tipo de cliente (15 categorías)
  if (tipoClienteFiltro !== "Todos" && p.tipo_cliente_fcarnes !== tipoClienteFiltro) return false;
  
  // v4: Filtrar por tier basado en tipo de cliente (tier_fcarnes: 1-4)
  if (tierTipoFiltro !== "Todos" && p.tier_fcarnes !== tierTipoFiltro) return false;
  
  // Filtro de corredor logístico
  if (soloEnCorredor) {
    const distRuta = p.dist_ruta_km;
    if (distRuta === null || distRuta === undefined || distRuta > distanciaCorredor) return false;
  }
  
  // Filtro de prioritarios (usa campo pre-calculado del pipeline)
  if (soloPrioritarios) {
    if (!p.es_prioritario) return false;
  }
  
  // Filtro de cadenas (nuevo - usa campo pre-calculado del pipeline)
  if (soloCadenas) {
    if (!p.es_cadena) return false;
  }
  
  return true;
});

// Los datos de prioridad ya vienen del pipeline - no necesitamos calcularlos
const prospectosFiltradosConPrioridad = prospectosFiltrados;

const totalFiltrados = prospectosFiltrados.length;
const totalProspectos = features.length;

// v4: Usar score_ajustado (score v4) en lugar de score_total
const scorePromedio = totalFiltrados > 0
  ? prospectosFiltrados.reduce((s, f) => s + (f.properties?.score_ajustado || f.properties?.score_total || 0), 0) / totalFiltrados
  : 0;

// v4: Contar por tier basado en tipo de cliente (tier_fcarnes: 1-4)
const tier1Count = prospectosFiltrados.filter(f => f.properties?.tier_fcarnes === 1).length;
const tier2Count = prospectosFiltrados.filter(f => f.properties?.tier_fcarnes === 2).length;
const tier3Count = prospectosFiltrados.filter(f => f.properties?.tier_fcarnes === 3).length;
const tier4Count = prospectosFiltrados.filter(f => f.properties?.tier_fcarnes === 4).length;

// Stats adicionales (usando campos pre-calculados del pipeline)
const enCorredor = features.filter(f => f.properties?.en_corredor).length;
const totalPrioritarios = prospectosFiltrados.filter(f => f.properties?.es_prioritario).length;
const totalCadenas = prospectosFiltrados.filter(f => f.properties?.es_cadena).length;

// v4: Contar tipos de alto valor (Tier 1 por tipo)
const tiposAltoValor = tier1Count;
```

```js
display(kpi([
  { label: "Prospectos Filtrados", value: formatNumber(totalFiltrados), subtitle: `de ${formatNumber(totalProspectos)} totales` },
  { label: "Score v4 Promedio", value: scorePromedio.toFixed(1), subtitle: "Puntuación 0-100" },
  { label: "🟢 T1: Alto Valor", value: formatNumber(tier1Count), subtitle: "Mayoristas, Cadenas, Empacadoras" },
  { label: "🔵 T2: Alta Prioridad", value: formatNumber(tier2Count), subtitle: "Premium, HORECA, Supers" }
]));
```

<div class="note" style="background: #FFF3E0; border-left: 4px solid #FF9800; padding: 0.75rem; margin: 1rem 0; font-size: 0.9rem;">
  ⚡ <strong>Nota:</strong> Mostrando ${formatNumber(totalFiltrados)} prospectos filtrados. El mapa muestra todos los puntos, pero la tabla está limitada a los top 500 por rendimiento.
</div>

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
      <strong style="color: #b45309;">Tier (1-4 por tipo):</strong>
      <p style="margin: 0.25rem 0 0; color: #78350f;"><strong>Tier 1:</strong> Mayoristas, cadenas grandes. <strong>Tier 2:</strong> Supermercados regionales, carnicerias premium. <strong>Tier 3:</strong> Carnicerias consolidadas. <strong>Tier 4:</strong> Micro negocios. Ver detalles en <a href="./metodologia" style="color: #1d4ed8;">Metodología</a>.</p>
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

## Mapa de Prospectos

```js
// Crear GeoJSON filtrado (con info de prioridad)
const geoJsonFiltrado = {
  type: "FeatureCollection",
  features: prospectosFiltradosConPrioridad
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
        const tipoCliente = p.tipo_cliente_fcarnes;
        const score = p.score_total || p.score_ajustado || 50;
        
        // Color: prioridad = corredor > tipo_cliente v4 > tier legacy
        let color;
        let radius;
        
        if (soloEnCorredor && p.dist_ruta_km !== null) {
          // Modo corredor: colorear por proximidad
          color = getProximityColor(p.dist_ruta_km);
          radius = getRadiusForTier(tier);
        } else if (tipoCliente && TIPO_CLIENTE_COLORS[tipoCliente]) {
          // v4: Color y radio por tipo de cliente
          color = TIPO_CLIENTE_COLORS[tipoCliente];
          radius = getRadiusForTipoCliente(tipoCliente);
        } else {
          // Legacy: por tier
          color = getColorForTier(tier);
          radius = getRadiusForTier(tier);
        }
        
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
  // Leyenda dinamica v4
  // ============================================
  const legendItems = [];
  
  // Detectar si tenemos datos v4 (tipo_cliente_fcarnes)
  const tieneV4 = geoJsonFiltrado.features.some(f => f.properties?.tipo_cliente_fcarnes);
  
  // Leyenda de prospectos (solo si estan visibles)
  if (mostrarProspectos) {
    if (soloEnCorredor) {
      legendItems.push({ type: "header", label: "Proximidad a Ruta" });
      legendItems.push({ type: "circle", color: "#22c55e", label: "< 5 km" });
      legendItems.push({ type: "circle", color: "#84cc16", label: "5-15 km" });
      legendItems.push({ type: "circle", color: "#eab308", label: "15-25 km" });
      legendItems.push({ type: "circle", color: "#f97316", label: "25-50 km" });
    } else if (tieneV4) {
      // Leyenda v4 por tier de tipo de cliente
      legendItems.push({ type: "header", label: "Tier por Tipo de Cliente" });
      legendItems.push({ type: "circle", color: "#15803d", label: "T1: Alto Valor (Mayorista/Cadena)" });
      legendItems.push({ type: "circle", color: "#3b82f6", label: "T2: Alta (Premium/HORECA)" });
      legendItems.push({ type: "circle", color: "#eab308", label: "T3: Media (Consolidado)" });
      legendItems.push({ type: "circle", color: "#9ca3af", label: "T4: Baja (Micro)" });
    } else {
      // Leyenda legacy por tier
      legendItems.push({ type: "header", label: "Tier de Prioridad" });
      legendItems.push({ type: "circle", color: TIER_COLORS.A_PREMIUM, label: "A_PREMIUM (Maxima)" });
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
  
  // ============================================
  // Botón de Reset/Re-centrar mapa
  // ============================================
  const resetControl = L.control({ position: 'topleft' });
  resetControl.onAdd = function() {
    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    div.innerHTML = `
      <a href="#" title="Centrar en México" style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        background: white;
        font-size: 18px;
        text-decoration: none;
        color: #333;
      ">🎯</a>
    `;
    div.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (prospectosLayer && geoJsonFiltrado.features.length > 0) {
        fitBounds(map, prospectosLayer, 40);
      } else if (rutasLayer) {
        fitBounds(map, rutasLayer, 30);
      } else {
        map.setView([24.5, -102.5], 5);
      }
      return false;
    };
    return div;
  };
  resetControl.addTo(map);
  
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
const tablaData = prospectosFiltradosConPrioridad
  .map(f => {
    const p = f.properties || {};
    // Usar campos pre-calculados del pipeline
    const esPrio = p.es_prioritario || false;
    const esCadena = p.es_cadena || false;
    
    // v4: Obtener score v4 (sv4) o score_ajustado como fallback
    const scoreV4 = p.score_ajustado || p.score_total || 0;
    
    // v4: Formatear tipo de cliente para mostrar más legible
    const tipoRaw = p.tipo_cliente_fcarnes || "N/A";
    const tipoLegible = tipoRaw.replace(/_/g, " ").toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
    
    return {
      prioritario: esPrio ? "⭐" : "",
      cadena_info: esCadena ? { nombre: p.nombre_cadena || "Cadena", sucursales: p.num_sucursales || 0 } : null,
      nombre: p.nombre || "Sin nombre",
      estado: p.estado || "N/A",
      ciudad: p.ciudad || "N/A",
      zona_logistica: p.zona_logistica || "N/A",
      tipo_cliente: tipoLegible,  // v4: Tipo de cliente
      tier_fc: p.tier_fcarnes || 4,  // v4: Tier numérico (1-4)
      score: scoreV4,  // v4: Score ajustado
      telefono: p.telefono || "—",
      street_view: p.lat && p.lon ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${p.lat},${p.lon}` : null,
      dist_ruta: p.dist_ruta_km ?? null,
      razon_prioridad: p.razon_prioridad || "",
      nombre_cadena: p.nombre_cadena || "",
      num_sucursales: p.num_sucursales || 1,
      zona_scoring: p.zona_scoring || "N/A",
      lat: p.lat || 0,
      lon: p.lon || 0
    };
  })
  .sort((a, b) => {
    // Ordenar: primero por tier (menor=mejor), luego por score
    if (a.tier_fc !== b.tier_fc) return a.tier_fc - b.tier_fc;
    return b.score - a.score;
  });
```

```js
// Limitar a top 500 para rendimiento
const tablaLimitada = tablaData.slice(0, 500);

display(Inputs.table(tablaLimitada, {
  columns: ["prioritario", "nombre", "estado", "ciudad", "tipo_cliente", "tier_fc", "score", "telefono", "street_view"],
  header: {
    prioritario: "⭐",
    nombre: "Establecimiento",
    estado: "Estado",
    ciudad: "Ciudad",
    tipo_cliente: "Tipo Cliente",
    tier_fc: "Tier",
    score: "Score v4",
    telefono: "Teléfono",
    street_view: "Street View"
  },
  format: {
    score: d => typeof d === 'number' ? d.toFixed(1) : "—",
    tier_fc: d => `T${d}`,
    street_view: (url) => url ? htl.html`<a href="${url}" target="_blank" style="color: #2563eb; text-decoration: none;">🗺️ Ver</a>` : "—"
  },
  sort: "score",
  reverse: true,
  rows: 20,
  select: false
}));
```

```js
// Nota dinámica según cantidad de resultados
const notaTabla = tablaData.length <= 500 
  ? `Mostrando ${formatNumber(tablaData.length)} prospectos filtrados (ordenados por score)`
  : `Mostrando top 500 de ${formatNumber(tablaData.length)} prospectos filtrados (ordenados por score)`;
```

<small style="color: #666; display: block; margin-top: 0.5rem;">
  ${notaTabla}
</small>

---

## Distribución por Tipo de Cliente v4 (Selección Actual)

```js
// v4: Contar por tipo de cliente
const tipoClienteCounts = {};
for (const f of prospectosFiltrados) {
  const tipo = f.properties?.tipo_cliente_fcarnes || "OTRO";
  tipoClienteCounts[tipo] = (tipoClienteCounts[tipo] || 0) + 1;
}

// Ordenar por cantidad descendente y tomar top 10
const tipoClienteData = Object.entries(tipoClienteCounts)
  .map(([tipo, count]) => ({ tipo, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);

// Colores por tipo de cliente v4
const TIPO_COLORS_MAP = {
  "DISTRIBUIDOR_MAYORISTA": "#15803d",
  "CADENA_CARNICERIA_GRANDE": "#22c55e",
  "PROCESADOR_TROMPO": "#16a34a",
  "EMPACADORA_INDUSTRIAL": "#4ade80",
  "SUPERMERCADO_REGIONAL": "#1d4ed8",
  "CARNICERIA_PREMIUM": "#3b82f6",
  "HORECA_ALTO_VOLUMEN": "#60a5fa",
  "TAQUERIA_CADENA": "#93c5fd",
  "CARNICERIA_CONSOLIDADA": "#ca8a04",
  "OBRADOR_TRADICIONAL": "#eab308",
  "RESTAURANTE_CARNES": "#fbbf24",
  "TAQUERIA_INDIVIDUAL": "#fcd34d",
  "CARNICERIA_MICRO": "#9ca3af",
  "MINISUPER_CARNES": "#d1d5db",
  "CREMERIA_CARNES": "#e5e7eb",
  "OTRO": "#6b7280"
};
```

```js
import * as Plot from "npm:@observablehq/plot";

display(resize((width) => Plot.plot({
  width: Math.min(width, 600),
  height: Math.max(300, tipoClienteData.length * 35),  // Altura dinámica: 35px por barra
  marginLeft: 180,
  x: { label: "Cantidad", grid: true },
  y: { label: null },
  marks: [
    Plot.barX(tipoClienteData, {
      y: "tipo",
      x: "count",
      fill: d => TIPO_COLORS_MAP[d.tipo] || "#666",
      sort: { y: "x", reverse: true }
    }),
    Plot.text(tipoClienteData, {
      y: "tipo",
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
  <div class="card" style="border-left: 4px solid #3b82f6;">
    <h4 style="margin-top: 0; color: #1d4ed8;">📋 Para el Equipo Comercial</h4>
    <ol style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #555; line-height: 1.6;">
      <li>Filtra por <strong>"Solo Prioritarios"</strong> para Tier 1 y 2 (mayoristas, cadenas, supermercados)</li>
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
  <strong>Prospectos verificados:</strong> ${formatNumber(totalProspectos)} (filtrados por calidad) | Datos DENUE + Scoring v4<br>
  <strong>Scoring v4:</strong> 15 tipos de cliente específicos FCarnes | Rastros y pollerías excluidos automáticamente<br>
  <strong>STRTGY</strong> — Transformando complejidad en certeza | Proyecto FCarnes | Enero 2026
</small>

