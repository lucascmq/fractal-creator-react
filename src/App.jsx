import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import FractalCanvas from './components/FractalCanvas';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estados globais para linhas e formas
  const [lines, setLines] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [groups, setGroups] = useState([]); // Estado para grupos (ainda não usado)
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [localShapes, setLocalShapes] = useState([]);
  
  // Estado para controlar quando estamos editando e desabilitar scroll da página
  const [isEditingShape, setIsEditingShape] = useState(false);
  
  // Estado para as configurações
  const [settings, setSettings] = useState({
    showGrid: true, // grid ligado por padrão
    gridDivisions: 4, // divisão padrão
    snapToGrid: false,
    autoCalculateSlope: true,
    showCenterText: false, // texto central desativado
    showGuideGrid: false,
    gridSize: 20,
    guideGridSize: 125,
    centerText: '' // frase central vazia
  });

  // Efeito para controlar scroll da página durante edição
  useEffect(() => {
    if (isEditingShape) {
      document.body.classList.add('editing-mode');
    } else {
      document.body.classList.remove('editing-mode');
    }
    
    // Cleanup ao desmontar componente
    return () => document.body.classList.remove('editing-mode');
  }, [isEditingShape]);

  // Efeito para aplicar as configurações
  useEffect(() => {
    // Aqui você pode adicionar lógica para atualizar o canvas 
    // baseado nas configurações atualizadas
    
    // Exemplo: Mostrar ou esconder o texto central
    const centerText = document.querySelector('.quote-text');
    if (centerText) {
      if (settings.showCenterText) {
        centerText.classList.remove('hidden');
      } else {
        centerText.classList.add('hidden');
      }
    }
    
    // Outras atualizações podem ser adicionadas aqui
    
  }, [settings]);

  // Adiciona uma linha ao estado global
  const handleAddLine = (line) => {
    setLines(prev => [
      ...prev,
      { id: Date.now() + Math.random(), ...line }
    ]);
  };

  // Adiciona uma forma ao estado global
  const handleAddShape = (shape) => {
    setShapes(prev => {
      // Define o próximo valor de layer (boa prática: sempre maior que o atual)
      const nextLayer = prev.length > 0 ? Math.max(...prev.map(s => s.layer ?? 0)) + 1 : 0;
      return [
        ...prev,
        { id: Date.now() + Math.random(), layer: nextLayer, ...shape }
      ];
    });
  };

  // Handler para atualizar as configurações
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  // Funções para atualizar elementos (placeholders)
  const handleUpdateLine = (id, newParams) => {
    setLines(prev => prev.map(line => line.id === id ? { ...line, ...newParams } : line));
  };
  const handleUpdateShape = (id, newParams) => {
    setShapes(prev => prev.map(shape => shape.id === id ? { ...shape, ...newParams } : shape));
  };
  // Remove uma linha
  const handleDeleteLine = (id) => {
    setLines(prev => prev.filter(line => line.id !== id));
  };
  // Remove uma forma
  const handleDeleteShape = (id) => {
    setShapes(prev => prev.filter(shape => shape.id !== id));
  };

  // Limpar todas as formas e linhas
  const handleClearAll = () => {
    setLines([]);
    setShapes([]);
  };

  // Resetar a visualização (zoom, pan, etc.)
  const handleResetView = () => {
    // Implementar lógica de reset quando necessário
    console.log('Resetando visualização');
  };

  // Garante que todas as shapes tenham layer ao inicializar (boa prática para retrocompatibilidade)
  useEffect(() => {
    setShapes(prev => prev.map((s, i) =>
      s.layer === undefined ? { ...s, layer: i } : s
    ));
  }, []);

  return (
    <>
      <header className="design-header">
        <h1>FRACTAL CREATOR</h1>
        <p><span className="quote">"Criado com matemática precisa, ímpeto e muito amor ♥"</span> - por Lucas Camargo</p>
      </header>
      <div className="main-content-wrapper">
        <aside className="editor-column">
          <LeftPanel 
            onAddLine={handleAddLine} 
            onAddShape={handleAddShape} 
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onClearAll={handleClearAll}
            onResetView={handleResetView}
          />
        </aside>
        <main className="canvas-column">
          <FractalCanvas 
            lines={lines} 
            shapes={shapes}
            settings={settings}
            onUpdateShape={handleUpdateShape}
            selectedShapeId={selectedShapeId}
            setSelectedShapeId={setSelectedShapeId}
            isEditingShape={isEditingShape}
            setIsEditingShape={setIsEditingShape}
          />
        </main>
        <aside className="editor-column" tabIndex="0">
          <RightPanel
            lines={lines}
            shapes={shapes}
            onUpdateLine={handleUpdateLine}
            onUpdateShape={handleUpdateShape}
            onDeleteLine={handleDeleteLine}
            onDeleteShape={handleDeleteShape}
            selectedShapeId={selectedShapeId}
          />
        </aside>
      </div>
    </>
  );
}

export default App;
