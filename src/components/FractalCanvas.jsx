// Componente base do Canvas responsivo usando React-Konva
// Explicação: Este componente cria um Stage (área de desenho) que se ajusta ao tamanho do container e já está pronto para receber shapes, grid e interatividade.

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text } from 'react-konva';
import { COLORS } from '../utils/colors';
import { Line, Group } from 'react-konva';
import { Circle, Rect, RegularPolygon } from 'react-konva';
import ShapeWithOutline from './ShapeWithOutline';
import ShapePopover from './ShapePopover';

const CANVAS_SIZE = 500;

export default function FractalCanvas({ 
  lines = [], 
  shapes = [],
  settings = {},
  onUpdateShape // Recebe função do App para atualizar shape
}) {
  // Canvas quadrado fixo
  const width = CANVAS_SIZE;
  const height = CANVAS_SIZE;
  const containerRef = useRef(null);  // Determina se deve mostrar o texto central com base nas configurações
  const showCenterText = settings.showCenterText !== false;
  // Pega o texto central diretamente das configurações
  const centerText = settings.centerText || '';

  // Conversão de coordenadas centradas para canvas (centro em width/2, height/2)
  const toCanvas = (x, y) => [x + width / 2, y + height / 2];

  // Destaca as linhas principais do grid conforme a divisão escolhida
  const maxDivisions = 16;
  const divisaoEscolhida = Math.max(2, Math.min(maxDivisions, settings.gridDivisions || 4));
  const gridLines = [];
  for (let i = 1; i < maxDivisions; i++) {
    const isActive = (i % (maxDivisions / divisaoEscolhida) === 0);
    const opacity = isActive ? 1 : 0.2;
    const dash = isActive ? [] : [6, 6];
    // Linhas verticais internas
    const x = -CANVAS_SIZE / 2 + (CANVAS_SIZE / maxDivisions) * i;
    gridLines.push(
      <Line
        key={`v-${i}`}
        points={[
          ...toCanvas(x, -CANVAS_SIZE / 2),
          ...toCanvas(x, CANVAS_SIZE / 2)
        ]}
        stroke={COLORS.primary}
        strokeWidth={1}
        opacity={opacity}
        dash={dash}
      />
    );
    // Linhas horizontais internas
    const y = -CANVAS_SIZE / 2 + (CANVAS_SIZE / maxDivisions) * i;
    gridLines.push(
      <Line
        key={`h-${i}`}
        points={[
          ...toCanvas(-CANVAS_SIZE / 2, y),
          ...toCanvas(CANVAS_SIZE / 2, y)
        ]}
        stroke={COLORS.primary}
        strokeWidth={1}
        opacity={opacity}
        dash={dash}
      />
    );
  }
  // Bordas do grid
  gridLines.push(
    <Line
      key="border-top"
      points={[...toCanvas(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2), ...toCanvas(CANVAS_SIZE / 2, -CANVAS_SIZE / 2)]}
      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={0.5}
    />
  );
  gridLines.push(
    <Line
      key="border-bottom"
      points={[...toCanvas(-CANVAS_SIZE / 2, CANVAS_SIZE / 2), ...toCanvas(CANVAS_SIZE / 2, CANVAS_SIZE / 2)]}
      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={0.5}
    />
  );
  gridLines.push(
    <Line
      key="border-left"
      points={[...toCanvas(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2), ...toCanvas(-CANVAS_SIZE / 2, CANVAS_SIZE / 2)]}
      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={0.5}
    />
  );
  gridLines.push(
    <Line
      key="border-right"
      points={[...toCanvas(CANVAS_SIZE / 2, -CANVAS_SIZE / 2), ...toCanvas(CANVAS_SIZE / 2, CANVAS_SIZE / 2)]}
      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={0.5}
    />
  );  // Linhas centrais (sempre visíveis)
  const centerLines = [
    // Linha vertical central
    <Line
      key="center-v"
      points={[...toCanvas(0, -CANVAS_SIZE / 2), ...toCanvas(0, CANVAS_SIZE / 2)]}
      stroke={COLORS.primary}
      strokeWidth={2}
      opacity={0.5}
      dash={[8, 8]}
    />,
    // Linha horizontal central
    <Line
      key="center-h"
      points={[...toCanvas(-CANVAS_SIZE / 2, 0), ...toCanvas(CANVAS_SIZE / 2, 0)]}
      stroke={COLORS.primary}
      strokeWidth={2}
      opacity={0.5}
      dash={[8, 8]}
    />
  ];

  // Grid completo (4x4), só aparece se showGrid estiver ativo
  const fullGridLines = [];
  if (settings.showGrid) {
    for (let i = 1; i < 4; i++) {
      // Linhas verticais internas
      const x = -CANVAS_SIZE / 2 + (CANVAS_SIZE / 4) * i;
      fullGridLines.push(
        <Line
          key={`v-${i}`}
          points={[
            ...toCanvas(x, -CANVAS_SIZE / 2),
            ...toCanvas(x, CANVAS_SIZE / 2)
          ]}
          stroke={COLORS.primary}
          strokeWidth={1}
          opacity={0.5}
          dash={[8, 8]}
        />
      );
      // Linhas horizontais internas
      const y = -CANVAS_SIZE / 2 + (CANVAS_SIZE / 4) * i;
      fullGridLines.push(
        <Line
          key={`h-${i}`}
          points={[
            ...toCanvas(-CANVAS_SIZE / 2, y),
            ...toCanvas(CANVAS_SIZE / 2, y)
          ]}
          stroke={COLORS.primary}
          strokeWidth={1}
          opacity={0.5}
          dash={[8, 8]}
        />
      );
    }
  }

  // Bordas do grid (sempre visíveis)
  const borderLines = [
    <Line
      key="border-top"
      points={[...toCanvas(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2), ...toCanvas(CANVAS_SIZE / 2, -CANVAS_SIZE / 2)]}
      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={0.5}
    />,
    <Line
      key="border-bottom"
      points={[...toCanvas(-CANVAS_SIZE / 2, CANVAS_SIZE / 2), ...toCanvas(CANVAS_SIZE / 2, CANVAS_SIZE / 2)]}
      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={0.5}
    />,
    <Line
      key="border-left"
      points={[...toCanvas(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2), ...toCanvas(-CANVAS_SIZE / 2, CANVAS_SIZE / 2)]}
      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={0.5}
    />,
    <Line
      key="border-right"
      points={[...toCanvas(CANVAS_SIZE / 2, -CANVAS_SIZE / 2), ...toCanvas(CANVAS_SIZE / 2, CANVAS_SIZE / 2)]}
      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={0.5}
    />
  ];  // Hook para fornecer uma classe CSS especial para o container pai do Stage
  useEffect(() => {
    if (containerRef.current) {
      // O elemento konvajs-content é criado automaticamente pelo React-Konva
      // Esta configuração garante que ele se posicione corretamente dentro do container
      const konvaContent = containerRef.current.querySelector('.konvajs-content');
      if (konvaContent) {
        konvaContent.style.position = 'static';
      }
    }
  }, []);

  // Renderização condicional do grid conforme configuração
  let divisionLines = [];
  // Multiplicador de opacidade do grid
  const gridIntensity = settings.gridIntensity || 0.3;
  // Dash do grid conforme configuração
  const gridDash = settings.dashedGrid ? [12, 10] : [];
  if (settings.showGrid && settings.gridDivisions) {
    // Renderiza apenas a divisão escolhida (ex: 4x4, 8x8, 16x16)
    const divs = settings.gridDivisions;
    for (let i = 1; i < divs; i++) {
      const x = -CANVAS_SIZE / 2 + (CANVAS_SIZE / divs) * i;
      divisionLines.push(
        <Line
          key={`div-v-${divs}-${i}`}
          points={[
            ...toCanvas(x, -CANVAS_SIZE / 2),
            ...toCanvas(x, CANVAS_SIZE / 2)
          ]}
          stroke={COLORS.primary}
          strokeWidth={1}
          opacity={1 * gridIntensity}
          dash={gridDash}
        />
      );
      const y = -CANVAS_SIZE / 2 + (CANVAS_SIZE / divs) * i;
      divisionLines.push(
        <Line
          key={`div-h-${divs}-${i}`}
          points={[
            ...toCanvas(-CANVAS_SIZE / 2, y),
            ...toCanvas(CANVAS_SIZE / 2, y)
          ]}
          stroke={COLORS.primary}
          strokeWidth={1}
          opacity={1 * gridIntensity}
          dash={gridDash}
        />
      );
    }
  }

  // Define se as formas são preenchidas ou apenas contorno
  const isOutline = settings.shapeStyle === 'outline';
  // Array de opacidades fixas para o slider
  const shapeFillOpacities = [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,1];
  const idx = Number(settings.shapeFillOpacityIndex);
  const fillOpacity = shapeFillOpacities[isNaN(idx) ? 5 : idx];
  console.log('shapeFillOpacityIndex:', settings.shapeFillOpacityIndex, '| idx:', idx, '| fillOpacity:', fillOpacity);
  // Estado para marcador de snap visual
  const [snapMarker, setSnapMarker] = useState(null);
  // Estado para seleção de forma
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  // Estado para o popover
  const [popover, setPopover] = useState(null);

  // Função utilitária: encontra o ponto do grid mais próximo
  function getNearestGridPoint(x, y, divisions = 4) {
    const step = CANVAS_SIZE / divisions;
    // Converte para coordenadas centradas
    const cx = x - width / 2;
    const cy = y - height / 2;
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
  }

  // Handler de movimento do mouse
  function handleMouseMove(e) {
    if (!settings.snapToGrid || !settings.showGrid) {
      setSnapMarker(null);
      return;
    }
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const divisions = settings.gridDivisions || 4;
    const nearest = getNearestGridPoint(pointer.x, pointer.y, divisions);
    // Só mostra marcador se mouse estiver "perto" do ponto do grid (ex: 12px)
    const dist = Math.hypot(pointer.x - nearest.canvas[0], pointer.y - nearest.canvas[1]);
    if (dist < 12) {
      setSnapMarker({ x: nearest.canvas[0], y: nearest.canvas[1], logical: nearest.logical });
    } else {
      setSnapMarker(null);
    }
  }

  // Handler de clique na shape
  function handleShapeClick(id, evt) {
    setSelectedShapeId(id);
    
    // Pega posição do mouse para o popover
    if (evt && evt.evt) {
      const rect = containerRef.current.getBoundingClientRect();
      setPopover({
        x: evt.evt.clientX - rect.left + 10,
        y: evt.evt.clientY - rect.top - 10
      });
    }
  }

  // Handler de scroll: ajusta opacidade só da forma selecionada
  function handleWheelDiv(e) {
    if (!selectedShapeId) return;
    // Removido e.preventDefault() para evitar erro com passive event listener
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const shape = shapes.find(s => s.id === selectedShapeId);
    if (!shape) return;
    let newOpacity = (typeof shape.fillOpacity === 'number' ? shape.fillOpacity : 0.5) + delta;
    newOpacity = Math.max(0, Math.min(1, Math.round(newOpacity * 10) / 10));
    if (onUpdateShape) onUpdateShape(selectedShapeId, { fillOpacity: newOpacity });
  }

  // Handler para ajustar opacidade da máscara
  function handleMaskOpacityChange(val) {
    setMaskOpacity(val);
  }
  // Handler para desmarcar seleção ao clicar fora
  function handleStageClick(e) {
    // Só desmarca se clicou no Stage, não em uma forma
    if (e.target === e.target.getStage()) {
      setSelectedShapeId(null);
      setPopover(null);
    }
  }

  // Fecha o popover
  function handleClosePopover() {
    setPopover(null);
    setSelectedShapeId(null);
  }

  // Altera a opacidade da forma
  function handleChangeOpacity(val) {
    if (selectedShapeId && onUpdateShape) {
      onUpdateShape(selectedShapeId, { fillOpacity: val });
    }
  }

  // Altera a opacidade da máscara preta
  function handleChangeMaskOpacity(val) {
    if (selectedShapeId && onUpdateShape) {
      onUpdateShape(selectedShapeId, { maskOpacity: val });
    }
  }

  // Move a forma para cima/baixo na pilha de camadas
  function handleMoveLayer(direction) {
    if (!selectedShapeId) return;
    const ordered = [...shapes].sort((a, b) => a.layer - b.layer);
    const idx = ordered.findIndex(s => s.id === selectedShapeId);
    if (idx === -1) return;
    let targetIdx = direction === 'up' ? idx + 1 : idx - 1;
    if (targetIdx < 0 || targetIdx >= ordered.length) return;
    const temp = ordered[idx].layer;
    ordered[idx].layer = ordered[targetIdx].layer;
    ordered[targetIdx].layer = temp;
    if (onUpdateShape) {
      onUpdateShape(ordered[idx].id, { ...ordered[idx] });
      onUpdateShape(ordered[targetIdx].id, { ...ordered[targetIdx] });
    }
  }

  return (
    <div 
      className="fractal-canvas-container"
      style={{ 
        width: CANVAS_SIZE, 
        height: CANVAS_SIZE, 
        margin: '0 auto',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #4CC674',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(76, 198, 116, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      ref={containerRef}
      onWheel={handleWheelDiv}
    >
      <Stage 
        width={width} 
        height={height} 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setSnapMarker(null)}
        onClick={handleStageClick}
        style={{ 
          background: '#000', 
          borderRadius: '7px'
        }}>
        <Layer>
          {/* Renderiza grid, bordas e linhas centrais apenas se showGrid estiver ativo */}
          {settings.showGrid && divisionLines}
          {settings.showGrid && borderLines}
          {settings.showGrid && settings.gridDivisions === 2 && centerLines}
          {/* NÃO renderiza guideLines nem borderLines quando o grid está desligado */}
          {/* Renderiza bordas do grid (sempre visíveis) */}
          {borderLines}
          {/* Texto central customizável, só aparece se não estiver vazio e se showCenterText for true */}
          {showCenterText && centerText.trim() && (
            <Text
              text={centerText}
              x={width / 2}
              y={height / 2}
              offsetX={width / 4} // metade da largura do texto (aprox.)
              offsetY={14} // metade da fontSize (aprox.)
              width={width / 2}
              align="center"
              fontSize={28}
              fill={COLORS.secondary}
              fontStyle="bold"
              fontFamily="Orbitron, Rajdhani, monospace"
              shadowColor={COLORS.primary}
              shadowBlur={10}
              shadowOffset={{ x: 0, y: 0 }}
              shadowOpacity={0.7}
              listening={false}
            />
          )}
          {/* Renderiza linhas no sistema centrado */}
          {Array.isArray(lines) && lines.filter(line => line && line.x1 !== undefined && line.y1 !== undefined && line.x2 !== undefined && line.y2 !== undefined).map(line => (
            <Line
              key={line.id}
              points={[
                ...toCanvas(line.x1, line.y1),
                ...toCanvas(line.x2, line.y2)
              ]}
              stroke={COLORS.secondary}
              strokeWidth={2}
              opacity={0.8}
            />
          ))}

          {/* Renderiza formas no sistema centrado */}
          {Array.isArray(shapes) && shapes.filter(shape => shape && shape.x !== undefined && shape.y !== undefined && shape.type)
  .slice().sort((a, b) => a.layer - b.layer).map(shape => {
    const [x, y] = toCanvas(shape.x, shape.y);
    const color = COLORS.primary;
    const isSelected = shape.id === selectedShapeId;
    const shapeOpacity = typeof shape.fillOpacity === 'number' ? shape.fillOpacity : fillOpacity;
    const shapeMaskOpacity = typeof shape.maskOpacity === 'number' ? shape.maskOpacity : 0;
      // Renderização especial para losango
    if (["losango", "diamond"].includes(shape.type.toLowerCase())) {
      const s = 36 * (shape.scale || 1);
      const w = s * 0.6;
      const h = s * 1.1;
      const rotation = shape.rotation || 0;
      
      // Criamos um grupo para aplicar a rotação a todas as linhas do losango
      return (
        <React.Fragment key={shape.id}>
          <Group
            x={x}
            y={y}
            rotation={rotation}
          >
            {shapeMaskOpacity > 0 && (
              <Line
                points={[
                  0, -h/2,
                  w/2, 0,
                  0, h/2,
                  -w/2, 0
                ]}
                closed
                fill="#000"
                stroke="#000"
                strokeWidth={0}
                opacity={shapeMaskOpacity}
                onClick={(evt) => handleShapeClick(shape.id, evt)}
                listening={true}
              />
            )}
            <Line
              points={[
                0, -h/2,
                w/2, 0,
                0, h/2,
                -w/2, 0
              ]}
              closed
              stroke={isSelected ? '#FFD700' : color}
              strokeWidth={isSelected ? 4 : 2}
              fill={undefined}
              opacity={1 - shapeOpacity}
              onClick={(evt) => handleShapeClick(shape.id, evt)}
            />
            <Line
              points={[
                0, -h/2,
                w/2, 0,
                0, h/2,
                -w/2, 0
              ]}
              closed
              fill={color}
              stroke={color}
              strokeWidth={0}
              opacity={shapeOpacity}
              onClick={(evt) => handleShapeClick(shape.id, evt)}
            />
          </Group>
        </React.Fragment>
      );
    }    // Mapeamento de tipo e lados para polígonos
    let shapeType = shape.type;
    let sides = undefined;
    if (["triangle", "triângulo"].includes(shapeType.toLowerCase())) {
      shapeType = "polygon";
      sides = 3;
    } else if (["pentágono", "pentagono", "pentagon"].includes(shapeType.toLowerCase())) {
      shapeType = "polygon";
      sides = 5;
    } else if (["hexágono", "hexagono", "hexagon"].includes(shapeType.toLowerCase())) {
      shapeType = "polygon";
      sides = 6;
    } else if (["heptágono", "heptagono", "heptagon"].includes(shapeType.toLowerCase())) {
      shapeType = "polygon";
      sides = 7;
    }
    
    // Renderização padrão para qualquer polígono
    return (
      <ShapeWithOutline
        key={shape.id}
        type={shapeType}
        x={x}
        y={y}
        size={shapeType === 'square' ? 64 * (shape.scale || 1) : 36 * (shape.scale || 1)}
        fillOpacity={shapeOpacity}
        maskOpacity={shapeMaskOpacity}
        color={color}
        strokeColor={isSelected ? '#FFD700' : color}
        strokeWidth={isSelected ? 4 : 2}
        sides={sides}
        rotation={shape.rotation || 0}
        onClick={(evt) => handleShapeClick(shape.id, evt)}
      />
    );
  })}
          {/* Marcador visual de snap */}
          {snapMarker && (
            <>
              {/* Círculo de destaque */}
              <Circle
                x={snapMarker.x}
                y={snapMarker.y}
                radius={7}
                stroke="#4CC674"
                strokeWidth={2}
                fill="#4cc67433"
              />
              {/* Fundo arredondado para a coordenada */}
              <Rect
                x={snapMarker.x + 6}
                y={snapMarker.y - 28}
                width={120}
                height={28}
                fill="#181A20EE"
                cornerRadius={12}
                shadowColor="#000"
                shadowBlur={8}
              />
              {/* Coordenada exata destacada */}
              <Text
                x={snapMarker.x + 16}
                y={snapMarker.y - 22}
                text={`x=${snapMarker.logical.x}, y=${snapMarker.logical.y}`}
                fontSize={16}
                fill="#4CC674"
                fontFamily="Rajdhani, Orbitron, monospace"
                fontStyle="bold"
                shadowColor="#000"
                shadowBlur={4}
              />
            </>
          )}
        </Layer>
      </Stage>
      {/* Popover HTML absoluto, fora do Stage/Konva */}
      {popover && selectedShapeId && (() => {
        const shape = shapes.find(s => s.id === selectedShapeId);
        if (!shape) return null;
        const ordered = [...shapes].sort((a, b) => a.layer - b.layer);
        const idx = ordered.findIndex(s => s.id === selectedShapeId);
        return (
          <ShapePopover
            x={popover.x}
            y={popover.y}
            value={typeof shape.fillOpacity === 'number' ? shape.fillOpacity : fillOpacity}
            onChange={handleChangeOpacity}
            onClose={handleClosePopover}
            layer={shape.layer}
            onMoveLayer={handleMoveLayer}
            canMoveUp={idx < ordered.length - 1}
            canMoveDown={idx > 0}
            maskValue={typeof shape.maskOpacity === 'number' ? shape.maskOpacity : 0}
            onChangeMask={handleChangeMaskOpacity}
          />
        );
      })()}
    </div>
  );
}
