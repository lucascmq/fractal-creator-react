# 🎨 Fractal Creator React

> **Uma ferramenta moderna e interativa para criação de arte generativa baseada em fractais**

Desenvolvido por Lucas Camargo com React, Konva.js e muito amor ♥

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/dark/fractal-creator-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Konva](https://img.shields.io/badge/Konva-9.3.20-red.svg)](https://konvajs.org/)

## 🚀 Funcionalidades

### ✨ **Interface Intuitiva**
- **Painéis Laterais:** Interface dividida em 3 painéis (Criação, Canvas, Edição)
- **Abas Organizadas:** Linhas, Formas e Configurações separadas
- **Design Responsivo:** Layout adaptativo e moderno

### 🎯 **Criação de Elementos**
- **Linhas Personalizadas:** Coordenadas precisas com sistema centrado (-250 a +250)
- **Padrões Rápidos:** Diagonais, Cruz, X pré-definidos
- **Formas Geométricas:** Círculos, quadrados, triângulos, pentágonos, heptágonos, losangos
- **Propriedades Avançadas:** Escala, rotação, opacidade individual e de máscara

### 🔧 **Sistema de Grid Inteligente**
- **Divisões Configuráveis:** 2x2, 4x4, 8x8, 16x16
- **Snap to Grid:** Alinhamento automático opcional
- **Intensidade Ajustável:** Controle visual da opacidade do grid
- **Estilos:** Linhas contínuas ou pontilhadas

### ⌨️ **Controles Avançados**
- **Seleção Múltipla:** Ctrl+clique para selecionar múltiplas formas
- **Navegação por Teclado:** Setas para mover entre sliders
- **Scroll Inteligente:** Controle de opacidade via scroll do mouse
- **Foco Automático:** Sistema de foco otimizado para usabilidade

### 🎨 **Edição em Tempo Real**
- **Editor Visual:** Arrastar e modificar elementos no canvas
- **Popover Contextual:** Controles aparecem ao selecionar elementos
- **Layer Management:** Sistema de camadas para organização
- **Auto-cálculo:** Slope automático para linhas

## 🏗️ Arquitetura

### 📁 **Estrutura de Diretórios**
```
src/
├── components/          # Componentes React
│   ├── FractalCanvas.jsx    # Canvas principal (Konva)
│   ├── LeftPanel.jsx        # Painel de criação
│   ├── RightPanel.jsx       # Painel de edição
│   ├── AddLinePanel.jsx     # Formulário de linhas
│   ├── AddShapePanel.jsx    # Formulário de formas
│   ├── ConfigPanel.jsx      # Configurações
│   ├── OpacityPopover.jsx   # Popover de opacidade
│   ├── ShapePopover.jsx     # Popover de formas
│   └── ShapeWithOutline.jsx # Componente de forma
├── hooks/               # Hooks customizados
│   ├── useFocusControl.js   # Controle de foco
│   └── useKeyboardSelection.js # Seleção múltipla
├── utils/               # Utilitários
│   ├── colors.js           # Paleta de cores
│   └── GroupManager.js     # Gerenciamento de grupos
└── assets/              # Recursos estáticos
```

### 🧩 **Hooks Customizados**

#### `useFocusControl()`
Gerencia o foco entre sliders para navegação por teclado:
```javascript
const { sliderRefs } = useFocusControl();
// Uso: ref={sliderRefs.opacity}
```

#### `useKeyboardSelection()`
Controla seleção múltipla via Ctrl+clique:
```javascript
const { selectedElements, handleElementSelect, clearSelection } = useKeyboardSelection();
```

### 🎛️ **Componentes Principais**

#### `FractalCanvas`
- Canvas principal usando React-Konva
- Renderização de grid, linhas e formas
- Sistema de snap to grid
- Controles de mouse e teclado

#### `LeftPanel` 
- Abas para Linhas, Formas e Configurações
- Padrões rápidos predefinidos
- Controles de grid e visualização

#### `RightPanel`
- Lista de elementos criados
- Edição de propriedades em tempo real
- Sistema de layers e ordenação
- Botões de exclusão

## 🛠️ Instalação e Uso

### **Pré-requisitos**
- Node.js 16.0+ 
- npm 7.0+

### **Instalação**
```bash
# Clone o repositório
git clone https://github.com/dark/fractal-creator-react.git
cd fractal-creator-react

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### **Scripts Disponíveis**
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Verificação de código
npm run deploy   # Deploy para GitHub Pages
```

## 🎮 Como Usar

### **1. Criando Linhas**
1. Vá para a aba "Linhas" no painel esquerdo
2. Use padrões rápidos ou insira coordenadas manuais
3. Linhas aparecem no canvas e no painel direito para edição

### **2. Adicionando Formas**
1. Vá para a aba "Formas" no painel esquerdo  
2. Escolha o tipo (círculo, quadrado, triângulo, etc.)
3. Defina posição, escala e opacidade
4. Ajuste propriedades no painel direito

### **3. Configurando o Grid**
1. Vá para a aba "Configurações"
2. Ligue/desligue o grid
3. Escolha divisão (2x2 até 16x16)
4. Ajuste intensidade e estilo das linhas
5. Ative "Snap to Grid" para alinhamento automático

### **4. Controles Avançados**
- **Seleção Múltipla:** Ctrl+clique em formas
- **Navegação:** Use setas ↑↓ entre sliders
- **Opacidade:** Scroll do mouse sobre forma selecionada
- **Edição:** Clique em elementos no painel direito

## 🔧 Tecnologias

- **React 19.1.0** - Interface e gerenciamento de estado
- **Konva.js 9.3.20** - Renderização de canvas 2D
- **React-Konva 19.0.6** - Integração React + Konva
- **Vite 6.3.5** - Build tool e servidor de desenvolvimento
- **ESLint** - Qualidade de código

## 📈 Melhorias Futuras

### 🎯 **Próximas Funcionalidades**
- [ ] Sistema de grupos avançado
- [ ] Exportação de imagens (PNG, SVG)
- [ ] Presets de fractais famosos
- [ ] Animações e transições
- [ ] Modo escuro/claro
- [ ] Undo/Redo
- [ ] Salvamento local/cloud

### 🐛 **Problemas Conhecidos**
- [ ] Bundle size > 500KB (otimização de chunks pendente)
- [ ] Melhorar performance com muitos elementos
- [ ] Adicionar testes unitários
- [ ] Melhorar acessibilidade

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Lucas Camargo**
- GitHub: [@dark](https://github.com/dark)
- "Criado com matemática precisa, ímpeto e muito amor ♥"

---

⭐ **Se este projeto te ajudou, deixe uma estrela!**
