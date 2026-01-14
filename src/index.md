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

// Calcular prospectos prioritarios (Scoring v2: cadenas, bodegones, mayoristas)
const allFeatures = prospectosData?.features || [];
// Scoring v2: usa el campo es_prioritario calculado en el pipeline
const oportunidadesPrioritarias = allFeatures.filter(f => f.properties?.prio === 1 || f.properties?.es_prioritario).length;
const totalCadenas = allFeatures.filter(f => f.properties?.cad === 1 || f.properties?.es_cadena).length;
```

```js
// Total de prospectos verificados (del archivo filtrado)
const prospectosVerificados = allFeatures.length;
const pctVerificados = (prospectosVerificados / tamBruto * 100).toFixed(1);

// Hero compacto con métricas integradas
display(heroFCarnes({
  title: "Censo Estratégico Nacional",
  subtitle: "Canal Tradicional (Carnicerías y Obradores)",
  context: `Este dashboard identifica y prioriza prospectos de alto potencial para la expansión de FCarnes en el mercado nacional de carnes. De ${formatCompact(tamBruto)} establecimientos identificados, solo ${formatCompact(prospectosVerificados)} (${pctVerificados}%) pasaron los filtros de verificación.`,
  metrics: [
    { value: formatCompact(tamBruto), label: "Mercado Total" },
    { value: formatCompact(prospectosVerificados), label: "Verificados" },
    { value: formatCompact(clientesActuales), label: "Clientes Actuales" }
  ]
}));
```

<div class="card" style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border-left: 4px solid #f59e0b; margin: 1rem 0; padding: 1rem;">
  <h4 style="margin: 0 0 0.5rem 0; color: #92400e; display: flex; align-items: center; gap: 0.5rem;">
    <span>📖</span> ¿Cómo leer este dashboard?
  </h4>
  <p style="margin: 0; font-size: 0.9rem; color: #78350f; line-height: 1.6;">
    <strong>Mercado Total (TAM)</strong> = Todos los establecimientos de carnes en México según DENUE + Google Maps.<br>
    <strong>Prospectos Verificados</strong> = Cumplen criterios de calidad: score ≥35, contacto verificable, coordenadas precisas, nombre específico, negocio activo.<br>
    <strong>⭐ Prioritarios (Scoring v2)</strong> = Cadenas con 4+ sucursales, bodegones en ZM Monterrey, mayoristas fuera de NL.<br>
    <strong>Clientes Actuales</strong> = Base instalada de FCarnes que se excluye del mercado objetivo.
  </p>
</div>

## Resumen Ejecutivo

<details style="margin-bottom: 1rem; background: #f8fafc; border-radius: 8px; padding: 0.5rem 1rem;">
  <summary style="cursor: pointer; font-weight: 600; color: #1e40af;">📘 Glosario de Términos</summary>
  <div style="margin-top: 0.75rem; font-size: 0.85rem; color: #475569; line-height: 1.6;">
    <p><strong>TAM (Total Addressable Market)</strong> = Mercado Total Direccionable. Todos los establecimientos de carnes en México que podrían ser clientes potenciales.</p>
    <p><strong>Sakbe</strong> = Sistema de ruteo de INEGI que calcula distancias reales por carretera, incluyendo casetas y tiempos estimados. El nombre proviene de "sacbé" (camino blanco en maya).</p>
    <p><strong>Tier</strong> = Nivel de prioridad del prospecto (A_PREMIUM = máxima, B_ALTA = alta, C_MEDIA, D_BAJA).</p>
    <p><strong>Penetración</strong> = Porcentaje de clientes actuales respecto al mercado total de esa región.</p>
  </div>
</details>

```js
// Calcular % verificados de top ciudad
const topCiudadPctVerif = topCiudad?.tam_bruto > 0 
  ? ((topCiudad?.tam_neto || 0) / topCiudad?.tam_bruto * 100).toFixed(0) 
  : 0;

display(kpi([
  { 
    label: "TAM Bruto Nacional", 
    value: formatNumber(tamBruto),
    subtitle: "Mercado Total Direccionable",
    color: "primary",
    icon: "🎯"
  },
  { 
    label: "Prospectos Verificados", 
    value: formatNumber(prospectosVerificados),
    subtitle: `${pctVerificados}% pasó filtros de calidad`,
    color: "success",
    icon: "✅"
  },
  { 
    label: "Clientes FCarnes", 
    value: formatNumber(clientesActuales),
    subtitle: `${formatPercent(penetracion)} penetración nacional`,
    color: "info",
    icon: "👥"
  },
  { 
    label: "Top Ciudad", 
    value: topCiudad?.municipio || "N/A",
    subtitle: `${formatNumber(topCiudad?.tam_neto || 0)} prospectos verificados`,
    color: "warning",
    icon: "🏆"
  }
]));
```

```js
// Calcular métricas adicionales para hallazgos
const centroData = tamRegion.find(r => r.macro_region === "CENTRO");
const golfoData = tamRegion.find(r => r.macro_region === "GOLFO_SURESTE");
const noresteData = tamRegion.find(r => r.macro_region === "NORESTE");
const bajioData = tamRegion.find(r => r.macro_region === "BAJIO");

const oportunidadCentroGolfo = (centroData?.tam_neto || 0) + (golfoData?.tam_neto || 0);
const penetracionNoreste = noresteData?.penetracion_pct?.toFixed(1) || "0";
const costoBajio = bajioData?.costo_logistico_mxn || 0;
```

```js
display(html`<div class="card" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; border: none; margin: 1.5rem 0;">
  <h3 style="margin-top: 0; color: #ffd700; display: flex; align-items: center; gap: 0.5rem;">
    <span>📊</span> Principales Hallazgos del Análisis
  </h3>
  
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;">
    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; border-left: 3px solid #22c55e;">
      <strong style="color: #22c55e;">🚀 Oportunidad Inexplorada</strong>
      <p style="margin: 0.5rem 0 0; font-size: 0.95rem; line-height: 1.5;">
        <strong>${formatNumber(oportunidadCentroGolfo)}</strong> prospectos verificados en <strong>CENTRO</strong> y <strong>GOLFO_SURESTE</strong> con menos del 0.1% de penetración actual. Estas regiones representan el <strong>62%</strong> del mercado nacional desatendido.
      </p>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;">
      <strong style="color: #3b82f6;">💰 Eficiencia Logística</strong>
      <p style="margin: 0.5rem 0 0; font-size: 0.95rem; line-height: 1.5;">
        <strong>BAJÍO</strong> combina alto TAM (${formatNumber(bajioData?.tam_neto || 0)} prospectos) con costo logístico moderado (<strong>$${formatNumber(Math.round(costoBajio))}/viaje</strong>). Oportunidad de <strong>5x ROI</strong> vs mercados más lejanos.
      </p>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; border-left: 3px solid #f59e0b;">
      <strong style="color: #f59e0b;">📈 Dominio en Origen</strong>
      <p style="margin: 0.5rem 0 0; font-size: 0.95rem; line-height: 1.5;">
        FCarnes tiene <strong>${penetracionNoreste}%</strong> de penetración en NORESTE — el mercado más maduro. Quedan <strong>${formatNumber(noresteData?.tam_neto || 0)}</strong> prospectos verificados para capturar el mercado restante antes de la competencia.
      </p>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; border-left: 3px solid #ec4899;">
      <strong style="color: #ec4899;">✅ Calidad + Scoring v2</strong>
      <p style="margin: 0.5rem 0 0; font-size: 0.95rem; line-height: 1.5;">
        <strong>${pctVerificados}%</strong> del TAM pasó filtros de calidad. De estos, <strong>${formatNumber(oportunidadesPrioritarias)}</strong> son prioritarios (cadenas 4+ suc, bodegones ZM MTY, mayoristas).
      </p>
    </div>
  </div>
  
  <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%); border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);">
    <h4 style="margin: 0 0 0.5rem 0; color: #fbbf24; font-size: 1rem;">
      🎯 ¿Qué región atacar primero?
    </h4>
    <p style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
      <strong>Recomendación basada en datos:</strong> Iniciar con <strong>BAJÍO</strong> (Querétaro, León, Aguascalientes) que ofrece el mejor balance de:
      alto TAM (${formatNumber(bajioData?.tam_neto || 0)} prospectos), costo logístico moderado ($${formatNumber(Math.round(costoBajio))}/viaje), 
      y baja penetración actual. En paralelo, consolidar el mercado de <strong>NORESTE</strong> donde ya existe infraestructura.
    </p>
    <div style="margin-top: 0.75rem; display: flex; gap: 1rem; flex-wrap: wrap;">
      <span style="background: #22c55e; color: white; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
        1° BAJÍO (ROI Alto)
      </span>
      <span style="background: #3b82f6; color: white; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
        2° NORESTE (Consolidar)
      </span>
      <span style="background: #f59e0b; color: white; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
        3° CENTRO (Evaluar CEDIS)
      </span>
    </div>
  </div>
</div>`);
```

---

<div class="grid grid-cols-2">

```js
display(decisionCallout({
  title: "¿Cómo usar esta información?",
  items: [
    "Comparar macro-regiones por TAM, costo logístico y penetración actual",
    "Identificar ciudades clave para expansión inmediata",
    "Validar prospectos visualmente con Street View antes de contactar",
    "Exportar bases filtradas para el equipo de ventas"
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
  "NOROESTE": "Sinaloa, Durango, Zacatecas",
  "SIN_REGION": "Registros pendientes de clasificación geográfica"
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

```js
display(html`<div class="grid grid-cols-3" style="margin-bottom: 1rem;">
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #FEF5F5 0%, #fff 100%); border-left: 4px solid #C41E3A;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Prospectos Disponibles</div>
    <div style="font-size: 1.75rem; font-weight: 700; color: #C41E3A;">${formatNumber(tamFiltrado)}</div>
    <div style="font-size: 0.65rem; color: #999;">Sin clientes actuales</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #E8F5E9 0%, #fff 100%); border-left: 4px solid #4CAF50;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Clientes Actuales</div>
    <div style="font-size: 1.75rem; font-weight: 700; color: #2E7D32;">${formatNumber(clientesFiltrado)}</div>
    <div style="font-size: 0.65rem; color: #999;">Ya capturados</div>
  </div>
  <div class="card" style="text-align: center; background: linear-gradient(135deg, #E3F2FD 0%, #fff 100%); border-left: 4px solid #2196F3;">
    <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Regiones</div>
    <div style="font-size: 1.75rem; font-weight: 700; color: #1565C0;">${datosMostrar.length}</div>
  </div>
</div>`);
```

```js
display(resize((width) => Plot.plot({
  width,
  height: Math.max(200, datosMostrar.length * 45 + 60),
  marginLeft: 140,
  marginRight: 100,
  x: { 
    label: "Prospectos Disponibles (TAM Neto = Mercado - Clientes) →", 
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
      title: d => `${d.macro_region}\n━━━━━━━━━━━━━━━━\n🎯 Mercado Total: ${formatNumber(d.tam_bruto)}\n👥 Clientes FCarnes: ${formatNumber(d.clientes_fcarnes)}\n📊 Disponibles: ${formatNumber(d.tam_neto)}\n📈 Penetración: ${(d.clientes_fcarnes/d.tam_bruto*100).toFixed(1)}%\n🚛 Dist. Sakbe: ${d.distancia_sakbe_km ? Math.round(d.distancia_sakbe_km) + ' km' : 'N/A'}`
    }),
    // Etiquetas con valores - mostrar penetración para dar contexto
    Plot.text(datosMostrar, {
      y: "macro_region",
      x: "tam_neto",
      text: d => {
        const penetracion = d.tam_bruto > 0 ? (d.clientes_fcarnes / d.tam_bruto * 100).toFixed(0) : 0;
        return `${formatNumber(d.tam_neto)} disponibles | ${penetracion}% penetración`;
      },
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
// Calcular penetración de NORESTE dinámicamente (usa noresteData ya definido arriba)
const norestePenetracion = noresteData?.penetracion_pct?.toFixed(0) || 0;

display(insightCallout({
  title: "Insight Estratégico",
  content: `FCarnes tiene ${norestePenetracion}% de penetración en NORESTE (${formatNumber(noresteData?.clientes_fcarnes || 0)} clientes). Las mayores oportunidades están en CENTRO (${formatNumber(regionesOrdenadas.find(r => r.macro_region === "CENTRO")?.tam_neto || 0)}) y GOLFO_SURESTE (${formatNumber(regionesOrdenadas.find(r => r.macro_region === "GOLFO_SURESTE")?.tam_neto || 0)}) con menos del 0.1% de penetración actual.`,
  type: "highlight"
}));
```

---

## 🚛 Costos Logísticos por Ruta (Sakbe INEGI)

```js
display(html`<div class="grid grid-cols-4">
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
</div>`);
```

```js
// Top 10 rutas más costosas (ya vienen ordenadas por costo total desc)
const topRutas = (costosLogisticos.rutas_principales || []).slice(0, 10);

// Orden de ciudades para el eje Y (por costo total descendente)
const ordenCiudades = topRutas.map(r => r.ciudad);
```

### Comparar Rutas por Métrica

```js
// Selector de métrica para el eje X
const metricaRutas = view(Inputs.select(
  ["Costo Total", "Distancia", "Tiempo"], 
  { 
    label: "Comparar por:", 
    value: "Costo Total" 
  }
));
```

```js
// Configuración dinámica según la métrica seleccionada
const metricaConfig = {
  "Costo Total": { field: "costo_total_mxn", label: "Costo por Viaje (MXN)", format: d => `$${d >= 1000 ? (d/1000).toFixed(1) + 'K' : d}`, color: "#C41E3A" },
  "Distancia": { field: "distancia_km", label: "Distancia (km)", format: d => `${d} km`, color: "#1565C0" },
  "Tiempo": { field: "tiempo_horas", label: "Tiempo de Viaje (horas)", format: d => `${d}h`, color: "#2E7D32" }
};

const config = metricaConfig[metricaRutas];

display(resize((width) => Plot.plot({
  width,
  height: 400,
  marginLeft: 110,
  marginRight: 80,
  x: { 
    label: `${config.label} →`, 
    grid: true,
    tickFormat: config.format
  },
  y: { label: null },
  marks: [
    Plot.barX(topRutas, {
      y: "ciudad",
      x: config.field,
      fill: config.color,
      sort: { y: `-x` },
      tip: true,
      title: d => `${d.ciudad}\nDistancia: ${d.distancia_km} km\nTiempo: ${d.tiempo_horas}h\nCosto Total: $${d.costo_total_mxn?.toLocaleString()}`
    }),
    Plot.text(topRutas, {
      y: "ciudad",
      x: config.field,
      text: d => config.format(d[config.field]),
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

### Desglose: Casetas vs Combustible

```js
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
// Agregar clasificación de semáforo a las rutas
const topRutasConSemaforo = topRutas.map(r => {
  let semaforo = "🟢";
  let zona_costo = "Verde";
  if (r.costo_total_mxn >= 7000) {
    semaforo = "🔴";
    zona_costo = "Roja";
  } else if (r.costo_total_mxn >= 4000) {
    semaforo = "🟡";
    zona_costo = "Amarilla";
  }
  return { ...r, semaforo, zona_costo };
});

// Tabla detallada de rutas con semáforo
display(Inputs.table(topRutasConSemaforo, {
  columns: ["semaforo", "ciudad", "distancia_km", "tiempo_horas", "costo_casetas_mxn", "costo_combustible_mxn", "costo_total_mxn"],
  header: {
    semaforo: "Zona",
    ciudad: "Destino",
    distancia_km: "Distancia",
    tiempo_horas: "Tiempo",
    costo_casetas_mxn: "Casetas",
    costo_combustible_mxn: "Combustible",
    costo_total_mxn: "Costo Logístico Total"
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

<div style="display: flex; gap: 1.5rem; justify-content: center; margin: 0.5rem 0; font-size: 0.8rem;">
  <span>🟢 <strong>Verde</strong>: &lt;$4,000 (alta rentabilidad)</span>
  <span>🟡 <strong>Amarilla</strong>: $4,000-$7,000 (requiere volumen)</span>
  <span>🔴 <strong>Roja</strong>: &gt;$7,000 (evaluar CEDIS regional)</span>
</div>

<div class="note" style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 0.75rem 1rem; margin: 1rem 0; border-radius: 0 8px 8px 0; font-size: 0.9rem;">
  <strong>📊 Fuente:</strong> Costos calculados con <strong>INEGI Sakbe API</strong> (rutas óptimas reales). 
  Incluye casetas de la ruta más económica desde Planta FCarnes Monterrey. 
  Combustible estimado para camión 2 ejes (6 km/L diesel).
</div>

<div class="card" style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border-left: 4px solid #f59e0b; margin: 1.5rem 0;">
  <h4 style="margin-top: 0; color: #92400e; display: flex; align-items: center; gap: 0.5rem;">
    <span>💡</span> Interpretación Estratégica de Costos
  </h4>
  <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #78350f; line-height: 1.6;">
    El análisis de costos revela tres zonas claras de rentabilidad:
  </p>
  <ul style="margin: 0.5rem 0; padding-left: 1.25rem; font-size: 0.9rem; color: #78350f; line-height: 1.6;">
    <li><strong>Zona Verde (&lt;$4,000/viaje):</strong> NORESTE, BAJÍO — Rentables con pedidos mínimos de $10,000. Prioridad máxima de expansión.</li>
    <li><strong>Zona Amarilla ($4,000-$7,000/viaje):</strong> OCCIDENTE, NOROESTE — Requieren pedidos &gt;$20,000 o consolidación de clientes para rentabilidad.</li>
    <li><strong>Zona Roja (&gt;$7,000/viaje):</strong> CENTRO, GOLFO, PENÍNSULA — Alto TAM pero evaluar modelo de CEDIS regional o alianzas estratégicas.</li>
  </ul>
  <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #92400e;">
    <em>→ Recomendación: Iniciar expansión en Zona Verde mientras se evalúa infraestructura para Zona Roja.</em>
  </p>
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
    description: "Mapa interactivo con filtros, análisis IA y validación Street View. Solo prospectos verificados de alta calidad.",
    badge: `${formatCompact(prospectosVerificados)} verificados`
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

// Ciudades sin presencia FCarnes
const sinPresencia = top10.filter(c => c.clientes_fcarnes === 0);
const tamSinPresencia = sinPresencia.reduce((s, c) => s + c.tam_neto, 0);
```

```js
// Calcular datos adicionales para el hallazgo
const leonData = top10.find(c => c.municipio === "León");
const leonPctVerif = leonData?.tam_bruto > 0 ? ((leonData?.tam_neto || 0) / leonData?.tam_bruto * 100).toFixed(0) : 0;

display(html`<div class="card" style="background: linear-gradient(135deg, #fef2f2 0%, #fff 100%); border-left: 4px solid #C41E3A; margin-bottom: 1rem;">
  <p style="margin: 0; font-size: 0.95rem; line-height: 1.6;">
    <strong style="color: #C41E3A;">🎯 Oportunidad Identificada:</strong> De las 10 ciudades con mayor potencial, 
    <strong>${sinPresencia.length}</strong> no tienen presencia de FCarnes, representando 
    <strong>${formatNumber(tamSinPresencia)}</strong> prospectos verificados sin explorar.
    ${leonData ? `<br><strong>Ejemplo: León</strong> tiene ${formatNumber(leonData.tam_neto)} prospectos verificados (${leonPctVerif}% del mercado total de esa ciudad pasó los filtros de calidad).` : ""}
  </p>
</div>`);
```

```js
// Tabla sin checkbox (select: false)
display(Inputs.table(top10, {
  columns: ["municipio", "macro_region", "tam_neto", "clientes_fcarnes", "penetracion_pct"],
  header: {
    municipio: "Ciudad",
    macro_region: "Región",
    tam_neto: "Prospectos Verificados",
    clientes_fcarnes: "Clientes Actuales",
    penetracion_pct: "Penetración"
  },
  format: {
    tam_neto: d => formatNumber(d),
    penetracion_pct: d => d ? `${d.toFixed(1)}%` : "0%"
  },
  sort: "tam_neto",
  reverse: true,
  rows: 10,
  select: false
}));
```

<div class="note" style="background: #EDE7F6; border-left: 4px solid #7C3AED; padding: 0.75rem; margin: 1rem 0; font-size: 0.9rem;">
  <strong>📌 Siguiente Paso Recomendado:</strong> Las ciudades en <strong>CENTRO</strong> (CDMX y área metropolitana) tienen la mayor concentración de prospectos verificados. 
  Una estrategia de entrada coordinada en estas plazas podría capturar <strong>~8,000 prospectos</strong> estableciendo un CEDIS en Querétaro como hub logístico intermedio.
</div>

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
