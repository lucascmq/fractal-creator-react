# Roadmap Incremental — Sistema de Grupos (Fase 1: Core de Dados)

## Objetivo
Implementar o núcleo do sistema de grupos com metadados, preparado para hierarquia, transformações futuras e máxima flexibilidade, sem quebrar o funcionamento atual do app.

---

## Fase 1 — Passos Detalhados

### 1. Estrutura de Dados Inicial
- Definir o modelo de grupo (id, nome, cor, filhos, matriz de transformação, etc.)
- Definir o modelo de shape/linha para suportar referência a grupo(s)
- Documentar exemplos de objetos (mock)

### 2. Estado Global de Grupos
- Adicionar estado de grupos no App.jsx (useState ou useReducer)
- Garantir persistência temporária (em memória)
- Funções básicas: criar grupo, deletar grupo, adicionar/remover filhos

### 3. GroupManager Utilitário
- Criar classe/funções utilitárias para manipulação dos grupos
- Métodos: createGroup, deleteGroup, addChild, removeChild, getGroupById
- Testes unitários simples (console.log ou Jest)

### 4. Integração Inicial com UI
- Exibir lista de grupos no painel direito (apenas nomes e quantidade de filhos)
- Garantir que a criação/deleção de grupos não afeta shapes existentes
- Sem renderização especial no canvas ainda

### 5. Seleção e Associação
- Permitir selecionar múltiplas formas e criar grupo a partir da seleção
- Atualizar estado dos shapes para referenciar grupo
- Testar criação e deleção de grupos com seleção

### 6. Documentação e Testes
- Documentar exemplos de uso e edge cases
- Testar todos os fluxos manualmente

---

## Observações
- Cada passo deve ser commitado separadamente
- Testar o app a cada etapa para garantir que nada quebre
- Não alterar renderização do canvas até a Fase 2

---

## Próximas Fases (apenas referência)
- Fase 2: UI hierárquica, drag & drop, expand/collapse
- Fase 3: Transformações em grupo
- Fase 4: Zoom/navegação hierárquica
- Fase 5: Performance e otimizações avançadas
