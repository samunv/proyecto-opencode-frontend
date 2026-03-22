---
name: arquitectura-js
description: Reglas de arquitectura y separación de responsabilidades del proyecto
---

## Estructura de ficheros
- api.js → SOLO llamadas fetch a Last.fm. Nunca tocar el DOM.
- ui.js → SOLO manipulación del DOM. Nunca hacer fetch.
- app.js → Orquestador. Llama a api.js y pasa el resultado a ui.js.
- config.js → SOLO constantes y configuración (API key, BASE_URL...)
- types.js → Clases/tipos de los objetos para trabajar con ellos

## Reglas generales
- Un fichero = una responsabilidad
- Una función = una responsabilidad
- Nunca repetir código, extraer funciones reutilizables
- Nunca hardcodear valores, usar config.js
- En los .js Siempre async/await con try/catch para manejo de promesas con errores
- Funciones con máximo 10 líneas y un solo propósito.
- Programación orientada a objetos con clases JS
- Estados de carga al hacer fetch obligatorios.
- Nombres de variables en español, claros y legibles.