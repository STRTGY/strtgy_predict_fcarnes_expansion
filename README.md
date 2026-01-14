# STRTGY Predict | Censo Estratégico Nacional FCarnes

Dashboard interactivo de inteligencia comercial para la expansión nacional de FCarnes. Canal tradicional (Carnicerías y Obradores).

## 🚀 Vista Rápida

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000  (o el puerto que indique la terminal)
```

## 📊 Contenido del Dashboard

| Página | Descripción |
|--------|-------------|
| **Inicio** | Resumen ejecutivo, KPIs y navegación |
| **TAM por Región** | Análisis de oportunidad por macro-región |
| **Explorador de Prospectos** | Mapa interactivo con filtros, IA y Street View |
| **Metodología** | Fuentes de datos y criterios de análisis |
| **Descargas** | Export de bases de datos |

## 🗂️ Estructura del Proyecto

```
src/
├── index.md                    # Página principal
├── tam-regional.md             # TAM por macro-región
├── explorador-prospectos.md    # Dashboard interactivo con IA
├── metodologia.md              # Metodología y fuentes
├── descargas.md                # Descargas de datos
├── components/
│   ├── ui.js                   # KPIs, formatters, badges
│   ├── brand.js                # Hero, callouts STRTGY
│   └── maps.js                 # Utilidades Leaflet
└── data/
    ├── tam_por_macroregion.csv
    ├── tam_top50_ciudades.csv
    ├── prospectos_sample.json  # 30,915 prospectos verificados
    └── costos_logisticos.json  # Rutas Sakbe INEGI
```

### Campos Nuevos en `prospectos_sample.json`

```json
{
  "cad": 1,           // es_cadena (0/1)
  "cad_nom": "El Florido",  // nombre_cadena
  "cad_suc": 6,       // num_sucursales
  "cad_met": "PATRON", // método: PATRON|CONTEO|AMBOS
  "prio": 1,          // es_prioritario (0/1)
  "prio_raz": "Cadena conocida",  // razón
  "zona_sc": "EXTERIOR",  // zona_scoring
  "sadj": 75.0        // score_ajustado
}
```

## 📈 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| TAM Bruto Nacional | 79,620 establecimientos |
| Clientes FCarnes | 3,368 (4.2% penetración) |
| TAM Neto | 76,252 prospectos |
| **Prospectos Verificados** | 30,915 (38.8% del TAM) |
| **Tier A (Premium)** | 74 |
| **Tier B (Alta)** | 9,050 |
| **Tier C (Media)** | 21,791 |
| **Prioritarios (Scoring v2)** | 701 |
| **Cadenas detectadas (v3.2 fuzzy)** | 574 |
| **↳ Por razón social (fuzzy 92%)** | 101 (máxima confianza) |
| **↳ Por patrón conocido (regex)** | 187 (CarneMart, SuKarne, etc.) |
| **↳ Por email (exacto)** | 7 (alta confianza) |
| **↳ Por teléfono (exacto)** | 41 (media-alta confianza) |
| **↳ Por nombre+ciudad (fuzzy 88%)** | 238 (media confianza) |
| **Confianza CONFIRMADA** | 295 |
| **Confianza PROBABLE** | 279 |
| Macro-regiones | 9 |
| Prospectos con análisis IA | ~49% |
| Prospectos con teléfono | ~74% |

## 🛠️ Desarrollo

### Requisitos
- Node.js >= 18

### Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Limpiar caché
npm run clean
```

### 📖 Guía de Desarrollo (Cursor Rules)

Este proyecto incluye reglas específicas para Cursor AI en `.cursorrules`. Las reglas incluyen:

- **Contexto del cliente FCarnes** (colores, industria, restricciones)
- **Patrones de Observable Framework** (imports, FileAttachment, Plot)
- **Componentes personalizados** (`heroFCarnes()`, `kpi()`, `decisionCallout()`)
- **Estructura de datos** (GeoJSON de prospectos, CSVs de TAM)
- **Convenciones de código** y mejores prácticas

> **Tip:** El archivo `.cursorrules` proporciona contexto automático cuando trabajas en este proyecto con Cursor.

## 🎯 Características

- ✅ Dashboard Interactivo de Ubicaciones (Nacional)
- ✅ TAM por Ciudad y Macro-Región (8 regiones)
- ✅ Costos logísticos reales (INEGI Sakbe)
- ✅ Análisis de IA con GPT-4o Vision (~49% cobertura)
- ✅ Link a Fachada (Street View)
- ✅ Horarios Operativos
- ✅ Filtro Canal Tradicional (Carnicerías y Obradores)
- ✅ Base de Datos Depurada con ~74% teléfonos

### 🆕 Scoring Diferenciado (v2.0)

- ✅ **Detección de Cadenas**: 574 cadenas con criterios estrictos (fuzzy matching)
- ✅ **Priorización ZM Monterrey**: Bodegones y retailers (+15 pts), procesadoras excluidas
- ✅ **Priorización Exterior**: Cadenas multi-ubicación (+20 pts)
- ✅ **Filtros Nuevos**: "Solo Prioritarios" y "Solo Cadenas (4+ suc)"
- ✅ **Badges Visuales**: ⭐ para prioritarios, 🔗 para cadenas

## 📦 Publicación en GitHub Pages

```bash
# Build para producción
npm run build

# El directorio dist/ contiene los archivos estáticos
# Subir dist/ a GitHub Pages o usar GitHub Actions
```

### GitHub Actions (Opcional)

Crear `.github/workflows/deploy.yml` para deploy automático.

## 📝 Notas

- Los datos en `prospectos_sample.json` incluyen prospectos verificados de todos los tiers
- Análisis de IA disponible para Tier A_PREMIUM y B_ALTA
- Costos de ruta calculados con INEGI Sakbe API
- Para actualizar datos, ejecutar notebooks en `notebooks/fcarnes/pipeline/`

---

**STRTGY** — Transformando complejidad en certeza  
Proyecto FCarnes | Enero 2026
