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
    ├── prospectos_sample.json  # ~79K prospectos con análisis IA
    └── costos_logisticos.json  # Rutas Sakbe INEGI
```

## 📈 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| TAM Bruto Nacional | ~79,000 establecimientos |
| Clientes FCarnes | 3,059 (3.9% penetración) |
| TAM Neto | ~76,000 prospectos |
| Macro-regiones | 8 |
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

## 🎯 Características

- ✅ Dashboard Interactivo de Ubicaciones (Nacional)
- ✅ TAM por Ciudad y Macro-Región (8 regiones)
- ✅ Costos logísticos reales (INEGI Sakbe)
- ✅ Análisis de IA con GPT-4o Vision (~49% cobertura)
- ✅ Link a Fachada (Street View)
- ✅ Horarios Operativos
- ✅ Filtro Canal Tradicional (Carnicerías y Obradores)
- ✅ Base de Datos Depurada con ~74% teléfonos

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

- Los datos en `prospectos_sample.json` incluyen ~79K prospectos reales
- Análisis de IA disponible para Tier A_PREMIUM y B_ALTA
- Costos de ruta calculados con INEGI Sakbe API
- Para actualizar datos, ejecutar notebooks en `notebooks/fcarnes/pipeline/`

---

**STRTGY** — Transformando complejidad en certeza  
Proyecto FCarnes | Enero 2026
