# 📋 Gestor de Plan de Igualdad

Herramienta web en HTML, CSS y JS vanilla para crear y gestionar el Plan de Igualdad de una empresa.

## Estructura del proyecto

comite/
├── index.html
├── configuracion.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── configuracion.js
├── assets/
└── README.md

## Cómo usar

1. Abrir `index.html` en el navegador, o
2. Servir con un servidor local:

python3 -m http.server 8080

Luego abrir en el navegador: http://localhost:8080

## Características actuales

- Área de configuración con:
  - Datos de la empresa
  - Comité de igualdad
  - Parámetros del plan
- Persistencia con `localStorage` (los datos se guardan en el navegador)

## Próximas funcionalidades

- Módulo de diagnóstico
- Objetivos y medidas
- Exportación del plan (PDF / Word)
