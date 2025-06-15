# 🎣 Documentação Técnica - Hooks Customizados

## Visão Geral

Este projeto utiliza dois hooks customizados principais para gerenciar interações avançadas de interface:

- **`useFocusControl`** - Controle inteligente de foco entre sliders
- **`useKeyboardSelection`** - Seleção múltipla via teclas modificadoras

---

## 🎯 `useFocusControl`

### Descrição
Hook responsável por gerenciar o foco automático entre sliders de opacidade baseado no valor do slider principal. Implementa uma lógica inteligente que foca automaticamente no slider mais relevante dependendo da posição atual.

### Localização
```
src/hooks/useFocusControl.js
```

### Assinatura da Função
```typescript
useFocusControl({ 
  sliderValue: number,      // Valor do slider principal (0-1)
  isEditingShape: boolean   // Se está em modo de edição
}): {
  opacitySliderRef: RefObject,  // Ref para slider de opacidade
  darkSliderRef: RefObject      // Ref para slider de escuridão
}
```

### Parâmetros de Entrada

| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|---------|
| `sliderValue` | `number` | Valor atual do slider principal (0.0 a 1.0) | Obrigatório |
| `isEditingShape` | `boolean` | Indica se o componente está em modo de edição | Obrigatório |

### Valores de Retorno

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `opacitySliderRef` | `RefObject<HTMLInputElement>` | Referência para o slider de opacidade |
| `darkSliderRef` | `RefObject<HTMLInputElement>` | Referência para o slider de escuridão |

### Lógica de Funcionamento

1. **Início (≤ 0.01)**: Foca no `opacitySliderRef`, remove foco do `darkSliderRef`
2. **Final (≥ 0.99)**: Foca no `darkSliderRef`, remove foco do `opacitySliderRef`  
3. **Meio (0.01 < valor < 0.99)**: Remove foco de ambos os sliders

### Exemplo de Uso

```jsx
import { useFocusControl } from '../hooks/useFocusControl';

function SliderPanel({ opacityValue, isEditing }) {
  const { opacitySliderRef, darkSliderRef } = useFocusControl({
    sliderValue: opacityValue,
    isEditingShape: isEditing
  });

  return (
    <div>
      <input
        type="range"
        ref={opacitySliderRef}
        min={0}
        max={1}
        step={0.1}
        value={opacityValue}
      />
      <input
        type="range"
        ref={darkSliderRef}
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  );
}
```

### Dependências Internas
- `useRef` - Para criar referências dos sliders
- `useEffect` - Para gerenciar o ciclo de vida do foco

---

## ⌨️ `useKeyboardSelection`

### Descrição
Hook que implementa seleção múltipla de elementos usando teclas modificadoras (Shift/Ctrl) e tecla Escape para limpar seleção. Essencial para operações em lote e edição simultânea de múltiplos elementos.

### Localização
```
src/hooks/useKeyboardSelection.js
```

### Assinatura da Função
```typescript
useKeyboardSelection({
  onClearSelection: () => void,
  onToggleElementSelection: (id: string, type: string) => void,
  isEditingShape: boolean,
  selectedElements: Array<{id: string, type: string}>
}): {
  keysPressed: {shift: boolean, ctrl: boolean},
  handleElementSelect: (id: string, type: string, event: Event) => void,
  isElementSelected: (id: string) => boolean
}
```

### Parâmetros de Entrada

| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|---------|
| `onClearSelection` | `Function` | Callback para limpar toda a seleção | Obrigatório |
| `onToggleElementSelection` | `Function` | Callback para alternar seleção de um elemento | Obrigatório |
| `isEditingShape` | `boolean` | Se está em modo de edição (desabilita seleção) | Obrigatório |
| `selectedElements` | `Array` | Array de elementos atualmente selecionados | `[]` |

### Valores de Retorno

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `keysPressed` | `Object` | Estado atual das teclas modificadoras |
| `keysPressed.shift` | `boolean` | Se a tecla Shift está pressionada |
| `keysPressed.ctrl` | `boolean` | Se a tecla Ctrl/Cmd está pressionada |
| `handleElementSelect` | `Function` | Função para processar seleção de elemento |
| `isElementSelected` | `Function` | Verifica se um elemento está selecionado |

### Lógica de Funcionamento

#### Detecção de Teclas
- **Shift/Ctrl Pressionadas**: Monitora `keydown`/`keyup` globalmente
- **Cross-platform**: Detecta `Control` (Windows/Linux) e `Meta` (Mac)
- **Escape**: Limpa toda a seleção atual

#### Comportamento de Seleção
1. **Sem teclas modificadoras**: Limpa seleção atual e seleciona apenas o elemento clicado
2. **Com Shift/Ctrl**: Adiciona/remove elemento da seleção múltipla
3. **Modo de edição ativo**: Desabilita completamente a seleção

#### Prevenção de Propagação
- Usa `e.cancelBubble = true` para impedir propagação do evento
- Evita conflitos com outros handlers de clique

### Exemplo de Uso

```jsx
import { useKeyboardSelection } from '../hooks/useKeyboardSelection';

function ElementList({ elements, selectedIds, onSelect, onClear, isEditing }) {
  const { 
    keysPressed, 
    handleElementSelect, 
    isElementSelected 
  } = useKeyboardSelection({
    onClearSelection: onClear,
    onToggleElementSelection: onSelect,
    isEditingShape: isEditing,
    selectedElements: selectedIds
  });

  return (
    <div>
      {/* Indicador de teclas */}
      <div className="status">
        {keysPressed.shift && <span>SHIFT</span>}
        {keysPressed.ctrl && <span>CTRL</span>}
      </div>

      {/* Lista de elementos */}
      {elements.map(element => (
        <div
          key={element.id}
          className={isElementSelected(element.id) ? 'selected' : ''}
          onClick={(e) => handleElementSelect(element.id, element.type, e)}
        >
          {element.name}
        </div>
      ))}
    </div>
  );
}
```

### Dependências Internas
- `useState` - Para gerenciar estado das teclas pressionadas
- `useEffect` - Para adicionar/remover event listeners globais

---

## 🔄 Integração no Projeto

### No `FractalCanvas.jsx`

```jsx
// Importações
import { useFocusControl } from '../hooks/useFocusControl';
import { useKeyboardSelection } from '../hooks/useKeyboardSelection';

export default function FractalCanvas({ 
  selectedShapeId, 
  setSelectedShapeId,
  isEditingShape,
  setIsEditingShape,
  onUpdateShape 
}) {
  // Hook de controle de foco
  const { opacitySliderRef, darkSliderRef } = useFocusControl({
    sliderValue: selectedShape?.fillOpacity || 0,
    isEditingShape
  });

  // Hook de seleção múltipla  
  const { handleElementSelect } = useKeyboardSelection({
    onClearSelection: () => setSelectedShapeId(null),
    onToggleElementSelection: (id) => setSelectedShapeId(id),
    isEditingShape,
    selectedElements: selectedShapeId ? [{ id: selectedShapeId }] : []
  });

  // Uso nas formas
  const handleShapeClick = (shapeId, evt) => {
    handleElementSelect(shapeId, 'shape', evt.evt);
  };

  // Refs nos sliders do popover
  <input
    type="range"
    ref={opacitySliderRef}
    value={shape.fillOpacity}
    onChange={handleOpacityChange}
  />
}
```

---

## 🧪 Testes e Validação

### Cenários de Teste para `useFocusControl`

1. **Teste de Foco Inicial**
   ```javascript
   // sliderValue = 0.0, isEditingShape = true
   // Expectativa: opacitySliderRef deve ter foco
   ```

2. **Teste de Foco Final**
   ```javascript
   // sliderValue = 1.0, isEditingShape = true  
   // Expectativa: darkSliderRef deve ter foco
   ```

3. **Teste de Modo Inativo**
   ```javascript
   // isEditingShape = false
   // Expectativa: nenhum slider deve ter foco forçado
   ```

### Cenários de Teste para `useKeyboardSelection`

1. **Teste de Seleção Simples**
   ```javascript
   // Clique sem teclas modificadoras
   // Expectativa: seleciona apenas o elemento clicado
   ```

2. **Teste de Seleção Múltipla**
   ```javascript
   // Clique com Ctrl pressionado
   // Expectativa: adiciona elemento à seleção existente
   ```

3. **Teste de Tecla Escape**
   ```javascript
   // Pressionar ESC
   // Expectativa: limpa toda a seleção
   ```

---

## ⚡ Performance e Otimizações

### `useFocusControl`
- **Memoização**: Considera memoizar refs se houver re-renders frequentes
- **Debounce**: Para sliders com mudanças muito rápidas
- **Cleanup**: Remove listeners automaticamente

### `useKeyboardSelection`  
- **Event Delegation**: Usa listeners globais eficientemente
- **Prevent Default**: Só quando necessário para manter performance
- **Memory Leaks**: Cleanup automático dos event listeners

---

## 🐛 Troubleshooting

### Problemas Comuns

#### `useFocusControl`
- **Foco não funciona**: Verificar se elementos têm `tabIndex` adequado
- **Foco perdido**: Confirmar que `isEditingShape` está correto
- **Refs undefined**: Garantir que elementos foram renderizados

#### `useKeyboardSelection`
- **Seleção múltipla falha**: Verificar detecção de teclas modificadoras
- **Propagação incorreta**: Confirmar uso de `cancelBubble`
- **Cross-browser**: Testar tanto `Control` quanto `Meta` para Mac

### Debugging

```javascript
// Adicionar logs temporários para debug
useEffect(() => {
  console.log('Focus Control:', { sliderValue, isEditingShape });
}, [sliderValue, isEditingShape]);

useEffect(() => {
  console.log('Keys Pressed:', keysPressed);
}, [keysPressed]);
```

---

## 📈 Melhorias Futuras

### Possíveis Extensões

1. **Configurabilidade**: Permitir customização de teclas e comportamentos
2. **Accessibility**: Melhorar suporte a leitores de tela
3. **Touch Support**: Adaptar para dispositivos móveis
4. **Animation**: Adicionar transições visuais de foco
5. **Undo/Redo**: Integrar com sistema de histórico

### Refatorações Sugeridas

1. **Tipagem TypeScript**: Adicionar tipos explícitos
2. **Testes Unitários**: Implementar testes automatizados
3. **Context API**: Considerar uso de Context para estado global
4. **Custom Events**: Implementar sistema de eventos customizados

---

📚 **Documentação Técnica v1.0**  
📅 **Última atualização:** 15 de junho de 2025  
👨‍💻 **Desenvolvido por:** Lucas Camargo
