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
| **Explorador de Prospectos** | Mapa interactivo con filtros y Street View |
| **Descargas** | Export de bases de datos |

## 🗂️ Estructura del Proyecto

```
src/
├── index.md                    # Página principal
├── tam-regional.md             # TAM por macro-región
├── explorador-prospectos.md    # Dashboard interactivo
├── descargas.md                # Descargas de datos
├── components/
│   ├── ui.js                   # KPIs, formatters, badges
│   ├── brand.js                # Hero, callouts STRTGY
│   └── maps.js                 # Utilidades Leaflet
└── data/
    ├── tam_por_macroregion.csv
    ├── tam_top50_ciudades.csv
    └── prospectos_sample.json
```

## 📈 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| TAM Bruto Nacional | ~79,000 establecimientos |
| Clientes FCarnes | 282 (0.36% penetración) |
| TAM Neto | ~78,670 prospectos |
| Macro-regiones | 6 principales |

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

## 🎯 Alcance (Opción 1)

- ✅ Dashboard Interactivo de Ubicaciones (Nacional)
- ✅ TAM por Ciudad y Macro-Región
- ✅ Link a Fachada (Street View)
- ✅ Horarios Operativos
- ✅ Filtro Canal Tradicional (Carnicerías y Obradores)
- ✅ Base de Datos Depurada

## 📝 Notas

- Los datos de ejemplo en `prospectos_sample.json` son ilustrativos
- La base completa (78,670 prospectos) se entrega en archivo separado
- Para actualizar datos, ejecutar notebooks en `notebooks/fcarnes/`

---

**STRTGY** — Transformando complejidad en certeza  
Proyecto FCarnes | Diciembre 2025
