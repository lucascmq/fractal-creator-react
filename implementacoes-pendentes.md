# Implementações Pendentes para o Fractal Creator

## Bugs e Melhorias Urgentes

- **LIGAR/DESLIGAR GRID NÃO FUNCIONA** - Verificar a função de ativar/desativar o grid
- **Zoom precisa ter um marcador para mostrar em qual quadrante está** - Adicionar indicador visual de quadrante no sistema de zoom

## Resumo do Trabalho na Movimentação de Grupos

Hoje trabalhamos na implementação da capacidade de selecionar, mover, girar e redimensionar grupos no projeto Fractal Creator. Embora não tenhamos conseguido fazer a implementação funcionar completamente, identificamos todos os componentes necessários e as alterações que precisam ser feitas.

## Modificações Necessárias

### 1. GroupManager.js

Precisamos adicionar propriedades de transformação aos grupos:

```javascript
export function createGroup(options = {}) {
  // Gera ID único para o grupo
  const id = `group-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Determina o nome (automático ou fornecido)
  const name = options.name || `Grupo ${Math.floor(Math.random() * 1000)}`;
  
  // Determina a cor (aleatória ou fornecida)
  const color = options.color || getRandomColor();
  
  // Cria o objeto de grupo
  return {
    id,
    name,
    color,
    children: options.children || [],
    visible: true,
    locked: false,
    expanded: true,
    transformMatrix: [1, 0, 0, 1, 0, 0], // Identidade por padrão [a, b, c, d, tx, ty]
    x: options.x || 0,          // Posição X (centro do grupo)
    y: options.y || 0,          // Posição Y (centro do grupo)
    rotation: options.rotation || 0,  // Rotação em graus
    scale: options.scale || 1,        // Escala (1 = tamanho original)
    createdAt: Date.now(),
  };
}
```

### 2. GroupPopover.jsx

Implementar controles completos para posição, rotação e escala:

```jsx
import React, { useEffect, useRef } from 'react';
import './OpacityPopover.css'; // Reutiliza o CSS existente

export default function GroupPopover({
  x,
  y,
  group,
  onUpdate,
  onClose
}) {
  const ref = useRef();

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Handlers para posição, rotação e escala
  const handleXPositionChange = (e) => {
    const newX = Number(e.target.value);
    onUpdate({ x: newX });
  };

  const handleYPositionChange = (e) => {
    const newY = Number(e.target.value);
    onUpdate({ y: newY });
  };

  const handleRotationChange = (e) => {
    const newRotation = Number(e.target.value);
    onUpdate({ rotation: newRotation });
  };

  const handleScaleChange = (e) => {
    const newScale = Number(e.target.value);
    onUpdate({ scale: newScale });
  };

  // Função para resetar transformações
  const handleResetTransform = () => {
    onUpdate({ x: 0, y: 0, rotation: 0, scale: 1 });
  };

  return (
    <div
      ref={ref}
      className="opacity-popover"
      style={{ left: x, top: y, minWidth: 220 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <h3 style={{ color: '#7DF9A6', margin: '0 0 10px 0', fontSize: 18 }}>Editar Grupo</h3>
        
        {/* Controle de Posição X */}
        <label style={{ width: '100%', marginBottom: 8, display: 'block', color: '#7DF9A6', fontWeight: 600, fontSize: 15 }}>
          Posição X: {group.x ? group.x.toFixed(1) : 0}
          <input
            type="range"
            min={-250}
            max={250}
            step={1}
            value={group.x || 0}
            onChange={handleXPositionChange}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        {/* Controle de Posição Y */}
        <label style={{ width: '100%', marginBottom: 8, display: 'block', color: '#7DF9A6', fontWeight: 600, fontSize: 15 }}>
          Posição Y: {group.y ? group.y.toFixed(1) : 0}
          <input
            type="range"
            min={-250}
            max={250}
            step={1}
            value={group.y || 0}
            onChange={handleYPositionChange}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
        
        {/* Controle de Rotação */}
        <label style={{ width: '100%', marginBottom: 8, display: 'block', color: '#7DF9A6', fontWeight: 600, fontSize: 15 }}>
          Rotação: {Math.round(group.rotation || 0)}°
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={group.rotation || 0}
            onChange={handleRotationChange}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        {/* Controle de Escala */}
        <label style={{ width: '100%', marginBottom: 8, display: 'block', color: '#7DF9A6', fontWeight: 600, fontSize: 15 }}>
          Escala: {((group.scale || 1) * 100).toFixed(0)}%
          <input
            type="range"
            min={0.1}
            max={5}
            step={0.01}
            value={group.scale || 1}
            onChange={handleScaleChange}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        {/* Botão para resetar transformações */}
        <button 
          onClick={handleResetTransform}
          style={{
            background: 'transparent',
            border: '2px solid #7DF9A6',
            color: '#7DF9A6',
            padding: '4px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '5px',
            fontWeight: 600,
          }}
        >
          Resetar Transformações
        </button>
      </div>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
}
```

### 3. FractalCanvas.jsx

1. Importar o componente GroupPopover:
```jsx
import GroupPopover from './GroupPopover';
```

2. Adicionar busca por grupo para o popover:
```jsx
// Busca shape/linha atualizado para o popover
let popoverShape = null;
let popoverLine = null;
let popoverGroup = null;
if (editPopover && editPopover.type === 'shape') {
  popoverShape = shapes.find(s => s.id === editPopover.data.id);
}
if (editPopover && editPopover.type === 'line') {
  popoverLine = lines.find(l => l.id === editPopover.data.id);
}
if (editPopover && editPopover.type === 'group') {
  popoverGroup = groups.find(g => g.id === editPopover.data.id);
}
```

3. Adicionar renderização do popover do grupo:
```jsx
{/* NOVO: Popover de edição de grupo */}
{editPopover && editPopover.type === 'group' && popoverGroup && (
  <GroupPopover
    x={editPopover.x}
    y={editPopover.y}
    group={popoverGroup}
    onUpdate={props => onUpdateGroup(popoverGroup.id, props)}
    onClose={closeEditPopover}
  />
)}
```

4. Adicionar indicador visual para grupos selecionados:
```jsx
const [groupCanvasX, groupCanvasY] = toCanvasZ(group.x || 0, group.y || 0);
const groupRotation = group.rotation || 0;
const groupScale = group.scale || 1;
// Verifica se o grupo está selecionado
const isGroupSelected = selectedElements.some(el => el.id === group.id);
```

5. Adicionar indicador visual e área clicável no grupo:
```jsx
{/* Borda indicando seleção do grupo */}
{isGroupSelected && (
  <>
    {/* Borda externa para indicar seleção */}
    <Rect
      x={-120 * groupScale}
      y={-120 * groupScale}
      width={240 * groupScale}
      height={240 * groupScale}
      stroke="#4CC674"
      strokeWidth={3}
      dash={[10, 5]}
      fill="transparent"
      opacity={0.8}
    />
    {/* Indicador central do grupo */}
    <Circle
      radius={12}
      fill="#4CC674"
      opacity={0.6}
      stroke="#FFFFFF"
      strokeWidth={2}
    />
  </>
)}

{/* Área clicável para o grupo - invisível mas facilita a seleção */}
<Rect
  x={-120 * groupScale}
  y={-120 * groupScale}
  width={240 * groupScale}
  height={240 * groupScale}
  fill="transparent"
  opacity={0.01}
/>
```

### 4. App.jsx

Adicionar função para atualizar grupos:
```jsx
// Atualiza um grupo
const handleUpdateGroup = (id, newParams) => {
  setGroups(prev => prev.map(group => group.id === id ? { ...group, ...newParams } : group));
};
```

Adicionar prop onUpdateGroup ao FractalCanvas:
```jsx
<FractalCanvas 
  // ...outras props
  onUpdateGroup={handleUpdateGroup} // <--- Adicionado handler para grupos
  // ...outras props  
/>
```

## Próximos Passos

Na próxima sessão, você pode:

1. Implementar as mudanças acima
2. Testar a seleção de grupos clicando neles
3. Verificar se o indicador visual aparece quando um grupo é selecionado
4. Testar movimentação, rotação e escala através do popover
5. Verificar a movimentação direta por drag-and-drop

## Notas Adicionais

- O sistema usa o componente React-Konva para renderização do canvas
- Os grupos são coleções de formas e linhas que podem ser transformadas juntas
- As transformações incluem posição (x, y), rotação (ângulo) e escala
- A seleção múltipla usa as teclas Shift e Ctrl para adicionar ou remover elementos da seleção

Bom trabalho hoje e descanse bem! Amanhã será um novo dia para continuar o desenvolvimento deste projeto incrível.

## Bugs e Melhorias Adicionais para Amanhã

1. **LIGAR/DESLIGAR GRID NÃO FUNCIONA**
   - Verificar por que a funcionalidade de ativar/desativar o grid não está funcionando
   - Checar as configurações `settings.showGrid` e como são aplicadas no FractalCanvas

2. **Zoom Precisa ter um Marcador para Mostrar em qual Quadrante está**
   - Adicionar um indicador visual que mostre em qual quadrante do espaço o usuário está navegando
   - Implementar um mini-mapa ou coordenadas visuais para facilitar a orientação
