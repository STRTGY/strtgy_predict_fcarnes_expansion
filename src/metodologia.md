---
title: Metodología
toc: true
---

```js
import {kpi, formatNumber} from "./components/ui.js";
import {decisionCallout} from "./components/brand.js";
```

<h1 style="display: flex; align-items: center; gap: 0.5rem;">
  <span style="font-size: 1.5rem;">📊</span> Metodología y Fuentes de Datos
</h1>

<p style="color: #666; margin-top: 0;">
  Documentación técnica del proceso de análisis, fuentes de datos y criterios utilizados para la identificación de oportunidades de expansión.
</p>

---

## Resumen Ejecutivo

Este análisis de expansión nacional para FCarnes utiliza una metodología de **inteligencia geoespacial** que combina múltiples fuentes de datos públicos y privados para identificar, priorizar y validar prospectos comerciales en el sector cárnico de México.

```js
display(kpi([
  { label: "Fuentes de Datos", value: "5", subtitle: "Integradas" },
  { label: "Prospectos Analizados", value: "79,175", subtitle: "A nivel nacional" },
  { label: "Variables por Prospecto", value: "45+", subtitle: "Campos de datos" },
  { label: "Cobertura Geográfica", value: "32", subtitle: "Estados de México" }
]));
```

---

## 1. Fuentes de Datos

### 1.1 DENUE (INEGI)

<div class="card">

**Directorio Estadístico Nacional de Unidades Económicas**

| Atributo | Valor |
|----------|-------|
| **Fuente** | INEGI - Instituto Nacional de Estadística y Geografía |
| **Fecha de extracción** | Diciembre 2024 |
| **Códigos SCIAN utilizados** | 461121, 461122, 311611, 311612, 311615 |
| **Registros extraídos** | 79,273 unidades económicas |

**Campos utilizados:**
- Nombre del establecimiento y razón social
- Coordenadas geográficas (lat/lon)
- Código de actividad económica (SCIAN)
- Personal ocupado
- Dirección completa
- **Teléfono** (39.4% de cobertura)
- Clave de entidad, municipio y localidad

</div>

### 1.2 Google Maps / Places API

<div class="card">

**Enriquecimiento con datos de Google**

| Atributo | Valor |
|----------|-------|
| **API utilizada** | Google Places API |
| **Prospectos enriquecidos** | 866 |
| **Campos adicionales** | Rating, reviews, horarios, teléfono verificado |

**Campos utilizados:**
- Rating promedio (1-5 estrellas)
- Número de reseñas
- Horarios de operación
- Teléfono verificado
- Indicador de apertura en sábado

</div>

### 1.3 INEGI Sakbe (Ruteo)

<div class="card">

**Sistema de cálculo de rutas y costos logísticos**

| Atributo | Valor |
|----------|-------|
| **API utilizada** | INEGI Sakbe v1 |
| **Rutas calculadas** | 102 |
| **Rutas con datos reales** | 82 (80%) |
| **Rutas con estimación** | 5 (5%) |

**Métricas obtenidas:**
- Distancia en kilómetros (ruta óptima)
- Tiempo estimado de viaje
- Costo de casetas (autopistas de cuota)
- Costo de combustible (diesel)

</div>

### 1.4 Street View + GPT-4o Vision

<div class="card">

**Análisis visual con inteligencia artificial**

| Atributo | Valor |
|----------|-------|
| **Modelo utilizado** | GPT-4o-mini |
| **Prospectos analizados** | 338 (Tier A_PREMIUM) |
| **Tasa de éxito** | 85.5% |
| **Costo total** | ~$2.60 USD |

**Métricas de IA generadas:**
- Vitalidad comercial de la escena (1-10)
- Visibilidad del negocio desde la calle (1-10)
- Condición de la fachada (1-10)
- Target encontrado (sí/no)
- Elementos detectados en la imagen

</div>

### 1.5 Datos del Cliente (FCarnes)

<div class="card">

**Base de clientes actuales**

| Atributo | Valor |
|----------|-------|
| **Archivo fuente** | Ventas por Ruta ciudad cliente 2024 2025 valores.xlsx |
| **Clientes únicos** | 3,059 |
| **Cobertura de ciudades** | 129 ciudades |

**Campos utilizados:**
- Nombre del cliente
- Ciudad y ruta asignada
- Tipo (Local/Foráneo)
- Vendedor asignado
- Fecha de alta

</div>

---

## 2. Proceso de Análisis

### 2.1 Pipeline de Datos

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Extracción │───▶│   Limpieza  │───▶│ Integración │───▶│   Scoring   │
│    DENUE    │    │   y Dedupe  │    │   Google    │    │  y Ranking  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Dashboard  │◀───│   Análisis  │◀───│   Sakbe     │◀───│  Matching   │
│   Export    │    │     IA      │    │   Routing   │    │  Clientes   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 2.2 Criterios de Clasificación

#### Categorías de Canal FCarnes

| Categoría | Descripción | Códigos SCIAN |
|-----------|-------------|---------------|
| **MAYORISTA** | Distribuidores y mayoristas de carne | 431150, 461121 (>50 empleados) |
| **PROCESO** | Obradores, rastros, empacadoras | 311611, 311612, 311615 |
| **RETAIL_CONSOLIDADO** | Carnicerías establecidas | 461121 (6-50 empleados) |
| **RETAIL_MICRO** | Carnicerías de barrio | 461121 (0-5 empleados) |
| **SUPERMERCADO** | Tiendas de autoservicio | 462111 |

#### Tiers de Prioridad

| Tier | Criterio | Score |
|------|----------|-------|
| **A_PREMIUM** | Mayoristas + alto score | ≥80 |
| **B_ALTA** | Consolidados con potencial | 65-79 |
| **C_MEDIA** | Retail micro con oportunidad | 45-64 |
| **D_BAJA** | Baja prioridad | <45 |

### 2.3 Score de Relevancia

El score de relevancia (0-100) se calcula combinando:

```
Score = (0.35 × Canal) + (0.25 × Tamaño) + (0.20 × Completitud) + 
        (0.10 × Rating_GM) + (0.10 × Reviews_GM)
```

| Factor | Peso | Descripción |
|--------|------|-------------|
| Canal | 35% | Tipo de negocio (mayorista > retail) |
| Tamaño | 25% | Personal ocupado |
| Completitud | 20% | Datos de contacto disponibles |
| Rating GM | 10% | Calificación en Google Maps |
| Reviews GM | 10% | Número de reseñas |

### 2.4 Zonas Logísticas

| Zona | Distancia desde Monterrey | Frecuencia sugerida |
|------|---------------------------|---------------------|
| **LOCAL** | 0-50 km | Semanal |
| **REGIONAL** | 50-200 km | Quincenal |
| **FORÁNEA** | 200-500 km | Mensual |
| **LEJANA** | >500 km | Evaluación especial |

---

## 3. Macro-Regiones

La segmentación geográfica se realizó agrupando los 32 estados en 8 macro-regiones:

| Macro-Región | Estados | Características |
|--------------|---------|-----------------|
| **NORESTE** | NL, Coah, Tamps, SLP | Zona de origen, mercado maduro |
| **FRONTERA_NORTE** | BC, Chih, Son, BCS | Alta demanda, logística compleja |
| **NOROESTE** | Sin, Nay, Dgo | Mercado en desarrollo |
| **BAJÍO** | Ags, Gto, Qro, Zac | Alto potencial industrial |
| **OCCIDENTE** | Jal, Col, Mich | Mercado grande, competido |
| **CENTRO** | CDMX, Edo.Méx, Hgo, Mor, Pue, Tlax | Mayor TAM, alta competencia |
| **GOLFO_SURESTE** | Ver, Tab, Chis, Oax, Gro | Mercado emergente |
| **PENÍNSULA** | QRoo, Yuc, Camp | Turismo + mercado local |

---

## 4. Limitaciones y Consideraciones

### 4.1 Cobertura de Datos

```js
display(decisionCallout({
  title: "Limitaciones conocidas",
  items: [
    "Teléfonos DENUE: 39.4% de cobertura (31,227 de 79,273)",
    "Teléfonos Google Maps: 1% de cobertura (756 prospectos)",
    "Análisis IA: Solo Tier A_PREMIUM (338 de 79,273)",
    "Sakbe: 18 rutas usaron estimación Haversine en lugar de API"
  ]
}));
```

### 4.2 Rutas con Estimación (sin datos Sakbe reales)

Las siguientes rutas no pudieron ser calculadas con la API de Sakbe y utilizan estimación basada en distancia Haversine con factor de ajuste 1.3x:

| Destino | Distancia Estimada |
|---------|-------------------|
| Tijuana | 2,328 km |
| Mexicali | 2,155 km |
| Ciudad Juárez | 1,163 km |
| Puebla | 1,001 km |
| Culiacán | 934 km |
| Chihuahua | 856 km |
| Querétaro | 737 km |
| León | 684 km |
| Aguascalientes | 608 km |
| San Luis Potosí | 518 km |

### 4.3 Precisión del Análisis de IA

- **Errores de validación**: 14.5% de los análisis de IA tuvieron errores de parsing
- **Falsos negativos**: Algunos negocios no fueron identificados en Street View
- **Cobertura Street View**: Algunas ubicaciones rurales no tienen imágenes disponibles

---

## 5. Actualizaciones Futuras

### 5.1 Mejoras Planificadas

1. **Enriquecimiento de teléfonos**: Integrar los 31,227 teléfonos DENUE disponibles
2. **Análisis IA extendido**: Procesar Tier B_ALTA (10,119 prospectos) usando OpenAI Batch API
3. **Sakbe pendientes**: Reintentar las 18 rutas con estimación
4. **Actualización DENUE**: Incorporar datos del censo económico 2024

### 5.2 Costos Estimados

| Mejora | Costo Estimado | Tiempo |
|--------|----------------|--------|
| Análisis IA B_ALTA (Batch) | $45.53 USD | 24 horas |
| Sakbe rutas pendientes | $0 (API gratuita) | 1 hora |
| Enriquecimiento teléfonos | $0 (datos existentes) | 30 min |

---

## 6. Reproducibilidad

### 6.1 Código Fuente

Todo el análisis es reproducible mediante el pipeline de datos ubicado en:

```
notebooks/FCarnes/pipeline/
├── config.py           # Configuración centralizada
├── step_01_extract_denue.py
├── step_02_clean_denue.py
├── step_03_integrate_google.py
├── step_04_consolidate_tam.py
├── step_04b_enrich_logistics.py
├── step_05_streetview_urls.py
├── step_06_export_dashboard.py
├── step_07_final_database.py
└── run_pipeline.py     # Orquestador CLI
```

### 6.2 Dependencias

- Python 3.10+
- pandas, geopandas
- geointelligence (paquete interno STRTGY)
- OpenAI API (para análisis de IA)
- Google Maps API (para enriquecimiento)
- INEGI Sakbe API (para ruteo)

---

<small style="color: #999; display: block; text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
  <strong>STRTGY</strong> — Transformando complejidad en certeza<br>
  Proyecto FCarnes Expansión Nacional | Metodología v1.0 | Enero 2026
</small>

