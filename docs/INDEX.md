# 📚 Índice da Documentação - Fractal Creator React

## Documentação Geral

### 🏠 [README Principal](../README.md)
Visão geral do projeto, funcionalidades, instalação e uso básico.

### 🗺️ [Roadmap do Projeto](roadmap-grupos.md)
Planejamento e funcionalidades futuras, especialmente relacionadas ao sistema de grupos.

---

## Documentação Técnica

### 🎣 Hooks Customizados

#### 📖 [Documentação dos Hooks](HOOKS.md)
- Visão geral dos hooks
- Exemplos de uso básico
- Casos de uso recomendados
- Boas práticas

#### ⚙️ [Documentação Técnica dos Hooks](HOOKS_TECHNICAL.md)
- Documentação técnica detalhada
- Assinaturas de função
- Lógica interna
- Performance e otimizações
- Troubleshooting

#### 🔧 [Guia do Desenvolvedor](DEVELOPER_GUIDE.md)
- Setup rápido para desenvolvedores
- Casos de uso avançados
- Customização e extensão
- Debugging e testes
- Exemplos práticos completos

---

## Estrutura dos Hooks

### `useFocusControl`
> **Controle inteligente de foco entre sliders**

- **Arquivo**: `src/hooks/useFocusControl.js`
- **Função**: Gerencia foco automático baseado em valor de slider
- **Uso**: Painéis de edição com múltiplos controles
- **Documentação**: [Technical](HOOKS_TECHNICAL.md#usefocuscontrol) | [Guide](DEVELOPER_GUIDE.md#1-painel-de-edição-com-sliders)

### `useKeyboardSelection`
> **Seleção múltipla via teclas modificadoras**

- **Arquivo**: `src/hooks/useKeyboardSelection.js`
- **Função**: Implementa seleção múltipla com Ctrl/Shift
- **Uso**: Listas e canvas com seleção múltipla
- **Documentação**: [Technical](HOOKS_TECHNICAL.md#usekeyboardselection) | [Guide](DEVELOPER_GUIDE.md#2-lista-de-elementos-com-seleção-múltipla)

---

## Como Navegar na Documentação

### 👋 **Para Usuários Finais**
1. Comece com o [README Principal](../README.md)
2. Veja a seção "Como Usar" para instruções básicas
3. Consulte as funcionalidades disponíveis

### 👨‍💻 **Para Desenvolvedores**
1. Leia o [README Principal](../README.md) para entender o projeto
2. Consulte o [Guia do Desenvolvedor](DEVELOPER_GUIDE.md) para setup rápido
3. Use a [Documentação Técnica](HOOKS_TECHNICAL.md) como referência
4. Veja exemplos práticos na [Documentação dos Hooks](HOOKS.md)

### 🔧 **Para Contribuidores**
1. Revise toda a documentação técnica
2. Consulte o [Roadmap](roadmap-grupos.md) para funcionalidades planejadas
3. Siga as convenções de código nos exemplos
4. Use o sistema de debugging documentado

---

## Convenções de Documentação

### 📝 **Símbolos Utilizados**
- 🎯 = Funcionalidade principal
- ⚙️ = Configuração técnica
- 💡 = Exemplo prático
- ⚠️ = Atenção/Cuidado
- ✅ = Recomendação
- ❌ = Não recomendado
- 🐛 = Debugging/Troubleshooting

### 📋 **Formato de Código**
```jsx
// Comentários explicativos em português
function ExemploComponente() {
  // Implementação clara e comentada
  return <div>Exemplo</div>;
}
```

### 🏷️ **Tags JSDoc**
```javascript
/**
 * @description Descrição clara da função
 * @param {Type} param - Descrição do parâmetro
 * @returns {Type} Descrição do retorno
 * @example Exemplo de uso prático
 */
```

---

## Status da Documentação

### ✅ **Concluído**
- [x] README principal com visão geral
- [x] Documentação técnica dos hooks
- [x] Guia do desenvolvedor
- [x] Exemplos práticos de uso
- [x] JSDoc nos arquivos de código
- [x] Troubleshooting e debugging

### 🚧 **Em Progresso**
- [ ] Documentação de testes unitários
- [ ] Guia de contribuição detalhado
- [ ] Documentação de performance
- [ ] Changelog detalhado

### 📋 **Planejado**
- [ ] Video tutorials
- [ ] Documentação de API completa
- [ ] Guia de migração de versões
- [ ] Documentação de deployment
- [ ] Guias de boas práticas de UX

---

## Como Contribuir com a Documentação

### 📝 **Adicionando Nova Documentação**
1. Siga o formato estabelecido nos arquivos existentes
2. Use símbolos e convenções consistentes
3. Inclua exemplos práticos sempre que possível
4. Adicione links para documentação relacionada

### 🔄 **Atualizando Documentação Existente**
1. Mantenha a estrutura e formato originais
2. Atualize o timestamp de "Última atualização"
3. Teste todos os exemplos de código
4. Mantenha consistência com outros documentos

### 🐛 **Reportando Problemas**
1. Use issues no GitHub para reportar problemas
2. Inclua qual documento está incorreto
3. Sugira correções específicas
4. Inclua contexto sobre o problema encontrado

---

## Links Rápidos

| Documento | Propósito | Audiência |
|-----------|-----------|-----------|
| [README](../README.md) | Visão geral e setup | Todos |
| [HOOKS](HOOKS.md) | Guia dos hooks | Desenvolvedores |
| [HOOKS_TECHNICAL](HOOKS_TECHNICAL.md) | Referência técnica | Desenvolvedores avançados |
| [DEVELOPER_GUIDE](DEVELOPER_GUIDE.md) | Guia prático | Desenvolvedores |
| [roadmap-grupos](roadmap-grupos.md) | Planejamento | Contribuidores |

---

📚 **Índice da Documentação v1.0**  
📅 **Última atualização:** 15 de junho de 2025  
👨‍💻 **Organizado por:** Lucas Camargo

> 💡 **Dica**: Use Ctrl+F para buscar conteúdo específico em qualquer documento!
