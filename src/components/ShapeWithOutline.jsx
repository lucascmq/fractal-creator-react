import React from 'react';
import { Circle, Rect, RegularPolygon } from 'react-konva';

// Componente genérico para qualquer shape com duas camadas: contorno e preenchimento
export default function ShapeWithOutline({
  type = 'circle',
  x = 0,
  y = 0,
  size = 32,
  fillOpacity = 0.5,
  color = '#4CC674',
  strokeColor = '#4CC674',
  rotation = 0,
  sides = 3, // para poligonos
  maskOpacity = 0, // NOVO: opacidade da máscara preta
  ...rest
}) {
  // Camada de contorno (aparece quando fillOpacity < 1)
  const outlineProps = {
    x,
    y,
    stroke: strokeColor,
    strokeWidth: 2,
    fill: undefined,
    opacity: 1,
    rotation,
    ...rest
  };
  // Camada de preenchimento (aparece quando fillOpacity > 0)
  const fillProps = {
    x,
    y,
    fill: color,
    stroke: color,
    strokeWidth: 0,
    opacity: fillOpacity,
    rotation,
    ...rest
  };
  if (type === 'circle') {
    return <>
      <Circle {...outlineProps} radius={size} />
      <Circle {...fillProps} radius={size} />
      {maskOpacity > 0 && (
        <Circle
          x={x}
          y={y}
          radius={size}
          fill="#000"
          opacity={maskOpacity}
          rotation={rotation}
          onClick={rest.onClick} // Propaga o evento de clique
          listening={true}
        />
      )}
    </>;
  }
  if (type === 'square') {
    return <>
      <Rect {...outlineProps} width={size} height={size} offsetX={size/2} offsetY={size/2} />
      <Rect {...fillProps} width={size} height={size} offsetX={size/2} offsetY={size/2} />
      {maskOpacity > 0 && (
        <Rect
          x={x}
          y={y}
          width={size}
          height={size}
          offsetX={size/2}
          offsetY={size/2}
          fill="#000"
          opacity={maskOpacity}
          rotation={rotation}
          onClick={rest.onClick} // Propaga o evento de clique
          listening={true}
        />
      )}
    </>;
  }
  if (type === 'polygon') {
    return <>
      <RegularPolygon {...outlineProps} sides={sides} radius={size} />
      <RegularPolygon {...fillProps} sides={sides} radius={size} />
      {maskOpacity > 0 && (
        <RegularPolygon
          x={x}
          y={y}
          sides={sides}
          radius={size}
          fill="#000"
          opacity={maskOpacity}
          rotation={rotation}
          onClick={rest.onClick} // Propaga o evento de clique
          listening={true}
        />
      )}
    </>;
  }
  return null;
}
