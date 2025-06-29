// Componente para adicionar uma forma ao fractal
// Exibe opções de forma (círculo, quadrado, triângulo) e inputs para coordenadas e scale
// Layout integrado: mostra os inputs ao lado da lista de formas

import React, { useState, useEffect } from 'react';

const SHAPES = [
  { type: 'circle', label: 'Círculo', icon: '⚪' },
  { type: 'pentagono', label: 'Pentágono', icon: '⬟' },
  { type: 'triangle', label: 'Triângulo', icon: '▲' },
  { type: 'losango', label: 'Losango', icon: '◆' },
  { type: 'square', label: 'Quadrado', icon: '⬛' },
  { type: 'hexagono', label: 'Hexágono', icon: '⬢' },
];

export default function AddShapePanel({ onAdd, onCancel, viewportCenter, zoom }) {
  // Limites centrados
  const MIN = -250;
  const MAX = 250;
  // Centraliza a forma no viewport atual e ajusta escala pelo zoom
  const defaultScale = 4 / (zoom || 1);
  const [selected, setSelected] = useState(null);
  const [x, setX] = useState(viewportCenter ? viewportCenter.x : 0);
  const [y, setY] = useState(viewportCenter ? viewportCenter.y : 0);
  const [scale, setScale] = useState(defaultScale);
  const [fillOpacity, setFillOpacity] = useState(0.5);
  const clamp = (val) => Math.max(MIN, Math.min(MAX, Number(val)));

  // Sempre que viewportCenter ou zoom mudar, centraliza os inputs
  useEffect(() => {
    setX(viewportCenter ? viewportCenter.x : 0);
    setY(viewportCenter ? viewportCenter.y : 0);
    setScale(4 / (zoom || 1));
  }, [viewportCenter, zoom]);

  const handleShapeSelect = (type) => {
    setSelected(type);
    setX(viewportCenter ? viewportCenter.x : 0);
    setY(viewportCenter ? viewportCenter.y : 0);
    setScale(4 / (zoom || 1));
    setFillOpacity(0.5);
  };

  const handleSubmit = () => {
    if (!selected || isNaN(Number(x)) || isNaN(Number(y)) || isNaN(Number(scale))) return;
    const nx = clamp(x);
    const ny = clamp(y);    onAdd({ 
      type: selected, 
      x: nx, 
      y: ny, 
      scale: Number(scale), 
      fillOpacity: Number(fillOpacity),
      maskOpacity: 0 // Valor padrão 0 (sem máscara)
    });
    // Mantemos a seleção atual após adicionar
  };
  
  return (
    <div className="control-group">
      <label>Adicionar Forma</label>
      
      {/* Layout integrado com formas à esquerda e configurações à direita */}
      <div className="shape-editor-layout">
        {/* Lista de formas sempre visível */}
        <div className="shape-selector-panel">
          <div className="shape-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {SHAPES.map((shape) => (
              <button
                key={shape.type}
                onClick={() => handleShapeSelect(shape.type)}
                className={`shape-btn ${selected === shape.type ? 'selected' : ''}`}
                style={{ minWidth: 90 }}
              >
                <span style={{ marginRight: '5px' }}>{shape.icon}</span> {shape.label}
              </button>
            ))}
          </div>
          {/* Painel de propriedades aparece abaixo do grid, apenas se houver seleção */}
          {selected && (
            <div className="shape-properties-panel" style={{ marginTop: 16 }}>
              <div style={{ marginBottom: '10px', color: '#4CC674', fontSize: '20px', fontWeight: 700, fontFamily: 'Orbitron, Rajdhani, monospace', textAlign: 'left' }}>
                {SHAPES.find(s => s.type === selected).icon} {SHAPES.find(s => s.type === selected).label}
              </div>
              <div className="coordinate-inputs" style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <label>X:</label>
                  <input
                    type="number"
                    value={x}
                    min={MIN}
                    max={MAX}
                    onChange={e => setX(e.target.value)}
                    style={{ width: 60 }}
                    onWheel={e => {
                      const step = 1;
                      const dir = e.deltaY < 0 ? 1 : -1;
                      setX(prev => String(clamp(Number(prev) + dir * step)));
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Y:</label>
                  <input
                    type="number"
                    value={y}
                    min={MIN}
                    max={MAX}
                    onChange={e => setY(e.target.value)}
                    style={{ width: 60, marginLeft: 4 }}
                    onWheel={e => {
                      const step = 1;
                      const dir = e.deltaY < 0 ? 1 : -1;
                      setY(prev => String(clamp(Number(prev) + dir * step)));
                    }}
                  />
                </div>
              </div>
              <div className="coordinate-inputs" style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label>Escala:</label>
                  <input
                    type="number"
                    value={scale}
                    min={1}
                    step={1}
                    onChange={e => setScale(e.target.value)}
                    style={{ width: 60 }}
                    onWheel={e => {
                      const step = 1;
                      const dir = e.deltaY < 0 ? 1 : -1;
                      setScale(prev => String(Math.max(1, Number(prev) + dir * step)));
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Opacidade:</label>
                  <input
                    type="number"
                    value={fillOpacity}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={e => setFillOpacity(e.target.value)}
                    style={{ width: 60, marginLeft: 4 }}
                    onWheel={e => {
                      const step = 0.1;
                      const dir = e.deltaY < 0 ? 1 : -1;
                      setFillOpacity(prev => {
                        let next = Math.round((Number(prev) + dir * step) * 10) / 10;
                        if (next > 1) next = 1;
                        if (next < 0) next = 0;
                        return String(next);
                      });
                    }}
                  />
                </div>
              </div>
              <div className="shape-footer" style={{ marginTop: 8 }}>
                <button onClick={handleSubmit} className="editor-btn">Adicionar Forma</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
