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
  { label: "TAM Bruto Analizado", value: "79,620", subtitle: "Prospectos totales" },
  { label: "Prospectos Verificados", value: "8,761", subtitle: "Alta calidad (11%)" },
  { label: "Macro-Regiones", value: "9", subtitle: "Cobertura nacional" }
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
| **Registros extraídos** | 79,175 unidades económicas |

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

### 1.3 Ruteo y Costos Logísticos (HERE + Sakbe)

<div class="card">

**Sistema de cálculo de rutas y costos logísticos**

| Atributo | Valor |
|----------|-------|
| **APIs utilizadas** | HERE Routing API + INEGI Sakbe |
| **Rutas principales calculadas** | 16 destinos estratégicos |
| **Rutas con casetas** | 15 (94%) |
| **Distancia máxima** | 2,600 km (Tijuana) |

**Métricas obtenidas:**
- Distancia en kilómetros (ruta óptima por carretera)
- Tiempo estimado de viaje
- Zonas de cobertura logística
- Geometría de rutas para visualización en mapa

</div>

### 1.4 Street View + GPT-4o Vision

<div class="card">

**Análisis visual con inteligencia artificial**

| Tier | Total | Con IA | Cobertura |
|------|------:|-------:|----------:|
| **A_PREMIUM** | 377 | 274 | 72.7% |
| **B_ALTA** | 22,052 | 22,012 | **99.8%** |
| **Total Prioritarios** | 22,429 | 22,286 | **99.4%** |

| Atributo | Valor |
|----------|-------|
| **Modelo utilizado** | GPT-4o Vision |
| **Método de procesamiento** | Análisis por lotes automatizado |

**Métricas de IA generadas:**
- Vitalidad comercial de la escena (1-10)
- Visibilidad del negocio desde la calle (1-10)
- Condición de la fachada (1-10)
- Target encontrado (sí/no)
- Tipo de calle y densidad urbana

**Prospectos sin análisis IA:**
- A_PREMIUM sin IA (103): Sin cobertura Street View en ubicaciones rurales
- B_ALTA sin IA (40): Diferencias menores de coordenadas que impidieron match

</div>

### 1.5 Datos del Cliente (FCarnes)

<div class="card">

**Base de clientes actuales**

| Atributo | Valor |
|----------|-------|
| **Clientes únicos** | 3,059 |
| **Cobertura de ciudades** | 129 ciudades |
| **Período de referencia** | 2024-2025 |

**Campos utilizados:**
- Nombre del cliente
- Ciudad y ruta asignada
- Tipo (Local/Foráneo)
- Fecha de alta

</div>

---

## 2. Proceso de Análisis

### 2.1 Pipeline de Datos

El proceso de generación de prospectos sigue un flujo de 8 etapas:

<div class="grid grid-cols-4" style="gap: 0.5rem; margin: 1rem 0;">
  <div style="background: #E3F2FD; padding: 0.75rem; border-radius: 6px; text-align: center; font-size: 0.85rem;">
    <strong>1. Extracción</strong><br>
    <span style="color: #666;">DENUE INEGI</span>
  </div>
  <div style="background: #E8F5E9; padding: 0.75rem; border-radius: 6px; text-align: center; font-size: 0.85rem;">
    <strong>2. Limpieza</strong><br>
    <span style="color: #666;">Dedupe + Normalización</span>
  </div>
  <div style="background: #FFF3E0; padding: 0.75rem; border-radius: 6px; text-align: center; font-size: 0.85rem;">
    <strong>3. Enriquecimiento</strong><br>
    <span style="color: #666;">Google Maps API</span>
  </div>
  <div style="background: #FCE4EC; padding: 0.75rem; border-radius: 6px; text-align: center; font-size: 0.85rem;">
    <strong>4. Scoring</strong><br>
    <span style="color: #666;">Ranking por canal</span>
  </div>
</div>

<div class="grid grid-cols-4" style="gap: 0.5rem; margin: 1rem 0;">
  <div style="background: #F3E5F5; padding: 0.75rem; border-radius: 6px; text-align: center; font-size: 0.85rem;">
    <strong>5. Logística</strong><br>
    <span style="color: #666;">HERE + Sakbe</span>
  </div>
  <div style="background: #E0F7FA; padding: 0.75rem; border-radius: 6px; text-align: center; font-size: 0.85rem;">
    <strong>6. Análisis IA</strong><br>
    <span style="color: #666;">GPT-4o Vision</span>
  </div>
  <div style="background: #FBE9E7; padding: 0.75rem; border-radius: 6px; text-align: center; font-size: 0.85rem;">
    <strong>7. Filtrado</strong><br>
    <span style="color: #666;">Verificación calidad</span>
  </div>
  <div style="background: #FFEBEE; padding: 0.75rem; border-radius: 6px; text-align: center; font-size: 0.85rem;">
    <strong>8. Dashboard</strong><br>
    <span style="color: #666;">Export final</span>
  </div>
</div>

### 2.2 Filtrado de Calidad

Para garantizar que **solo se entreguen prospectos verificables**, se implementó un proceso de filtrado multicapa:

<div class="card" style="border-left: 4px solid #4CAF50; background: #E8F5E9;">

**Criterios de Filtrado Aplicados:**

| Filtro | Criterio | Impacto |
|--------|----------|---------|
| **Tier** | Solo A_PREMIUM y B_ALTA | Elimina ~71% del TAM (C y D) |
| **Score mínimo** | ≥ 50 puntos | Elimina baja relevancia |
| **Completitud** | ≥ 30% de campos | Elimina registros vacíos |
| **Nombres** | Excluir genéricos | Elimina "CARNICERIA", "EXPENDIO", etc. |
| **Contacto** | Requiere teléfono, reviews o web | Elimina sin forma de contacto |

**Resultado del filtrado:**
- TAM Bruto: 79,620 prospectos
- **Prospectos Verificados: 8,761** (11% de alta calidad)
- Cada prospecto tiene contacto verificable

</div>

#### Niveles de Confianza

Cada prospecto filtrado recibe un nivel de confianza:

| Nivel | Criterio | Acción Recomendada |
|-------|----------|-------------------|
| **ALTA** | Validado IA + teléfono + reviews | Contactar directamente |
| **MEDIA** | Teléfono o reviews | Validar por teléfono |
| **PENDIENTE** | Solo datos básicos | Validar con Street View |

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

La segmentación geográfica se realizó agrupando los 32 estados en 9 macro-regiones:

| Macro-Región | Estados | Características |
|--------------|---------|-----------------|
| **NORESTE** | NL, Coah, Tamps, SLP | Zona de origen, mercado maduro (53.6% penetración) |
| **FRONTERA_NORTE** | BC, Chih, Son, BCS | Alta demanda, logística compleja |
| **NOROESTE** | Sin, Nay, Dgo | Mercado en desarrollo |
| **BAJÍO** | Ags, Gto, Qro, Zac | Alto potencial industrial, costos moderados |
| **OCCIDENTE** | Jal, Col, Mich | Mercado grande, competido |
| **CENTRO** | CDMX, Edo.Méx, Hgo, Mor, Pue, Tlax | Mayor TAM (28,251), baja penetración |
| **GOLFO_SURESTE** | Ver, Tab, Chis, Oax, Gro | Mercado emergente, alto potencial |
| **PENÍNSULA** | QRoo, Yuc, Camp | Turismo + mercado local |
| **OTRA** | Estados sin clasificación específica | Registros pendientes de asignación |

---

## 4. Limitaciones y Consideraciones

### 4.1 Cobertura de Datos

```js
display(decisionCallout({
  title: "Consideraciones sobre los datos",
  items: [
    "Teléfonos DENUE: 39.4% de cobertura en la fuente oficial",
    "Enriquecimiento Google Maps: Aplicado a prospectos prioritarios",
    "Análisis visual IA: 99.4% de cobertura en prospectos Tier A y B",
    "Rutas logísticas: Calculadas con APIs de ruteo oficial"
  ]
}));
```

### 4.2 Rutas Logísticas Calculadas

Se calcularon 16 rutas estratégicas desde la planta de Monterrey, optimizadas para transitar exclusivamente por territorio mexicano:

| Destino | Distancia | Tiempo Estimado | Zona |
|---------|-----------|-----------------|------|
| Tijuana | 2,600 km | ~32.5 hrs | LEJANA |
| Mexicali | 2,429 km | ~30.4 hrs | LEJANA |
| Culiacán | 1,529 km | ~19.1 hrs | LEJANA |
| Puebla | 1,293 km | ~16.2 hrs | LEJANA |
| Ciudad Juárez | 1,163 km | ~14.5 hrs | LEJANA |
| Chihuahua | 800 km | ~10.0 hrs | LEJANA |
| Querétaro | 703 km | ~8.8 hrs | LEJANA |
| León | 693 km | ~8.7 hrs | FORÁNEA |
| Aguascalientes | 679 km | ~8.5 hrs | FORÁNEA |
| San Luis Potosí | 510 km | ~6.4 hrs | FORÁNEA |

### 4.3 Precisión del Análisis de IA

- **Tasa de éxito**: 99.7% de parsing exitoso en el batch B_ALTA (12,411 de 12,411)
- **Falsos negativos**: Algunos negocios no fueron identificados en Street View
- **Cobertura Street View**: 103 ubicaciones A_PREMIUM y 40 B_ALTA sin imágenes (zonas rurales)

---

## 5. Estado del Análisis y Mejoras Futuras

### 5.1 Análisis Completados ✅

| Componente | Estado | Cobertura |
|------------|--------|-----------|
| Extracción DENUE | ✅ Completado | 79,620 registros |
| Enriquecimiento Google Maps | ✅ Completado | 866 prospectos |
| Análisis IA (Tier A+B) | ✅ Completado | 22,286 prospectos (99.4%) |
| Cálculo de rutas logísticas | ✅ Completado | 16 destinos estratégicos |
| Filtrado de calidad | ✅ Completado | 8,761 verificados |
| Red logística visualizable | ✅ Completado | Rutas en mapa interactivo |

### 5.2 Posibles Mejoras Futuras

| Mejora | Beneficio | Prioridad |
|--------|-----------|-----------|
| Análisis IA Tier C | +56,372 prospectos evaluados | Media |
| Actualización DENUE 2025 | Datos más recientes | Alta |
| Integración CRM | Sincronización automática | Media |
| Alertas de nuevos prospectos | Detección en tiempo real | Baja |

---

<small style="color: #999; display: block; text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
  <strong>STRTGY</strong> — Transformando complejidad en certeza<br>
  Proyecto FCarnes Expansión Nacional | Metodología v2.0 (con Filtrado de Calidad) | Enero 2026
</small>

