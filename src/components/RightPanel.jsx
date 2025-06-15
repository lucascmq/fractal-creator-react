// Painel lateral direito: lista de elementos criados (linhas e formas)
// Permite editar parâmetros de cada elemento
import React, { useState, useRef, useEffect } from 'react';

export default function RightPanel({ lines, shapes, onUpdateLine, onUpdateShape, onDeleteLine, onDeleteShape, selectedShapeId }) {
  // Estado local para o Auto Y de cada linha
  const [autoY, setAutoY] = useState({});
  
  // Função para mover as camadas (layer) das formas
  const moveShapeLayer = (id, direction) => {
    const ordered = [...shapes].sort((a, b) => a.layer - b.layer);
    const idx = ordered.findIndex(s => s.id === id);
    if (idx === -1) return;
    
    let targetIdx = direction === 'up' ? idx + 1 : idx - 1;
    if (targetIdx < 0 || targetIdx >= ordered.length) return;
    
    const temp = ordered[idx].layer;
    ordered[idx].layer = ordered[targetIdx].layer;
    ordered[targetIdx].layer = temp;
    
    onUpdateShape(ordered[idx].id, { ...ordered[idx] });
    onUpdateShape(ordered[targetIdx].id, { ...ordered[targetIdx] });
  };

  // Função para alternar o Auto Y de uma linha
  const toggleAutoY = (id) => {
    setAutoY(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Função para atualizar mantendo o slope
  const handleLineInput = (id, field, value, line) => {
    const v = Number(value);
    if (!autoY[id]) {
      onUpdateLine(id, { ...line, [field]: v });
      return;
    }
    // Se Auto Y está ativado, recalcula o Y correspondente para manter o slope
    let newLine = { ...line, [field]: v };
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    if (field === 'x1' && dx !== 0) {
      // y1 = y2 - slope * (x2 - x1)
      const slope = dy / dx;
      newLine.y1 = Math.round(line.y2 - slope * (line.x2 - v));
    } else if (field === 'x2' && dx !== 0) {
      // y2 = y1 + slope * (x2 - x1)
      const slope = dy / dx;
      newLine.y2 = Math.round(line.y1 + slope * (v - line.x1));
    } else if (field === 'y1' && dx !== 0) {
      // x1 = x2 - (y2 - y1)/slope
      const slope = dy / dx;
      newLine.x1 = Math.round(line.x2 - (line.y2 - v) / slope);
    } else if (field === 'y2' && dx !== 0) {
      // x2 = x1 + (y2 - y1)/slope
      const slope = dy / dx;
      newLine.x2 = Math.round(line.x1 + (v - line.y1) / slope);
    } else {
      // Se slope indefinido, só atualiza normalmente
      newLine[field] = v;
    }
    onUpdateLine(id, newLine);
  };

  // Array de refs para inputs de opacidade
  const opacityRefs = useRef({});

  // Foco automático ao selecionar
  useEffect(() => {
    if (selectedShapeId && opacityRefs.current[selectedShapeId]) {
      opacityRefs.current[selectedShapeId].focus();
    }
  }, [selectedShapeId]);

  // Handler robusto: trava scroll do painel ao focar input type=number usando addEventListener passive: false
  const asideRef = useRef(null);
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    function wheelHandler(e) {
      const active = document.activeElement;
      // Só bloqueia o scroll se NÃO estiver sobre um input numérico focado
      if (!(active && active.tagName === 'INPUT' && active.type === 'number')) {
        e.preventDefault();
      }
    }
    aside.addEventListener('wheel', wheelHandler, { passive: false });
    return () => aside.removeEventListener('wheel', wheelHandler);
  }, []);

  return (
    <aside
      ref={asideRef}
      style={{
        background: 'rgba(10,20,10,0.95)',
        borderLeft: '2px solid #4CC674',
         width: '100%',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        height: '100%',
        fontFamily: 'Orbitron, Rajdhani, monospace',
      }}
    >
      <h3 style={{ color: '#4CC674', marginBottom: 12 }}>Elementos Criados</h3>
      <div>
        <h4 style={{ color: '#7DF9A6', marginBottom: 8 }}>Linhas</h4>
        {lines.length === 0 && <p style={{ color: '#888' }}>Nenhuma linha criada.</p>}
        {lines.map((line, idx) => {
          const dx = line.x2 - line.x1;
          const dy = line.y2 - line.y1;
          const slope = dx !== 0 ? (dy / dx) : null;
          return (
            <div key={line.id} style={itemStyle}>
              <span style={{ color: '#4CC674', fontWeight: 700 }}>Linha {idx + 1}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 8px 0' }}>
                <input type="checkbox" checked={!!autoY[line.id]} onChange={() => toggleAutoY(line.id)} />
                <span style={{ color: '#7DF9A6', fontSize: 12 }}>Auto Y</span>
                <span style={{ color: '#7DF9A6', fontSize: 11, marginLeft: 8 }}>Slope: {slope === null ? 'Vertical' : slope.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={labelStyle}>x1 =</span>
                  <input type="number" value={line.x1} min={-250} max={250} onChange={e => handleLineInput(line.id, 'x1', e.target.value, line)} style={inputStyle} onWheel={e => { console.log('wheel x1'); e.stopPropagation(); }} />
                  <span style={labelStyle}>y1 =</span>
                  <input type="number" value={line.y1} min={-250} max={250} onChange={e => handleLineInput(line.id, 'y1', e.target.value, line)} style={inputStyle} onWheel={e => { console.log('wheel y1'); e.stopPropagation(); }} />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={labelStyle}>x2 =</span>
                  <input type="number" value={line.x2} min={-250} max={250} onChange={e => handleLineInput(line.id, 'x2', e.target.value, line)} style={inputStyle} onWheel={e => { console.log('wheel x2'); e.stopPropagation(); }} />
                  <span style={labelStyle}>y2 =</span>
                  <input type="number" value={line.y2} min={-250} max={250} onChange={e => handleLineInput(line.id, 'y2', e.target.value, line)} style={inputStyle} onWheel={e => { console.log('wheel y2'); e.stopPropagation(); }} />
                </div>
              </div>
              {/* Botão Deletar menor, abaixo dos inputs */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <button onClick={() => onDeleteLine(line.id)} style={deleteBtnSmallStyle}>
                  <span role="img" aria-label="lixeira" style={{ marginRight: 2, fontSize: 14 }}>🗑️</span>Deletar
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <h4 style={{ color: '#7DF9A6', marginBottom: 8 }}>Formas</h4>
        {shapes.length === 0 && <p style={{ color: '#888' }}>Nenhuma forma criada.</p>}
        {shapes.map((shape, idx) => {
          const isSelected = shape.id === selectedShapeId;
          return (
            <div
              key={shape.id}
              style={{
                ...itemStyle,
                border: isSelected ? '2px solid #FFD700' : itemStyle.border,
                background: isSelected ? 'rgba(255, 215, 0, 0.08)' : itemStyle.background,
                boxShadow: isSelected ? '0 0 8px #FFD70088' : undefined,
                transition: 'border 0.2s, background 0.2s, box-shadow 0.2s',
              }}
            >
              <span style={{ color: '#4CC674', fontWeight: 700 }}>{shape.type} {idx + 1}</span>
              {isSelected && (
                <div style={{ display: 'flex', gap: 4, margin: '4px 0' }}>
                  <button
                    title="Mover para cima"
                    style={{ ...buttonStyle, opacity: idx === shapes.length - 1 ? 0.4 : 1 }}
                    disabled={idx === shapes.length - 1}
                    onClick={() => moveShapeLayer(shape.id, 'up')}
                  >↑</button>
                  <button
                    title="Mover para baixo"
                    style={{ ...buttonStyle, opacity: idx === 0 ? 0.4 : 1 }}
                    disabled={idx === 0}
                    onClick={() => moveShapeLayer(shape.id, 'down')}
                  >↓</button>
                </div>
              )}              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'auto auto auto',
                gap: '6px 12px',
                alignItems: 'center',
                margin: '8px 0',
              }}>
                {/* Linha 1: x e escala */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ ...labelStyle, fontSize: 16, fontWeight: 700, width: 18, textAlign: 'right' }}>x</span>
                  <span style={{ color: '#7DF9A6', fontWeight: 700, width: 16, textAlign: 'center' }}>=</span>
                  <input type="number" value={shape.x} min={-250} max={250} onChange={e => onUpdateShape(shape.id, { ...shape, x: Number(e.target.value) })} style={{ ...inputStyleSmall, width: 38 }} onWheel={e => { console.log('wheel shape.x'); e.stopPropagation(); }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ ...labelStyle, textTransform: 'lowercase', minWidth: 44, textAlign: 'right' }}>escala</span>
                  <span style={{ color: '#7DF9A6', fontWeight: 700, width: 16, textAlign: 'center' }}>=</span>
                  <input type="number" value={shape.scale} min={1} step={1} onChange={e => onUpdateShape(shape.id, { ...shape, scale: Number(e.target.value) })} style={{ ...inputStyleSmall, width: 38 }} onWheel={e => { console.log('wheel shape.scale'); e.stopPropagation(); }} />
                </div>
                {/* Linha 2: y e girar (ou vazio para círculo) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ ...labelStyle, fontSize: 16, fontWeight: 700, width: 18, textAlign: 'right' }}>y</span>
                  <span style={{ color: '#7DF9A6', fontWeight: 700, width: 16, textAlign: 'center' }}>=</span>
                  <input type="number" value={shape.y} min={-250} max={250} onChange={e => onUpdateShape(shape.id, { ...shape, y: Number(e.target.value) })} style={{ ...inputStyleSmall, width: 38 }} onWheel={e => { console.log('wheel shape.y'); e.stopPropagation(); }} />
                </div>                {['triângulo', 'quadrado', 'triangulo', 'square', 'triangle', 'pentágono', 'pentagono', 'heptágono', 'heptagono', 'pentagon', 'heptagon', 'losango', 'diamond'].includes(shape.type.toLowerCase()) ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ ...labelStyle, minWidth: 44, textAlign: 'right' }}>girar</span>
                    <span style={{ color: '#7DF9A6', fontWeight: 700, width: 16, textAlign: 'center' }}>=</span>
                    <input type="number" value={shape.rotation || 0} min={0} max={360} step={15} onChange={e => onUpdateShape(shape.id, { ...shape, rotation: Number(e.target.value) })} style={{ ...inputStyleSmall, width: 38 }} onWheel={e => { console.log('wheel shape.rotation'); e.stopPropagation(); }} />
                  </div>
                ) : (
                  <div />
                )}{/* Opacidade individual */}
                <div style={{ display: 'flex', alignItems: 'center', gridColumn: '1 / span 2', justifyContent: 'center' }}>
                  <span style={{ ...labelStyle, minWidth: 44, textAlign: 'right' }}>opacidade</span>
                  <span style={{ color: '#7DF9A6', fontWeight: 700, width: 16, textAlign: 'center' }}>=</span>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={typeof shape.fillOpacity === 'number' ? shape.fillOpacity : 0.5}
                    onChange={e => onUpdateShape(shape.id, { fillOpacity: Number(e.target.value) })}
                    style={{ ...inputStyleSmall, width: 38 }}
                    ref={el => opacityRefs.current[shape.id] = el}
                    onWheel={e => { console.log('wheel shape.fillOpacity'); e.stopPropagation(); }}
                  />
                </div>
                {/* Opacidade da máscara */}
                <div style={{ display: 'flex', alignItems: 'center', gridColumn: '1 / span 2', justifyContent: 'center' }}>
                  <span style={{ ...labelStyle, minWidth: 44, textAlign: 'right' }}>máscara</span>
                  <span style={{ color: '#7DF9A6', fontWeight: 700, width: 16, textAlign: 'center' }}>=</span>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={typeof shape.maskOpacity === 'number' ? shape.maskOpacity : 0}
                    onChange={e => onUpdateShape(shape.id, { maskOpacity: Number(e.target.value) })}
                    style={{ ...inputStyleSmall, width: 38 }}
                    onWheel={e => { console.log('wheel shape.maskOpacity'); e.stopPropagation(); }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <button onClick={() => onDeleteShape(shape.id)} style={deleteBtnSmallStyle}>
                  <span role="img" aria-label="lixeira" style={{ marginRight: 2, fontSize: 14 }}>🗑️</span>Deletar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

const itemStyle = {
  background: 'rgba(76,198,116,0.05)',
  border: '1px solid #4CC67433',
  borderRadius: 6,
  padding: 10,
  marginBottom: 8,
};

const inputStyle = {
  width: 50,
  background: 'rgba(0,0,0,0.7)',
  border: '1px solid #4CC674',
  borderRadius: 4,
  color: '#fff',
  fontSize: 13,
  padding: '4px 6px',
  fontFamily: 'Rajdhani, monospace',
};

// Novo estilo para input menor
const inputStyleSmall = {
  width: 38,
  background: 'rgba(0,0,0,0.7)',
  border: '1px solid #4CC674',
  borderRadius: 4,
  color: '#fff',
  fontSize: 13,
  padding: '3px 5px',
  fontFamily: 'Rajdhani, monospace',
};

const deleteBtnStyle = {
  background: 'rgba(76,198,116,0.15)',
  color: '#4CC674',
  border: 'none',
  borderRadius: 4,
  fontSize: 16,
  cursor: 'pointer',
  padding: '2px 8px',
  fontWeight: 700,
  marginLeft: 4,
  transition: 'background 0.2s',
};

const deleteBtnSmallStyle = {
  background: 'rgba(76,198,116,0.10)',
  color: '#4CC674',
  border: 'none',
  borderRadius: 4,
  fontSize: 13,
  cursor: 'pointer',
  padding: '2px 10px',
  fontWeight: 500,
  marginLeft: 0,
  transition: 'background 0.2s',
  display: 'flex',
  alignItems: 'center',
};

const labelStyle = {
  color: '#7DF9A6',
  fontSize: 13,
  fontFamily: 'Rajdhani, monospace',
  fontWeight: 500,
  marginRight: 2,
};

const buttonStyle = {
  background: 'rgba(76,198,116,0.15)',
  color: '#4CC674',
  border: 'none',
  borderRadius: 4,
  fontSize: 14,
  cursor: 'pointer',
  padding: '4px 8px',
  fontWeight: 700,
  transition: 'background 0.2s',
};



// Função para mover shape na ordem de camadas
function moveShapeLayer(id, direction) {
  // Ordena shapes por layer
  const ordered = [...shapes].sort((a, b) => a.layer - b.layer);
  const idx = ordered.findIndex(s => s.id === id);
  if (idx === -1) return;
  let targetIdx = direction === 'up' ? idx + 1 : idx - 1;
  if (targetIdx < 0 || targetIdx >= ordered.length) return;
  // Troca os layers
  const temp = ordered[idx].layer;
  ordered[idx].layer = ordered[targetIdx].layer;
  ordered[targetIdx].layer = temp;
  // Atualiza ambos
  onUpdateShape(ordered[idx].id, { ...ordered[idx] });
  onUpdateShape(ordered[targetIdx].id, { ...ordered[targetIdx] });
}

//    col 1               col 2
//   x    = (input)     y = (input)
// escala = (input)

// desfazer