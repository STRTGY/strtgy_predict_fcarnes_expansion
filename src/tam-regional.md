---
title: TAM por Macro-Región
toc: false
---

```js
import * as Plot from "npm:@observablehq/plot";
import {kpi, formatNumber, formatPercent, formatDistance, note} from "./components/ui.js";
import {insightCallout} from "./components/brand.js";

// Cargar datos
const tamRegion = await FileAttachment("data/tam_por_macroregion.csv").csv({typed: true});
const topCiudades = await FileAttachment("data/tam_top50_ciudades.csv").csv({typed: true});

// Ordenar regiones por TAM Neto
const regionesOrdenadas = [...tamRegion].sort((a, b) => b.tam_neto - a.tam_neto);

// Totales
const totalTamNeto = tamRegion.reduce((s, r) => s + r.tam_neto, 0);
const totalClientes = tamRegion.reduce((s, r) => s + r.clientes_fcarnes, 0);
```

<h1 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
  <span style="font-size: 1.5rem;">📊</span> TAM por Macro-Región
</h1>

<p style="color: #666; margin-top: 0;">
  Análisis de oportunidad de mercado segmentado por región geográfica. Prioriza regiones con alto volumen y cercanía a planta.
</p>

---

## Métricas Agregadas

```js
display(kpi([
  { label: "Total TAM Neto", value: formatNumber(totalTamNeto), subtitle: "Prospectos nacionales" },
  { label: "Clientes Actuales", value: formatNumber(totalClientes), subtitle: "Base instalada" },
  { label: "Regiones Analizadas", value: tamRegion.length, subtitle: "Macro-regiones" },
  { label: "Región Top", value: regionesOrdenadas[0]?.macro_region || "N/A", subtitle: `${formatNumber(regionesOrdenadas[0]?.tam_neto)} prospectos` }
]));
```

---

## 🎯 TAM Mayorista (Incentivo Alto)

<div class="note" style="background: #FCE4EC; border-left: 4px solid #C41E3A; padding: 1rem; margin: 1rem 0;">
  <strong>💰 Mayoristas = Pedidos Grandes:</strong> Los <strong>1,225 mayoristas nacionales</strong> representan clientes de alto volumen que pueden justificar abrir rutas lejanas. Se requiere un análisis costo-beneficio con distancias reales (Sakbe INEGI).
</div>

```js
// Datos de mayoristas por región
const mayoristasData = tamRegion.map(r => ({
  macro_region: r.macro_region,
  tam_mayorista: r.tam_mayorista || 0,
  distancia_sakbe_km: r.distancia_sakbe_km || 0,
  costo_logistico_mxn: r.costo_logistico_mxn || 0
})).sort((a, b) => b.tam_mayorista - a.tam_mayorista);

const totalMayoristas = mayoristasData.reduce((s, r) => s + r.tam_mayorista, 0);
```

```js
display(kpi([
  { label: "Total Mayoristas", value: formatNumber(totalMayoristas), subtitle: "Clientes de alto volumen" },
  { label: "Mayoristas en CENTRO", value: formatNumber(mayoristasData.find(r => r.macro_region === "CENTRO")?.tam_mayorista || 0), subtitle: "Mayor concentración" },
  { label: "Mayoristas en NORESTE", value: formatNumber(mayoristasData.find(r => r.macro_region === "NORESTE")?.tam_mayorista || 0), subtitle: "Mercado principal" },
  { label: "Costo Promedio Ruta", value: `$${formatNumber(Math.round(mayoristasData.reduce((s, r) => s + (r.costo_logistico_mxn || 0), 0) / mayoristasData.length))}`, subtitle: "Por viaje (Sakbe)" }
]));
```

```js
display(resize((width) => Plot.plot({
  width,
  height: 320,
  marginLeft: 140,
  marginRight: 100,
  x: { label: "Mayoristas (establecimientos)", grid: true },
  y: { label: null },
  marks: [
    Plot.barX(mayoristasData, {
      y: "macro_region",
      x: "tam_mayorista",
      fill: d => regionColors[d.macro_region] || "#666",
      sort: { y: "-x" },
      tip: true,
      title: d => `${d.macro_region}\nMayoristas: ${d.tam_mayorista}\nDist. Sakbe: ${Math.round(d.distancia_sakbe_km)} km\nCosto: $${formatNumber(Math.round(d.costo_logistico_mxn))}`
    }),
    Plot.text(mayoristasData, {
      y: "macro_region",
      x: "tam_mayorista",
      text: d => `${d.tam_mayorista} | $${formatNumber(Math.round(d.costo_logistico_mxn))}`,
      dx: 5,
      textAnchor: "start",
      fill: "#333",
      fontWeight: "600",
      fontSize: 11
    }),
    Plot.ruleX([0])
  ]
})));
```

<div class="grid grid-cols-2" style="margin-top: 1rem;">
  <div class="card" style="background: linear-gradient(135deg, #E8F5E9 0%, #fff 100%);">
    <h4 style="margin-top: 0; color: #2E7D32;">✅ Rutas Rentables (< $5,000/viaje)</h4>
    <p style="margin: 0; font-size: 0.9rem;">
      <strong>NORESTE:</strong> 193 mayoristas a 128 km (<strong>$781/viaje</strong>) ✓ Sakbe<br>
      <strong>BAJÍO:</strong> 121 mayoristas a 633 km (<strong>$3,773/viaje</strong>) ✓ Sakbe
    </p>
    <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
      📊 Alto margen. Casetas: $219-$991 | Combustible: $562-$2,781
    </p>
  </div>
  <div class="card" style="background: linear-gradient(135deg, #FFF3E0 0%, #fff 100%);">
    <h4 style="margin-top: 0; color: #E65100;">🟡 Moderados ($5,000-$7,000/viaje)</h4>
    <p style="margin: 0; font-size: 0.9rem;">
      <strong>OCCIDENTE:</strong> 177 mayoristas a 904 km (<strong>$5,939/viaje</strong>) ✓ Sakbe<br>
      <strong>FRONTERA_NORTE:</strong> 143 mayoristas a 840 km (<strong>$6,098/viaje</strong>)
    </p>
    <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
      💼 Requieren pedidos mínimos ~$20K para rentabilidad
    </p>
  </div>
</div>

<div class="grid grid-cols-2" style="margin-top: 0.5rem;">
  <div class="card" style="background: linear-gradient(135deg, #FFEBEE 0%, #fff 100%);">
    <h4 style="margin-top: 0; color: #C41E3A;">⚠️ Alto Costo (> $7,000/viaje)</h4>
    <p style="margin: 0; font-size: 0.9rem;">
      <strong>CENTRO:</strong> 346 mayoristas a 1,065 km (<strong>$7,148/viaje</strong>) ✓ Sakbe<br>
      <strong>GOLFO_SURESTE:</strong> 115 mayoristas a 1,329 km (<strong>$9,044/viaje</strong>)
    </p>
  </div>
  <div class="card" style="background: linear-gradient(135deg, #F3E5F5 0%, #fff 100%);">
    <h4 style="margin-top: 0; color: #7B1FA2;">🔮 Evaluar Franquicia</h4>
    <p style="margin: 0; font-size: 0.9rem;">
      <strong>PENÍNSULA:</strong> 50 mayoristas a 1,644 km (<strong>$11,188/viaje</strong>)<br>
      <strong>NOROESTE:</strong> 80 mayoristas a 799 km (<strong>$6,999/viaje</strong>)
    </p>
  </div>
</div>

<div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem; margin: 1rem 0; font-size: 0.85rem;">
  <strong>✓ Metodología Sakbe:</strong> Distancias y costos calculados con <strong>ruteo segmentado</strong> usando INEGI Sakbe API.
  Rutas largas divididas en tramos de ~350km para mayor precisión. Costos: casetas reales + diesel ($23.5/L, 6 km/L).
</div>

---

## TAM Neto por Macro-Región (Total)

```js
// Colores por región (8 regiones, sin OTRA)
const regionColors = {
  "NORESTE": "#C41E3A",        // Rojo FCarnes - mercado principal
  "CENTRO": "#1565C0",         // Azul - megalópolis
  "GOLFO_SURESTE": "#2E7D32",  // Verde - emergente
  "OCCIDENTE": "#7B1FA2",      // Púrpura
  "BAJIO": "#F57C00",          // Naranja - industrial
  "PENINSULA": "#00838F",      // Teal - presencia (32 cli)
  "FRONTERA_NORTE": "#5D4037", // Café
  "NOROESTE": "#546E7A"        // Gris azul
};
```

```js
display(resize((width) => Plot.plot({
  width,
  height: 350,
  marginLeft: 140,
  marginRight: 80,
  x: { label: "TAM Neto (Prospectos)", grid: true },
  y: { label: null },
  marks: [
    Plot.barX(regionesOrdenadas, {
      y: "macro_region",
      x: "tam_neto",
      fill: d => regionColors[d.macro_region] || "#666",
      sort: { y: "-x" },
      tip: {
        format: {
          y: false,
          x: d => formatNumber(d)
        }
      }
    }),
    Plot.text(regionesOrdenadas, {
      y: "macro_region",
      x: "tam_neto",
      text: d => formatNumber(d.tam_neto),
      dx: 5,
      textAnchor: "start",
      fill: "#333",
      fontWeight: "600",
      fontSize: 12
    }),
    Plot.ruleX([0])
  ]
})));
```

```js
const noreste = regionesOrdenadas.find(r => r.macro_region === "NORESTE");
display(insightCallout({
  title: "Priorización Estratégica",
  content: `NORESTE tiene ${noreste?.penetracion_pct?.toFixed(0) || 0}% de penetración (${formatNumber(noreste?.clientes_fcarnes || 0)} clientes). Las mayores oportunidades están en CENTRO (${formatNumber(regionesOrdenadas.find(r => r.macro_region === "CENTRO")?.tam_neto || 0)}) y GOLFO_SURESTE (${formatNumber(regionesOrdenadas.find(r => r.macro_region === "GOLFO_SURESTE")?.tam_neto || 0)}) con <0.1% penetración.`,
  type: "highlight"
}));
```

---

## Penetración Actual por Región

```js
display(resize((width) => Plot.plot({
  width,
  height: 300,
  marginLeft: 140,
  marginRight: 60,
  x: { 
    label: "Penetración (%)", 
    grid: true,
    domain: [0, Math.max(...tamRegion.map(d => d.penetracion_pct)) * 1.3]
  },
  y: { label: null },
  marks: [
    Plot.barX(regionesOrdenadas, {
      y: "macro_region",
      x: "penetracion_pct",
      fill: "#3498DB",
      sort: { y: "-x" },
      tip: true
    }),
    Plot.text(regionesOrdenadas, {
      y: "macro_region",
      x: "penetracion_pct",
      text: d => formatPercent(d.penetracion_pct),
      dx: 5,
      textAnchor: "start",
      fill: "#333",
      fontWeight: "600"
    }),
    Plot.ruleX([0])
  ]
})));
```

<div class="note" style="background: #E3F2FD; border-left: 4px solid #2196F3; padding: 1rem; margin: 1rem 0;">
  <strong>💡 Interpretación:</strong> Mayor penetración indica presencia consolidada de FCarnes. Regiones con baja penetración y alto TAM (ej. CENTRO, OCCIDENTE) representan <strong>territorios de expansión</strong> con mínima canibalización.
</div>

---

## Comparativo: TAM vs Distancia (Sakbe)

```js
// Filtrar regiones con distancia Sakbe válida
const regionesConDistancia = tamRegion.filter(d => d.distancia_sakbe_km > 0);
```

```js
// Preparar datos con radio calculado
const dataConRadio = regionesConDistancia.map(d => {
  const minTam = 1700;
  const maxTam = 20000;
  const normalized = Math.max(0, Math.min(1, (d.tam_neto - minTam) / (maxTam - minTam)));
  return {
    ...d,
    radio: 12 + normalized * 45  // rango de 12 a 57 pixels
  };
});
```

```js
display(resize((width) => Plot.plot({
  width,
  height: 450,
  marginLeft: 70,
  marginBottom: 50,
  marginTop: 40,
  x: { 
    label: "Distancia en ruta Sakbe (km) →", 
    grid: true,
    domain: [0, 1800]
  },
  y: { 
    label: "↑ TAM Neto (prospectos)", 
    grid: true,
    domain: [0, 22000]
  },
  r: { range: [12, 57] },
  marks: [
    // Zonas de fondo
    Plot.rect([{x1: 0, x2: 300, y1: 0, y2: 22000}], {
      x1: "x1", x2: "x2", y1: "y1", y2: "y2",
      fill: "#E8F5E9", fillOpacity: 0.4
    }),
    Plot.rect([{x1: 300, x2: 700, y1: 0, y2: 22000}], {
      x1: "x1", x2: "x2", y1: "y1", y2: "y2",
      fill: "#FFF3E0", fillOpacity: 0.4
    }),
    Plot.rect([{x1: 700, x2: 1800, y1: 0, y2: 22000}], {
      x1: "x1", x2: "x2", y1: "y1", y2: "y2",
      fill: "#FFEBEE", fillOpacity: 0.4
    }),
    // Líneas de referencia
    Plot.ruleX([300], { stroke: "#4CAF50", strokeDasharray: "4,4", strokeWidth: 2 }),
    Plot.ruleX([700], { stroke: "#FF9800", strokeDasharray: "4,4", strokeWidth: 2 }),
    Plot.ruleX([1000], { stroke: "#F44336", strokeDasharray: "4,4", strokeWidth: 2 }),
    // Burbujas - usando "radio" como canal
    Plot.dot(dataConRadio, {
      x: "distancia_sakbe_km",
      y: "tam_neto",
      r: "radio",
      fill: d => regionColors[d.macro_region] || "#666",
      fillOpacity: 0.75,
      stroke: "#fff",
      strokeWidth: 2,
      tip: true,
      title: d => `${d.macro_region}\nTAM Neto: ${formatNumber(d.tam_neto)}\nDistancia Sakbe: ${Math.round(d.distancia_sakbe_km)} km\nCosto logístico: $${formatNumber(Math.round(d.costo_logistico_mxn))}\nClientes: ${d.clientes_fcarnes}`
    }),
    // Etiquetas
    Plot.text(dataConRadio, {
      x: "distancia_sakbe_km",
      y: "tam_neto",
      text: "macro_region",
      dy: d => -(d.radio + 10),
      fontSize: 11,
      fontWeight: "700",
      fill: "#333"
    }),
    Plot.ruleX([0])
  ]
})));
```

<div style="text-align: center; margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
  <strong>Tamaño de burbuja = TAM Neto</strong> (mayor círculo = más prospectos)
</div>

<div class="grid grid-cols-3" style="margin-top: 0.5rem;">
  <div style="text-align: center; font-size: 0.85rem; background: #E8F5E9; padding: 0.5rem; border-radius: 4px;">
    <span style="color: #4CAF50; font-weight: 600;">● < 300 km</span><br>
    <span style="color: #666;">Zona LOCAL (~$800)</span>
  </div>
  <div style="text-align: center; font-size: 0.85rem; background: #FFF3E0; padding: 0.5rem; border-radius: 4px;">
    <span style="color: #FF9800; font-weight: 600;">● 300-700 km</span><br>
    <span style="color: #666;">Zona FORÁNEA (~$4,000)</span>
  </div>
  <div style="text-align: center; font-size: 0.85rem; background: #FFEBEE; padding: 0.5rem; border-radius: 4px;">
    <span style="color: #F44336; font-weight: 600;">● > 700 km</span><br>
    <span style="color: #666;">Zona LEJANA (~$7,000+)</span>
  </div>
</div>

<div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem; margin: 1rem 0; font-size: 0.85rem;">
  <strong>✓ Distancias Sakbe:</strong> Distancias calculadas con <strong>ruteo real por carretera</strong> usando INEGI Sakbe API.
  Incluyen casetas + combustible diesel para camión 2 ejes (6 km/L, $23.5/L).
</div>

---

## Top 20 Ciudades por Oportunidad

```js
const top20 = topCiudades.slice(0, 20);
```

```js
display(Inputs.table(top20, {
  columns: ["municipio", "macro_region", "tam_neto", "clientes_fcarnes", "penetracion_pct"],
  header: {
    municipio: "Ciudad",
    macro_region: "Región",
    tam_neto: "TAM Neto",
    clientes_fcarnes: "Clientes FCarnes",
    penetracion_pct: "Penetración %"
  },
  format: {
    tam_neto: d => formatNumber(d),
    penetracion_pct: d => d ? `${d.toFixed(1)}%` : "0%"
  },
  sort: "tam_neto",
  reverse: true,
  rows: 20
}));
```

---

## Resumen por Región (Tabla)

```js
display(Inputs.table(regionesOrdenadas, {
  columns: ["macro_region", "tam_bruto", "clientes_fcarnes", "tam_neto", "penetracion_pct", "distancia_sakbe_km", "costo_logistico_mxn"],
  header: {
    macro_region: "Macro-Región",
    tam_bruto: "TAM Bruto",
    clientes_fcarnes: "Clientes FCarnes",
    tam_neto: "TAM Neto",
    penetracion_pct: "Penetración %",
    distancia_sakbe_km: "Dist. Sakbe (km)",
    costo_logistico_mxn: "Costo Viaje"
  },
  format: {
    tam_bruto: d => formatNumber(d),
    tam_neto: d => formatNumber(d),
    penetracion_pct: d => d ? `${d.toFixed(1)}%` : "0%",
    distancia_sakbe_km: d => d ? `${Math.round(d)} km` : "-",
    costo_logistico_mxn: d => d ? `$${formatNumber(Math.round(d))}` : "-"
  }
}));
```

---

## Recomendaciones por Fase

```js
const getNoreste = regionesOrdenadas.find(r => r.macro_region === "NORESTE");
const getBajio = regionesOrdenadas.find(r => r.macro_region === "BAJIO");
const getNoroeste = regionesOrdenadas.find(r => r.macro_region === "NOROESTE");
const getCentro = regionesOrdenadas.find(r => r.macro_region === "CENTRO");
const getOccidente = regionesOrdenadas.find(r => r.macro_region === "OCCIDENTE");
const getGolfo = regionesOrdenadas.find(r => r.macro_region === "GOLFO_SURESTE");
const getPeninsula = regionesOrdenadas.find(r => r.macro_region === "PENINSULA");
```

<div class="grid grid-cols-4">
  <div class="card" style="border-left: 4px solid #4CAF50;">
    <h4 style="margin-top: 0; color: #4CAF50;">🟢 Fase 1: Consolidar</h4>
    <p style="margin: 0; font-size: 0.85rem; color: #555;">
      <strong>NORESTE</strong> (71% penetración)<br>
      ${formatNumber(getNoreste?.tam_neto || 0)} prospectos<br>
      ~128 km | <strong>$781/viaje</strong><br>
      <em>Mercado saturado - optimizar</em>
    </p>
  </div>
  <div class="card" style="border-left: 4px solid #FF9800;">
    <h4 style="margin-top: 0; color: #FF9800;">🟡 Fase 2: Expandir</h4>
    <p style="margin: 0; font-size: 0.85rem; color: #555;">
      <strong>BAJÍO + NOROESTE</strong><br>
      ${formatNumber((getBajio?.tam_neto || 0) + (getNoroeste?.tam_neto || 0))} prospectos<br>
      ~633-799 km | <strong>$3,773-$6,999</strong><br>
      <em>Activar en 1-2 meses</em>
    </p>
  </div>
  <div class="card" style="border-left: 4px solid #2196F3;">
    <h4 style="margin-top: 0; color: #2196F3;">🔵 Fase 3: Conquistar</h4>
    <p style="margin: 0; font-size: 0.85rem; color: #555;">
      <strong>CENTRO + OCCIDENTE</strong><br>
      ${formatNumber((getCentro?.tam_neto || 0) + (getOccidente?.tam_neto || 0))} prospectos<br>
      ~904-1,065 km | <strong>$5,939-$7,148</strong><br>
      <em>Evaluar CEDIS regional</em>
    </p>
  </div>
  <div class="card" style="border-left: 4px solid #9C27B0;">
    <h4 style="margin-top: 0; color: #9C27B0;">🟣 Fase 4: Fronteras</h4>
    <p style="margin: 0; font-size: 0.85rem; color: #555;">
      <strong>GOLFO + PENÍNSULA</strong><br>
      ${formatNumber((getGolfo?.tam_neto || 0) + (getPeninsula?.tam_neto || 0))} prospectos<br>
      ~1,329-1,644 km | <strong>$9,044-$11,188</strong><br>
      <em>Alianzas o franquicia</em>
    </p>
  </div>
</div>

---

<small style="color: #999; display: block; text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
  <strong>STRTGY</strong> — Transformando complejidad en certeza | Proyecto FCarnes | Diciembre 2025
</small>

