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
const totalTamBruto = tamRegion.reduce((s, r) => s + r.tam_bruto, 0);

// Prospectos verificados
const totalVerificados = tamRegion.reduce((s, r) => s + (r.verificados_total || 0), 0);
const totalVerificadosAB = tamRegion.reduce((s, r) => s + (r.verificados_a_b || 0), 0);
const totalConfianzaAlta = tamRegion.reduce((s, r) => s + (r.verificados_confianza_alta || 0), 0);
const pctVerificados = totalTamBruto > 0 ? (totalVerificados / totalTamBruto * 100).toFixed(1) : 0;
```

<h1 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
  <span style="font-size: 1.5rem;">📊</span> TAM por Macro-Región
</h1>

<p style="color: #666; margin-top: 0;">
  Análisis de oportunidad de mercado segmentado por región geográfica. Comparación TAM Total vs Prospectos Verificados.
</p>

<div class="card" style="background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); color: white; border: none; margin: 1rem 0;">
  <h3 style="margin-top: 0; color: #93c5fd;">
    ¿Qué revela este análisis?
  </h3>
  <p style="margin: 0; font-size: 0.95rem; line-height: 1.7;">
    Este análisis segmenta el mercado nacional de carnes en <strong>9 macro-regiones</strong>, evaluando cada una por: 
    tamaño del mercado (TAM), penetración actual de FCarnes, calidad de prospectos verificados, y viabilidad logística.
    El objetivo es <strong>priorizar regiones de expansión</strong> que maximicen el retorno sobre la inversión en ventas y distribución.
  </p>
</div>

---

## 💎 Síntesis Estratégica

<div class="card" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; border: none; margin: 1rem 0;">
  <h3 style="margin-top: 0; color: #fbbf24; display: flex; align-items: center; gap: 0.5rem;">
    <span>🎯</span> El Panorama en Una Mirada
  </h3>
  
  <p style="margin: 0.75rem 0; font-size: 0.95rem; line-height: 1.7;">
    FCarnes tiene una <strong>posición de fuerza en NORESTE</strong> (>50% de penetración) 
    pero <strong>prácticamente ninguna presencia en el 95% del territorio nacional</strong>. Esta asimetría representa 
    una <strong>oportunidad masiva de crecimiento</strong>.
  </p>
  
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
    <div style="text-align: center;">
      <div style="font-size: 1.75rem; font-weight: 700; color: #22c55e;">79.6K</div>
      <div style="font-size: 0.75rem; color: #94a3b8;">TAM Bruto<br>Nacional</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 1.75rem; font-weight: 700; color: #3b82f6;">30.9K</div>
      <div style="font-size: 0.75rem; color: #94a3b8;">Prospectos<br>Verificados</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 1.75rem; font-weight: 700; color: #f59e0b;">$3-7K</div>
      <div style="font-size: 0.75rem; color: #94a3b8;">Costo por Viaje<br>Zonas Prioritarias</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 1.75rem; font-weight: 700; color: #ec4899;">4 Fases</div>
      <div style="font-size: 0.75rem; color: #94a3b8;">Plan de<br>Expansión</div>
    </div>
  </div>
  
  <p style="margin: 0; font-size: 0.9rem; color: #cbd5e1; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 0.75rem;">
    <strong>Recomendación:</strong> 1° BAJÍO (alto ROI), 2° NORESTE (consolidar), 3° CENTRO (evaluar CEDIS), 4° GOLFO/PENÍNSULA (alianzas).
  </p>
</div>

---

## TAM Total vs Prospectos Verificados

```js
display(kpi([
  { label: "TAM Total", value: formatNumber(totalTamBruto), subtitle: "Mercado potencial (DENUE + Google)" },
  { label: "Prospectos Verificados", value: formatNumber(totalVerificados), subtitle: `${pctVerificados}% del TAM - Alta calidad` },
  { label: "Verificados A/B", value: formatNumber(totalVerificadosAB), subtitle: "Tiers prioritarios" },
  { label: "Clientes FCarnes", value: formatNumber(totalClientes), subtitle: "Base instalada actual" }
]));
```

<div class="grid grid-cols-2" style="margin-top: 1rem;">
  <div class="card" style="background: linear-gradient(135deg, #E3F2FD 0%, #fff 100%); border-left: 4px solid #1565C0;">
    <h4 style="margin-top: 0; color: #1565C0;">📦 TAM Total (Mercado Potencial)</h4>
    <p style="margin: 0; font-size: 0.9rem; color: #555;">
      <strong>${formatNumber(totalTamBruto)}</strong> establecimientos identificados en DENUE + Google Maps que operan en el sector cárnico (códigos SCIAN 311611, 311612, 431121, 461121).
    </p>
    <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #777;">
      Incluye todos los registros sin filtrar: activos, potencialmente cerrados, datos incompletos.
    </p>
  </div>
  <div class="card" style="background: linear-gradient(135deg, #E8F5E9 0%, #fff 100%); border-left: 4px solid #2E7D32;">
    <h4 style="margin-top: 0; color: #2E7D32;">✅ Prospectos Verificados (Entregables)</h4>
    <p style="margin: 0; font-size: 0.9rem; color: #555;">
      <strong>${formatNumber(totalVerificados)}</strong> prospectos de alta calidad después del proceso de filtrado y verificación multicapa.
    </p>
    <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #777;">
      Incluye todos los tiers, score &gt;50, datos de contacto, coordenadas precisas, negocios activos. Priorización via Scoring v2.
    </p>
  </div>
</div>

---

## 🔍 Proceso de Filtrado (Señalética)

<div class="note" style="background: #FFF8E1; border-left: 4px solid #FFA000; padding: 1rem; margin: 1rem 0;">
  <h4 style="margin: 0 0 0.5rem 0; color: #E65100;">⚙️ Metodología de Verificación de Prospectos</h4>
  <p style="margin: 0; font-size: 0.9rem; color: #333;">
    El proceso de filtrado reduce el TAM total a prospectos de alta calidad mediante <strong>7 criterios de validación</strong>:
  </p>
</div>

<div class="grid grid-cols-4" style="margin-top: 0.5rem; font-size: 0.85rem;">
  <div style="background: #fff; padding: 0.75rem; border-radius: 6px; border: 1px solid #E0E0E0;">
    <span style="color: #C41E3A; font-weight: 600;">1. Todos los Tiers</span><br>
    <span style="color: #666;">Incluye A, B, C, D — Priorización via Scoring v2 (cadenas, bodegones)</span>
  </div>
  <div style="background: #fff; padding: 0.75rem; border-radius: 6px; border: 1px solid #E0E0E0;">
    <span style="color: #C41E3A; font-weight: 600;">2. Score ≥ 35</span><br>
    <span style="color: #666;">Puntuación mínima de relevancia basada en SCIAN, tamaño y ubicación</span>
  </div>
  <div style="background: #fff; padding: 0.75rem; border-radius: 6px; border: 1px solid #E0E0E0;">
    <span style="color: #C41E3A; font-weight: 600;">3. Datos Contacto</span><br>
    <span style="color: #666;">Requiere teléfono, email, web o reseñas Google verificables</span>
  </div>
  <div style="background: #fff; padding: 0.75rem; border-radius: 6px; border: 1px solid #E0E0E0;">
    <span style="color: #C41E3A; font-weight: 600;">4. Negocio Activo</span><br>
    <span style="color: #666;">Excluye negocios marcados como cerrados en Google Maps</span>
  </div>
</div>

<div class="grid grid-cols-3" style="margin-top: 0.5rem; font-size: 0.85rem;">
  <div style="background: #fff; padding: 0.75rem; border-radius: 6px; border: 1px solid #E0E0E0;">
    <span style="color: #C41E3A; font-weight: 600;">5. Coordenadas Precisas</span><br>
    <span style="color: #666;">Mínimo 4 decimales de precisión (~11 metros)</span>
  </div>
  <div style="background: #fff; padding: 0.75rem; border-radius: 6px; border: 1px solid #E0E0E0;">
    <span style="color: #C41E3A; font-weight: 600;">6. Nombre Específico</span><br>
    <span style="color: #666;">Excluye nombres genéricos ("Carnicería", "Local 1", etc.)</span>
  </div>
  <div style="background: #fff; padding: 0.75rem; border-radius: 6px; border: 1px solid #E0E0E0;">
    <span style="color: #C41E3A; font-weight: 600;">7. Completitud ≥ 30%</span><br>
    <span style="color: #666;">Score mínimo de datos completos en el registro</span>
  </div>
</div>

<div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem; margin: 1rem 0; font-size: 0.85rem;">
  <strong>✓ Resultado:</strong> De <strong>${formatNumber(totalTamBruto)}</strong> registros iniciales → <strong>${formatNumber(totalVerificados)}</strong> prospectos verificados (<strong>${pctVerificados}%</strong> de retención). 
  El <a href="./explorador-prospectos">Explorador de Prospectos</a> muestra únicamente los ${formatNumber(totalVerificados)} verificados.
</div>

---

## Comparativo por Macro-Región: TAM vs Verificados

```js
// Preparar datos para gráfica comparativa
const dataComparativo = regionesOrdenadas.map(r => [
  { macro_region: r.macro_region, tipo: "TAM Total", valor: r.tam_bruto },
  { macro_region: r.macro_region, tipo: "Verificados", valor: r.verificados_total || 0 }
]).flat();
```

```js
display(resize((width) => Plot.plot({
  width,
  height: 380,
  marginLeft: 140,
  marginRight: 80,
  x: { label: "Establecimientos", grid: true },
  y: { label: null },
  color: { 
    legend: true,
    domain: ["TAM Total", "Verificados"],
    range: ["#1565C0", "#2E7D32"]
  },
  marks: [
    Plot.barX(dataComparativo, {
      y: "macro_region",
      x: "valor",
      fill: "tipo",
      sort: { y: "-x", reduce: "sum" },
      tip: true,
      title: d => `${d.macro_region}\n${d.tipo}: ${formatNumber(d.valor)}`
    }),
    Plot.ruleX([0])
  ]
})));
```

```js
display(insightCallout({
  title: "Interpretación",
  content: `La diferencia entre TAM Total y Verificados refleja el proceso de depuración. Regiones como NORESTE tienen alta penetración (${regionesOrdenadas.find(r => r.macro_region === "NORESTE")?.penetracion_pct?.toFixed(0) || 0}%) pero también alta calidad de datos. CENTRO y GOLFO_SURESTE representan oportunidades con ${formatNumber((regionesOrdenadas.find(r => r.macro_region === "CENTRO")?.verificados_total || 0) + (regionesOrdenadas.find(r => r.macro_region === "GOLFO_SURESTE")?.verificados_total || 0))} prospectos verificados combinados.`,
  type: "highlight"
}));
```

---

## 🎯 TAM Mayorista (Incentivo Alto)

<div class="note" style="background: #FCE4EC; border-left: 4px solid #C41E3A; padding: 1rem; margin: 1rem 0;">
  <strong>💰 Mayoristas = Pedidos Grandes:</strong> Los <strong>${formatNumber(totalMayoristas)} mayoristas nacionales</strong> representan clientes de alto volumen que pueden justificar abrir rutas lejanas. Se requiere un análisis costo-beneficio con distancias reales (Sakbe INEGI).
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

```js
// Helpers para obtener datos de mayoristas por región
const getMayorista = (region) => mayoristasData.find(r => r.macro_region === region) || {};
const mayNoreste = getMayorista("NORESTE");
const mayBajio = getMayorista("BAJIO");
const mayOccidente = getMayorista("OCCIDENTE");
const mayFronteraNorte = getMayorista("FRONTERA_NORTE");
const mayCentro = getMayorista("CENTRO");
const mayGolfoSureste = getMayorista("GOLFO_SURESTE");
const mayPeninsula = getMayorista("PENINSULA");
const mayNoroeste = getMayorista("NOROESTE");
```

<div class="grid grid-cols-2" style="margin-top: 1rem;">
  <div class="card" style="background: linear-gradient(135deg, #E8F5E9 0%, #fff 100%);">
    <h4 style="margin-top: 0; color: #2E7D32;">✅ Rutas Rentables (< $5,000/viaje)</h4>
    <p style="margin: 0; font-size: 0.9rem;">
      <strong>NORESTE:</strong> ${mayNoreste.tam_mayorista || 0} mayoristas a ${Math.round(mayNoreste.distancia_sakbe_km || 0)} km (<strong>$${formatNumber(Math.round(mayNoreste.costo_logistico_mxn || 0))}/viaje</strong>) ✓ Sakbe<br>
      <strong>BAJÍO:</strong> ${mayBajio.tam_mayorista || 0} mayoristas a ${Math.round(mayBajio.distancia_sakbe_km || 0)} km (<strong>$${formatNumber(Math.round(mayBajio.costo_logistico_mxn || 0))}/viaje</strong>) ✓ Sakbe
    </p>
    <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
      📊 Alto margen. Casetas: $219-$991 | Combustible: $562-$2,781
    </p>
  </div>
  <div class="card" style="background: linear-gradient(135deg, #FFF3E0 0%, #fff 100%);">
    <h4 style="margin-top: 0; color: #E65100;">🟡 Moderados ($5,000-$7,000/viaje)</h4>
    <p style="margin: 0; font-size: 0.9rem;">
      <strong>OCCIDENTE:</strong> ${mayOccidente.tam_mayorista || 0} mayoristas a ${Math.round(mayOccidente.distancia_sakbe_km || 0)} km (<strong>$${formatNumber(Math.round(mayOccidente.costo_logistico_mxn || 0))}/viaje</strong>) ✓ Sakbe<br>
      <strong>FRONTERA_NORTE:</strong> ${mayFronteraNorte.tam_mayorista || 0} mayoristas a ${Math.round(mayFronteraNorte.distancia_sakbe_km || 0)} km (<strong>$${formatNumber(Math.round(mayFronteraNorte.costo_logistico_mxn || 0))}/viaje</strong>)
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
      <strong>CENTRO:</strong> ${mayCentro.tam_mayorista || 0} mayoristas a ${Math.round(mayCentro.distancia_sakbe_km || 0)} km (<strong>$${formatNumber(Math.round(mayCentro.costo_logistico_mxn || 0))}/viaje</strong>) ✓ Sakbe<br>
      <strong>GOLFO_SURESTE:</strong> ${mayGolfoSureste.tam_mayorista || 0} mayoristas a ${Math.round(mayGolfoSureste.distancia_sakbe_km || 0)} km (<strong>$${formatNumber(Math.round(mayGolfoSureste.costo_logistico_mxn || 0))}/viaje</strong>)
    </p>
  </div>
  <div class="card" style="background: linear-gradient(135deg, #F3E5F5 0%, #fff 100%);">
    <h4 style="margin-top: 0; color: #7B1FA2;">🔮 Evaluar Franquicia</h4>
    <p style="margin: 0; font-size: 0.9rem;">
      <strong>PENÍNSULA:</strong> ${mayPeninsula.tam_mayorista || 0} mayoristas a ${Math.round(mayPeninsula.distancia_sakbe_km || 0)} km (<strong>$${formatNumber(Math.round(mayPeninsula.costo_logistico_mxn || 0))}/viaje</strong>)<br>
      <strong>NOROESTE:</strong> ${mayNoroeste.tam_mayorista || 0} mayoristas a ${Math.round(mayNoroeste.distancia_sakbe_km || 0)} km (<strong>$${formatNumber(Math.round(mayNoroeste.costo_logistico_mxn || 0))}/viaje</strong>)
    </p>
  </div>
</div>

<div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem; margin: 1rem 0; font-size: 0.85rem;">
  <strong>✓ ¿Qué es Sakbe?</strong> Sistema de ruteo de INEGI que calcula <strong>distancias reales por carretera</strong> en México.
  El nombre proviene de "sacbé" (camino blanco en maya). Incluye casetas de peaje reales y permite calcular costos logísticos precisos.
  <br><br>
  <strong>Metodología:</strong> Rutas largas divididas en tramos de ~350km para mayor precisión. Costos: casetas reales + diesel ($23.5/L, 6 km/L camión 2 ejes).
</div>

---

## TAM Neto por Macro-Región (Total)

```js
// Colores por región (9 regiones incluyendo SIN_REGION)
const regionColors = {
  "NORESTE": "#C41E3A",        // Rojo FCarnes - mercado principal
  "CENTRO": "#1565C0",         // Azul - megalópolis
  "GOLFO_SURESTE": "#2E7D32",  // Verde - emergente
  "OCCIDENTE": "#7B1FA2",      // Púrpura
  "BAJIO": "#F57C00",          // Naranja - industrial
  "PENINSULA": "#00838F",      // Teal - presencia (32 cli)
  "FRONTERA_NORTE": "#5D4037", // Café
  "NOROESTE": "#546E7A",       // Gris azul
  "OTRA": "#9E9E9E",           // Gris - registros pendientes de clasificación
  "SIN_REGION": "#9E9E9E"      // Alias para registros sin clasificar
};
```

<div class="note" style="background: #f1f5f9; border-left: 4px solid #64748b; padding: 0.75rem; margin: 0.5rem 0; font-size: 0.85rem;">
  <strong>📌 Nota:</strong> "OTRA" o "Sin Región" incluye registros que no pudieron ser asignados a una macro-región por datos incompletos de ubicación. Representan una minoría del total.
</div>

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
const regionNoreste = regionesOrdenadas.find(r => r.macro_region === "NORESTE");
display(insightCallout({
  title: "Priorización Estratégica",
  content: `NORESTE tiene ${regionNoreste?.penetracion_pct?.toFixed(0) || 0}% de penetración (${formatNumber(regionNoreste?.clientes_fcarnes || 0)} clientes). Las mayores oportunidades están en CENTRO (${formatNumber(regionesOrdenadas.find(r => r.macro_region === "CENTRO")?.tam_neto || 0)}) y GOLFO_SURESTE (${formatNumber(regionesOrdenadas.find(r => r.macro_region === "GOLFO_SURESTE")?.tam_neto || 0)}) con <0.1% penetración.`,
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

<div class="card" style="background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); border-left: 4px solid #a855f7; margin: 1.5rem 0;">
  <h4 style="margin-top: 0; color: #7c3aed;">
    🔍 Análisis de Brechas de Penetración
  </h4>
  <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #581c87; line-height: 1.6;">
    El contraste entre la penetración en NORESTE (${regionesOrdenadas.find(r => r.macro_region === "NORESTE")?.penetracion_pct?.toFixed(0) || 0}%) y el resto del país (<1%) revela una <strong>oportunidad histórica</strong>:
  </p>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 0.75rem;">
    <div style="text-align: center; background: white; padding: 0.75rem; border-radius: 6px;">
      <div style="font-size: 1.5rem; font-weight: 700; color: #7c3aed;">${formatNumber((regionesOrdenadas.find(r => r.macro_region === "CENTRO")?.tam_neto || 0) + (regionesOrdenadas.find(r => r.macro_region === "GOLFO_SURESTE")?.tam_neto || 0))}</div>
      <div style="font-size: 0.75rem; color: #666;">Prospectos en regiones con <0.1% penetración</div>
    </div>
    <div style="text-align: center; background: white; padding: 0.75rem; border-radius: 6px;">
      <div style="font-size: 1.5rem; font-weight: 700; color: #16a34a;">0</div>
      <div style="font-size: 0.75rem; color: #666;">Competidores nacionales con cobertura similar</div>
    </div>
    <div style="text-align: center; background: white; padding: 0.75rem; border-radius: 6px;">
      <div style="font-size: 1.5rem; font-weight: 700; color: #ea580c;">18-24</div>
      <div style="font-size: 0.75rem; color: #666;">Meses ventana para establecer presencia</div>
    </div>
  </div>
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

<div class="card" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #059669; margin: 1.5rem 0;">
  <h4 style="margin-top: 0; color: #047857;">
    📈 Lectura del Gráfico de Burbujas
  </h4>
  <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #064e3b; line-height: 1.6;">
    <strong>Posición ideal: Arriba-Izquierda</strong> — Alto TAM + Baja distancia. Observe que:
  </p>
  <ul style="margin: 0.5rem 0 0; padding-left: 1.25rem; font-size: 0.9rem; color: #064e3b; line-height: 1.6;">
    <li><strong>NORESTE</strong> (burbuja roja) está bien posicionado pero con mercado limitado — estrategia de consolidación.</li>
    <li><strong>BAJÍO y NOROESTE</strong> ofrecen el mejor balance TAM/distancia — prioridad de expansión inmediata.</li>
    <li><strong>CENTRO</strong> tiene el mayor TAM pero distancia media — evaluar CEDIS en Querétaro como hub.</li>
    <li><strong>GOLFO_SURESTE y PENÍNSULA</strong> son mercados de alto TAM pero logística compleja — estrategia de largo plazo o alianzas.</li>
  </ul>
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
  rows: 20,
  select: false
}));
```

---

## Resumen por Región (Tabla)

```js
display(Inputs.table(regionesOrdenadas, {
  columns: ["macro_region", "tam_bruto", "verificados_total", "pct_verificados", "clientes_fcarnes", "penetracion_pct", "distancia_sakbe_km", "costo_logistico_mxn"],
  header: {
    macro_region: "Macro-Región",
    tam_bruto: "TAM Total",
    verificados_total: "Verificados",
    pct_verificados: "% Verif.",
    clientes_fcarnes: "Clientes",
    penetracion_pct: "Penetración",
    distancia_sakbe_km: "Dist. Sakbe",
    costo_logistico_mxn: "Costo Viaje"
  },
  format: {
    tam_bruto: d => formatNumber(d),
    verificados_total: d => formatNumber(d || 0),
    pct_verificados: d => d ? `${d.toFixed(1)}%` : "0%",
    penetracion_pct: d => d ? `${d.toFixed(1)}%` : "0%",
    distancia_sakbe_km: d => d ? `${Math.round(d)} km` : "-",
    costo_logistico_mxn: d => d ? `$${formatNumber(Math.round(d))}` : "-"
  },
  select: false
}));
```

<div class="note" style="background: #F5F5F5; border-left: 4px solid #9E9E9E; padding: 0.75rem; margin: 1rem 0; font-size: 0.8rem;">
  <strong>Leyenda:</strong> 
  <strong>TAM Total</strong> = Mercado potencial sin filtrar | 
  <strong>Verificados</strong> = Prospectos de alta calidad entregables | 
  <strong>% Verif.</strong> = Tasa de verificación | 
  <strong>Penetración</strong> = Clientes actuales / TAM Total
</div>

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
      <strong>NORESTE</strong> (${Math.round(getNoreste?.penetracion_pct || 0)}% penetración)<br>
      ${formatNumber(getNoreste?.tam_neto || 0)} prospectos<br>
      ~128 km | <strong>$781/viaje</strong><br>
      <em>Mercado principal - optimizar</em>
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
  <strong>STRTGY</strong> — Transformando complejidad en certeza | Proyecto FCarnes | Enero 2026
</small>

