# Operational Intelligence Orchestrator - TODO

## Fase 1: Estructura Base y Base de Datos
- [x] Actualizar schema de Drizzle con tablas para desafíos operacionales y resultados
- [x] Crear migraciones de base de datos
- [x] Configurar variables de entorno para LLM

## Fase 2: Componentes React
- [x] Crear componente Hero Section con título exacto "Operational Intelligence Orchestrator"
- [x] Crear componente Formulario con:
  - [x] Selector de industria (Manufacturing, Retail, Healthcare, etc.)
  - [x] Selector de prioridad (Low, Medium, High, Critical)
  - [x] Textarea con contador de caracteres
  - [x] Carga de archivos adjuntos
  - [x] Botón "Orchestrate Intelligence"
- [x] Crear componente Footer con texto exacto "OPTINEX AI — Operational Intelligence Infrastructure"
- [x] Crear página Home con hero + formulario

## Fase 3: Backend y tRPC
- [x] Crear procedimiento tRPC para procesar desafíos operacionales
- [x] Integrar LLM para clasificación y generación de recomendaciones
- [x] Implementar lógica de activación de unidades de negocio
- [x] Crear helpers en server/db.ts para CRUD de desafíos

## Fase 4: Vista Completa del Orquestador
- [x] Crear página /orchestrator con panel expandido de resultados
- [x] Visualizar clasificación del problema
- [x] Mostrar unidades de negocio activadas
- [x] Mostrar recomendaciones estratégicas estructuradas
- [x] Implementar navegación entre Home y /orchestrator

## Fase 5: Estilos y Diseño
- [x] Configurar paleta de colores (azul, cian, fondo oscuro)
- [x] Aplicar estilos Tailwind a todos los componentes
- [x] Implementar tema oscuro tech/corporativo
- [x] Asegurar responsividad en móvil y desktop

## Fase 6: Pruebas y Validación
- [x] Escribir tests vitest para procedimientos tRPC
- [x] Validar flujo completo de formulario a resultados
- [x] Verificar que npm run dev funciona sin errores
- [x] Crear checkpoint final
