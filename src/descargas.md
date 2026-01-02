---
title: Descargas
toc: false
---

```js
import {note} from "./components/ui.js";
```

<h1 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
  <span style="font-size: 1.5rem;">📥</span> Descargas
</h1>

<p style="color: #666; margin-top: 0;">
  Descarga las bases de datos para uso en CRM, Excel o análisis adicional.
</p>

---

## Archivos Disponibles en Dashboard

<div class="grid grid-cols-2">
  <div class="card" style="border-left: 4px solid #4CAF50;">
    <h3 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem;">
      <span>📊</span> TAM por Macro-Región
    </h3>
    <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
      Resumen ejecutivo del mercado total direccionable por región geográfica. Incluye TAM bruto, neto, clientes y penetración.
    </p>
    <p style="font-size: 0.85rem; color: #888; margin-bottom: 1rem;">
      <strong>Formato:</strong> CSV | <strong>Filas:</strong> 7 | <strong>Columnas:</strong> 7
    </p>
    <a href="./data/tam_por_macroregion.csv" download 
       style="display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
      ⬇️ Descargar CSV
    </a>
  </div>

  <div class="card" style="border-left: 4px solid #2196F3;">
    <h3 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem;">
      <span>🏙️</span> Top 50 Ciudades
    </h3>
    <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
      Ciudades con mayor oportunidad de mercado, ordenadas por TAM Neto. Ideal para priorización de territorios.
    </p>
    <p style="font-size: 0.85rem; color: #888; margin-bottom: 1rem;">
      <strong>Formato:</strong> CSV | <strong>Filas:</strong> 50 | <strong>Columnas:</strong> 8
    </p>
    <a href="./data/tam_top50_ciudades.csv" download 
       style="display: inline-block; background: #2196F3; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
      ⬇️ Descargar CSV
    </a>
  </div>
</div>

---

## Diccionario de Datos

### TAM por Macro-Región (`tam_por_macroregion.csv`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `macro_region` | texto | Nombre de la macro-región (NORESTE, BAJIO, etc.) |
| `tam_bruto` | entero | Total de establecimientos en la región |
| `clientes_fcarnes` | entero | Clientes actuales de FCarnes |
| `tam_neto` | entero | Prospectos nuevos (TAM bruto - clientes) |
| `penetracion_pct` | decimal | Porcentaje de penetración actual |
| `distancia_promedio` | decimal | Distancia promedio a planta (km) |
| `con_google_match` | entero | Registros con validación Google Maps |

### Top 50 Ciudades (`tam_top50_ciudades.csv`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ciudad_estado` | texto | Ciudad y estado (ej. "Monterrey, Nuevo León") |
| `macro_region` | texto | Macro-región a la que pertenece |
| `tam_bruto` | entero | Total de establecimientos en la ciudad |
| `tam_neto` | entero | Prospectos nuevos en la ciudad |
| `clientes_fcarnes` | entero | Clientes actuales en la ciudad |
| `penetracion_pct` | decimal | Porcentaje de penetración |
| `distancia_promedio` | decimal | Distancia a planta (km) |
| `con_google_match` | entero | Registros validados con Google Maps |

---

## Base de Datos Completa

<div class="card" style="background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%); border-left: 4px solid #FF9800;">
  <h3 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem; color: #E65100;">
    <span>📋</span> Censo Nacional FCarnes (Base Completa)
  </h3>
  <p style="color: #555; margin-bottom: 1rem;">
    La base de datos completa con <strong>78,670 prospectos</strong> se entrega en archivo separado por su tamaño. Incluye todos los campos del censo, coordenadas, y links a Street View.
  </p>
  
  <div style="background: white; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
    <h4 style="margin: 0 0 0.5rem; font-size: 0.9rem; color: #666;">Archivos incluidos en entrega:</h4>
    <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
      <tr>
        <td style="padding: 6px; border-bottom: 1px solid #eee;"><code>CENSO_FCARNES_NACIONAL_FINAL.xlsx</code></td>
        <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right;">Excel (~15 MB)</td>
      </tr>
      <tr>
        <td style="padding: 6px; border-bottom: 1px solid #eee;"><code>CENSO_FCARNES_NACIONAL_FINAL.gpkg</code></td>
        <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right;">GeoPackage (~20 MB)</td>
      </tr>
      <tr>
        <td style="padding: 6px;"><code>CENSO_FCARNES_NACIONAL_FINAL.parquet</code></td>
        <td style="padding: 6px; text-align: right;">Parquet (~8 MB)</td>
      </tr>
    </table>
  </div>
  
  <p style="font-size: 0.85rem; color: #888; margin: 0;">
    <strong>Solicitar a:</strong> contacto@strtgy.mx
  </p>
</div>

---

## Campos de la Base Completa

La base de datos completa incluye los siguientes campos:

<div class="grid grid-cols-2">
  <div class="card" style="font-size: 0.85rem;">
    <h4 style="margin-top: 0; color: #C41E3A;">Identificación</h4>
    <ul style="margin: 0; padding-left: 1.2rem; color: #555;">
      <li><code>id_unico</code> - Identificador único</li>
      <li><code>nombre</code> - Nombre del establecimiento</li>
      <li><code>fuente</code> - DENUE / GOOGLE / AMBOS</li>
      <li><code>placeId_google</code> - ID de Google Maps</li>
    </ul>
  </div>
  
  <div class="card" style="font-size: 0.85rem;">
    <h4 style="margin-top: 0; color: #C41E3A;">Ubicación</h4>
    <ul style="margin: 0; padding-left: 1.2rem; color: #555;">
      <li><code>direccion</code> - Dirección completa</li>
      <li><code>ciudad</code>, <code>estado</code> - Ciudad y estado</li>
      <li><code>lat</code>, <code>lon</code> - Coordenadas</li>
      <li><code>macro_region</code> - Región asignada</li>
    </ul>
  </div>
  
  <div class="card" style="font-size: 0.85rem;">
    <h4 style="margin-top: 0; color: #C41E3A;">Logística</h4>
    <ul style="margin: 0; padding-left: 1.2rem; color: #555;">
      <li><code>distancia_planta_km</code> - Distancia a MTY</li>
      <li><code>zona_logistica</code> - LOCAL/REGIONAL/etc.</li>
    </ul>
  </div>
  
  <div class="card" style="font-size: 0.85rem;">
    <h4 style="margin-top: 0; color: #C41E3A;">Clasificación</h4>
    <ul style="margin: 0; padding-left: 1.2rem; color: #555;">
      <li><code>categoria_fcarnes</code> - MAYOREO/RETAIL/PROCESO</li>
      <li><code>tier</code> - A/B/C/D</li>
      <li><code>score_total</code> - Puntuación 0-100</li>
    </ul>
  </div>
  
  <div class="card" style="font-size: 0.85rem;">
    <h4 style="margin-top: 0; color: #C41E3A;">Contacto (Google)</h4>
    <ul style="margin: 0; padding-left: 1.2rem; color: #555;">
      <li><code>telefono</code> - Teléfono</li>
      <li><code>rating_google</code> - Calificación</li>
      <li><code>reviews_google</code> - Número de reseñas</li>
    </ul>
  </div>
  
  <div class="card" style="font-size: 0.85rem;">
    <h4 style="margin-top: 0; color: #C41E3A;">Horarios y Visual</h4>
    <ul style="margin: 0; padding-left: 1.2rem; color: #555;">
      <li><code>tiene_horarios</code> - Horarios disponibles</li>
      <li><code>abre_sabado</code> - Abre sábados</li>
      <li><code>url_streetview</code> - Link Street View</li>
    </ul>
  </div>
</div>

---

## Uso Recomendado

<div class="grid grid-cols-3">
  <div class="card">
    <h4 style="margin-top: 0;">📊 Excel / Google Sheets</h4>
    <p style="font-size: 0.85rem; color: #555; margin: 0;">
      Usa <code>.xlsx</code> para análisis rápido, filtros y tablas dinámicas.
    </p>
  </div>
  <div class="card">
    <h4 style="margin-top: 0;">🗺️ QGIS / ArcGIS</h4>
    <p style="font-size: 0.85rem; color: #555; margin: 0;">
      Usa <code>.gpkg</code> para análisis espacial y mapas.
    </p>
  </div>
  <div class="card">
    <h4 style="margin-top: 0;">🐍 Python / R</h4>
    <p style="font-size: 0.85rem; color: #555; margin: 0;">
      Usa <code>.parquet</code> para mejor rendimiento en código.
    </p>
  </div>
</div>

---

<small style="color: #999; display: block; text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
  <strong>STRTGY</strong> — Transformando complejidad en certeza | Proyecto FCarnes | Diciembre 2025
</small>

