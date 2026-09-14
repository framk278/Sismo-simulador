# Sismolab — Laboratorio Virtual de Ingeniería Sísmica

Aplicación web educativa e interactiva sobre ingeniería sísmica y comportamiento
de ondas sísmicas, construida con **React + Vite**. Funciona completamente en el
navegador, sin backend.

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

## Compilar para producción

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
src/
├── components/     # UI reutilizable (Sidebar, Panel, Quiz, Slider, etc.)
├── pages/          # Las 8 secciones del laboratorio
├── simulations/     # Animaciones y modelos físicos (canvas/SVG)
├── data/           # Datos de suelos, ondas, placas, sistemas estructurales
├── hooks/          # Contexto de progreso y puntaje
└── App.jsx         # Navegación principal
```

## Secciones

1. **Inicio** — ruta de aprendizaje.
2. **Contexto tectónico** — origen de la energía sísmica, tipos de límites de
   placa, Cinturón de Fuego, Colombia y Venezuela.
3. **Ondas mecánicas** — simulador de onda con sliders, comparación de ondas
   P, S, Love y Rayleigh.
4. **Medios y efectos de sitio** — partículas de suelo, propagación de onda
   por distintos tipos de suelo.
5. **Mitigación estructural** — estructura oscilando, sistemas de disipación
   y aislamiento sísmico, tabla comparativa.
6. **Laboratorio masa-resorte** — física real de oscilación amortiguada,
   registro de experimentos y gráficos.
7. **Simulador sísmico** — integra suelo, número de pisos, frecuencia y
   sistema estructural; incluye modo comparación de los tres sistemas.
8. **Conclusiones** — resultado del laboratorio con puntaje y temas a repasar.

## Nota académica

Los valores numéricos (frecuencias naturales, amplificaciones, velocidades de
onda, etc.) son aproximaciones simplificadas con fines didácticos. El
simulador no reemplaza un software profesional de análisis estructural ni un
estudio real de microzonificación sísmica.
