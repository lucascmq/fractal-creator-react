import React from 'react';
import { Circle, Rect, RegularPolygon, Line, Group } from 'react-konva';
import { COLORS } from '../utils/colors';

// Losango
export function Diamond({ x, y, scale = 1, zoom = 1, color = COLORS.primary, fillOpacity = 0.5, maskOpacity = 0, rotation = 0, isSelected = false, isMultiSelected = false, onClick }) {
  const h = 124 * scale * zoom;
  const w = 62 * scale * zoom;
  return (
    <Group x={x} y={y} rotation={rotation}>
      {maskOpacity > 0 && (
        <Line
          points={[0, -h/2, w/2, 0, 0, h/2, -w/2, 0]}
          closed
          fill="#000"
          stroke="#000"
          strokeWidth={0}
          opacity={maskOpacity}
          onClick={onClick}
          listening={true}
        />
      )}
      <Line
        points={[0, -h/2, w/2, 0, 0, h/2, -w/2, 0]}
        closed
        stroke={isSelected ? '#FFD700' : isMultiSelected ? '#4CC674' : color}
        strokeWidth={isSelected ? 4 : isMultiSelected ? 3 : 2}
        fill={undefined}
        opacity={1}
        onClick={onClick}
      />
      {fillOpacity > 0 && (
        <Line
          points={[0, -h/2, w/2, 0, 0, h/2, -w/2, 0]}
          closed
          fill={color}
          stroke={color}
          strokeWidth={0}
          opacity={fillOpacity}
          onClick={onClick}
        />
      )}
    </Group>
  );
}

// Círculo
export function FigureCircle({ x, y, size = 36, color = COLORS.primary, fillOpacity = 0.5, maskOpacity = 0, rotation = 0, isSelected = false, isMultiSelected = false, onClick }) {
  return (
    <>
      <Circle
        x={x}
        y={y}
        radius={size}
        stroke={isSelected ? '#FFD700' : isMultiSelected ? '#4CC674' : color}
        strokeWidth={isSelected ? 4 : isMultiSelected ? 3 : 2}
        fill={undefined}
        opacity={1}
        rotation={rotation}
        onClick={onClick}
      />
      <Circle
        x={x}
        y={y}
        radius={size}
        fill={color}
        stroke={color}
        strokeWidth={0}
        opacity={fillOpacity}
        rotation={rotation}
        onClick={onClick}
      />
      {maskOpacity > 0 && (
        <Circle
          x={x}
          y={y}
          radius={size}
          fill="#000"
          opacity={maskOpacity}
          rotation={rotation}
          onClick={onClick}
          listening={true}
        />
      )}
    </>
  );
}

// Quadrado
export function FigureSquare({ x, y, size = 64, color = COLORS.primary, fillOpacity = 0.5, maskOpacity = 0, rotation = 0, isSelected = false, isMultiSelected = false, onClick }) {
  return (
    <>
      <Rect
        x={x}
        y={y}
        width={size}
        height={size}
        offsetX={size/2}
        offsetY={size/2}
        stroke={isSelected ? '#FFD700' : isMultiSelected ? '#4CC674' : color}
        strokeWidth={isSelected ? 4 : isMultiSelected ? 3 : 2}
        fill={undefined}
        opacity={1}
        rotation={rotation}
        onClick={onClick}
      />
      <Rect
        x={x}
        y={y}
        width={size}
        height={size}
        offsetX={size/2}
        offsetY={size/2}
        fill={color}
        stroke={color}
        strokeWidth={0}
        opacity={fillOpacity}
        rotation={rotation}
        onClick={onClick}
      />
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
          onClick={onClick}
          listening={true}
        />
      )}
    </>
  );
}

// Polígono genérico (triângulo, pentágono, hexágono...)
export function FigurePolygon({ x, y, size = 36, sides = 3, color = COLORS.primary, fillOpacity = 0.5, maskOpacity = 0, rotation = 0, isSelected = false, isMultiSelected = false, onClick }) {
  return (
    <>
      <RegularPolygon
        x={x}
        y={y}
        sides={sides}
        radius={size}
        stroke={isSelected ? '#FFD700' : isMultiSelected ? '#4CC674' : color}
        strokeWidth={isSelected ? 4 : isMultiSelected ? 3 : 2}
        fill={undefined}
        opacity={1}
        rotation={rotation}
        onClick={onClick}
      />
      <RegularPolygon
        x={x}
        y={y}
        sides={sides}
        radius={size}
        fill={color}
        stroke={color}
        strokeWidth={0}
        opacity={fillOpacity}
        rotation={rotation}
        onClick={onClick}
      />
      {maskOpacity > 0 && (
        <RegularPolygon
          x={x}
          y={y}
          sides={sides}
          radius={size}
          fill="#000"
          opacity={maskOpacity}
          rotation={rotation}
          onClick={onClick}
          listening={true}
        />
      )}
    </>
  );
}
