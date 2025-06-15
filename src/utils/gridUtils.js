// Grid utilities - Funções puras para cálculos de grid
// Separado do FractalCanvas para melhor organização

export const CANVAS_SIZE = 500;

/**
 * Converte coordenadas centradas para canvas (centro em width/2, height/2)
 * @param {number} x - Coordenada X centrada
 * @param {number} y - Coordenada Y centrada
 * @returns {Array} [canvasX, canvasY]
 */
export const toCanvas = (x, y) => [x + CANVAS_SIZE / 2, y + CANVAS_SIZE / 2];

/**
 * Encontra o ponto mais próximo do grid baseado nas coordenadas do mouse
 * @param {number} x - Coordenada X do mouse no canvas
 * @param {number} y - Coordenada Y do mouse no canvas
 * @param {number} divisions - Número de divisões do grid (padrão: 4)
 * @returns {Object} { canvas: [x, y], logical: { x, y } }
 */
export const getNearestGridPoint = (x, y, divisions = 4) => {
  const step = CANVAS_SIZE / divisions;
  // Converte para coordenadas centradas
  const cx = x - CANVAS_SIZE / 2;
  const cy = y - CANVAS_SIZE / 2;
  // Calcula o índice mais próximo
  const idxX = Math.round((cx + CANVAS_SIZE / 2) / step);
  const idxY = Math.round((cy + CANVAS_SIZE / 2) / step);
  // Calcula a coordenada do ponto do grid
  const gridX = -CANVAS_SIZE / 2 + idxX * step;
  const gridY = -CANVAS_SIZE / 2 + idxY * step;
  return {
    canvas: toCanvas(gridX, gridY),
    logical: { x: Math.round(gridX), y: Math.round(gridY) }
  };
};

/**
 * Gera linhas do grid principal baseado nas configurações
 * @param {Object} settings - Configurações do grid
 * @returns {Array} Array de objetos com propriedades das linhas
 */
export const generateMainGridLines = (settings) => {
  // Esta função agora não gera nada, pois o grid principal é gerado por generateDivisionLines
  return [];
};

/**
 * Gera linhas do grid selecionado baseado nas configurações
 * @param {Object} settings - Configurações do grid
 * @returns {Array} Array de objetos com propriedades das linhas
 */
export const generateDivisionLines = (settings) => {
  if (!settings.showGrid || !settings.gridDivisions) return [];

  const divisionLines = [];
  const gridIntensity = settings.gridIntensity || 0.3; // De 0.1 a 1.0
  const gridDash = settings.dashedGrid ? [20, 10] : [];
  const divs = settings.gridDivisions;

  // Gera APENAS as linhas do grid selecionado (2x2, 4x4, 8x8, 16x16, etc.)
  for (let i = 1; i < divs; i++) {
    const x = -CANVAS_SIZE / 2 + (CANVAS_SIZE / divs) * i;
    divisionLines.push({
      key: `grid-v-${divs}-${i}`,
      type: 'vertical',
      points: [...toCanvas(x, -CANVAS_SIZE / 2), ...toCanvas(x, CANVAS_SIZE / 2)],
      opacity: gridIntensity, // Opacidade controlada diretamente pelo slider
      dash: gridDash
    });

    const y = -CANVAS_SIZE / 2 + (CANVAS_SIZE / divs) * i;
    divisionLines.push({
      key: `grid-h-${divs}-${i}`,
      type: 'horizontal',
      points: [...toCanvas(-CANVAS_SIZE / 2, y), ...toCanvas(CANVAS_SIZE / 2, y)],
      opacity: gridIntensity, // Opacidade controlada diretamente pelo slider
      dash: gridDash
    });
  }

  return divisionLines;
};

/**
 * Gera linhas de borda do grid
 * @returns {Array} Array de objetos com propriedades das bordas
 */
export const generateBorderLines = () => [
  {
    key: 'border-top',
    type: 'border',
    points: [...toCanvas(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2), ...toCanvas(CANVAS_SIZE / 2, -CANVAS_SIZE / 2)],
    opacity: 0.5
  },
  {
    key: 'border-bottom', 
    type: 'border',
    points: [...toCanvas(-CANVAS_SIZE / 2, CANVAS_SIZE / 2), ...toCanvas(CANVAS_SIZE / 2, CANVAS_SIZE / 2)],
    opacity: 0.5
  },
  {
    key: 'border-left',
    type: 'border', 
    points: [...toCanvas(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2), ...toCanvas(-CANVAS_SIZE / 2, CANVAS_SIZE / 2)],
    opacity: 0.5
  },
  {
    key: 'border-right',
    type: 'border',
    points: [...toCanvas(CANVAS_SIZE / 2, -CANVAS_SIZE / 2), ...toCanvas(CANVAS_SIZE / 2, CANVAS_SIZE / 2)],
    opacity: 0.5
  }
];
