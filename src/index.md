---
title: Censo Estratégico Nacional FCarnes
toc: false
theme: ["cotton", "wide"]
---

```js
import {kpi, formatNumber, formatPercent, formatCompact, bigNumber, navCard, note, COLORS} from "./components/ui.js";
import {heroFCarnes, decisionCallout, coberturaGeografica, navigationCards, metricsBar, insightCallout, strtgyFooter, REGION_COLORS} from "./components/brand.js";
import * as Plot from "npm:@observablehq/plot";

// Cargar datos
const tamRegion = await FileAttachment("data/tam_por_macroregion.csv").csv({typed: true});
const topCiudades = await FileAttachment("data/tam_top50_ciudades.csv").csv({typed: true});
const costosLogisticos = await FileAttachment("data/costos_logisticos.json").json();
const prospectosData = await FileAttachment("data/prospectos_sample.json").json();

// Calcular métricas agregadas
const tamBruto = tamRegion.reduce((s, r) => s + r.tam_bruto, 0);
const tamNeto = tamRegion.reduce((s, r) => s + r.tam_neto, 0);
const clientesActuales = tamRegion.reduce((s, r) => s + r.clientes_fcarnes, 0);
const penetracion = (clientesActuales / tamBruto * 100);
const regionesOrdenadas = [...tamRegion].sort((a, b) => b.tam_neto - a.tam_neto);
const topCiudad = topCiudades.sort((a, b) => b.tam_neto - a.tam_neto)[0];

// Calcular prospectos por tier (solo A y B para oportunidades prioritarias)
const allFeatures = prospectosData?.features || [];
const prospectosAPremium = allFeatures.filter(f => f.properties?.t === "A_PREMIUM").length;
const prospectosBAlta = allFeatures.filter(f => f.properties?.t === "B_ALTA").length;
const oportunidadesPrioritarias = prospectosAPremium + prospectosBAlta;
```

```js
// Hero compacto con métricas integradas
display(heroFCarnes({
  title: "Censo Estratégico Nacional",
  subtitle: "Canal Tradicional (Carnicerías y Obradores)",
  context: "Inteligencia geoestadística para identificar y priorizar prospectos en el mercado nacional de carnes.",
  metrics: [
    { value: formatCompact(tamBruto), label: "TAM Total" },
    { value: formatCompact(oportunidadesPrioritarias), label: "A + B" },
    { value: formatCompact(clientesActuales), label: "Clientes" }
  ]
}));
```

## Resumen Ejecutivo

```js
display(kpi([
  { 
    label: "TAM Bruto Nacional", 
    value: formatNumber(tamBruto),
    subtitle: "Establecimientos de carnes",
    color: "primary",
    icon: "🎯"
  },
  { 
    label: "Clientes FCarnes", 
    value: formatNumber(clientesActuales),
    subtitle: `${formatPercent(penetracion)} penetración`,
    color: "success",
    icon: "✅"
  },
  { 
    label: "Oportunidades A + B", 
    value: formatNumber(oportunidadesPrioritarias),
    subtitle: `${formatNumber(prospectosAPremium)} Premium + ${formatNumber(prospectosBAlta)} Alta`,
    color: "info",
    icon: "⭐"
  },
  { 
    label: "Top Ciudad", 
    value: topCiudad?.municipio || "N/A",
    subtitle: `${formatNumber(topCiudad?.tam_neto || 0)} prospectos`,
    color: "warning",
    icon: "🏆"
  }
]));
```

---

<div class="grid grid-cols-2">

```js
display(decisionCallout({
  title: "¿Qué decidir con este análisis?",
  items: [
    "Priorizar macro-regiones con mayor oportunidad",
    "Identificar ciudades clave para expansión inmediata",
    "Validar prospectos visualmente con Street View",
    "Optimizar rutas de ventas por zona logística"
  ]
}));
```

```js
display(coberturaGeografica({
  "NORESTE": "Nuevo León, Tamaulipas, Coahuila, SLP",
  "CENTRO": "CDMX, Edo.Méx, Hidalgo, Morelos, Puebla",
  "GOLFO_SURESTE": "Veracruz, Tabasco, Chiapas, Oaxaca",
  "OCCIDENTE": "Jalisco, Colima, Nayarit, Michoacán",
  "BAJIO": "Guanajuato, Querétaro, Aguascalientes",
  "PENINSULA": "Quintana Roo, Yucatán, Campeche",
  "FRONTERA_NORTE": "Chihuahua, BC, Sonora, BCS",
  "NOROESTE": "Sinaloa, Durango, Zacatecas"
}));
```

</div>

---

## 🗺️ Distribución por Macro-Región

```js
// Filtro interactivo de región
const regionFiltro = view(Inputs.select(
  ["Todas las regiones", ...regionesOrdenadas.map(r => r.macro_region)],
  { 
    label: "Filtrar región",
    value: "Todas las regiones"
  }
));
```

```js
// Datos filtrados según selección
const datosMostrar = regionFiltro === "Todas las regiones" 
  ? regionesOrdenadas 
  : regionesOrdenadas.filter(r => r.macro_region === regionFiltro);

const tamFiltrado = datosMostrar.reduce((s, r) => s + r.tam_neto, 0);
const clientesFiltrado = datosMostrar.reduce((s, r) => s + r.clientes_fcarnes, 0);
```

<div class="grid grid-cols-3" style="margin-bottom: 1rem;">
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #FEF5F5 0%, #fff 100%); border-left: 4px solid #C41E3A;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Prospectos</div>
    <div style="font-size: 1.75rem; font-weight: 700; color: #C41E3A;">${formatNumber(tamFiltrado)}</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #E8F5E9 0%, #fff 100%); border-left: 4px solid #4CAF50;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Clientes</div>
    <div style="font-size: 1.75rem; font-weight: 700; color: #2E7D32;">${formatNumber(clientesFiltrado)}</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #E3F2FD 0%, #fff 100%); border-left: 4px solid #2196F3;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Regiones</div>
    <div style="font-size: 1.75rem; font-weight: 700; color: #1565C0;">${datosMostrar.length}</div>
  </div>
</div>

```js
display(resize((width) => Plot.plot({
  width,
  height: Math.max(200, datosMostrar.length * 45 + 60),
  marginLeft: 140,
  marginRight: 100,
  x: { 
    label: "Prospectos (TAM Neto) →", 
    grid: true,
    tickFormat: d => d >= 1000 ? `${(d/1000).toFixed(0)}K` : d
  },
  y: { label: null },
  marks: [
    // Barra de fondo (TAM bruto como contexto)
    Plot.barX(datosMostrar, {
      y: "macro_region",
      x: "tam_bruto",
      fill: "#f0f0f0",
      sort: { y: "-x" }
    }),
    // Barra principal coloreada
    Plot.barX(datosMostrar, {
      y: "macro_region",
      x: "tam_neto",
      fill: d => REGION_COLORS[d.macro_region] || "#666",
      sort: { y: "-x" },
      tip: {
        format: {
          y: false,
          x: false
        }
      },
      title: d => `${d.macro_region}\n━━━━━━━━━━━━━━━━\n📊 TAM Neto: ${formatNumber(d.tam_neto)}\n👥 Clientes: ${d.clientes_fcarnes}\n📈 Penetración: ${(d.clientes_fcarnes/d.tam_bruto*100).toFixed(1)}%\n🚛 Dist. Sakbe: ${d.distancia_sakbe_km ? Math.round(d.distancia_sakbe_km) + ' km' : 'N/A'}`
    }),
    // Etiquetas con valores
    Plot.text(datosMostrar, {
      y: "macro_region",
      x: "tam_neto",
      text: d => `${formatNumber(d.tam_neto)} (${d.clientes_fcarnes} cli)`,
      dx: 5,
      textAnchor: "start",
      fontWeight: "600",
      fontSize: 11,
      fill: "#333"
    }),
    Plot.ruleX([0])
  ]
})));
```

```js
display(insightCallout({
  title: "Insight Estratégico",
  content: `FCarnes tiene 71% de penetración en NORESTE (${formatNumber(regionesOrdenadas.find(r => r.macro_region === "NORESTE")?.clientes_fcarnes || 0)} clientes). Las mayores oportunidades están en CENTRO (${formatNumber(regionesOrdenadas.find(r => r.macro_region === "CENTRO")?.tam_neto || 0)}) y GOLFO_SURESTE (${formatNumber(regionesOrdenadas.find(r => r.macro_region === "GOLFO_SURESTE")?.tam_neto || 0)}) con menos del 0.1% de penetración actual.`,
  type: "highlight"
}));
```

---

## 🚛 Costos Logísticos por Ruta (Sakbe INEGI)

<div class="grid grid-cols-4">
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #E3F2FD 0%, #fff 100%); border-bottom: 3px solid #1565C0;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Rutas Calculadas</div>
    <div style="font-size: 2rem; font-weight: 700; color: #1565C0;">${costosLogisticos.resumen?.total_rutas || "N/A"}</div>
    <div style="font-size: 0.7rem; color: #666;">${costosLogisticos.resumen?.rutas_con_casetas || 0} con casetas</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #E8F5E9 0%, #fff 100%); border-bottom: 3px solid #4CAF50;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Distancia Máxima</div>
    <div style="font-size: 2rem; font-weight: 700; color: #2E7D32;">${formatNumber(costosLogisticos.resumen?.distancia_max_km || 0)} km</div>
    <div style="font-size: 0.7rem; color: #666;">Prom: ${costosLogisticos.resumen?.distancia_promedio_km || 0} km</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #FFF3E0 0%, #fff 100%); border-bottom: 3px solid #FF9800;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Casetas Promedio</div>
    <div style="font-size: 2rem; font-weight: 700; color: #E65100;">$${formatNumber(costosLogisticos.resumen?.costo_casetas_promedio || 0)}</div>
    <div style="font-size: 0.7rem; color: #666;">Solo rutas de cuota</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #FCE4EC 0%, #fff 100%); border-bottom: 3px solid #C41E3A;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Costo Máximo</div>
    <div style="font-size: 2rem; font-weight: 700; color: #C41E3A;">$${formatNumber(costosLogisticos.resumen?.costo_max_mxn || 0)}</div>
    <div style="font-size: 0.7rem; color: #666;">Prom: $${formatNumber(costosLogisticos.resumen?.costo_total_promedio || 0)}</div>
  </div>
</div>

```js
// Top 10 rutas más costosas (ya vienen ordenadas por costo total desc)
const topRutas = (costosLogisticos.rutas_principales || []).slice(0, 10);

// Orden de ciudades para el eje Y (por costo total descendente)
const ordenCiudades = topRutas.map(r => r.ciudad);

// Transformar datos para barras agrupadas
const datosBarras = [];
for (const r of topRutas) {
  datosBarras.push({ 
    ciudad: r.ciudad, 
    tipo: "Casetas", 
    valor: r.costo_casetas_mxn || 0,
    distancia: r.distancia_km,
    total: r.costo_total_mxn
  });
  datosBarras.push({ 
    ciudad: r.ciudad, 
    tipo: "Combustible", 
    valor: r.costo_combustible_mxn || 0,
    distancia: r.distancia_km,
    total: r.costo_total_mxn
  });
}

display(resize((width) => Plot.plot({
  width,
  height: 500,
  marginLeft: 110,
  marginRight: 100,
  x: { 
    label: "Costo por Viaje (MXN) →", 
    grid: true,
    tickFormat: d => `$${d >= 1000 ? (d/1000).toFixed(1) + 'K' : d}`
  },
  y: { 
    label: null, 
    padding: 0.2,
    domain: ["Casetas", "Combustible"]
  },
  fy: { 
    label: null, 
    padding: 0.15,
    domain: ordenCiudades
  },
  color: {
    domain: ["Casetas", "Combustible"],
    range: ["#1565C0", "#FF9800"],
    legend: true
  },
  marks: [
    Plot.barX(datosBarras, {
      y: "tipo",
      fy: "ciudad",
      x: "valor",
      fill: "tipo",
      title: d => `${d.ciudad}\n${d.tipo}: $${d.valor.toLocaleString()}\nDistancia: ${d.distancia} km\nTotal viaje: $${d.total.toLocaleString()}`
    }),
    Plot.text(datosBarras, {
      y: "tipo",
      fy: "ciudad",
      x: "valor",
      text: d => `$${d.valor.toLocaleString()}`,
      dx: 5,
      textAnchor: "start",
      fontWeight: "600",
      fontSize: 9,
      fill: "#333"
    }),
    Plot.ruleX([0])
  ]
})));
```

<div style="display: flex; gap: 2rem; justify-content: center; margin: 0.75rem 0; font-size: 0.85rem;">
  <span style="display: flex; align-items: center; gap: 0.35rem;">
    <span style="display: inline-block; width: 14px; height: 14px; background: #1565C0; border-radius: 3px;"></span>
    Casetas
  </span>
  <span style="display: flex; align-items: center; gap: 0.35rem;">
    <span style="display: inline-block; width: 14px; height: 14px; background: #FF9800; border-radius: 3px;"></span>
    Combustible (diesel)
  </span>
</div>

```js
// Tabla detallada de rutas
display(Inputs.table(topRutas, {
  columns: ["ciudad", "distancia_km", "tiempo_horas", "costo_casetas_mxn", "costo_combustible_mxn", "costo_total_mxn"],
  header: {
    ciudad: "Destino",
    distancia_km: "Distancia",
    tiempo_horas: "Tiempo",
    costo_casetas_mxn: "Casetas",
    costo_combustible_mxn: "Combustible",
    costo_total_mxn: "Total"
  },
  format: {
    distancia_km: d => `${formatNumber(d)} km`,
    tiempo_horas: d => `${d}h`,
    costo_casetas_mxn: d => `$${formatNumber(d)}`,
    costo_combustible_mxn: d => `$${formatNumber(d)}`,
    costo_total_mxn: d => `$${formatNumber(d)}`
  },
  rows: 10
}));
```

<div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem 1rem; margin: 1rem 0; border-radius: 0 8px 8px 0; font-size: 0.9rem;">
  <strong>📊 Fuente:</strong> Costos calculados con <strong>INEGI Sakbe API</strong> (rutas óptimas reales). 
  Incluye casetas de la ruta más económica desde Planta FCarnes Monterrey. 
  Combustible estimado para camión 2 ejes (6 km/L diesel).
</div>

---

## 🧭 Navegación del Dashboard

```js
display(navigationCards([
  {
    href: "./tam-regional",
    icon: "📊",
    title: "TAM por Región",
    description: "Análisis detallado de oportunidad por macro-región, distancias Sakbe y costos logísticos",
    badge: `${tamRegion.length} regiones`
  },
  {
    href: "./explorador-prospectos",
    icon: "🗺️",
    title: "Explorador de Prospectos",
    description: "Mapa interactivo con filtros, análisis IA y validación Street View",
    badge: `${formatCompact(tamBruto)} prospectos`
  },
  {
    href: "./descargas",
    icon: "📥",
    title: "Descargas",
    description: "Exportar bases de datos para CRM, Excel y análisis offline",
    badge: "CSV, XLSX"
  }
]));
```

---

## 🏆 Top 10 Ciudades por Oportunidad

```js
const top10 = topCiudades.slice(0, 10);
```

```js
display(Inputs.table(top10, {
  columns: ["municipio", "macro_region", "tam_neto", "clientes_fcarnes", "penetracion_pct"],
  header: {
    municipio: "Ciudad",
    macro_region: "Región",
    tam_neto: "TAM Neto",
    clientes_fcarnes: "Clientes",
    penetracion_pct: "Penetración"
  },
  format: {
    tam_neto: d => formatNumber(d),
    penetracion_pct: d => d ? `${d.toFixed(1)}%` : "0%"
  },
  sort: "tam_neto",
  reverse: true,
  rows: 10
}));
```

<div style="text-align: center; margin-top: 1rem;">
  <a href="./tam-regional" style="
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #C41E3A;
    font-weight: 600;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 2px solid #C41E3A;
    border-radius: 8px;
    transition: all 0.2s;
  ">Ver análisis completo por región →</a>
</div>

---

## 📋 Metodología y Fuentes

<div class="grid grid-cols-2">
  <div class="card" style="border-left: 4px solid #1565C0;">
    <h4 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem; color: #1565C0;">
      <span>📋</span> Alcance del Censo
    </h4>
    <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; color: #555; line-height: 1.6;">
      <li><strong>Canal:</strong> Tradicional consolidado (Carnicerías, Obradores)</li>
      <li><strong>Fuentes:</strong> DENUE INEGI 2024, Google Maps</li>
      <li><strong>Cobertura:</strong> 9 macro-regiones nacionales</li>
      <li><strong>Validación:</strong> Links Street View para cada prospecto</li>
    </ul>
  </div>
  <div class="card" style="border-left: 4px solid #2E7D32;">
    <h4 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem; color: #2E7D32;">
      <span>🎯</span> Entregables Incluidos
    </h4>
    <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; color: #555; line-height: 1.6;">
      <li>Dashboard interactivo de ubicaciones</li>
      <li>Base de datos depurada con distancia a planta</li>
      <li>Reporte TAM por ciudad y macro-región</li>
      <li>Análisis IA de fachadas para prospectos premium</li>
    </ul>
  </div>
</div>

---

```js
display(strtgyFooter());
```
