import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import FractalCanvas from './components/FractalCanvas';
import React, { useState, useEffect } from 'react';
import './App.css';
import { createGroup, deleteGroup, addChildToGroup, removeChildFromGroup, createGroupFromSelection } from './utils/GroupManager';

function App() {  // Estados globais para linhas e formas
  const [lines, setLines] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [groups, setGroups] = useState([]); // Estado para grupos
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]); // Estado para seleção múltipla
  
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
    if (newParams === null) {
      setLines(prev => prev.filter(line => line.id !== id));
    } else {
      setLines(prev => prev.map(line => line.id === id ? { ...line, ...newParams } : line));
    }
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
  };

  // Funções para manipulação de grupos
  
  // Cria um novo grupo vazio
  const handleCreateGroup = (options = {}) => {
    const newGroup = createGroup(options);
    setGroups(prev => [...prev, newGroup]);
    return newGroup.id; // Retorna o ID do grupo criado
  };
  
  // Cria um grupo a partir de elementos selecionados
  const handleCreateGroupFromSelection = (selectedIds, options = {}) => {
    // Obtém os elementos correspondentes aos IDs selecionados
    const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));
    const selectedLines = lines.filter(line => selectedIds.includes(line.id));
    const selectedElements = [...selectedShapes, ...selectedLines];
    
    if (selectedElements.length === 0) return null;
    
    const newGroup = createGroupFromSelection(selectedElements, options);
    setGroups(prev => [...prev, newGroup]);
    return newGroup.id;
  };
  
  // Remove um grupo
  const handleDeleteGroup = (groupId, orphanChildren = true) => {
    const { groups: updatedGroups, affectedElements } = deleteGroup(groups, groupId, orphanChildren);
    setGroups(updatedGroups);
    return affectedElements; // Retorna os IDs dos elementos afetados
  };
  
  // Adiciona elementos a um grupo
  const handleAddToGroup = (groupId, elementIds) => {
    setGroups(prev => addChildToGroup(prev, groupId, elementIds));
  };
  
  // Remove elementos de um grupo
  const handleRemoveFromGroup = (groupId, elementId) => {
    setGroups(prev => removeChildFromGroup(prev, groupId, elementId));
  };

  // Atualiza propriedades de um grupo
  const handleUpdateGroup = (groupId, newParams) => {
    setGroups(prev => prev.map(group => group.id === groupId ? { ...group, ...newParams } : group));
  };

    // Alterna a seleção de um elemento
  const handleToggleElementSelection = (elementId, elementType) => {
    setSelectedElements(prev => {
      const isSelected = prev.some(el => el.id === elementId);
      if (isSelected) {
        return prev.filter(el => el.id !== elementId);
      } else {
        return [...prev, { id: elementId, type: elementType }];
      }
    });
  };
  
  // Limpa a seleção atual
  const handleClearSelection = () => {
    setSelectedElements([]);
  };

  // Garante que todas as shapes tenham layer ao inicializar (boa prática para retrocompatibilidade)
  useEffect(() => {
    setShapes(prev => prev.map((s, i) =>
      s.layer === undefined ? { ...s, layer: i } : s    ));
    
    // Garante que a seleção múltipla comece vazia
    setSelectedElements([]);
  }, []);

  // Expor handleAddLine, handleAddShape e handleAddGroup globalmente para uso no RightPanel
  React.useEffect(() => {
    window.handleAddLine = handleAddLine;
    window.handleAddShape = handleAddShape;
    window.handleAddGroup = (group) => setGroups(prev => [...prev, group]);
    return () => {
      window.handleAddLine = undefined;
      window.handleAddShape = undefined;
      window.handleAddGroup = undefined;
    };
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
          />
        </aside>
        <main className="canvas-column">
          <FractalCanvas 
            lines={lines} 
            shapes={shapes}
            groups={groups}
            settings={settings}
            onUpdateShape={handleUpdateShape}
            onUpdateLine={handleUpdateLine} // <--- Adicionado!
            selectedShapeId={selectedShapeId}
            setSelectedShapeId={setSelectedShapeId}
            isEditingShape={isEditingShape}
            setIsEditingShape={setIsEditingShape}
            selectedElements={selectedElements}
            onToggleElementSelection={handleToggleElementSelection}
            onClearSelection={handleClearSelection}
          />
        </main>
        <aside className="editor-column" tabIndex="0">
          <RightPanel
            lines={lines}
            shapes={shapes}
            groups={groups}
            onUpdateLine={handleUpdateLine}
            onUpdateShape={handleUpdateShape}
            onDeleteLine={handleDeleteLine}
            onDeleteShape={handleDeleteShape}
            selectedShapeId={selectedShapeId}
            selectedElements={selectedElements}
            onToggleElementSelection={handleToggleElementSelection}
            onCreateGroup={handleCreateGroupFromSelection}
            onDeleteGroup={handleDeleteGroup}
            onAddToGroup={handleAddToGroup}
            onRemoveFromGroup={handleRemoveFromGroup}
            onUpdateGroup={handleUpdateGroup}
          />
        </aside>
      </div>
    </>
  );
}

export default App;
