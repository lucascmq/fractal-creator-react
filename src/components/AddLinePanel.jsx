// Componente para adicionar uma linha ao fractal
// Exibe inputs para coordenadas X e Y e um botão para confirmar
// Boas práticas: use estados locais para os inputs e valide os valores antes de adicionar

import React, { useState, useEffect } from 'react';

export default function AddLinePanel({ onAdd, viewportCenter, zoom }) {
  // Limites centrados
  const MIN = -250;
  const MAX = 250;
  // Calcula um deslocamento padrão proporcional ao zoom
  const defaultOffset = 100 / zoom;
  // Inicializa os inputs centralizados no viewport atual
  const [x1, setX1] = useState(viewportCenter ? viewportCenter.x - defaultOffset / 2 : 0);
  const [y1, setY1] = useState(viewportCenter ? viewportCenter.y - defaultOffset / 2 : 0);
  const [x2, setX2] = useState(viewportCenter ? viewportCenter.x + defaultOffset / 2 : 100);
  const [y2, setY2] = useState(viewportCenter ? viewportCenter.y + defaultOffset / 2 : 100);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const clamp = (val) => Math.max(MIN, Math.min(MAX, Number(val)));

  // Sempre que viewportCenter ou zoom mudar, centraliza os inputs
  useEffect(() => {
    setX1(viewportCenter ? viewportCenter.x - defaultOffset / 2 : 0);
    setY1(viewportCenter ? viewportCenter.y - defaultOffset / 2 : 0);
    setX2(viewportCenter ? viewportCenter.x + defaultOffset / 2 : 100);
    setY2(viewportCenter ? viewportCenter.y + defaultOffset / 2 : 100);
  }, [viewportCenter, zoom]);

  // Handler para adicionar linha customizada pelos inputs
  const handleSubmit = (e) => {
    e.preventDefault();
    const nx1 = clamp(x1);
    const ny1 = clamp(y1);
    const nx2 = clamp(x2);
    const ny2 = clamp(y2);
    if ([nx1, ny1, nx2, ny2].some(v => isNaN(v))) return;
    onAdd({ x1: nx1, y1: ny1, x2: nx2, y2: ny2 });
  };

  // Função para obter as linhas de um padrão
  const getQuickPatternLines = (pattern) => {
    // Tamanho base dos padrões proporcional ao zoom
    const size = (250) / zoom; // metade do canvas lógico, ajustado pelo zoom
    const cx = viewportCenter ? viewportCenter.x : 0;
    const cy = viewportCenter ? viewportCenter.y : 0;
    switch (pattern) {
      case 'vertical':
        return { x1: cx, y1: cy - size, x2: cx, y2: cy + size };
      case 'horizontal':
        return { x1: cx - size, y1: cy, x2: cx + size, y2: cy };
      case 'diagonal-principal':
        return { x1: cx - size, y1: cy - size, x2: cx + size, y2: cy + size };
      case 'diagonal-secundaria':
        return { x1: cx - size, y1: cy + size, x2: cx + size, y2: cy - size };
      case 'x':
        return { x1: cx - size, y1: cy - size, x2: cx + size, y2: cy + size };
      case 'cruz':
        return { x1: cx, y1: cy - size, x2: cx, y2: cy + size };
      default:
        return { x1: cx, y1: cy, x2: cx + 100 / zoom, y2: cy + 100 / zoom };
    }
  };

  // Handler para quando um padrão é selecionado e o botão adicionar é clicado
  const handlePatternAdd = () => {
    if (!selectedPattern) return;
    const lineData = getQuickPatternLines(selectedPattern);
    onAdd(lineData);
    
    // Caso específico para padrões compostos
    if (selectedPattern === 'x') {
      // Adiciona a segunda linha do X
      setTimeout(() => {
        onAdd({ x1: -250, y1: 250, x2: 250, y2: -250 });
      }, 100);
    } else if (selectedPattern === 'cruz') {
      // Adiciona a segunda linha da cruz
      setTimeout(() => {
        onAdd({ x1: -250, y1: 0, x2: 250, y2: 0 });
      }, 100);
    }
  };
  
  // Handler para quando um botão de padrão é clicado
  const handleSelectPattern = (pattern) => {
    setSelectedPattern(pattern);
    
    // Atualiza os inputs com as coordenadas do padrão
    const lineData = getQuickPatternLines(pattern);
    setX1(lineData.x1);
    setY1(lineData.y1);
    setX2(lineData.x2);
    setY2(lineData.y2);
  };

  return (
    <div className="add-line-panel">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontWeight: 600 }}>Linhas</label>
          <div className="quick-patterns" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 12
          }}>
            <button type="button" className={`editor-btn pattern-btn${selectedPattern === 'vertical' ? ' selected' : ''}`} onClick={() => handleSelectPattern('vertical')} title="Vertical" style={{ minWidth: 60, minHeight: 48, flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
              <svg width="24" height="24"><line x1="12" y1="3" x2="12" y2="21" stroke="#fff" strokeWidth="2"/></svg>
              <span>Vertical</span>
            </button>
            <button type="button" className={`editor-btn pattern-btn${selectedPattern === 'horizontal' ? ' selected' : ''}`} onClick={() => handleSelectPattern('horizontal')} title="Horizontal" style={{ minWidth: 60, minHeight: 48, flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
              <svg width="24" height="24"><line x1="3" y1="12" x2="21" y2="12" stroke="#fff" strokeWidth="2"/></svg>
              <span>Horizontal</span>
            </button>
            <button type="button" className={`editor-btn pattern-btn${selectedPattern === 'diagonal-principal' ? ' selected' : ''}`} onClick={() => handleSelectPattern('diagonal-principal')} title="Diagonal Principal (\\)" style={{ minWidth: 60, minHeight: 48, flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
              <svg width="24" height="24"><line x1="3" y1="3" x2="21" y2="21" stroke="#fff" strokeWidth="2"/></svg>
              <span>Diagonal</span>
            </button>
            <button type="button" className={`editor-btn pattern-btn${selectedPattern === 'diagonal-secundaria' ? ' selected' : ''}`} onClick={() => handleSelectPattern('diagonal-secundaria')} title="Diagonal Secundária (/)" style={{ minWidth: 60, minHeight: 48, flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
              <svg width="24" height="24"><line x1="3" y1="21" x2="21" y2="3" stroke="#fff" strokeWidth="2"/></svg>
              <span>Diagonal</span>
            </button>
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Padrões</label>
          <div className="quick-patterns" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8
          }}>
            <button type="button" className={`editor-btn pattern-btn${selectedPattern === 'x' ? ' selected' : ''}`} onClick={() => handleSelectPattern('x')} title="X (diagonal cruzada)" style={{ minWidth: 60, minHeight: 48, flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
              <svg width="24" height="24"><line x1="3" y1="3" x2="21" y2="21" stroke="#fff" strokeWidth="2"/><line x1="3" y1="21" x2="21" y2="3" stroke="#fff" strokeWidth="2"/></svg>
              <span>X</span>
            </button>
            <button type="button" className={`editor-btn pattern-btn${selectedPattern === 'cruz' ? ' selected' : ''}`} onClick={() => handleSelectPattern('cruz')} title="Cruz (vertical e horizontal)" style={{ minWidth: 60, minHeight: 48, flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
              <svg width="24" height="24"><line x1="12" y1="3" x2="12" y2="21" stroke="#fff" strokeWidth="2"/><line x1="3" y1="12" x2="21" y2="12" stroke="#fff" strokeWidth="2"/></svg>
              <span>Cruz</span>
            </button>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ minWidth: 30, textAlign: 'right' }}>x1:</label>
            <input
              type="number"
              step={10}
              min={MIN}
              max={MAX}
              value={x1}
              onChange={e => setX1(Number(e.target.value))}
              style={{ width: '100%' }}
              onWheel={e => {
                const step = 5;
                const dir = e.deltaY < 0 ? 1 : -1;
                setX1(prev => clamp(Number(prev) + dir * step));
              }}
            />
            <label style={{ minWidth: 30, textAlign: 'right' }}>y1:</label>
            <input
              type="number"
              step={10}
              min={MIN}
              max={MAX}
              value={y1}
              onChange={e => setY1(Number(e.target.value))}
              style={{ width: '100%' }}
              onWheel={e => {
                const step = 5;
                const dir = e.deltaY < 0 ? 1 : -1;
                setY1(prev => clamp(Number(prev) + dir * step));
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ minWidth: 30, textAlign: 'right' }}>x2:</label>
            <input
              type="number"
              step={10}
              min={MIN}
              max={MAX}
              value={x2}
              onChange={e => setX2(Number(e.target.value))}
              style={{ width: '100%' }}
              onWheel={e => {
                const step = 5;
                const dir = e.deltaY < 0 ? 1 : -1;
                setX2(prev => clamp(Number(prev) + dir * step));
              }}
            />
            <label style={{ minWidth: 30, textAlign: 'right' }}>y2:</label>
            <input
              type="number"
              step={10}
              min={MIN}
              max={MAX}
              value={y2}
              onChange={e => setY2(Number(e.target.value))}
              style={{ width: '100%' }}
              onWheel={e => {
                const step = 5;
                const dir = e.deltaY < 0 ? 1 : -1;
                setY2(prev => clamp(Number(prev) + dir * step));
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button
            type="button"
            className="editor-btn"
            style={{ minWidth: 120 }}
            onClick={() => {
              if (selectedPattern) {
                handlePatternAdd();
              } else {
                handleSubmit({ preventDefault: () => {} });
              }
            }}
            disabled={!selectedPattern && ([x1, y1, x2, y2].some(v => isNaN(v)))}
          >Adicionar</button>
        </div>
      </form>
    </div>
  );
}
