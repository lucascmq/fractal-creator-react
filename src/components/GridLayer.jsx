import React from 'react';
import { Layer, Line } from 'react-konva';
import { COLORS } from '../utils/colors';
import { generateDivisionLines, generateBorderLines } from '../utils/gridUtils';

/**
 * GridLayer - Renderiza o grid principal, divisões e bordas do canvas.
 * Props:
 *   - zoom: fator de zoom
 *   - viewportCenter: centro lógico da viewport
 *   - settings: configurações do grid
 *   - toCanvasZ: função para converter coordenadas lógicas para canvas considerando zoom/pan
 */
export default function GridLayer({ zoom, viewportCenter, settings, toCanvasZ }) {
  // Renderização das linhas principais do grid
  const logicalSize = 500 / zoom;
  const minX = viewportCenter.x - logicalSize / 2;
  const maxX = viewportCenter.x + logicalSize / 2;
  const minY = viewportCenter.y - logicalSize / 2;
  const maxY = viewportCenter.y + logicalSize / 2;
  const gridDivs = settings.gridDivisions || 4;
  const step = logicalSize / gridDivs;
  const mainGridLines = [];
  for (let i = 0; i <= gridDivs; i++) {
    // Verticais
    const x = minX + i * step;
    mainGridLines.push(
      <Line
        key={`v-${i}`}
        points={[
          ...toCanvasZ(x, minY),
          ...toCanvasZ(x, maxY)
        ]}
        stroke={COLORS.primary}
        strokeWidth={1}
        opacity={0.3}
      />
    );
    // Horizontais
    const y = minY + i * step;
    mainGridLines.push(
      <Line
        key={`h-${i}`}
        points={[
          ...toCanvasZ(minX, y),
          ...toCanvasZ(maxX, y)
        ]}
        stroke={COLORS.primary}
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  // Bordas do grid
  const borderLinesData = generateBorderLines();
  const borderLines = borderLinesData.map(lineData => (
    <Line
      key={lineData.key}
      points={lineData.points}
      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={lineData.opacity}
    />
  ));

  // Linhas de divisão internas
  const divisionLinesData = generateDivisionLines(settings);
  const divisionLines = divisionLinesData.map(lineData => (
    <Line
      key={lineData.key}
      points={lineData.points}
      stroke={COLORS.primary}
      strokeWidth={1}
      opacity={lineData.opacity}
      dash={lineData.dash}
    />
  ));

  return (
    <Layer>
      {/* Linhas do grid principal (ajustadas para o zoom) - condicional ao settings.showGrid */}
      {settings.showGrid && mainGridLines}
      {/* Linhas de borda do grid - sempre visíveis */}
      {borderLines}
      {/* Linhas de divisão internas (se houver) */}
      {divisionLines}
    </Layer>
  );
}
