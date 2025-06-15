// Painel lateral direito: lista de elementos criados (linhas e formas)
// Permite editar parâmetros de cada elemento
import React, { useState, useEffect, useRef } from 'react';
import GroupNameEditor from './GroupNameEditor';
import LineNameEditor from './LineNameEditor';

export default function RightPanel({ 
  lines, 
  shapes, 
  groups = [], // Adiciona grupos como prop
  onUpdateLine, 
  onUpdateShape, 
  onDeleteLine, 
  onDeleteShape, 
  selectedShapeId, 
  selectedElements = [], // Adiciona selectedElements como prop
  onToggleElementSelection = () => {}, // Função para alternar seleção
  onCreateGroup = () => {}, // Função para criar grupo
  onDeleteGroup = () => {}, // Função para deletar grupo
  onAddToGroup = () => {}, // Função para adicionar ao grupo
  onRemoveFromGroup = () => {}, // Função para remover do grupo
  onClearSelection = () => {}, // Função para limpar seleção
  onRenameGroup, // Para renomear grupo
  onRenameShape // Para renomear forma
}) {
  // Estado local para o Auto Y de cada linha
  const [autoY, setAutoY] = useState({});
  // Estado para mostrar ou esconder a seção de grupos
  const [showGroups, setShowGroups] = useState(true);
  // Estado para alternar entre modo Opacity e Dark
  const [opacityMode, setOpacityMode] = useState(true);
  
  // Ref para o container do painel
  const asideRef = useRef(null);
    // Dar foco automático no painel quando há elementos suficientes para scroll
  useEffect(() => {
    const totalElements = lines.length + shapes.length;
    if (totalElements >= 2 && asideRef.current) {
      asideRef.current.focus();
    }
  }, [lines.length, shapes.length]);
  
  // Função para retornar foco ao painel quando input perde foco
  const handleInputBlur = () => {
    const totalElements = lines.length + shapes.length;
    if (totalElements >= 2 && asideRef.current) {
      // Pequeno delay para evitar conflitos
      setTimeout(() => {
        asideRef.current.focus();
      }, 10);
    }
  };
  
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
    }  }, [selectedShapeId]);  // Handler robusto: controla scroll baseado no elemento sob o mouse
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    function wheelHandler(e) {
      const elementUnderMouse = e.target;
      const active = document.activeElement;
        // Se o mouse está sobre um input (number/range), bloqueia scroll do container mas deixa o input processar
      if (elementUnderMouse && elementUnderMouse.tagName === 'INPUT' && 
          (elementUnderMouse.type === 'number' || elementUnderMouse.type === 'range')) {
        e.stopPropagation(); // Impede que chegue ao container, mas deixa o input processar
        return;
      }
      
      // Se há um input focado e o mouse está sobre ele, bloqueia scroll do container
      if (active && active.tagName === 'INPUT' && 
          (active.type === 'number' || active.type === 'range') && 
          elementUnderMouse === active) {
        e.stopPropagation(); // Impede que chegue ao container, mas deixa o input processar
        return;
      }
      
      // Caso contrário, permite scroll normal do container
    }
    aside.addEventListener('wheel', wheelHandler, { passive: false });
    return () => aside.removeEventListener('wheel', wheelHandler);
  }, []);
  // Handler para criar um grupo a partir da seleção atual
  const handleCreateGroupFromSelection = () => {
    if (selectedElements.length < 1) return;
    const selectedIds = selectedElements.map(elem => elem.id);
    onCreateGroup(selectedIds);
    onClearSelection(); // Limpa a seleção após criar o grupo
  };
  
  // Verificar se um elemento está selecionado
  const isElementSelected = (id) => {
    return selectedElements.some(elem => elem.id === id);
  };
  
  // Alternar seleção de um elemento
  const handleToggleSelection = (id, type) => {
    onToggleElementSelection(id, type);
  };
  
  // Excluir um grupo
  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo? Os elementos serão mantidos.')) {
      onDeleteGroup(groupId, true); // true = manter elementos
    }
  };

  // Estilo para destacar elementos selecionados
  const getSelectionStyle = (id) => {
    return isElementSelected(id) ? { 
      outline: '2px solid #4CC674', 
      outlineOffset: '2px',
      backgroundColor: 'rgba(76, 198, 116, 0.1)' 
    } : {};
  };

  // IDs de todos os elementos agrupados (garante que são IDs puros)
  const groupedElementIds = groups.flatMap(g => g.children.map(child => typeof child === 'object' ? child.id : child));
  // Filtra seleção para considerar apenas elementos não agrupados
  const selectableElements = selectedElements.filter(el => !groupedElementIds.includes(el.id));
  // Linhas e formas não agrupadas
  const ungroupedLines = lines.filter(line => !groupedElementIds.includes(line.id));
  const ungroupedShapes = shapes.filter(shape => !groupedElementIds.includes(shape.id));

  // NOVO: linha selecionada para painel de propriedades
  const selectedLine = selectedElements.find(el => el.type === 'line')
    ? lines.find(l => l.id === selectedElements.find(el => el.type === 'line').id)
    : null;

  // Função para renderizar uma linha (com todos os controles)
  function renderLine(line, idx) {
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    const slope = dx !== 0 ? (dy / dx) : null;
    return (
      <div 
        key={line.id} 
        style={{
          ...itemStyle,
          ...getSelectionStyle(line.id),
          maxWidth: '96%', // Aumentado para 96%
          margin: '0 auto 8px auto',
          boxSizing: 'border-box',
        }}
        onClick={() => handleToggleSelection(line.id, 'line')}
      >
        {/* Painel de propriedades da linha, se selecionada */}
        {/* REMOVIDO: LinePropertiesBox do RightPanel, pois agora é flutuante no canvas */}
        <LineNameEditor
          name={line.name || `Linha ${idx + 1}`}
          onRename={newName => onUpdateLine(line.id, { ...line, name: newName })}
          style={{ fontSize: 24, fontWeight: 700, color: '#4CC674', width: '100%', textAlign: 'center', marginTop: 2, padding: 12, background: 'transparent', border: 'none' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 8px 0' }}>
          <input type="checkbox" checked={!!autoY[line.id]} onChange={() => toggleAutoY(line.id)} />
          <span style={{ color: '#7DF9A6', fontSize: 12 }}>Auto Y</span>
          <span style={{ color: '#7DF9A6', fontSize: 11, marginLeft: 8 }}>Slope: {slope === null ? 'Vertical' : slope.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={labelStyle}>x1 =</span>
            <input type="number" value={line.x1} min={-250} max={250} onChange={e => handleLineInput(line.id, 'x1', e.target.value, line)} style={inputStyle} 
              onWheel={e => {
                const step = 1;
                const dir = e.deltaY < 0 ? 1 : -1;
                handleLineInput(line.id, 'x1', Number(line.x1) + dir * step, line);
              }} 
              onBlur={handleInputBlur} 
            />
            <span style={labelStyle}>y1 =</span>
            <input type="number" value={line.y1} min={-250} max={250} onChange={e => handleLineInput(line.id, 'y1', e.target.value, line)} style={inputStyle} 
              onWheel={e => {
                const step = 1;
                const dir = e.deltaY < 0 ? 1 : -1;
                handleLineInput(line.id, 'y1', Number(line.y1) + dir * step, line);
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={labelStyle}>x2 =</span>
            <input type="number" value={line.x2} min={-250} max={250} onChange={e => handleLineInput(line.id, 'x2', e.target.value, line)} style={inputStyle} 
              onWheel={e => {
                const step = 1;
                const dir = e.deltaY < 0 ? 1 : -1;
                handleLineInput(line.id, 'x2', Number(line.x2) + dir * step, line);
              }}
            />
            <span style={labelStyle}>y2 =</span>
            <input type="number" value={line.y2} min={-250} max={250} onChange={e => handleLineInput(line.id, 'y2', e.target.value, line)} style={inputStyle} 
              onWheel={e => {
                const step = 1;
                const dir = e.deltaY < 0 ? 1 : -1;
                handleLineInput(line.id, 'y2', Number(line.y2) + dir * step, line);
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <button onClick={() => onDeleteLine(line.id)} style={deleteBtnSmallStyle}>
            <span role="img" aria-label="lixeira" style={{ marginRight: 2, fontSize: 14 }}>🗑️</span>Deletar
          </button>
        </div>
      </div>
    );
  }
  // Nova versão do renderShape: mais simples, só com o essencial e pronto para receber o novo controle
  function renderShape(shape, idx) {
    return (
      <div
        key={shape.id}
        style={{
          ...itemStyle,
          ...getSelectionStyle(shape.id),
          minHeight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 220, // Aumenta para ~1.8x o tamanho anterior
          minWidth: 220, // Garante largura mínima igual
          margin: '0 auto 8px auto',
          boxSizing: 'border-box',
        }}
        onClick={() => handleToggleSelection(shape.id, 'shape')}
      >
        {/* Cabeçalho da forma */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: '#4CC674', fontWeight: 700 }}>
            <GroupNameEditor
              name={shape.name || (shape.type.charAt(0).toUpperCase() + shape.type.slice(1) + ' ' + (idx + 1))}
              onRename={newName => handleRenameShape(shape.id, newName)}
              style={{ fontSize: 15, fontWeight: 700, color: '#4CC674', background: 'transparent', border: 'none', padding: 0, minWidth: 0 }}
            />
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', justifyContent: 'space-between' }}>
            {/* Coluna 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, alignItems: 'center' }}>
              <label style={{ ...labelStyle, marginBottom: 2 }}>X</label>
              <input type="number" value={shape.x || 0} onChange={e => onUpdateShape(shape.id, { ...shape, x: Number(e.target.value) })} style={{ ...inputStyle, width: 38 }} onWheel={e => { e.stopPropagation(); }} onBlur={handleInputBlur} />
              <label style={{ ...labelStyle, margin: '8px 0 2px 0' }}>Escala</label>
              <input type="number" min="1" max="5" step="1" value={shape.scale || 1} onChange={e => onUpdateShape(shape.id, { ...shape, scale: Number(e.target.value) })} style={{ ...inputStyle, width: 38 }} onWheel={e => { e.stopPropagation(); }} />
            </div>
            {/* Coluna 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, alignItems: 'center' }}>
              <label style={{ ...labelStyle, marginBottom: 2 }}>Y</label>
              <input type="number" value={shape.y || 0} onChange={e => onUpdateShape(shape.id, { ...shape, y: Number(e.target.value) })} style={{ ...inputStyle, width: 38 }} onWheel={e => { e.stopPropagation(); }} />
              <label style={{ ...labelStyle, margin: '8px 0 2px 0' }}>Girar</label>
              <input type="number" min="0" max="359" step="15" value={shape.rotation || 0} onChange={e => onUpdateShape(shape.id, { ...shape, rotation: Number(e.target.value) })} style={{ ...inputStyle, width: 38 }} onWheel={e => { e.stopPropagation(); }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <button onClick={() => onDeleteShape(shape.id)} style={deleteBtnSmallStyle}>
            <span role="img" aria-label="lixeira" style={{ marginRight: 2, fontSize: 14 }}>🗑️</span>Deletar
          </button>
        </div>
      </div>
    );
  }

  // Handler para renomear grupo
  const handleRenameGroup = (groupId, newName) => {
    if (typeof onRenameGroup === 'function') {
      onRenameGroup(groupId, newName);
    } else {
      // fallback: atualiza localmente se não vier prop do App
      const idx = groups.findIndex(g => g.id === groupId);
      if (idx !== -1) {
        groups[idx].name = newName;
      }
    }
  };

  // Handler para renomear forma
  const handleRenameShape = (shapeId, newName) => {
    if (typeof onRenameShape === 'function') {
      onRenameShape(shapeId, newName);
    } else {
      // fallback: atualiza localmente se não vier prop do App
      const idx = shapes.findIndex(s => s.id === shapeId);
      if (idx !== -1) {
        shapes[idx].name = newName;
      }
    }
  };

  // Função para duplicar grupo no centro (0,0)
  const handleDuplicateGroup = (group) => {
    if (!group) return;
    // Duplicar shapes e lines do grupo
    const newIdsMap = {};
    // 1. Duplicar shapes
    const groupShapes = group.children.map(id => shapes.find(s => s.id === id)).filter(Boolean);
    const groupLines = group.children.map(id => lines.find(l => l.id === id)).filter(Boolean);
    // Calcula centro do grupo
    const allX = groupShapes.map(s => s.x).concat(groupLines.map(l => (l.x1 + l.x2) / 2));
    const allY = groupShapes.map(s => s.y).concat(groupLines.map(l => (l.y1 + l.y2) / 2));
    const cx = allX.length ? allX.reduce((a, b) => a + b, 0) / allX.length : 0;
    const cy = allY.length ? allY.reduce((a, b) => a + b, 0) / allY.length : 0;
    // 2. Duplicar shapes centralizando no (0,0)
    const newShapeObjs = groupShapes.map(orig => {
      const newId = Date.now() + Math.random();
      newIdsMap[orig.id] = newId;
      return {
        ...orig,
        id: newId,
        x: (orig.x - cx),
        y: (orig.y - cy),
        name: orig.name ? orig.name + ' (cópia)' : undefined
      };
    });
    // 3. Duplicar lines centralizando no (0,0)
    const newLineObjs = groupLines.map(orig => {
      const newId = Date.now() + Math.random();
      newIdsMap[orig.id] = newId;
      return {
        ...orig,
        id: newId,
        x1: (orig.x1 - cx),
        y1: (orig.y1 - cy),
        x2: (orig.x2 - cx),
        y2: (orig.y2 - cy),
        name: orig.name ? orig.name + ' (cópia)' : undefined
      };
    });
    // 4. Adiciona shapes/lines duplicados
    if (typeof window.handleAddLine === 'function') {
      newLineObjs.forEach(l => window.handleAddLine(l));
    }
    if (typeof window.handleAddShape === 'function') {
      newShapeObjs.forEach(s => window.handleAddShape(s));
    }
    // 5. Cria novo grupo com os novos IDs
    const newGroup = {
      ...group,
      id: 'group-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: group.name + ' (cópia)',
      children: [...newShapeObjs, ...newLineObjs].map(e => e.id),
      createdAt: Date.now(),
    };
    if (typeof window.handleAddGroup === 'function') {
      window.handleAddGroup(newGroup);
    }
  };

  return (
    <aside ref={asideRef} style={{ 
      ...panelStyle, 
      opacity: showGroups ? 1 : 0.7, 
      pointerEvents: showGroups ? 'auto' : 'none',
      transition: 'opacity 0.3s, pointer-events 0.3s',
      maxWidth: '96%', // Aumentado para 96%
      margin: '0 auto',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 12px',
        borderBottom: '1px solid #4CC674',
        maxWidth: '96%', // Aumentado para 96%
        margin: '0 auto',
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: 16, 
          color: '#4CC674', 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>⚙️</span>
          Painel de Controle
        </h2>
        <button onClick={() => setShowGroups(prev => !prev)} style={{
          ...buttonStyle,
          marginLeft: 8,
          padding: '6px 12px',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {showGroups ? 'Ocultar Grupos' : 'Mostrar Grupos'}
          <span style={{ fontSize: 16, transform: showGroups ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}>▼</span>
        </button>
      </div>
      {showGroups && (
        <div style={{ 
          ...groupSectionStyle, 
          maxHeight: showGroups ? 420 : 0,
          opacity: showGroups ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out, opacity 0.3s ease-out',
          maxWidth: '96%',
          margin: '10px 10px',
          padding: '6px 6px', // Reduzido
        }}>
          <div style={{ padding: '6px 8px', borderBottom: '1px solid #4CC674' }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: 18, 
              color: '#4CC674', 
              fontWeight: 700,
            }}>
              Grupos
            </h3>
          </div>
          {/* Seção de grupos */}
          <div className="grupos-scroll" style={{
            padding: '6px 8px 24px', // Reduzido
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            maxHeight: '400px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}>
            {groups.length === 0 && (
              <span style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>
                Nenhum grupo criado ainda.
              </span>
            )}
            {groups.map((group, idx) => (
              <div key={group.id} style={{ 
                ...groupItemStyle, 
                backgroundColor: idx % 2 === 0 ? 'rgba(76, 198, 116, 0.1)' : undefined, // Usar só backgroundColor
                borderColor: idx % 2 === 0 ? 'transparent' : '#4CC67433',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 0 }}>
                  <span style={{ 
                    color: '#4CC674', 
                    fontWeight: 700, 
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <span style={{ fontSize: 18 }}>👤</span>
                    <GroupNameEditor name={group.name} onRename={newName => handleRenameGroup(group.id, newName)} />
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => handleDeleteGroup(group.id)} style={{
                      ...deleteBtnSmallStyle,
                      padding: '4px 8px',
                      fontSize: 13,
                      marginLeft: 8,
                    }}>
                      <span role="img" aria-label="lixeira" style={{ marginRight: 2, fontSize: 14 }}>🗑️</span>
                      Excluir
                    </button>
                    <button
                      onClick={() => handleDuplicateGroup(group)}
                      style={{
                        ...deleteBtnSmallStyle,
                        background: 'rgba(76,198,116,0.18)',
                        color: '#63B3ED',
                        marginLeft: 8,
                      }}
                      title="Duplicar grupo no centro (0,0)"
                    >
                      <span role="img" aria-label="duplicar" style={{ marginRight: 2, fontSize: 14 }}>📄</span>
                      Duplicar
                    </button>
                  </div>
                </div>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '8px',
                  marginTop: 8,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  maxWidth: '100%'
                  // justifyContent removido para alinhar à esquerda
                }}>
                  {group.children.map(childId => {
                    const line = lines.find(line => line.id === childId);
                    if (line) return renderLine(line, 0);
                    const shape = shapes.find(shape => shape.id === childId);
                    if (shape) return renderShape(shape, 0);
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Botão de criar grupo sempre visível, fora da div de grupos */}
      <div style={{ padding: '10px 12px' }}>
        <button 
          onClick={handleCreateGroupFromSelection}
          disabled={selectableElements.length === 0}
          style={{ 
            width: '100%', 
            padding: '8px', 
            backgroundColor: selectableElements.length ? '#4CC674' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectableElements.length ? 'pointer' : 'not-allowed',
            marginTop: '8px',
            opacity: selectableElements.length ? 1 : 0.7
          }}
        >
          Criar Grupo {selectableElements.length > 0 ? `(${selectableElements.length} selecionados)` : '(Selecione elementos)'}
        </button>
      </div>
      <div style={{ 
        padding: '10px 12px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8 
      }}>
      </div>
      {/* Linhas não agrupadas */}
      <div>
        <h4 style={{ color: '#7DF9A6', marginBottom: 8 }}>Linhas</h4>
        {ungroupedLines.length === 0 && <p style={{ color: '#888' }}>Nenhuma linha criada.</p>}
        {ungroupedLines.map(renderLine)}
      </div>
      {/* Formas não agrupadas */}
      <div>
        <h4 style={{ color: '#7DF9A6', marginBottom: 8 }}>Formas</h4>
        {ungroupedShapes.length === 0 && <p style={{ color: '#888' }}>Nenhuma forma criada.</p>}
        {ungroupedShapes.map(renderShape)}
      </div>
    </aside>
  );
}

const itemStyle = {
  backgroundColor: 'rgba(76,198,116,0.05)',
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

const panelStyle = {
  background: 'rgba(0,0,0,0.8)',
  color: '#fff',
  width: 300,
  padding: 0,
  borderRadius: '8px 0 0 8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  display: 'flex',
  flexDirection: 'column',
};

const groupSectionStyle = {
  background: 'rgba(76,198,116,0.1)',
  // borderTop: '1px solid #4CC674',
  borderRadius: '0 0 8px 8px',
  padding: '10px 12px',
  marginTop: -8,
};

const groupItemStyle = {
  background: 'rgba(76,198,116,0.05)',
  border: '1px solid #4CC67433',
  borderRadius: 6,
  padding: 10,
  marginBottom: 8,
};




//    col 1               col 2
//   x    = (input)     y = (input)
// escala = (input)

// desfazer