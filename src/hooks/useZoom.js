import { useState } from 'react';
import { CANVAS_SIZE } from '../utils/gridUtils';

// Hook para centralizar toda a lógica de zoom e pan do canvas
export function useZoom(initialZoom = 1, initialCenter = { x: 0, y: 0 }) {
  // Estado do zoom (1x, 2x, 4x, ...)
  const [zoom, setZoom] = useState(initialZoom);
  // Estado do centro lógico da viewport
  const [viewportCenter, setViewportCenter] = useState(initialCenter);

  // Função para dar zoom in
  function zoomIn() {
    const nextZoom = Math.min(zoom * 2, 16);
    const logicalSize = CANVAS_SIZE / nextZoom;
    setViewportCenter(c => ({
      x: Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.x)),
      y: Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.y)),
    }));
    setZoom(nextZoom);
  }

  // Função para dar zoom out
  function zoomOut() {
    const nextZoom = Math.max(zoom / 2, 1);
    const logicalSize = CANVAS_SIZE / nextZoom;
    setViewportCenter(c => ({
      x: Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.x)),
      y: Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.y)),
    }));
    setZoom(nextZoom);
  }

  // Função para pan (mover viewport)
  function pan(dx, dy) {
    const logicalSize = CANVAS_SIZE / zoom;
    setViewportCenter(c => {
      const nx = Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.x + dx));
      const ny = Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.y + dy));
      return { x: nx, y: ny };
    });
  }

  // Função para resetar zoom e centro
  function resetZoom() {
    setZoom(1);
    setViewportCenter({ x: 0, y: 0 });
  }

  return {
    zoom,
    setZoom,
    viewportCenter,
    setViewportCenter,
    zoomIn,
    zoomOut,
    pan,
    resetZoom,
  };
}
