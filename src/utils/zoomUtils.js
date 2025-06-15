import { CANVAS_SIZE } from './gridUtils';

// Converte coordenadas lógicas para canvas considerando zoom e centro da viewport
// x, y: coordenadas lógicas
// zoom: fator de zoom (1, 2, 4, ...)
// viewportCenter: {x, y} centro lógico da viewport
// Retorna [canvasX, canvasY]
export function toCanvasZoom(x, y, zoom, viewportCenter) {
  // Área lógica visível
  const logicalSize = CANVAS_SIZE / zoom;
  // Canto superior esquerdo da área lógica visível
  const minX = viewportCenter.x - logicalSize / 2;
  const minY = viewportCenter.y - logicalSize / 2;
  // Proporção dentro da área lógica
  const px = (x - minX) / logicalSize;
  const py = (y - minY) / logicalSize;
  // Converte para pixel no canvas
  return [px * CANVAS_SIZE, py * CANVAS_SIZE];
}

// Converte coordenadas canvas para lógicas considerando zoom e centro da viewport
export function fromCanvasZoom(canvasX, canvasY, zoom, viewportCenter) {
  const logicalSize = CANVAS_SIZE / zoom;
  const minX = viewportCenter.x - logicalSize / 2;
  const minY = viewportCenter.y - logicalSize / 2;
  const x = minX + (canvasX / CANVAS_SIZE) * logicalSize;
  const y = minY + (canvasY / CANVAS_SIZE) * logicalSize;
  return [x, y];
}
