// Componente base do Canvas responsivo usando React-Konva
// Explicação: Este componente cria um Stage (área de desenho) que se ajusta ao tamanho do container e já está pronto para receber shapes, grid e interatividade.

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text } from 'react-konva';
import { COLORS } from '../utils/colors';
import { Line, Group } from 'react-konva';
import { Circle, Rect, RegularPolygon } from 'react-konva';
import { Diamond, FigureCircle, FigureSquare, FigurePolygon } from './FigureLibrary';
import ShapePopover from './ShapePopover';
import LinePopover from './LinePopover';
import { useKeyboardSelection } from '../hooks/useKeyboardSelection';
import { useFocusControl } from '../hooks/useFocusControl';
import {
  CANVAS_SIZE,
  toCanvas,
  getNearestGridPoint,
  generateMainGridLines,
  generateDivisionLines,
  generateBorderLines
} from '../utils/gridUtils';
import { toCanvasZoom, fromCanvasZoom } from '../utils/zoomUtils';
import GridLayer from './GridLayer';
import SnapMarker from './SnapMarker';

export default function FractalCanvas({ 
  lines = [], 
  shapes = [],
  groups = [],
  settings = {},
  onUpdateShape, // Recebe função do App para atualizar shape
  onUpdateLine, // NOVO: para atualizar linha
  onUpdateGroup, // NOVO: para atualizar grupo
  selectedShapeId: selectedShapeIdProp,
  setSelectedShapeId: setSelectedShapeIdProp,
  isEditingShape,
  setIsEditingShape,
  selectedElements = [], // Adiciona array de elementos selecionados
  onToggleElementSelection = () => {}, // Função para alternar seleção
  onClearSelection = () => {}, // Função para limpar seleção
  // Props de zoom/pan centralizados no App
  zoom,
  setZoom,
  viewportCenter,
  setViewportCenter,
  zoomIn,
  zoomOut,
  pan,
  resetZoom
}) {  // Estado para controlar o slider de alternância entre Opacity e Dark
  const [sliderValue, setSliderValue] = useState(0);
  // Canvas quadrado fixo
  const width = CANVAS_SIZE;
  const height = CANVAS_SIZE;
  const containerRef = useRef(null);
  
  // Hook para controle inteligente de foco dos sliders
  const { opacitySliderRef, darkSliderRef } = useFocusControl({
    sliderValue,
    isEditingShape
  });
    // Determina se deve mostrar o texto central com base nas configurações
  const showCenterText = settings.showCenterText !== false;
  // Pega o texto central diretamente das configurações
  const centerText = settings.centerText || '';

  // Hook para seleção múltipla via teclado
  const { keysPressed, handleElementSelect, isElementSelected } = useKeyboardSelection({
    onClearSelection,
    onToggleElementSelection,
    isEditingShape,    selectedElements
  });

  // Estado para exibir controles de zoom
  const [showZoomControls, setShowZoomControls] = useState(false);

  // Substitui toCanvas por toCanvasZoom em todo o render
  // Helper para usar sempre o zoom/viewport atuais
  function toCanvasZ(x, y) {
    return toCanvasZoom(x, y, zoom, viewportCenter);
  }

  // Gera as linhas principais do grid usando a função utilitária, mas adaptada ao zoom
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

  // Gera as bordas do grid usando a função utilitária
  const borderLinesData = generateBorderLines();
  const borderLines = borderLinesData.map(lineData => (
    <Line
      key={lineData.key}
      points={lineData.points}      stroke={COLORS.primary}
      strokeWidth={1.5}
      opacity={lineData.opacity}
    />
  ));  // Hook para fornecer uma classe CSS especial para o container pai do Stage
  useEffect(() => {
    if (containerRef.current && containerRef.current instanceof HTMLElement) {
      // O elemento konvajs-content é criado automaticamente pelo React-Konva
      // Esta configuração garante que ele se posicione corretamente dentro do container
      const konvaContent = containerRef.current.querySelector('.konvajs-content');
      if (konvaContent) {
        konvaContent.style.position = 'static';
        konvaContent.style.border = '2px solid #4CC674';
        konvaContent.style.borderRadius = '8px';
        konvaContent.style.boxSizing = 'border-box';
        konvaContent.style.boxShadow = '0 0 15px rgba(76, 198, 116, 0.4), inset 0 0 15px rgba(76, 198, 116, 0.1)';
        konvaContent.style.filter = 'drop-shadow(0 0 8px rgba(76, 198, 116, 0.3))';
      }
    }
  }, [width, height]); // Dependências para re-executar quando canvas mudar

  // Renderização condicional do grid conforme configuração
  // Gera as linhas de divisão usando a função utilitária
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
  // Define se as formas são preenchidas ou apenas contorno
  const isOutline = settings.shapeStyle === 'outline';
  // Opacidade padrão para novas formas (antes era configurável, agora é fixa)
  const defaultFillOpacity = 0.5;
  // Estado para marcador de snap visual
  const [snapMarker, setSnapMarker] = useState(null);
  // Estado para seleção de forma
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  // Estado para o popover
  const [popover, setPopover] = useState(null);  // Estado para controle do hover da seta
  const [hoverArrow, setHoverArrow] = useState(false);
  // Estado para linha selecionada
  const [selectedLineId, setSelectedLineId] = useState(null);

  // DEBUG: Verifica se as shapes estão chegando corretamente
  console.log('Shapes recebidas no FractalCanvas:', shapes);

  // useEffect para fechar o menu com a tecla ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && selectedShapeId) {
        setSelectedShapeId(null);
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeId]);

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
  // Estado para o popover de edição (tipo, posição, dados)
  const [editPopover, setEditPopover] = useState(null); // { type: 'shape'|'line'|'group', x, y, data }

  // Função para abrir popover de shape
  function openShapePopover(shape) {
    // Calcula posição do centro da shape no canvas considerando zoom/pan
    const [canvasX, canvasY] = toCanvasZ(shape.x, shape.y);
    setEditPopover({
      type: 'shape',
      x: canvasX,
      y: canvasY,
      data: shape
    });
    setSelectedShapeId(shape.id);
    setSelectedLineId(null);
  }

  // Função para abrir popover de linha
  function openLinePopover(line) {
    // Posição: ponto médio da linha
    const midX = (line.x1 + line.x2) / 2;
    const midY = (line.y1 + line.y2) / 2;
    const [canvasX, canvasY] = toCanvasZ(midX, midY);
    setEditPopover({
      type: 'line',
      x: canvasX,
      y: canvasY,
      data: line
    });
    setSelectedLineId(line.id);
    setSelectedShapeId(null);
  }

  // Fecha popover
  function closeEditPopover() {
    setEditPopover(null);
    setSelectedShapeId(null);
    setSelectedLineId(null);
    setSelectedGroupId(null); // NOVO: Limpa seleção de grupo
  }

  // Handler de clique na shape (abre popover)
  function handleShapeClick(id, evt) {
    const shape = shapes.find(s => s.id === id);
    if (shape) {
      openShapePopover(shape);
    }
    if (evt && evt.cancelBubble !== undefined) evt.cancelBubble = true;
  }

  // Handler de clique na linha (abre popover)
  function handleLineClick(id, evt) {
    const line = lines.find(l => l.id === id);
    if (line) {
      openLinePopover(line);
    }
    if (evt && evt.cancelBubble !== undefined) evt.cancelBubble = true;
  }

  // Fecha popover ao clicar fora do Stage
  function handleStageClick(e) {
    if (e.target === e.target.getStage()) {
      closeEditPopover();
      setBreakLineData(null);
      if (onClearSelection && typeof onClearSelection === 'function') {
        onClearSelection();
      }
    }
  }

  // Estado para grupo selecionado
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Função para abrir popover de grupo
  function openGroupPopover(group) {
    // Posição: centro do grupo (aproximado)
    const [canvasX, canvasY] = toCanvasZ(group.x || 0, group.y || 0);
    setEditPopover({
      type: 'group',
      x: canvasX,
      y: canvasY,
      data: group
    });
    setSelectedGroupId(group.id);
    setSelectedShapeId(null);
    setSelectedLineId(null);
  }

  // Handler de clique no grupo (abre popover)
  function handleGroupClick(id, evt) {
    const group = groups.find(g => g.id === id);
    if (group) {
      openGroupPopover(group);
    }
    if (evt && evt.cancelBubble !== undefined) evt.cancelBubble = true;
  }

  // Handler de scroll: ajusta opacidade só da forma selecionada
  function handleWheelDiv(e) {
    if (!selectedShapeId) return;
    
    // Ativa modo de edição para prevenir scroll da página
    if (setIsEditingShape && !isEditingShape) {
      setIsEditingShape(true);
    }
    
    // Removido e.preventDefault() para evitar erro com passive event listener
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const shape = shapes.find(s => s.id === selectedShapeId);
    if (!shape) return;
    let newOpacity;
    if (sliderValue <= 0.5) { // Se o slider está mais para a esquerda (modo Opacity)
      newOpacity = (typeof shape.fillOpacity === 'number' ? shape.fillOpacity : 0.5) + delta;
      newOpacity = Math.max(0, Math.min(1, Math.round(newOpacity * 10) / 10));
      if (onUpdateShape) onUpdateShape(selectedShapeId, { fillOpacity: newOpacity });
    } else { // Se o slider está mais para a direita (modo Dark)
      newOpacity = (typeof shape.maskOpacity === 'number' ? shape.maskOpacity : 0) + delta;
      newOpacity = Math.max(0, Math.min(1, Math.round(newOpacity * 10) / 10));
      if (onUpdateShape) onUpdateShape(selectedShapeId, { maskOpacity: newOpacity });
    }
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
      setBreakLineData(null); // <--- Limpa o marcador de quebra de linha
      // Garante que a seleção múltipla seja limpa
      if (onClearSelection && typeof onClearSelection === 'function') {
        onClearSelection();
      }
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
  }  // Move a forma para cima/baixo na pilha de camadas
  function handleMoveLayer(direction) {
    if (!selectedShapeId) return;
    
    const currentShape = shapes.find(s => s.id === selectedShapeId);
    if (!currentShape) return;
    
    const ordered = [...shapes].sort((a, b) => a.layer - b.layer);
    const idx = ordered.findIndex(s => s.id === selectedShapeId);
    if (idx === -1) return;
    
    let targetIdx = direction === 'up' ? idx + 1 : idx - 1;
    if (targetIdx < 0 || targetIdx >= ordered.length) return;
    
    const targetShape = ordered[targetIdx];
    
    // Trocar os valores de layer
    const temp = currentShape.layer;
    const updatedCurrentShape = { ...currentShape, layer: targetShape.layer };
    const updatedTargetShape = { ...targetShape, layer: temp };
    
    // Atualizar ambas as formas
    if (onUpdateShape) {
      onUpdateShape(updatedCurrentShape.id, updatedCurrentShape);
      onUpdateShape(updatedTargetShape.id, updatedTargetShape);
    }
  }

  // Filtrar elementos agrupados para não renderizar duplicado
  const groupedElementIds = groups.flatMap(g => g.children.map(child => child.id));
  const ungroupedLines = lines.filter(line => !groupedElementIds.includes(line.id));
  const ungroupedShapes = shapes.filter(shape => !groupedElementIds.includes(shape.id));

  // Novo estado: ponto de quebra de linha
  const [breakLineData, setBreakLineData] = useState(null); // { lineId, point: {x, y}, canvas: [x, y] }

  // Handler de clique na linha para breakpoint
  function handleLineBreakpointClick(line, evt) {
    const stage = evt.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    // Snap sempre para 16x16
    const snap = getNearestGridPoint(pointer.x, pointer.y, 16);
    // Verifica se o ponto está realmente "em cima" da linha (distância mínima)
    const [x1, y1] = toCanvas(line.x1, line.y1);
    const [x2, y2] = toCanvas(line.x2, line.y2);
    const { canvas } = snap;
    // Distância ponto-linha
    const dist = Math.abs((y2 - y1) * canvas[0] - (x2 - x1) * canvas[1] + x2 * y1 - y2 * x1) /
      Math.hypot(y2 - y1, x2 - x1);
    if (dist > 16) return; // Só permite se estiver perto da linha
    setBreakLineData({ lineId: line.id, point: snap.logical, canvas: snap.canvas });
  }

  // Handler para realmente quebrar a linha
  function breakLineAtPoint() {
    if (!breakLineData) return;
    const line = lines.find(l => l.id === breakLineData.lineId);
    if (!line) return;
    // Calcula vetor diretor da linha
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    const length = Math.hypot(dx, dy);
    const gap = 20; // Gap de 20 unidades lógicas
    const ux = dx / length;
    const uy = dy / length;
    // Aplica gap ao ponto de quebra
    const px = breakLineData.point.x;
    const py = breakLineData.point.y;
    // Arredonda para 2 casas decimais
    const p1x = Number((px - ux * gap / 2).toFixed(2));
    const p1y = Number((py - uy * gap / 2).toFixed(2));
    const p2x = Number((px + ux * gap / 2).toFixed(2));
    const p2y = Number((py + uy * gap / 2).toFixed(2));
    // Cria duas novas linhas com gap
    const newLine1 = {
      ...line,
      id: Date.now() + Math.random(),
      x1: Number(line.x1.toFixed(2)),
      y1: Number(line.y1.toFixed(2)),
      x2: p1x,
      y2: p1y
    };
    const newLine2 = {
      ...line,
      id: Date.now() + Math.random(),
      x1: p2x,
      y1: p2y,
      x2: Number(line.x2.toFixed(2)),
      y2: Number(line.y2.toFixed(2))
    };
    // Remove a original e adiciona as duas novas
    if (typeof onUpdateLine === 'function' && typeof window.handleAddLine === 'function') {
      onUpdateLine(line.id, null); // null = remove
      setTimeout(() => {
        window.handleAddLine(newLine1);
        window.handleAddLine(newLine2);
      }, 0);
    }
    setBreakLineData(null);
  }

  // Handlers de zoom e pan (devem estar antes do JSX)
  const handleZoomIn = () => {
    // Calcula o próximo zoom
    const nextZoom = Math.min(zoom * 2, 16);
    // Calcula o tamanho lógico da área visível após o zoom
    const logicalSize = 500 / nextZoom;
    // Garante que o centro não ultrapasse os limites
    setViewportCenter(c => ({
      x: Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.x)),
      y: Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.y)),
    }));
    setZoom(nextZoom);
  };
  const handleZoomOut = () => {
    const nextZoom = Math.max(zoom / 2, 1);
    const logicalSize = 500 / nextZoom;
    setViewportCenter(c => ({
      x: Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.x)),
      y: Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.y)),
    }));
    setZoom(nextZoom);
  };
  const handlePan = (dx, dy) => {
    // Limita o pan para não sair dos limites
    const logicalSize = 500 / zoom;
    setViewportCenter(c => {
      const nx = Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.x + dx));
      const ny = Math.max(-250 + logicalSize / 2, Math.min(250 - logicalSize / 2, c.y + dy));
      return { x: nx, y: ny };
    });
  };
  const handleResetZoom = () => {
    setZoom(1);
    setViewportCenter({ x: 0, y: 0 });
  };

  // Fecha o painel de zoom ao clicar fora dele
  useEffect(() => {
    if (!showZoomControls) return;
    function handleClickOutside(e) {
      // Se o clique for dentro do painel ou do botão da lupa, não faz nada
      const zoomPanel = document.getElementById('zoom-panel');
      const zoomBtn = document.getElementById('zoom-btn');
      if (
        (zoomPanel && zoomPanel.contains(e.target)) ||
        (zoomBtn && zoomBtn.contains(e.target))
      ) {
        return;
      }
      setShowZoomControls(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showZoomControls]);

  // Busca shape/linha atualizado para o popover
  let popoverShape = null;
  let popoverLine = null;
  if (editPopover && editPopover.type === 'shape') {
    popoverShape = shapes.find(s => s.id === editPopover.data.id);
  }
  if (editPopover && editPopover.type === 'line') {
    popoverLine = lines.find(l => l.id === editPopover.data.id);
  }

  // Estado para ativar/desativar o zoom
  const [zoomEnabled, setZoomEnabled] = useState(true);

  return (
    <div className="fractal-canvas-container grid-transition" style={{ position: 'relative' }} onWheel={handleWheelDiv}>
      {/* Checkbox de zoom minimalista, totalmente fora do canvas, alinhada à borda esquerda da coluna */}
      <div style={{ position: 'absolute', right: '100%', bottom: 10, marginRight: 8, zIndex: 120 }}>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          background: '#181A20EE', border: '2px solid #4CC674', borderRadius: 7,
          padding: '5px 7px 4px 7px', color: '#7DF9A6', fontWeight: 700, fontSize: 13,
          cursor: 'pointer', userSelect: 'none', boxShadow: '0 1px 4px #000A',
          minWidth: 30
        }}>
          <input
            type="checkbox"
            checked={zoomEnabled}
            onChange={e => setZoomEnabled(e.target.checked)}
            style={{
              width: 15, height: 15, accentColor: '#4CC674', margin: 0,
              border: '2px solid #4CC674', borderRadius: 4, background: '#222',
              boxShadow: '0 1px 3px #0008', cursor: 'pointer',
              transition: 'accent-color 0.2s',
            }}
            aria-label="Ativar/desativar zoom"
          />
          <span style={{ display: 'block', lineHeight: 1.1, paddingTop: 2, fontFamily: 'Rajdhani, monospace', fontWeight: 700, color: '#7DF9A6', fontSize: 12, letterSpacing: 1 }}>Zoom</span>
        </label>
      </div>

      {/* Botão de ativação dos controles de zoom */}
      {zoomEnabled && (
        <button
          id="zoom-btn"
          onClick={() => setShowZoomControls(v => !v)}
          style={{
            position: 'absolute',
            left: 18,
            bottom: 18,
            width: 48,
            height: 48,
            borderRadius: 12,
            background: showZoomControls ? '#181A20EE' : 'rgba(24,26,32,0.7)',
            border: '2px solid #4CC674',
            color: '#7DF9A6',
            fontSize: 28,
            fontWeight: 700,
            boxShadow: '0 2px 8px #000A',
            zIndex: 50,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          title={showZoomControls ? 'Ocultar controles de zoom' : 'Mostrar controles de zoom'}
        >
          🔍
        </button>
      )}

      {/* Painel de controles de zoom */}
      {zoomEnabled && showZoomControls && (
        <div
          id="zoom-panel"
          style={{
            position: 'absolute',
            left: 80,
            bottom: 18,
            background: '#181A20EE',
            border: '2px solid #4CC674',
            borderRadius: 16,
            boxShadow: '0 2px 16px #000A',
            padding: '18px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            zIndex: 51,
            minWidth: 220,
            alignItems: 'center',
          }}
        >
          {/* Linha de zoom in/out */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={zoomOut} style={{ width: 38, height: 38, borderRadius: 8, background: 'transparent', border: '2px solid #4CC674', color: '#7DF9A6', fontSize: 22, fontWeight: 700, cursor: 'pointer' }}>–</button>
            <span style={{ color: '#7DF9A6', fontSize: 18, fontFamily: 'Orbitron, monospace', minWidth: 60, textAlign: 'center' }}>Zoom: {zoom}x</span>
            <button onClick={zoomIn} style={{ width: 38, height: 38, borderRadius: 8, background: 'transparent', border: '2px solid #4CC674', color: '#7DF9A6', fontSize: 22, fontWeight: 700, cursor: 'pointer' }}>+</button>
          </div>
          {/* Navegação (pan) */}
          <div style={{ display: 'grid', gridTemplateColumns: '38px 38px 38px', gridTemplateRows: '38px 38px 38px', gap: 4 }}>
            <div />
            <button onClick={() => pan(0, -50 / zoom)} style={{ gridColumn: 2, gridRow: 1, ...panBtnStyle }}>↑</button>
            <div />
            <button onClick={() => pan(-50 / zoom, 0)} style={{ gridColumn: 1, gridRow: 2, ...panBtnStyle }}>←</button>
            <div />
            <button onClick={() => pan(50 / zoom, 0)} style={{ gridColumn: 3, gridRow: 2, ...panBtnStyle }}>→</button>
            <div />
            <button onClick={() => pan(0, 50 / zoom)} style={{ gridColumn: 2, gridRow: 3, ...panBtnStyle }}>↓</button>
            <div />
          </div>
          {/* Área lógica visível */}
          <div style={{ color: '#7DF9A6', fontSize: 14, fontFamily: 'Rajdhani, monospace', marginTop: 6 }}>
            Centro: x={viewportCenter.x}, y={viewportCenter.y}
          </div>
          <button onClick={resetZoom} style={{ marginTop: 8, width: 120, height: 32, borderRadius: 8, background: 'transparent', border: '2px solid #4CC674', color: '#7DF9A6', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Resetar Zoom</button>
        </div>
      )}

      <Stage
        width={width}
        height={height}
        style={{ touchAction: 'none' }}
        onMouseMove={handleMouseMove}
        onClick={handleStageClick}
        ref={containerRef}
      >
        {/* Modularização: GridLayer */}
        <GridLayer zoom={zoom} viewportCenter={viewportCenter} settings={settings} toCanvasZ={toCanvasZ} />
        <Layer>
          {/* Marcador de snap (se ativo) */}
          <SnapMarker snapMarker={snapMarker} />
        </Layer>
        <Layer>
          {/* Grupos (ajustados para o zoom) */}
          {Array.isArray(groups) && groups.map(group => {
            const [groupCanvasX, groupCanvasY] = toCanvasZ(group.x || 0, group.y || 0);
            const groupRotation = group.rotation || 0;
            const groupScale = group.scale || 1;

            return (
              <Group
                key={group.id}
                x={groupCanvasX}
                y={groupCanvasY}
                rotation={groupRotation}
                scaleX={groupScale}
                scaleY={groupScale}
                draggable
                onDragMove={e => {
                  if (settings.snapToGrid && settings.showGrid) {
                    const { x: dragX, y: dragY } = e.target.position();
                    const divisions = settings.gridDivisions || 4;
                    const nearest = getNearestGridPoint(dragX, dragY, divisions);
                    setSnapMarker({ x: nearest.canvas[0], y: nearest.canvas[1], logical: nearest.logical });
                  } else {
                    setSnapMarker(null);
                  }
                }}
                onDragEnd={e => {
                  setSnapMarker(null);
                  let { x: newX, y: newY } = e.target.position();
                  if (settings.snapToGrid && settings.showGrid) {
                    const divisions = settings.gridDivisions || 4;
                    const nearest = getNearestGridPoint(newX, newY, divisions);
                    newX = nearest.canvas[0];
                    newY = nearest.canvas[1];
                  }
                  const [lx, ly] = fromCanvasZoom(newX, newY, zoom, viewportCenter);
                  if (onUpdateGroup) {
                    onUpdateGroup(group.id, { x: lx, y: ly });
                  }
                }}
                onClick={evt => {
                  handleGroupClick(group.id, evt);
                  handleElementSelect(group.id, 'group', evt);
                }}
              >
                {group.children.map(child => {
                  if (child.type === 'shape') {
                    const shape = shapes.find(s => s.id === child.id);
                    if (!shape) return null;
                    const typeLower = String(shape.type).toLowerCase();
                    if (["losango", "diamond"].includes(typeLower)) {
                      // As coordenadas x e y da forma devem ser relativas ao centro do grupo
                      const xRelativeToGroup = shape.x - (group.x || 0);
                      const yRelativeToGroup = shape.y - (group.y || 0);
                      const [x, y] = toCanvasZ(xRelativeToGroup, yRelativeToGroup);
                      const color = COLORS.primary;
                      const isSelected = selectedShapeId === shape.id;
                      const isGroupSelected = selectedElements.some(id => id === shape.id);
                      const shapeOpacity = typeof shape.fillOpacity === 'number' ? shape.fillOpacity : defaultFillOpacity;
                      const shapeMaskOpacity = typeof shape.maskOpacity === 'number' ? shape.maskOpacity : 0;
                      const scale = shape.scale || 1;
                      const h = 124 * scale * zoom;
                      const w = 62 * scale * zoom;
                      const rotation = shape.rotation || 0;
                      return (
                        <React.Fragment key={shape.id}>
                          <Group x={x} y={y} rotation={rotation}>
                            {shapeMaskOpacity > 0 && (
                              <Line
                                points={[0, -h/2, w/2, 0, 0, h/2, -w/2, 0]}
                                closed
                                fill="#000"
                                stroke="#000"
                                strokeWidth={0}
                                opacity={shapeMaskOpacity}
                                onClick={evt => {
                                  handleShapeClick(shape.id, evt);
                                  handleElementSelect(shape.id, 'shape', evt);
                                }}
                                listening={true}
                              />
                            )}
                            <Line
                              points={[0, -h/2, w/2, 0, 0, h/2, -w/2, 0]}
                              closed
                              stroke={isSelected ? '#FFD700' : isGroupSelected ? '#4CC674' : color}
                              strokeWidth={isSelected ? 4 : isGroupSelected ? 3 : 2}
                              fill={undefined}
                              opacity={1}
                              onClick={evt => {
                                handleShapeClick(shape.id, evt);
                                handleElementSelect(shape.id, 'shape', evt);
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
                                onClick={evt => {
                                  handleShapeClick(shape.id, evt);
                                  handleElementSelect(shape.id, 'shape', evt);
                                }}
                              />
                            )}
                          </Group>
                        </React.Fragment>
                      );
                    }
                    let mappedType = shape.type;
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
                    // As coordenadas x e y da forma devem ser relativas ao centro do grupo
                    const xRelativeToGroup = shape.x - (group.x || 0);
                    const yRelativeToGroup = shape.y - (group.y || 0);
                    const [x, y] = toCanvasZ(xRelativeToGroup, yRelativeToGroup);
                    const color = shape.color || COLORS.primary;
                    const isSelected = selectedShapeId === shape.id;
                    const isGroupSelected = selectedElements.some(id => id === shape.id);
                    const shapeOpacity = typeof shape.fillOpacity === 'number' ? shape.fillOpacity : defaultFillOpacity;
                    const shapeMaskOpacity = typeof shape.maskOpacity === 'number' ? shape.maskOpacity : 0;
                    return (
                      <ShapeWithOutline
                        key={shape.id}
                        type={mappedType}
                        x={x}
                        y={y}
                        size={mappedType === 'square' ? 64 * (shape.scale || 1) * zoom : 36 * (shape.scale || 1) * zoom}
                        fillOpacity={shapeOpacity}
                        maskOpacity={shapeMaskOpacity}
                        color={color}
                        strokeColor={(isSelected || isGroupSelected) ? (isSelected ? '#FFD700' : '#4CC674') : color}
                        strokeWidth={(isSelected || isGroupSelected) ? (isSelected ? 4 : 3) : 2}
                        sides={mappedSides}
                        rotation={shape.rotation || 0}
                        draggable={false} // Desabilitar draggable para shapes dentro de grupos
                        onDragEnd={null} // Remover onDragEnd para shapes dentro de grupos
                        onClick={evt => {
                          handleShapeClick(shape.id, evt);
                          handleElementSelect(shape.id, 'shape', evt);
                        }}
                      />
                    );
                  } else if (child.type === 'line') {
                    const line = lines.find(l => l.id === child.id);
                    if (!line) return null;
                    const selected = isElementSelected(line.id);
                    let dash = [];
                    if (line.isDashed) {
                      const dashLength = typeof line.dashLength === 'number' ? line.dashLength : 12;
                      const dashSpacing = typeof line.dashSpacing === 'number' ? line.dashSpacing : 8;
                      dash = [dashLength, dashSpacing];
                    }
                    return (
                      <Group key={line.id + '-hitbox'}>
                        <Line
                          key={line.id}
                          points={[
                            // As coordenadas x1, y1, x2, y2 da linha devem ser relativas ao centro do grupo
                            ...toCanvasZ(line.x1 - (group.x || 0), line.y1 - (group.y || 0)),
                            ...toCanvasZ(line.x2 - (group.x || 0), line.y2 - (group.y || 0))
                          ]}
                          stroke={selected ? '#FFD700' : COLORS.secondary}
                          strokeWidth={selected ? 4 : (line.strokeWidth || 2)}
                          opacity={typeof line.opacity === 'number' ? line.opacity : 0.8}
                          dash={dash}
                          onClick={(e) => { handleLineClick(line.id, e); }}
                          hitStrokeWidth={24}
                        />
                      </Group>
                    );
                  }
                  return null;
                })}
              </Group>
            );
          })}
        </Layer>
        <Layer>
          {/* Renderiza shapes não agrupadas */}
          {ungroupedShapes.map(shape => {
            const typeLower = String(shape.type).toLowerCase();
            const [x, y] = toCanvasZ(shape.x, shape.y);
            const color = shape.color || COLORS.primary;
            const isSelected = selectedShapeId === shape.id;
            const isMultiSelected = selectedElements.some(id => id === shape.id);
            const shapeOpacity = typeof shape.fillOpacity === 'number' ? shape.fillOpacity : defaultFillOpacity;
            const shapeMaskOpacity = typeof shape.maskOpacity === 'number' ? shape.maskOpacity : 0;
            const scale = shape.scale || 1;
            const rotation = shape.rotation || 0;
            if (["losango", "diamond"].includes(typeLower)) {
              return (
                <Diamond
                  key={shape.id}
                  x={x}
                  y={y}
                  scale={scale}
                  zoom={zoom}
                  color={color}
                  fillOpacity={shapeOpacity}
                  maskOpacity={shapeMaskOpacity}
                  rotation={rotation}
                  isSelected={isSelected}
                  isMultiSelected={isMultiSelected}
                  draggable
                  onDragMove={e => {
                    if (settings.snapToGrid && settings.showGrid) {
                      const { x: dragX, y: dragY } = e.target.position();
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(dragX, dragY, divisions);
                      setSnapMarker({ x: nearest.canvas[0], y: nearest.canvas[1], logical: nearest.logical });
                    } else {
                      setSnapMarker(null);
                    }
                  }}
                  onDragEnd={e => {
                    setSnapMarker(null);
                    let { x: newX, y: newY } = e.target.position();
                    if (settings.snapToGrid && settings.showGrid) {
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(newX, newY, divisions);
                      newX = nearest.canvas[0];
                      newY = nearest.canvas[1];
                    }
                    const [lx, ly] = fromCanvasZoom(newX, newY, zoom, viewportCenter);
                    if (onUpdateShape) {
                      onUpdateShape(shape.id, { x: lx, y: ly });
                    }
                  }}
                  onClick={evt => {
                    handleShapeClick(shape.id, evt);
                    handleElementSelect(shape.id, 'shape', evt);
                  }}
                />
              );
            }
            if (["circle"].includes(typeLower)) {
              return (
                <FigureCircle
                  key={shape.id}
                  x={x}
                  y={y}
                  size={36 * scale * zoom}
                  color={color}
                  fillOpacity={shapeOpacity}
                  maskOpacity={shapeMaskOpacity}
                  rotation={rotation}
                  isSelected={isSelected}
                  isMultiSelected={isMultiSelected}
                  draggable
                  onDragMove={e => {
                    if (settings.snapToGrid && settings.showGrid) {
                      const { x: dragX, y: dragY } = e.target.position();
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(dragX, dragY, divisions);
                      setSnapMarker({ x: nearest.canvas[0], y: nearest.canvas[1], logical: nearest.logical });
                    } else {
                      setSnapMarker(null);
                    }
                  }}
                  onDragEnd={e => {
                    setSnapMarker(null);
                    let { x: newX, y: newY } = e.target.position();
                    if (settings.snapToGrid && settings.showGrid) {
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(newX, newY, divisions);
                      newX = nearest.canvas[0];
                      newY = nearest.canvas[1];
                    }
                    const [lx, ly] = fromCanvasZoom(newX, newY, zoom, viewportCenter);
                    if (onUpdateShape) {
                      onUpdateShape(shape.id, { x: lx, y: ly });
                    }
                  }}
                  onClick={evt => {
                    handleShapeClick(shape.id, evt);
                    handleElementSelect(shape.id, 'shape', evt);
                  }}
                />
              );
            }
            if (["square"].includes(typeLower)) {
              return (
                <FigureSquare
                  key={shape.id}
                  x={x}
                  y={y}
                  size={64 * scale * zoom}
                  color={color}
                  fillOpacity={shapeOpacity}
                  maskOpacity={shapeMaskOpacity}
                  rotation={rotation}
                  isSelected={isSelected}
                  isMultiSelected={isMultiSelected}
                  draggable
                  onDragMove={e => {
                    if (settings.snapToGrid && settings.showGrid) {
                      const { x: dragX, y: dragY } = e.target.position();
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(dragX, dragY, divisions);
                      setSnapMarker({ x: nearest.canvas[0], y: nearest.canvas[1], logical: nearest.logical });
                    } else {
                      setSnapMarker(null);
                    }
                  }}
                  onDragEnd={e => {
                    setSnapMarker(null);
                    let { x: newX, y: newY } = e.target.position();
                    if (settings.snapToGrid && settings.showGrid) {
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(newX, newY, divisions);
                      newX = nearest.canvas[0];
                      newY = nearest.canvas[1];
                    }
                    const [lx, ly] = fromCanvasZoom(newX, newY, zoom, viewportCenter);
                    if (onUpdateShape) {
                      onUpdateShape(shape.id, { x: lx, y: ly });
                    }
                  }}
                  onClick={evt => {
                    handleShapeClick(shape.id, evt);
                    handleElementSelect(shape.id, 'shape', evt);
                  }}
                />
              );
            }
            if (["triangle", "triangulo"].includes(typeLower)) {
              return (
                <FigurePolygon
                  key={shape.id}
                  x={x}
                  y={y}
                  size={36 * scale * zoom}
                  sides={3}
                  color={color}
                  fillOpacity={shapeOpacity}
                  maskOpacity={shapeMaskOpacity}
                  rotation={rotation}
                  isSelected={isSelected}
                  isMultiSelected={isMultiSelected}
                  onClick={evt => {
                    handleShapeClick(shape.id, evt);
                    handleElementSelect(shape.id, 'shape', evt);
                  }}
                />
              );
            }
            if (["pentagono", "pentagon"].includes(typeLower)) {
              return (
                <FigurePolygon
                  key={shape.id}
                  x={x}
                  y={y}
                  size={36 * scale * zoom}
                  sides={5}
                  color={color}
                  fillOpacity={shapeOpacity}
                  maskOpacity={shapeMaskOpacity}
                  rotation={rotation}
                  isSelected={isSelected}
                  isMultiSelected={isMultiSelected}
                  draggable
                  onDragMove={e => {
                    if (settings.snapToGrid && settings.showGrid) {
                      const { x: dragX, y: dragY } = e.target.position();
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(dragX, dragY, divisions);
                      setSnapMarker({ x: nearest.canvas[0], y: nearest.canvas[1], logical: nearest.logical });
                    } else {
                      setSnapMarker(null);
                    }
                  }}
                  onDragEnd={e => {
                    setSnapMarker(null);
                    let { x: newX, y: newY } = e.target.position();
                    if (settings.snapToGrid && settings.showGrid) {
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(newX, newY, divisions);
                      newX = nearest.canvas[0];
                      newY = nearest.canvas[1];
                    }
                    const [lx, ly] = fromCanvasZoom(newX, newY, zoom, viewportCenter);
                    if (onUpdateShape) {
                      onUpdateShape(shape.id, { x: lx, y: ly });
                    }
                  }}
                  onClick={evt => {
                    handleShapeClick(shape.id, evt);
                    handleElementSelect(shape.id, 'shape', evt);
                  }}
                />
              );
            }
            if (["hexagono", "hexagon"].includes(typeLower)) {
              return (
                <FigurePolygon
                  key={shape.id}
                  x={x}
                  y={y}
                  size={36 * scale * zoom}
                  sides={6}
                  color={color}
                  fillOpacity={shapeOpacity}
                  maskOpacity={shapeMaskOpacity}
                  rotation={rotation}
                  isSelected={isSelected}
                  isMultiSelected={isMultiSelected}
                  draggable
                  onDragMove={e => {
                    if (settings.snapToGrid && settings.showGrid) {
                      const { x: dragX, y: dragY } = e.target.position();
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(dragX, dragY, divisions);
                      setSnapMarker({ x: nearest.canvas[0], y: nearest.canvas[1], logical: nearest.logical });
                    } else {
                      setSnapMarker(null);
                    }
                  }}
                  onDragEnd={e => {
                    setSnapMarker(null);
                    let { x: newX, y: newY } = e.target.position();
                    if (settings.snapToGrid && settings.showGrid) {
                      const divisions = settings.gridDivisions || 4;
                      const nearest = getNearestGridPoint(newX, newY, divisions);
                      newX = nearest.canvas[0];
                      newY = nearest.canvas[1];
                    }
                    const [lx, ly] = fromCanvasZoom(newX, newY, zoom, viewportCenter);
                    if (onUpdateShape) {
                      onUpdateShape(shape.id, { x: lx, y: ly });
                    }
                  }}
                  onClick={evt => {
                    handleShapeClick(shape.id, evt);
                    handleElementSelect(shape.id, 'shape', evt);
                  }}
                />
              );
            }
            return null;
          })}
          {/* Renderiza linhas não agrupadas */}
          {ungroupedLines.map(line => {
            const [x1, y1] = toCanvasZ(line.x1, line.y1);
            const [x2, y2] = toCanvasZ(line.x2, line.y2);
            const selected = isElementSelected(line.id);
            let dash = [];
            if (line.isDashed) {
              const dashLength = typeof line.dashLength === 'number' ? line.dashLength : 12;
              const dashSpacing = typeof line.dashSpacing === 'number' ? line.dashSpacing : 8;
              dash = [dashLength, dashSpacing];
            }
            return (
              <Line
                key={line.id}
                points={[x1, y1, x2, y2]}
                stroke={selected ? '#FFD700' : COLORS.secondary}
                strokeWidth={selected ? 4 : (line.strokeWidth || 2)}
                opacity={typeof line.opacity === 'number' ? line.opacity : 0.8}
                dash={dash}
                draggable
                onDragMove={e => {
                  if (settings.snapToGrid && settings.showGrid) {
                    const { x: dragX, y: dragY } = e.target.position();
                    const divisions = settings.gridDivisions || 4;
                    const nearest = getNearestGridPoint(dragX, dragY, divisions);
                    setSnapMarker({ x: nearest.canvas[0], y: nearest.canvas[1], logical: nearest.logical });
                  } else {
                    setSnapMarker(null);
                  }
                }}
                onDragEnd={e => {
                  setSnapMarker(null);
                  let { x: newX, y: newY } = e.target.position();
                  if (settings.snapToGrid && settings.showGrid) {
                    const divisions = settings.gridDivisions || 4;
                    const nearest = getNearestGridPoint(newX, newY, divisions);
                    newX = nearest.canvas[0];
                    newY = nearest.canvas[1];
                  }
                  // Atualiza a linha para o novo ponto inicial/final (mantém o delta)
                  const dx = newX - x1;
                  const dy = newY - y1;
                  const [lx1, ly1] = fromCanvasZoom(newX, newY, zoom, viewportCenter);
                  const [lx2, ly2] = fromCanvasZoom(x2 + dx, y2 + dy, zoom, viewportCenter);
                  if (onUpdateLine) {
                    onUpdateLine(line.id, { x1: lx1, y1: ly1, x2: lx2, y2: ly2 });
                  }
                }}
                onClick={e => handleLineClick(line.id, e)}
                hitStrokeWidth={24}
              />
            );
          })}
        </Layer>
        <Layer>
          {/* Texto central (se habilitado) */}
          {showCenterText && (
            <Text
              text={centerText}
              x={width / 2}
              y={height / 2}
              fontSize={24}
              fontFamily="Arial"
              fill="#FFFFFF"
              align="center"
              verticalAlign="middle"
              opacity={0.8}
              draggable={false}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
      {/* Popover de edição de shape/linha */}
      {editPopover && editPopover.type === 'shape' && popoverShape && (
        <ShapePopover
          x={editPopover.x}
          y={editPopover.y}
          value={popoverShape.fillOpacity ?? 0.5}
          maskValue={popoverShape.maskOpacity ?? 0}
          onChange={val => onUpdateShape(popoverShape.id, { fillOpacity: val })}
          onChangeMask={val => onUpdateShape(popoverShape.id, { maskOpacity: val })}
          onModeChange={mode => setSliderValue(mode === 'opacity' ? 0 : 1)}
          onClose={closeEditPopover}
          layer={popoverShape.layer}
          onMoveLayer={handleMoveLayer}
          canMoveUp={true}
          canMoveDown={true}
        />
      )}
      {editPopover && editPopover.type === 'line' && popoverLine && (
        <LinePopover
          line={popoverLine}
          onUpdate={props => onUpdateLine(popoverLine.id, props)}
          onClose={closeEditPopover}
        />
      )}

      {/* Visualização do zoom e área no canto superior direito */}
      {zoomEnabled && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 24,
          background: 'transparent',
          border: '2px solid #4CC674',
          borderRadius: 10,
          padding: '10px 18px',
          color: '#7DF9A6',
          fontFamily: 'Rajdhani, monospace',
          fontSize: 16,
          zIndex: 100,
          minWidth: 160,
          textAlign: 'right',
          userSelect: 'none',
          boxShadow: 'none',
        }}>
          <div style={{fontWeight: 700, fontSize: 18}}>Zoom: {zoom}x</div>
          <div style={{fontSize: 15}}>
            Área: {(CANVAS_SIZE/zoom).toFixed(0)} × {(CANVAS_SIZE/zoom).toFixed(0)} px
          </div>
          <div style={{fontSize: 14, opacity: 0.8}}>
            Centro: x={viewportCenter.x}, y={viewportCenter.y}
          </div>
        </div>
      )}

      {/* Checkbox de zoom minimalista, totalmente fora do canvas, alinhada à borda esquerda da coluna */}
      <div style={{ position: 'absolute', right: '100%', bottom: 10, marginRight: 8, zIndex: 120 }}>
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          background: '#181A20EE', border: '2px solid #4CC674', borderRadius: 7,
          padding: '5px 7px 4px 7px', color: '#7DF9A6', fontWeight: 700, fontSize: 13,
          cursor: 'pointer', userSelect: 'none', boxShadow: '0 1px 4px #000A',
          minWidth: 30
        }}>
          <input
            type="checkbox"
            checked={zoomEnabled}
            onChange={e => setZoomEnabled(e.target.checked)}
            style={{
              width: 15, height: 15, accentColor: '#4CC674', margin: 0,
              border: '2px solid #4CC674', borderRadius: 4, background: '#222',
              boxShadow: '0 1px 3px #0008', cursor: 'pointer',
              transition: 'accent-color 0.2s',
            }}
            aria-label="Ativar/desativar zoom"
          />
          <span style={{ display: 'block', lineHeight: 1.1, paddingTop: 2, fontFamily: 'Rajdhani, monospace', fontWeight: 700, color: '#7DF9A6', fontSize: 12, letterSpacing: 1 }}>Zoom</span>
        </label>
      </div>
    </div>
  );
}

// Estilo dos botões de pan
const panBtnStyle = {
  borderRadius: 8,
  background: 'transparent',
  border: '2px solid #4CC674',
  color: '#7DF9A6',
  fontSize: 22,
  fontWeight: 700,
  cursor: 'pointer',
  width: 38,
  height: 38,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

