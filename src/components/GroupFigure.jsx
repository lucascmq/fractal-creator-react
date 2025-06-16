import React from 'react';
import { Group, Line, Circle, Rect, RegularPolygon } from 'react-konva';
import { COLORS } from '../utils/colors';
import { toCanvasZoom } from '../utils/zoomUtils';
import ShapeWithOutline from './ShapeWithOutline';

export default function GroupFigure({ 
  group, 
  zoom, 
  viewportCenter, 
  selectedElements, 
  onUpdateGroup,
  onElementClick // Prop para lidar com cliques em elementos dentro do grupo
}) {
  // Helper para usar sempre o zoom/viewport atuais
  const toCanvasZ = (x, y) => toCanvasZoom(x, y, zoom, viewportCenter);

  const defaultFillOpacity = 0.5;

  return (
    <Group
      x={toCanvasZ(group.x || 0, group.y || 0)[0]}
      y={toCanvasZ(group.x || 0, group.y || 0)[1]}
      rotation={group.rotation || 0}
      scaleX={group.scale || 1}
      scaleY={group.scale || 1}
      draggable
      onDragEnd={e => {
        let { x: newCanvasX, y: newCanvasY } = e.target.position();
        // Converte a nova posição do canvas para o espaço lógico
        const [newLogicalX, newLogicalY] = toCanvasZoom(newCanvasX, newCanvasY, 1 / zoom, { x: 0, y: 0 }); // Inverte o zoom para obter a posição lógica
        
        // Ajusta a posição lógica do grupo
        if (onUpdateGroup) {
          onUpdateGroup(group.id, { x: newLogicalX, y: newLogicalY });
        }
      }}
      onClick={e => {
        // Impede que o clique no grupo propague para o Stage
        e.cancelBubble = true;
        if (onElementClick) {
          onElementClick(group.id, 'group', e);
        }
      }}
    >
      {group.elementsData && group.elementsData.map(element => {
        if (element.type === 'shape') {
          const typeLower = String(element.type).toLowerCase();
          const color = element.color || COLORS.primary;
          const isSelected = selectedElements.includes(element.id);
          const shapeOpacity = typeof element.fillOpacity === 'number' ? element.fillOpacity : defaultFillOpacity;
          const shapeMaskOpacity = typeof element.maskOpacity === 'number' ? element.maskOpacity : 0;
          const scale = element.scale || 1;
          const rotation = element.rotation || 0;

          // As coordenadas x e y da forma já são relativas ao centro do grupo
          const x = element.x;
          const y = element.y;

          if (["losango", "diamond"].includes(typeLower)) {
            const h = 124 * scale * zoom;
            const w = 62 * scale * zoom;
            return (
              <Group key={element.id} x={x} y={y} rotation={rotation}>
                {shapeMaskOpacity > 0 && (
                  <Line
                    points={[0, -h/2, w/2, 0, 0, h/2, -w/2, 0]}
                    closed
                    fill="#000"
                    stroke="#000"
                    strokeWidth={0}
                    opacity={shapeMaskOpacity}
                    onClick={e => {
                      e.cancelBubble = true;
                      if (onElementClick) onElementClick(element.id, 'shape', e);
                    }}
                  />
                )}
                <Line
                  points={[0, -h/2, w/2, 0, 0, h/2, -w/2, 0]}
                  closed
                  stroke={isSelected ? '#FFD700' : color}
                  strokeWidth={isSelected ? 4 : 2}
                  fill={undefined}
                  opacity={1}
                  onClick={e => {
                    e.cancelBubble = true;
                    if (onElementClick) onElementClick(element.id, 'shape', e);
                  }}
                />
                {shapeOpacity > 0 && (
                  <Line
                    points={[0, -h/2, w/2, 0, 0, h/2, -w/2, 0]}
                    closed
                    fill={color}
                    stroke={color}
                    strokeWidth={0}
                    opacity={shapeOpacity}
                    onClick={e => {
                      e.cancelBubble = true;
                      if (onElementClick) onElementClick(element.id, 'shape', e);
                    }}
                  />
                )}
              </Group>
            );
          }

          let mappedType = element.type;
          let mappedSides = undefined;
          if (["triangle", "triangulo"].includes(typeLower)) {
            mappedType = "polygon";
            mappedSides = 3;
          } else if (["pentagono", "pentagon"].includes(typeLower)) {
            mappedType = "polygon";
            mappedSides = 5;
          } else if (["hexagono", "hexagon"].includes(typeLower)) {
            mappedType = "polygon";
            mappedSides = 6;
          } else if (["square"].includes(typeLower)) {
            mappedType = "square";
            mappedSides = undefined;
          } else if (["circle"].includes(typeLower)) {
            mappedType = "circle";
            mappedSides = undefined;
          }

          return (
            <ShapeWithOutline
              key={element.id}
              type={mappedType}
              x={x}
              y={y}
              size={mappedType === 'square' ? 64 * scale * zoom : 36 * scale * zoom}
              fillOpacity={shapeOpacity}
              maskOpacity={shapeMaskOpacity}
              color={color}
              strokeColor={isSelected ? '#FFD700' : color}
              strokeWidth={isSelected ? 4 : 2}
              sides={mappedSides}
              rotation={rotation}
              draggable={false} // Shapes dentro do grupo não são arrastáveis individualmente
              onDragEnd={null}
              onClick={e => {
                e.cancelBubble = true;
                if (onElementClick) onElementClick(element.id, 'shape', e);
              }}
            />
          );
        } else if (element.type === 'line') {
          const selected = selectedElements.includes(element.id);
          let dash = [];
          if (element.isDashed) {
            const dashLength = typeof element.dashLength === 'number' ? element.dashLength : 12;
            const dashSpacing = typeof element.dashSpacing === 'number' ? element.dashSpacing : 8;
            dash = [dashLength, dashSpacing];
          }

          // As coordenadas x1, y1, x2, y2 da linha já são relativas ao centro do grupo
          return (
            <Line
              key={element.id}
              points={[
                element.x1, element.y1,
                element.x2, element.y2
              ]}
              stroke={selected ? '#FFD700' : COLORS.secondary}
              strokeWidth={selected ? 4 : (element.strokeWidth || 2)}
              opacity={typeof element.opacity === 'number' ? element.opacity : 0.8}
              dash={dash}
              onClick={e => {
                e.cancelBubble = true;
                if (onElementClick) onElementClick(element.id, 'line', e);
              }}
              hitStrokeWidth={24}
            />
          );
        }
        return null;
      })}
    </Group>
  );
}