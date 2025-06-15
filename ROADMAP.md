# 🗺️ ROADMAP: Fractal Creator

Este documento descreve o plano de evolução do Fractal Creator, com as funcionalidades já implementadas e as próximas a serem desenvolvidas.

## ✅ Funcionalidades já implementadas

### Core
- [x] Canvas responsivo com Konva Stage
- [x] Grid dinâmico com múltiplas divisões
- [x] Biblioteca de formas geométricas
- [x] Sistema de camadas para sobreposição de formas
- [x] Controle de opacidade para formas
- [x] Controle de opacidade para máscaras (overlay preto)
- [x] Rotação de formas (incluindo losango)
- [x] Painel esquerdo para adicionar novas formas
- [x] Painel direito para gerenciar elementos criados
- [x] Popover para edição rápida de elementos
- [x] Texto central customizável

## 🚀 Próxima fase (v1.1)

### Melhorias de UX
- [ ] Undo/Redo (histórico de ações)
- [ ] Modo de visualização limpa (esconder interface)
- [ ] Salvar/carregar projetos (exportação/importação JSON)
- [ ] Exportação PNG/SVG em alta resolução
- [ ] Tutoriais interativos

### Recursos gráficos
- [ ] Paleta de cores customizável
- [ ] Gradientes e padrões
- [ ] Biblioteca de presets
- [ ] Efeitos de composição avançados (multiply, overlay, etc.)
- [ ] Modo de symmetria (espelhamento)

### Técnico
- [ ] Migração para TypeScript
- [ ] Sistema de plugins
- [ ] Tema claro/escuro

## 🔮 Visão de longo prazo (v2.0)

### Recursos avançados
- [ ] Animações de formas
- [ ] Efeitos de partículas
- [ ] Suporte para tablets/dispositivos touch
- [ ] Geração procedural de padrões
- [ ] Exportação para web (canvas ou SVG animado)
- [ ] Interação com áudio (visualização de música)
- [ ] Algoritmos de geração de fractais matemáticos
- [ ] Compartilhamento de criações em galeria online

## 🔍 Princípios de design

- **Simplicidade**: Interface limpa e fácil de usar
- **Precisão**: Controle exato sobre todos os elementos
- **Performance**: Renderização rápida mesmo com muitos elementos
- **Extensibilidade**: Código modular e fácil de estender
- **Criatividade**: Ferramentas que inspiram e não limitam o usuário
- Sempre que tiver dúvida, peça explicação antes de aplicar
- Use o roadmap para saber o próximo passo
- Não tenha medo de experimentar e errar: faz parte do aprendizado!

---

## NOVA ETAPA: Sistema de Coordenadas Centrado e Canvas Quadrado

**Transição para sistema de coordenadas centrado:**
- Fixar o canvas em 500x500px, garantindo área utilizável exata (sem margens/paddings extras).
- O centro do canvas passa a ser (x=0, y=0).
- Eixo X: de -250 a +250. Eixo Y: de -250 a +250.
- Inputs e renderização passam a usar esse sistema centrado.
- Adicionar funções utilitárias para conversão de coordenadas centradas para o sistema do Konva.
- Ajustar criação de linhas e formas:
    - Linhas: coordenadas máximas de x1, y1, x2, y2 respeitando o novo sistema.
    - Formas: criadas sempre no centro, com centro da figura em (0,0).

## A IMPLEMENTAR
1. Novas formas geométricas
2. Escolha de grids com mais marcadores
3. Marcador de coordenadas: exibir coordenadas para posicionamento preciso dos elementos, com destaque para os centros dos quadrantes do grid
4. Ajuste de formas: opacidade da forma geométrica, podendo ser só linhas ou preenchida. Manter o ajuste automático de opacidade ao adicionar formas (feature muito elogiada!), mas adicionar botão de "personalizar" para o usuário ajustar uma forma específica ao clicar nela
5. Zoom em parte específica do canvas para experiência de desenhar detalhes em perspectiva maior (ex: 2x, 4x, 8x), ajustando coordenadas e escalas das figuras para facilitar desenhos complexos e detalhados.
- [ ] **IMPORTANTE:** Ajuste de opacidade via scroll do mouse diretamente sobre a forma no canvas (UX avançada).

## IDEIAS
- Sistema de animação onde o usuário pode escolher cores e gradientes para as formas mudarem de cor
- Sistema de animação para girar ou movimentar figuras de maneira simples (ferramentas simples que, combinadas, geram resultados complexos)
- Gerador de desenhos complexos aleatórios combinando várias formas básicas
- Permitir ao usuário salvar imagens criadas, inclusive GIFs ou vídeos das animações, e talvez gerar loops longos de animações aleatórias

> Atualize este roadmap sempre que novas ideias ou necessidades surgirem. Ele é seu guia para evoluir o projeto de forma organizada e profissional.
