# ✅ Scoring Diferenciado por Zona - FCarnes (IMPLEMENTADO)

> **Estado:** ✅ COMPLETADO (2026-01-12)

## 📋 Resumen Ejecutivo

Este plan implementó el scoring diferenciado solicitado por el cliente **directamente en el pipeline de datos Python**, no solo en el frontend. Esto garantiza:

1. **Reproducibilidad**: Los datos siempre tendrán la misma clasificación
2. **Consistencia**: Dashboard, exports y reportes usan la misma lógica
3. **Mantenibilidad**: Cambios centralizados en el pipeline

---

## 🎯 Requerimientos del Cliente

### Zona Metropolitana de Monterrey (ZM MTY)
- ✅ **Priorizar**: Bodegones, Retailers medianos/grandes
- ❌ **Excluir**: Procesadoras de carne

### Fuera de Nuevo León
- ✅ **Priorizar**: Cadenas con **4 o más sucursales**
- ✅ **Ejemplos conocidos**: El Florido, Las Nenas, El Tío (BC), Omerca, La Cabaña (Coah)

---

## 🔬 Investigación de Cadenas (Perplexity Research)

Se identificaron **15 cadenas regionales** que cumplen los criterios:

| Cadena | Estados | Sucursales | Tipo |
|--------|---------|------------|------|
| **El Florido** | Baja California | 6+ | Supermercado Regional |
| **Las Nenas** | Baja California | 4+ | Frutería con Carnes |
| **Carnes Finas San Juan** | Nuevo León | 14 | Carnicería Premium |
| **Carnes JC** | Sonora | 3+ | Carnicería Premium |
| **Mi Granja San Agustín** | 6 estados norte | 10+ | Distribuidor Trompo |
| **La Cabaña** | Coahuila | 4+ | Supermercado Regional |
| **Bodegas Omerca** | Coahuila | 4+ | Bodega Mayorista |
| **El Tío** | Baja California | 4+ | Carnicería Cadena |
| **Las Dos Marías** | San Luis Potosí | 2+ | Obrador Carnicería |
| **Alicarnes** | Querétaro | 4+ | Carnicería Cadena |
| **Carnes D'E. Río Sonora** | Sonora | 3+ | Distribuidor |
| **Carnes Finas del Norte** | Coah, NL, Chih | 5+ | Distribuidor |
| **Los Corrales** | Durango | 2+ | Carnicería Cadena |
| **Soles** | Sonora, Sinaloa, BC | 12+ | Productor-Distribuidor |
| **DCA Carnes** | Nuevo León | 2+ | Carnicería Familiar |

---

## 🏗️ Arquitectura de Implementación

```
┌─────────────────────────────────────────────────────────────────┐
│                    PIPELINE DE DATOS (Python)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                  │
│  │ config_cadenas.py│───▶│ step_09_detect_  │                  │
│  │                  │    │ chains.py        │                  │
│  │ - ZM_MONTERREY   │    │                  │                  │
│  │ - PATRONES_REGEX │    │ - Fuzzy matching │                  │
│  │ - CATEGORIAS     │    │ - Conteo sucurs. │                  │
│  └──────────────────┘    └────────┬─────────┘                  │
│                                   │                             │
│                                   ▼                             │
│                     ┌──────────────────────┐                   │
│                     │ step_10_scoring_     │                   │
│                     │ diferenciado.py      │                   │
│                     │                      │                   │
│                     │ - es_prioritario     │                   │
│                     │ - razon_prioridad    │                   │
│                     │ - score_ajustado     │                   │
│                     └────────┬─────────────┘                   │
│                              │                                  │
│                              ▼                                  │
│                     ┌──────────────────────┐                   │
│                     │ step_08_filter_      │                   │
│                     │ quality.py (mod)     │                   │
│                     └────────┬─────────────┘                   │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  prospectos_sample.json                         │
│  (incluye: es_prioritario, razon_prioridad, es_cadena,         │
│   nombre_cadena, num_sucursales, zona_scoring)                  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              DASHBOARD OBSERVABLE (JavaScript)                  │
├─────────────────────────────────────────────────────────────────┤
│  explorador-prospectos.md                                       │
│  - Lee campos del JSON (NO calcula scoring)                     │
│  - Toggle "Solo Prioritarios"                                   │
│  - Toggle "Solo Cadenas (4+ suc)"                               │
│  - Badge visual para cadenas                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Módulos del Plan

| Módulo | Descripción | Horas Est. | Prioridad |
|--------|-------------|------------|-----------|
| **MOD-000** | Configuración de cadenas y reglas | 3.5h | Critical |
| **MOD-001** | Detección de cadenas por conteo | 5h | Critical |
| **MOD-002** | Scoring diferenciado por zona | 4.5h | Critical |
| **MOD-003** | Actualización data loader dashboard | 2h | High |
| **MOD-004** | Actualización dashboard Observable | 4h | High |
| **MOD-005** | Testing y validación E2E | 3.5h | Medium |
| **TOTAL** | | **22.5h** | |

---

## 🔑 Cambios Clave

### 1. Nuevo Archivo: `config_cadenas.py`

```python
# Municipios de ZM Monterrey (16 municipios)
ZM_MONTERREY_MUNICIPIOS = [
    "Monterrey", "San Nicolás de los Garza", "Guadalupe", "Apodaca",
    "San Pedro Garza García", "Santa Catarina", "General Escobedo",
    "Juárez", "García", "Cadereyta Jiménez", "Santiago", "Salinas Victoria",
    "Ciénega de Flores", "General Zuazua", "Pesquería", "El Carmen"
]

# Patrones de cadenas conocidas (15+)
PATRONES_CADENAS = [
    (r"(?:el\s+)?florido", "El Florido"),
    (r"(?:las\s+)?nenas|fruteria(?:s)?\s+nenas", "Las Nenas"),
    (r"(?:carnes\s+)?(?:finas\s+)?san\s+juan", "Carnes Finas San Juan"),
    # ... 12 más
]

# Mínimo de sucursales para ser considerado cadena
MIN_SUCURSALES_CADENA = 4
```

### 2. Nuevo Step: `step_09_detect_chains.py`

Algoritmo de detección:
1. Normalizar nombres (lowercase, sin acentos, sin SA/SAPI)
2. Match con patrones conocidos → `es_cadena = True`
3. Agrupar por similitud fuzzy (threshold 85%)
4. Contar ubicaciones únicas (coordenadas con tolerancia 100m)
5. Si count ≥ 4 → `es_cadena = True`

### 3. Nuevo Step: `step_10_scoring_diferenciado.py`

Reglas de negocio:

| Zona | Regla | Bonus Score |
|------|-------|-------------|
| **ZM Monterrey** | Bodegones/Retailers = ✅, Procesadoras = ❌ | +15 pts |
| **Resto NL** | Sin priorización especial | +0 pts |
| **Exterior NL** | Cadenas con 4+ sucursales = ✅ | +20 pts |

### 4. Campos Nuevos en JSON

```json
{
  "properties": {
    "es_prioritario": true,
    "razon_prioridad": "Cadena/Multi-ubicación (alto volumen)",
    "es_cadena": true,
    "nombre_cadena": "El Florido",
    "num_sucursales": 6,
    "zona_scoring": "EXTERIOR"
  }
}
```

---

## ✅ Criterios de Aceptación (TODOS COMPLETADOS)

1. [x] Archivo `config_cadenas.py` con 15+ patrones de cadenas ✅
2. [x] Step 09 detecta cadenas por conteo (≥4 sucursales) ✅ - 3,690 detectadas
3. [x] Step 10 aplica scoring diferenciado correctamente ✅ - 4,001 prioritarios
4. [x] JSON de prospectos incluye campos nuevos ✅ - 8 campos añadidos
5. [x] Dashboard consume datos pre-procesados (no calcula en JS) ✅
6. [x] Tests unitarios pasan con casos del cliente ✅
7. [x] Procesadoras excluidas en ZM MTY ✅ - 3 excluidas
8. [x] El Florido, Las Nenas, Omerca, La Cabaña detectados como cadenas ✅

---

## 🚀 Comandos de Ejecución

```bash
# Ejecutar pipeline con nuevos steps
cd notebooks/fcarnes/pipeline
python run_pipeline.py --steps chains scoring quality

# Rebuild dashboard
cd reports/strtgy_predict_fcarnes_expansion_nacional
npm run build

# Ejecutar tests
pytest tests/test_fcarnes_cadenas.py -v
```

---

## 📅 Cronograma Sugerido

| Día | Tareas |
|-----|--------|
| **Día 1** | MOD-000 (config) + MOD-001 (detección) |
| **Día 2** | MOD-002 (scoring) + MOD-003 (data loader) |
| **Día 3** | MOD-004 (dashboard) + MOD-005 (testing) |

---

## 📝 Notas Técnicas

1. **Evitar falsos positivos**: Los patrones genéricos como `/super/` o `/bodega/` fueron eliminados. Solo se usan patrones específicos de cadenas conocidas.

2. **Doble validación**: Un negocio es cadena si:
   - Match con patrón conocido (alta confianza), **O**
   - Tiene ≥4 sucursales detectadas por nombre similar + coordenadas diferentes

3. **Exclusión de procesadoras**: Se usa tanto el campo `categoria_fcarnes` como los códigos SCIAN 311611/311612 para identificar procesadoras.

---

## 📊 Resultados de Implementación

### Métricas Finales

| Métrica | Valor |
|---------|-------|
| **Total registros procesados** | 8,761 |
| **Cadenas detectadas** | 3,690 (42.1%) |
| **Prioritarios totales** | 4,001 (45.7%) |

### Detección de Cadenas

| Método | Cantidad |
|--------|----------|
| Por patrón (Perplexity) | 29 |
| Por conteo DENUE | 3,604 |
| Por ambos métodos | 57 |

### Scoring por Zona

| Zona | Registros | Prioritarios | % |
|------|-----------|--------------|---|
| ZM Monterrey | 507 | 504 | 99.4% |
| Exterior NL | 8,169 | 3,497 | 42.8% |
| Resto NL | 85 | 0 | 0% |

### Archivos Generados

```
notebooks/fcarnes/pipeline/
├── config_cadenas.py           # Configuración y patrones
├── step_09_detect_chains.py    # Detección de cadenas
└── step_10_scoring_diferenciado.py  # Scoring por zona

data/processed/fcarnes/
├── prospectos_con_cadenas_20260112.parquet
└── prospectos_scoring_diferenciado_20260112.parquet

reports/.../src/data/
└── prospectos_sample.json      # Con 8 campos nuevos
```

---

*Plan implementado el 2026-01-12 por AI Data App Architect*
