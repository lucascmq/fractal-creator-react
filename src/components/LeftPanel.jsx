// Painel lateral esquerdo: ações principais do editor
// Adicionar linha, adicionar forma, configurações
import React, { useState, useRef, useEffect } from 'react';
import AddLinePanel from './AddLinePanel';
import AddShapePanel from './AddShapePanel';
import ConfigPanel from './ConfigPanel';

const TABS = [
  { key: 'lines', label: 'Linhas' },
  { key: 'shapes', label: 'Formas' },
  { key: 'config', label: 'Configurações' },
];

export default function LeftPanel({ 
  onAddLine, 
  onAddShape, 
  settings = {}, 
  onSettingsChange = () => {} 
}) {
  const [activeTab, setActiveTab] = useState('lines');
    // Ref para o container do painel
  const asideRef = useRef(null);

  // Função para dar foco ao painel quando input/slider perde foco (igual RightPanel)
  const handleInputBlur = () => {
    if (asideRef.current) {
      // Pequeno delay para evitar conflitos
      setTimeout(() => {
        asideRef.current.focus();
      }, 10);
    }
  };

  // Dar foco automático no painel para habilitar scroll
  useEffect(() => {
    if (asideRef.current) {
      asideRef.current.focus();
    }
  }, [activeTab]); // Refoca quando muda de aba// Handler robusto: controla scroll baseado no elemento sob o mouse (incluindo sliders)
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;    function wheelHandler(e) {
      const elementUnderMouse = e.target;
      const active = document.activeElement;      // Se o mouse está sobre um input (number/range) ou select, bloqueia scroll do container
      if (elementUnderMouse && 
          ((elementUnderMouse.tagName === 'INPUT' && (elementUnderMouse.type === 'number' || elementUnderMouse.type === 'range')) ||
           elementUnderMouse.tagName === 'SELECT')) {
        e.preventDefault(); // Bloqueia scroll do container
        return;
      }        // Se há um elemento range/number focado, deixa ele processar primeiro e depois bloqueia scroll do container
      if (active && active.tagName === 'INPUT' && (active.type === 'number' || active.type === 'range')) {
        e.stopPropagation(); // Impede que chegue ao container
        // NÃO fazemos preventDefault() aqui para deixar o onWheel do slider funcionar
        return;
      }
        // Se há um elemento focado e o mouse está sobre ele, bloqueia scroll do container
      if (active && 
          ((active.tagName === 'INPUT' && (active.type === 'number' || active.type === 'range')) || active.tagName === 'SELECT') && 
          elementUnderMouse === active) {
        e.stopPropagation(); // Impede que chegue ao container, mas deixa o elemento processar
        return;      }
      
      // Caso contrário, permite scroll normal do container
    }
    aside.addEventListener('wheel', wheelHandler, { passive: false });
    return () => aside.removeEventListener('wheel', wheelHandler);
  }, []);

  // Handlers para adicionar elementos
  const handleAddLine = (line) => {
    onAddLine(line);
  };
  const handleAddShape = (shape) => {
    onAddShape(shape);
  };
  return (
    <aside ref={asideRef} className="fractal-aside left" tabIndex="0" style={{ outline: 'none' }}>
      <div className="editor-card">        {/* Título centralizado */}
        <h3>Editor de Fractais</h3>
        
        {/* Tabs do editor no estilo do protótipo */}
        <div className="editor-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`editor-tab ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Conteúdos das abas */}
        <div className={`editor-tab-content ${activeTab === 'lines' ? 'active' : ''}`}>
          <AddLinePanel onAdd={handleAddLine} onCancel={() => {}} />
        </div>
        
        <div className={`editor-tab-content ${activeTab === 'shapes' ? 'active' : ''}`}>
          <AddShapePanel onAdd={handleAddShape} onCancel={() => {}} />
        </div>        <div className={`editor-tab-content ${activeTab === 'config' ? 'active' : ''}`}>
          <ConfigPanel 
            settings={settings} 
            onSettingsChange={onSettingsChange}
            onInputBlur={handleInputBlur}
          />
        </div>
      </div>
    </aside>
  );
}
