# 🔧 Guia do Desenvolvedor - Hooks

## Introdução

Este guia está direcionado para desenvolvedores que desejam usar, modificar ou estender os hooks customizados do Fractal Creator React.

---

## 🚀 Setup Rápido

### Instalação dos Hooks

Os hooks já estão incluídos no projeto. Para usar em novos componentes:

```jsx
// Importações necessárias
import { useFocusControl } from '../hooks/useFocusControl';
import { useKeyboardSelection } from '../hooks/useKeyboardSelection';
```

### Setup Básico

```jsx
function MeuComponente() {
  // Estado necessário
  const [isEditing, setIsEditing] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);
  const [sliderValue, setSliderValue] = useState(0.5);

  // Setup dos hooks
  const { opacitySliderRef, darkSliderRef } = useFocusControl({
    sliderValue,
    isEditingShape: isEditing
  });

  const { handleElementSelect, isElementSelected } = useKeyboardSelection({
    onClearSelection: () => setSelectedElements([]),
    onToggleElementSelection: (id, type) => {
      setSelectedElements(prev => {
        const exists = prev.find(el => el.id === id);
        if (exists) {
          return prev.filter(el => el.id !== id);
        } else {
          return [...prev, { id, type }];
        }
      });
    },
    isEditingShape: isEditing,
    selectedElements
  });

  return (/* JSX aqui */);
}
```

---

## 🎯 Casos de Uso Detalhados

### 1. Painel de Edição com Sliders

```jsx
import React, { useState } from 'react';
import { useFocusControl } from '../hooks/useFocusControl';

function PainelEdicaoAvancado({ shape, onUpdate, isActive }) {
  const [opacity, setOpacity] = useState(shape.opacity || 0.5);
  
  const { opacitySliderRef, darkSliderRef } = useFocusControl({
    sliderValue: opacity,
    isEditingShape: isActive
  });

  const handleOpacityChange = (value) => {
    setOpacity(value);
    onUpdate({ ...shape, opacity: value });
  };

  return (
    <div className="painel-edicao">
      <h3>Editando: {shape.name}</h3>
      
      {/* Slider principal que controla o foco */}
      <div>
        <label>Opacidade Principal:</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={opacity}
          onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Sliders que recebem foco automático */}
      <div>
        <label>Opacidade Detalhada:</label>
        <input
          type="range"
          ref={opacitySliderRef}
          min={0}
          max={1}
          step={0.001}
          value={opacity}
          onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
          className="slider-detalhado"
        />
      </div>

      <div>
        <label>Escuridão:</label>
        <input
          type="range"
          ref={darkSliderRef}
          min={0}
          max={1}
          step={0.001}
          value={1 - opacity}
          onChange={(e) => handleOpacityChange(1 - parseFloat(e.target.value))}
          className="slider-detalhado"
        />
      </div>
    </div>
  );
}
```

### 2. Lista de Elementos com Seleção Múltipla

```jsx
import React, { useState } from 'react';
import { useKeyboardSelection } from '../hooks/useKeyboardSelection';

function ListaElementos({ elementos, onUpdate, onDelete }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const { 
    keysPressed, 
    handleElementSelect, 
    isElementSelected 
  } = useKeyboardSelection({
    onClearSelection: () => setSelectedIds([]),
    onToggleElementSelection: (id, type) => {
      setSelectedIds(prev => {
        const index = prev.indexOf(id);
        if (index >= 0) {
          return prev.filter(elId => elId !== id);
        } else {
          return [...prev, id];
        }
      });
    },
    isEditingShape: isEditing,
    selectedElements: selectedIds.map(id => ({ id, type: 'element' }))
  });

  // Operações em lote
  const handleBulkDelete = () => {
    selectedIds.forEach(id => onDelete(id));
    setSelectedIds([]);
  };

  const handleBulkUpdate = (updates) => {
    selectedIds.forEach(id => onUpdate(id, updates));
  };

  return (
    <div className="lista-elementos">
      {/* Status de teclas */}
      <div className="status-bar">
        <span>Elementos: {elementos.length}</span>
        <span>Selecionados: {selectedIds.length}</span>
        {keysPressed.shift && <span className="key-indicator">SHIFT</span>}
        {keysPressed.ctrl && <span className="key-indicator">CTRL</span>}
      </div>

      {/* Controles de seleção múltipla */}
      {selectedIds.length > 0 && (
        <div className="bulk-controls">
          <button onClick={handleBulkDelete}>
            Deletar Selecionados ({selectedIds.length})
          </button>
          <button onClick={() => handleBulkUpdate({ visible: false })}>
            Ocultar Selecionados
          </button>
          <button onClick={() => setSelectedIds([])}>
            Limpar Seleção
          </button>
        </div>
      )}

      {/* Lista de elementos */}
      <div className="elementos-grid">
        {elementos.map(elemento => (
          <div
            key={elemento.id}
            className={`elemento-card ${isElementSelected(elemento.id) ? 'selected' : ''}`}
            onClick={(e) => handleElementSelect(elemento.id, 'element', e)}
          >
            <h4>{elemento.name}</h4>
            <p>Tipo: {elemento.type}</p>
            <p>Posição: ({elemento.x}, {elemento.y})</p>
            
            {/* Indicador visual de seleção */}
            {isElementSelected(elemento.id) && (
              <div className="selection-indicator">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Canvas Interativo Completo

```jsx
import React, { useState } from 'react';
import { Stage, Layer, Circle, Rect } from 'react-konva';
import { useFocusControl, useKeyboardSelection } from '../hooks';

function CanvasInterativo({ shapes, onUpdateShape, onSelectShape }) {
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const selectedShape = shapes.find(s => s.id === selectedShapeId);
  
  // Hook de foco para sliders de edição
  const { opacitySliderRef } = useFocusControl({
    sliderValue: selectedShape?.opacity || 0,
    isEditingShape: isEditing && selectedShapeId !== null
  });

  // Hook de seleção múltipla
  const { handleElementSelect } = useKeyboardSelection({
    onClearSelection: () => setSelectedShapeId(null),
    onToggleElementSelection: (id) => setSelectedShapeId(id),
    isEditingShape: isEditing,
    selectedElements: selectedShapeId ? [{ id: selectedShapeId, type: 'shape' }] : []
  });

  // Handler para clique nas formas
  const handleShapeClick = (shape, konvaEvent) => {
    setIsEditing(true);
    handleElementSelect(shape.id, 'shape', konvaEvent.evt);
    onSelectShape(shape.id);
  };

  // Handler para clique no stage (fundo)
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedShapeId(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="canvas-container">
      {/* Canvas principal */}
      <Stage 
        width={800} 
        height={600}
        onClick={handleStageClick}
      >
        <Layer>
          {shapes.map(shape => {
            const isSelected = shape.id === selectedShapeId;
            
            if (shape.type === 'circle') {
              return (
                <Circle
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  fill={shape.color}
                  opacity={shape.opacity}
                  stroke={isSelected ? '#FFD700' : 'transparent'}
                  strokeWidth={isSelected ? 3 : 0}
                  onClick={(e) => handleShapeClick(shape, e)}
                  draggable={isSelected}
                  onDragEnd={(e) => {
                    onUpdateShape(shape.id, {
                      x: e.target.x(),
                      y: e.target.y()
                    });
                  }}
                />
              );
            }
            
            return (
              <Rect
                key={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={shape.color}
                opacity={shape.opacity}
                stroke={isSelected ? '#FFD700' : 'transparent'}
                strokeWidth={isSelected ? 3 : 0}
                onClick={(e) => handleShapeClick(shape, e)}
                draggable={isSelected}
                onDragEnd={(e) => {
                  onUpdateShape(shape.id, {
                    x: e.target.x(),
                    y: e.target.y()
                  });
                }}
              />
            );
          })}
        </Layer>
      </Stage>

      {/* Painel de edição */}
      {selectedShape && isEditing && (
        <div className="edit-panel">
          <h3>Editando: {selectedShape.name}</h3>
          
          <div>
            <label>Opacidade:</label>
            <input
              type="range"
              ref={opacitySliderRef}
              min={0}
              max={1}
              step={0.01}
              value={selectedShape.opacity}
              onChange={(e) => onUpdateShape(selectedShape.id, {
                opacity: parseFloat(e.target.value)
              })}
            />
            <span>{selectedShape.opacity.toFixed(2)}</span>
          </div>

          <div>
            <label>Posição X:</label>
            <input
              type="number"
              value={selectedShape.x}
              onChange={(e) => onUpdateShape(selectedShape.id, {
                x: parseInt(e.target.value)
              })}
            />
          </div>

          <div>
            <label>Posição Y:</label>
            <input
              type="number"
              value={selectedShape.y}
              onChange={(e) => onUpdateShape(selectedShape.id, {
                y: parseInt(e.target.value)
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🔧 Customização Avançada

### Estendendo `useFocusControl`

```jsx
// Hook customizado estendido
function useExtendedFocusControl({ sliderValue, isEditingShape, customThresholds }) {
  const { opacitySliderRef, darkSliderRef } = useFocusControl({
    sliderValue,
    isEditingShape
  });

  // Lógica adicional
  useEffect(() => {
    if (customThresholds && isEditingShape) {
      const { low, high } = customThresholds;
      
      if (sliderValue <= low) {
        // Comportamento customizado para valores baixos
      } else if (sliderValue >= high) {
        // Comportamento customizado para valores altos
      }
    }
  }, [sliderValue, isEditingShape, customThresholds]);

  return { opacitySliderRef, darkSliderRef };
}
```

### Estendendo `useKeyboardSelection`

```jsx
// Hook com funcionalidades extras
function useAdvancedSelection({ 
  onClearSelection, 
  onToggleElementSelection, 
  isEditingShape,
  selectedElements,
  maxSelections = 10,
  enableDoubleClick = true
}) {
  const baseSelection = useKeyboardSelection({
    onClearSelection,
    onToggleElementSelection,
    isEditingShape,
    selectedElements
  });

  // Funcionalidade de duplo clique
  const [lastClick, setLastClick] = useState({ id: null, time: 0 });

  const handleAdvancedSelect = (id, type, event) => {
    const now = Date.now();
    
    // Verificar duplo clique
    if (enableDoubleClick && lastClick.id === id && now - lastClick.time < 300) {
      // Ação de duplo clique
      onEditElement?.(id);
      return;
    }
    
    // Verificar limite de seleções
    if (selectedElements.length >= maxSelections && !baseSelection.isElementSelected(id)) {
      alert(`Máximo de ${maxSelections} elementos podem ser selecionados`);
      return;
    }
    
    setLastClick({ id, time: now });
    baseSelection.handleElementSelect(id, type, event);
  };

  return {
    ...baseSelection,
    handleElementSelect: handleAdvancedSelect
  };
}
```

---

## 🧪 Debugging e Testes

### Debugging dos Hooks

```jsx
// Versão de debug do useFocusControl
function useDebugFocusControl(options) {
  const result = useFocusControl(options);
  
  useEffect(() => {
    console.group('🎯 Focus Control Debug');
    console.log('Slider Value:', options.sliderValue);
    console.log('Is Editing:', options.isEditingShape);
    console.log('Opacity Ref:', result.opacitySliderRef.current);
    console.log('Dark Ref:', result.darkSliderRef.current);
    console.groupEnd();
  }, [options.sliderValue, options.isEditingShape]);
  
  return result;
}

// Versão de debug do useKeyboardSelection
function useDebugKeyboardSelection(options) {
  const result = useKeyboardSelection(options);
  
  useEffect(() => {
    console.group('⌨️ Keyboard Selection Debug');
    console.log('Keys Pressed:', result.keysPressed);
    console.log('Selected Elements:', options.selectedElements);
    console.log('Is Editing:', options.isEditingShape);
    console.groupEnd();
  }, [result.keysPressed, options.selectedElements, options.isEditingShape]);
  
  return result;
}
```

### Testes Manuais

```jsx
// Componente de teste
function HookTester() {
  const [sliderValue, setSliderValue] = useState(0.5);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);

  // Usar versões de debug
  const focusControl = useDebugFocusControl({ sliderValue, isEditingShape: isEditing });
  const selection = useDebugKeyboardSelection({
    onClearSelection: () => setSelectedElements([]),
    onToggleElementSelection: (id, type) => {
      setSelectedElements(prev => {
        const exists = prev.find(el => el.id === id);
        return exists 
          ? prev.filter(el => el.id !== id)
          : [...prev, { id, type }];
      });
    },
    isEditingShape: isEditing,
    selectedElements
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Hook Tester</h2>
      
      {/* Controles de teste */}
      <div>
        <label>
          Slider Value: {sliderValue}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={sliderValue}
            onChange={(e) => setSliderValue(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={isEditing}
            onChange={(e) => setIsEditing(e.target.checked)}
          />
          Is Editing Mode
        </label>
      </div>

      {/* Elementos de teste */}
      <div>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            onClick={(e) => selection.handleElementSelect(`element-${id}`, 'test', e)}
            style={{
              margin: '5px',
              backgroundColor: selection.isElementSelected(`element-${id}`) ? 'lightblue' : 'white'
            }}
          >
            Element {id}
          </button>
        ))}
      </div>

      {/* Sliders de teste com foco */}
      <div>
        <input
          type="range"
          ref={focusControl.opacitySliderRef}
          min={0}
          max={1}
          step={0.01}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseFloat(e.target.value))}
          style={{ backgroundColor: 'rgba(255, 255, 0, 0.3)' }}
        />
        <label>Opacity Slider</label>
      </div>

      <div>
        <input
          type="range"
          ref={focusControl.darkSliderRef}
          min={0}
          max={1}
          step={0.01}
          value={1 - sliderValue}
          onChange={(e) => setSliderValue(1 - parseFloat(e.target.value))}
          style={{ backgroundColor: 'rgba(255, 0, 255, 0.3)' }}
        />
        <label>Dark Slider</label>
      </div>

      {/* Status */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Status:</h3>
        <p>Slider Value: {sliderValue}</p>
        <p>Is Editing: {isEditing.toString()}</p>
        <p>Selected Elements: {selectedElements.length}</p>
        <p>Keys Pressed: {JSON.stringify(selection.keysPressed)}</p>
      </div>
    </div>
  );
}
```

---

## 📚 Referências Adicionais

- **Código Fonte**: `src/hooks/`
- **Documentação Técnica**: `docs/HOOKS_TECHNICAL.md`
- **Documentação Geral**: `docs/HOOKS.md`
- **Exemplos de Uso**: `src/components/FractalCanvas.jsx`

---

📝 **Guia do Desenvolvedor v1.0**  
📅 **Última atualização:** 15 de junho de 2025  
👨‍💻 **Desenvolvido por:** Lucas Camargo
