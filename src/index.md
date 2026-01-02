---
title: Censo Estratégico Nacional FCarnes
toc: false
theme: ["cotton", "wide"]
---

```js
import {kpi, formatNumber, formatPercent} from "./components/ui.js";
import {heroFCarnes, decisionCallout, coberturaGeografica, strtgyFooter} from "./components/brand.js";

// Cargar datos
const tamRegion = await FileAttachment("data/tam_por_macroregion.csv").csv({typed: true});
const topCiudades = await FileAttachment("data/tam_top50_ciudades.csv").csv({typed: true});
const costosLogisticos = await FileAttachment("data/costos_logisticos.json").json();

// Calcular métricas agregadas
const tamBruto = tamRegion.reduce((s, r) => s + r.tam_bruto, 0);
const tamNeto = tamRegion.reduce((s, r) => s + r.tam_neto, 0);
const clientesActuales = tamRegion.reduce((s, r) => s + r.clientes_fcarnes, 0);
const penetracion = (clientesActuales / tamBruto * 100);
const topCiudad = topCiudades.sort((a, b) => b.tam_neto - a.tam_neto)[0];
```

```js
display(heroFCarnes({
  title: "Censo Estratégico Nacional",
  subtitle: "Expansión comercial basada en datos | Canal Tradicional (Carnicerías y Obradores)",
  context: "Inteligencia geoestadística para identificar y priorizar prospectos en el mercado nacional de carnes. De la complejidad territorial a una estrategia ejecutable con ROI medible."
}));
```

---

## Resumen Ejecutivo

```js
display(kpi([
  { 
    label: "TAM Bruto Nacional", 
    value: formatNumber(tamBruto),
    subtitle: "Establecimientos de carnes"
  },
  { 
    label: "Clientes Actuales FCarnes", 
    value: formatNumber(clientesActuales),
    subtitle: `${formatPercent(penetracion)} penetración`
  },
  { 
    label: "TAM Neto (Prospectos)", 
    value: formatNumber(tamNeto),
    subtitle: "Oportunidad de crecimiento"
  },
  { 
    label: "Top Ciudad por Oportunidad", 
    value: topCiudad?.ciudad_estado?.split(",")[0] || "N/A",
    subtitle: `${formatNumber(topCiudad?.tam_neto || 0)} prospectos`
  }
]));
```

---

<div class="grid grid-cols-2">

```js
display(decisionCallout({
  title: "¿Qué decidir con este análisis?",
  items: [
    "Priorizar macro-regiones con mayor oportunidad y menor costo logístico",
    "Identificar ciudades clave para expansión inmediata",
    "Validar prospectos visualmente antes de visita comercial",
    "Optimizar rutas de ventas por zona logística"
  ]
}));
```

```js
display(coberturaGeografica({
  "NORESTE": "Nuevo León, Tamaulipas, Coahuila, San Luis Potosí",
  "CENTRO": "CDMX, Edo.Méx, Hidalgo, Morelos, Puebla, Tlaxcala",
  "GOLFO_SURESTE": "Veracruz, Tabasco, Chiapas, Oaxaca, Guerrero",
  "OCCIDENTE": "Jalisco, Colima, Nayarit, Michoacán",
  "BAJIO": "Guanajuato, Querétaro, Aguascalientes",
  "PENINSULA": "Quintana Roo, Yucatán, Campeche",
  "FRONTERA_NORTE": "Chihuahua, BC, Sonora, BCS",
  "NOROESTE": "Sinaloa, Durango, Zacatecas"
}));
```

</div>

---

## Distribución por Macro-Región

```js
import * as Plot from "npm:@observablehq/plot";

const regionesOrdenadas = [...tamRegion].sort((a, b) => b.tam_neto - a.tam_neto);
```

```js
// Colores distintivos por región
const colorRegion = {
  "NORESTE": "#C41E3A",       // Rojo FCarnes - mercado principal
  "CENTRO": "#1565C0",        // Azul - megalópolis
  "GOLFO_SURESTE": "#2E7D32", // Verde - región emergente
  "OCCIDENTE": "#7B1FA2",     // Púrpura - occidente
  "BAJIO": "#F57C00",         // Naranja - bajío industrial
  "PENINSULA": "#00838F",     // Teal - península (32 clientes)
  "FRONTERA_NORTE": "#5D4037",// Café - frontera
  "NOROESTE": "#546E7A"       // Gris azul - noroeste
};

display(resize((width) => Plot.plot({
  width,
  height: 350,
  marginLeft: 140,
  marginRight: 80,
  x: { label: "Prospectos (TAM Neto)", grid: true },
  y: { label: null },
  marks: [
    Plot.barX(regionesOrdenadas, {
      y: "macro_region",
      x: "tam_neto",
      fill: d => colorRegion[d.macro_region] || "#666",
      sort: { y: "-x" },
      tip: true
    }),
    Plot.text(regionesOrdenadas, {
      y: "macro_region",
      x: "tam_neto",
      text: d => `${formatNumber(d.tam_neto)} (${d.clientes_fcarnes} cli)`,
      dx: 5,
      textAnchor: "start",
      fill: "#333",
      fontWeight: "600"
    }),
    Plot.ruleX([0])
  ]
})));
```

<div class="note" style="background: #FFF3E0; border-left: 4px solid #FF9800; padding: 1rem; margin: 1rem 0;">
  <strong>💡 Insight Clave:</strong> FCarnes tiene <strong>71% de penetración en NORESTE</strong> (NL, Tamps, Coah, SLP). Las mayores oportunidades de expansión están en <strong>CENTRO</strong> (19,300 prospectos) y <strong>GOLFO_SURESTE</strong> (13,795 prospectos) con menos del 0.1% de penetración actual.
</div>

---

## Costos Logísticos por Ruta (Sakbe INEGI)

<div class="grid grid-cols-4">
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #E3F2FD 0%, #fff 100%);">
    <div style="font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 1px;">Ciudades con Datos</div>
    <div style="font-size: 2rem; font-weight: 700; color: #1565C0;">${costosLogisticos.resumen.ciudades_con_datos_sakbe}</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #E8F5E9 0%, #fff 100%);">
    <div style="font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 1px;">Distancia Promedio</div>
    <div style="font-size: 2rem; font-weight: 700; color: #2E7D32;">${costosLogisticos.resumen.distancia_promedio_km} km</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #FFF3E0 0%, #fff 100%);">
    <div style="font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 1px;">Casetas Promedio</div>
    <div style="font-size: 2rem; font-weight: 700; color: #E65100;">$${formatNumber(costosLogisticos.resumen.costo_casetas_promedio)}</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #FCE4EC 0%, #fff 100%);">
    <div style="font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 1px;">Costo Total Promedio</div>
    <div style="font-size: 2rem; font-weight: 700; color: #C41E3A;">$${formatNumber(costosLogisticos.resumen.costo_total_promedio)}</div>
  </div>
</div>

```js
// Top rutas por clientes
const topRutas = costosLogisticos.rutas_principales.slice(0, 8);

display(resize((width) => Plot.plot({
  width,
  height: 280,
  marginLeft: 100,
  marginRight: 80,
  x: { label: "Costo Total por Viaje (MXN)", grid: true },
  y: { label: null },
  color: { legend: true, label: "Tipo de Costo" },
  marks: [
    Plot.barX(topRutas, Plot.stackX({
      y: "ciudad",
      x: "costo_casetas_mxn",
      fill: "#1565C0",
      title: d => `Casetas: $${formatNumber(d.costo_casetas_mxn)}`,
      sort: { y: "-x" }
    })),
    Plot.barX(topRutas, Plot.stackX({
      y: "ciudad",
      x: "costo_combustible_mxn",
      fill: "#FF9800",
      title: d => `Combustible: $${formatNumber(d.costo_combustible_mxn)}`
    })),
    Plot.text(topRutas, {
      y: "ciudad",
      x: d => d.costo_casetas_mxn + d.costo_combustible_mxn,
      text: d => `$${formatNumber(d.costo_total_mxn)}`,
      dx: 5,
      textAnchor: "start",
      fill: "#333",
      fontWeight: "600"
    }),
    Plot.ruleX([0])
  ]
})));
```

<div style="display: flex; gap: 1rem; justify-content: center; margin-top: 0.5rem; font-size: 0.8rem;">
  <span><span style="display: inline-block; width: 12px; height: 12px; background: #1565C0; border-radius: 2px; margin-right: 4px;"></span> Casetas</span>
  <span><span style="display: inline-block; width: 12px; height: 12px; background: #FF9800; border-radius: 2px; margin-right: 4px;"></span> Combustible</span>
</div>

<div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem; margin: 1rem 0; font-size: 0.9rem;">
  <strong>📊 Fuente:</strong> Costos calculados con <strong>INEGI Sakbe API</strong> (rutas óptimas reales). 
  Incluye casetas de la ruta más económica desde Planta FCarnes Monterrey. 
  Combustible estimado para camión 2 ejes (6 km/L diesel).
</div>

---

## Navegación del Dashboard

<div class="grid grid-cols-3">
  <a href="./tam-regional" class="card" style="text-decoration: none; color: inherit; transition: transform 0.2s, box-shadow 0.2s;">
    <div style="font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem;">📊</div>
    <h3 style="margin: 0 0 0.5rem; text-align: center; color: #C41E3A;">TAM por Región</h3>
    <p style="color: #666; font-size: 0.85rem; text-align: center; margin: 0;">
      Análisis detallado de oportunidad por macro-región y top ciudades
    </p>
  </a>
  <a href="./explorador-prospectos" class="card" style="text-decoration: none; color: inherit; transition: transform 0.2s, box-shadow 0.2s;">
    <div style="font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem;">🗺️</div>
    <h3 style="margin: 0 0 0.5rem; text-align: center; color: #C41E3A;">Explorador de Prospectos</h3>
    <p style="color: #666; font-size: 0.85rem; text-align: center; margin: 0;">
      Mapa interactivo con filtros y validación Street View
    </p>
  </a>
  <a href="./descargas" class="card" style="text-decoration: none; color: inherit; transition: transform 0.2s, box-shadow 0.2s;">
    <div style="font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem;">📥</div>
    <h3 style="margin: 0 0 0.5rem; text-align: center; color: #C41E3A;">Descargas</h3>
    <p style="color: #666; font-size: 0.85rem; text-align: center; margin: 0;">
      Exportar bases de datos para CRM y análisis
    </p>
  </a>
</div>

---

## Top 10 Ciudades por Oportunidad

```js
const top10 = topCiudades.slice(0, 10);

display(Inputs.table(top10, {
  columns: ["municipio", "macro_region", "tam_neto", "clientes_fcarnes", "penetracion_pct", "distancia_sakbe_km", "costo_total_sakbe_mxn"],
  header: {
    municipio: "Ciudad",
    macro_region: "Región",
    tam_neto: "TAM Neto",
    clientes_fcarnes: "Clientes",
    penetracion_pct: "Penetración %",
    distancia_sakbe_km: "Distancia",
    costo_total_sakbe_mxn: "Costo Logístico"
  },
  format: {
    tam_neto: d => formatNumber(d),
    penetracion_pct: d => d ? formatPercent(d) : "-",
    distancia_sakbe_km: d => d ? `${Math.round(d)} km` : "-",
    costo_total_sakbe_mxn: d => d ? `$${formatNumber(Math.round(d))}` : "-"
  },
  sort: "tam_neto",
  reverse: true
}));
```

<div style="text-align: center; margin-top: 1rem;">
  <a href="./tam-regional" style="color: #C41E3A; font-weight: 600;">Ver análisis completo por región →</a>
</div>

---

## Metodología y Fuentes

<div class="grid grid-cols-2">
  <div class="card">
    <h4 style="margin-top: 0;">📋 Alcance del Censo</h4>
    <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; color: #555;">
      <li><strong>Canal:</strong> Tradicional consolidado (Carnicerías, Obradores)</li>
      <li><strong>Fuentes:</strong> DENUE INEGI 2024, Google Maps</li>
      <li><strong>Cobertura:</strong> 6 macro-regiones prioritarias</li>
      <li><strong>Validación:</strong> Links Street View para cada prospecto</li>
    </ul>
  </div>
  <div class="card">
    <h4 style="margin-top: 0;">🎯 Entregables Incluidos</h4>
    <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; color: #555;">
      <li>Dashboard interactivo de ubicaciones (este reporte)</li>
      <li>Base de datos depurada con distancia a planta</li>
      <li>Reporte TAM por ciudad y macro-región</li>
      <li>Horarios operativos para optimización de visitas</li>
    </ul>
  </div>
</div>

---

```js
display(strtgyFooter());
```
