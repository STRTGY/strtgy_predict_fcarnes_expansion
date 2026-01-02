// See https://observablehq.com/framework/config for documentation.
export default {
  // The app's title; used in the sidebar and webpage titles.
  title: "STRTGY Predict | Censo Estratégico FCarnes",
  
  // SEO and metadata
  description: "Dashboard de inteligencia comercial para expansión nacional de FCarnes. TAM por macro-región, prospectos priorizados y validación visual.",
  
  // Pages and sections in the sidebar
  pages: [
    { name: "Inicio", path: "/" },
    { name: "TAM por Región", path: "/tam-regional" },
    { name: "Explorador de Prospectos", path: "/explorador-prospectos" },
    { name: "📋 Metodología", path: "/metodologia" },
    { name: "📥 Descargas", path: "/descargas" }
  ],

  // Enhanced head with Leaflet CSS + JS, favicon, and OG tags
  head: `
    <link rel="icon" href="observable.png" type="image/png" sizes="32x32">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin="anonymous"></script>
    <meta property="og:title" content="STRTGY Predict | FCarnes Censo Nacional">
    <meta property="og:description" content="Dashboard de inteligencia comercial para expansión nacional de FCarnes">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <style>
      :root { --fcarnes-primary: #C41E3A; }
      main .card { border-radius: 8px; transition: box-shadow 0.2s; }
      main .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      main table thead th { background: #f8f9fa; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
      main table tbody tr:hover { background: #fef5f5; }
    </style>
  `,

  // The path to the source root.
  root: "src",

  // Theme and UI configuration
  theme: ["cotton", "wide"],
  
  // Footer
  footer: "© 2026 STRTGY.ai | Proyecto FCarnes",
  
  // Enable sidebar navigation
  sidebar: true,
  
  // Enable table of contents (per page)
  toc: {
    show: false,
    label: "En esta página"
  },
  
  // Enable pagination
  pager: true,
  
  // Enable search functionality
  search: true,
  
  // Enable automatic URL linking
  linkify: true,
  
  // Typographic improvements
  typographer: true,
  
  // Output configuration
  output: "dist"
};
