# Semana 07 · Sesión 13

## Plan de desarrollo

1. Inicializar un proyecto Expo Blank compatible con SDK 57.
2. Instalar forzosamente y verificar `react-dom` y `react-native-web` para ejecutar el laboratorio en navegador.
3. Generar 1000 productos en `catalogo-optimizado/data/products.js`.
4. Renderizar cada producto mediante `ProductRow`, memoizado con `React.memo`.
5. Implementar foco imperativo con `useRef`, filtros/ordenamiento con `useMemo` y callbacks estables con `useCallback`.
6. Optimizar la lista usando `FlatList`, `initialNumToRender`, `windowSize` y `removeClippedSubviews`.
7. Validar búsqueda, precio mínimo, foco, reset y estado vacío en móvil y web.

## Ejecución

```bash
cd Semana7_S13__catalogo-optimizado
npm install
npm run web
```

La interfaz usa una paleta minimalista black/white y tipografía monoespaciada para comunicar un panel técnico.

## Criterios de validación

- La carga inicial muestra 1000 productos ordenados alfabéticamente.
- `QUERY` filtra por nombre y `MIN_PRICE / S/` conserva productos desde el precio indicado.
- `[ FOCUS ]` enfoca el buscador y `RESET` limpia ambos filtros y devuelve el foco.
- El listado usa `FlatList`; `ProductRow` está memoizado con `React.memo`.
- `useMemo` limita el cálculo de filtros/estadísticas y `useCallback` mantiene estables los handlers.
