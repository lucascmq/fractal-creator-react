// Painel lateral esquerdo: ações principais do editor
// Adicionar linha, adicionar forma, configurações
import React, { useState } from 'react';
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
  onSettingsChange = () => {}, 
  onClearAll = () => {}, 
  onResetView = () => {} 
}) {
  const [activeTab, setActiveTab] = useState('lines');

  // Handlers para adicionar elementos
  const handleAddLine = (line) => {
    onAddLine(line);
  };
  const handleAddShape = (shape) => {
    onAddShape(shape);
  };
  
  return (
    <aside className="fractal-aside left">
      <div className="editor-card">
        {/* Título centralizado */}
        <h3 style={{ textAlign: 'left', color: '#4CC674', marginBottom: 16 }}>Fractal Creator</h3>
        
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
        </div>
        <div className={`editor-tab-content ${activeTab === 'config' ? 'active' : ''}`}>
          <ConfigPanel 
            settings={settings} 
            onSettingsChange={onSettingsChange}
            onClearAll={onClearAll}
            onResetView={onResetView}
          />
        </div>
      </div>
    </aside>
  );
}
