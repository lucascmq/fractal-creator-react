# 🎣 Documentação dos Hooks Customizados

Este documento detalha todos os hooks customizados desenvolvidos para o Fractal Creator React.

## 📋 Índice
- [useFocusControl](#usefocuscontrol)
- [useKeyboardSelection](#usekeyboardselection)
- [Exemplos de Uso](#exemplos-de-uso)
- [Boas Práticas](#boas-práticas)

---

## `useFocusControl`

### 📝 **Descrição**
Hook responsável por gerenciar o foco entre elementos de interface (principalmente sliders) para navegação via teclado. Permite que o usuário navegue entre controles usando as setas do teclado.

### 📍 **Localização**
`src/hooks/useFocusControl.js`

### 🔧 **API**

```javascript
const { sliderRefs } = useFocusControl();
```

#### **Retorno**
- `sliderRefs` (Object): Objeto contendo referências para diferentes tipos de sliders

```javascript
{
  opacity: RefObject,      // Ref para slider de opacidade
  rotation: RefObject,     // Ref para slider de rotação  
  scale: RefObject,        // Ref para slider de escala
  x: RefObject,           // Ref para input X
  y: RefObject,           // Ref para input Y
  maskOpacity: RefObject  // Ref para slider de opacidade de máscara
}
```

### ⌨️ **Funcionalidades**
- **Navegação por Setas:** ↑↓ para navegar entre sliders
- **Auto-foco:** Foca automaticamente no primeiro elemento disponível
- **Detecção Inteligente:** Ignora elementos não visíveis ou desabilitados
- **Ciclo Infinito:** Navegação circular (último → primeiro)

### 💡 **Como Usar**

```jsx
import { useFocusControl } from '../hooks/useFocusControl';

function ComponenteComSliders() {
  const { sliderRefs } = useFocusControl();
  
  return (
    <div>
      <input 
        type="range" 
        ref={sliderRefs.opacity}
        min={0} 
        max={1} 
        step={0.1}
      />
      <input 
        type="range" 
        ref={sliderRefs.rotation}
        min={0} 
        max={360} 
        step={15}
      />
    </div>
  );
}
```

### 🎯 **Casos de Uso**
- ✅ Painéis de edição com múltiplos sliders
- ✅ Formulários com navegação via teclado
- ✅ Interfaces de configuração
- ❌ Elementos não relacionados (botões, texto)

---

## `useKeyboardSelection`

### 📝 **Descrição**
Hook que implementa seleção múltipla de elementos via Ctrl+clique e gerenciamento do estado de seleção. Fundamental para operações em lote e edição simultânea.

### 📍 **Localização**
`src/hooks/useKeyboardSelection.js`

### 🔧 **API**

```javascript
const { 
  selectedElements, 
  handleElementSelect, 
  clearSelection,
  isSelected 
} = useKeyboardSelection();
```

#### **Retorno**
- `selectedElements` (Array): Lista de elementos selecionados
- `handleElementSelect` (Function): Função para selecionar/deselecionar elemento
- `clearSelection` (Function): Limpa toda a seleção
- `isSelected` (Function): Verifica se um elemento está selecionado

#### **Tipos de Dados**

```javascript
// selectedElements
[
  { id: 'element-1', type: 'shape' },
  { id: 'element-2', type: 'line' },
  // ...
]

// handleElementSelect(elementId, elementType, event)
handleElementSelect('shape-123', 'shape', mouseEvent);

// isSelected(elementId)
const selected = isSelected('shape-123'); // boolean
```

### ⌨️ **Funcionalidades**
- **Ctrl+Clique:** Adiciona/remove elementos da seleção
- **Clique Normal:** Substitui seleção atual
- **Detecção de Teclas:** Monitora tecla Ctrl automaticamente
- **Estado Persistente:** Mantém seleção entre re-renders
- **Tipagem Flexível:** Suporta diferentes tipos de elementos

### 💡 **Como Usar**

```jsx
import { useKeyboardSelection } from '../hooks/useKeyboardSelection';

function ComponenteComSelecao() {
  const { 
    selectedElements, 
    handleElementSelect, 
    clearSelection,
    isSelected 
  } = useKeyboardSelection();
  
  const handleShapeClick = (shapeId, event) => {
    handleElementSelect(shapeId, 'shape', event);
  };
  
  return (
    <div>
      {shapes.map(shape => (
        <div 
          key={shape.id}
          onClick={(e) => handleShapeClick(shape.id, e)}
          className={isSelected(shape.id) ? 'selected' : ''}
        >
          {shape.name}
        </div>
      ))}
      
      <button onClick={clearSelection}>
        Limpar Seleção ({selectedElements.length})
      </button>
    </div>
  );
}
```

### 🎯 **Casos de Uso**
- ✅ Seleção múltipla de formas no canvas
- ✅ Operações em lote (deletar, mover, agrupar)
- ✅ Interfaces de lista com seleção
- ❌ Seleção única simples (use useState)

---

## 💡 Exemplos de Uso

### **Exemplo 1: Painel de Edição Completo**

```jsx
import { useFocusControl } from './hooks/useFocusControl';
import { useKeyboardSelection } from './hooks/useKeyboardSelection';

function PainelEdicao({ shapes, onUpdateShape, onDeleteShapes }) {
  const { sliderRefs } = useFocusControl();
  const { selectedElements, handleElementSelect, clearSelection } = useKeyboardSelection();
  
  const selectedShapes = shapes.filter(s => 
    selectedElements.some(el => el.id === s.id)
  );
  
  const handleBulkDelete = () => {
    const ids = selectedElements.map(el => el.id);
    onDeleteShapes(ids);
    clearSelection();
  };
  
  return (
    <div>
      {/* Lista de formas */}
      {shapes.map(shape => (
        <div 
          key={shape.id}
          onClick={(e) => handleElementSelect(shape.id, 'shape', e)}
          className={selectedElements.some(el => el.id === shape.id) ? 'selected' : ''}
        >
          <h4>{shape.name}</h4>
          
          {/* Sliders com navegação por teclado */}
          <label>Opacidade:</label>
          <input
            type="range"
            ref={sliderRefs.opacity}
            value={shape.opacity}
            onChange={(e) => onUpdateShape(shape.id, { opacity: e.target.value })}
          />
          
          <label>Rotação:</label>
          <input
            type="range"
            ref={sliderRefs.rotation}
            value={shape.rotation}
            onChange={(e) => onUpdateShape(shape.id, { rotation: e.target.value })}
          />
        </div>
      ))}
      
      {/* Controles de seleção múltipla */}
      {selectedElements.length > 0 && (
        <div className="bulk-controls">
          <span>{selectedElements.length} selecionados</span>
          <button onClick={handleBulkDelete}>Deletar Selecionados</button>
          <button onClick={clearSelection}>Limpar Seleção</button>
        </div>
      )}
    </div>
  );
}
```

### **Exemplo 2: Canvas Interativo**

```jsx
function CanvasInterativo({ shapes }) {
  const { selectedElements, handleElementSelect } = useKeyboardSelection();
  
  return (
    <Stage>
      <Layer>
        {shapes.map(shape => (
          <Circle
            key={shape.id}
            x={shape.x}
            y={shape.y}
            radius={shape.radius}
            fill={shape.color}
            stroke={selectedElements.some(el => el.id === shape.id) ? '#FFD700' : 'transparent'}
            strokeWidth={3}
            onClick={(e) => {
              handleElementSelect(shape.id, 'shape', e.evt);
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
}
```

---

## 🏆 Boas Práticas

### ✅ **Recomendações**

1. **Combine os Hooks:** Use ambos em componentes complexos
2. **Refs Específicas:** Use refs específicas para cada tipo de controle
3. **Cleanup:** Os hooks já fazem cleanup automático
4. **Performance:** Evite re-criações desnecessárias dos handlers
5. **Acessibilidade:** Mantenha suporte a navegação por teclado

### ❌ **O que Evitar**

1. **Não misture refs:** Cada tipo de controle deve ter sua ref específica
2. **Não force foco:** Deixe o hook gerenciar o foco automaticamente  
3. **Não ignore eventos:** Sempre passe o evento para `handleElementSelect`
4. **Não use em listas grandes:** Performance pode ser impactada com muitos elementos

### 🔧 **Configurações Avançadas**

```jsx
// Configuração personalizada do useFocusControl
const { sliderRefs } = useFocusControl({
  autoFocus: true,        // Auto-foco no primeiro elemento
  cycleNavigation: true,  // Navegação circular
  debugMode: false        // Logs de debug
});

// Configuração personalizada do useKeyboardSelection  
const selection = useKeyboardSelection({
  multiSelect: true,      // Permite seleção múltipla
  clearOnEscape: true,    // Limpa com ESC
  maxSelection: 10        // Limite máximo de seleção
});
```

---

## 🐛 Troubleshooting

### **Problema: Navegação por teclado não funciona**
- ✅ Verifique se os elementos têm `tabIndex={0}`
- ✅ Confirme que as refs estão sendo atribuídas corretamente
- ✅ Teste se os elementos estão visíveis

### **Problema: Seleção múltipla não funciona**
- ✅ Confirme que está passando o evento para `handleElementSelect`
- ✅ Verifique se a tecla Ctrl está sendo detectada
- ✅ Teste em diferentes navegadores

### **Problema: Performance lenta**
- ✅ Limite o número de elementos selecionáveis
- ✅ Use `React.memo` nos componentes filhos
- ✅ Evite re-renders desnecessários

---

📝 **Última atualização:** 15 de junho de 2025  
🔗 **Versão:** 1.0.0  
👨‍💻 **Autor:** Lucas Camargo
