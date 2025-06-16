# Instructions para Modularização e Evolução do Projeto Fractal Creator

## 1. Discussão e Validação de Ideias
- Toda nova funcionalidade ou refatoração deve ser discutida antes de qualquer ação.
- Processo:
  1. Quem propõe (usuário ou IA) apresenta a ideia.
  2. O outro avalia: é viável? Tem riscos? Sugere melhorias ou alternativas.
  3. A ideia volta para quem propôs, que pode ajustar, aprovar ou sugerir mudanças.
  4. Só após consenso, criamos um plano de ação detalhado.

## 2. Criação do Plano de Ação e Avaliação de Impacto
- Criar um plano de ação detalhado para a implementação/refatoração.
- Avaliar o impacto do plano:
  1. A mudança tende a funcionar sem quebrar o restante do projeto?
  2. Se há risco de quebrar várias partes, buscar alternativas mais seguras.
  3. Documentar possíveis impactos e dependências.

## 3. Implementação em Pequenos Passos
- Priorizar edições pequenas e modulares.
- Evitar grandes mudanças em muitos arquivos de uma vez.
- Dividir funcionalidades complexas em etapas menores e bem controladas.
- Após cada etapa, testar e validar antes de seguir.

## 4. Colaboração e Transparência
- Sempre explicar o raciocínio por trás das sugestões e mudanças.
- Manter comunicação aberta para ajustes rápidos.
- Registrar decisões e próximos passos.

## 5. Exemplo de Fluxo
- Você propõe uma ideia:
  - Eu avalio, sugiro melhorias ou alternativas, explico riscos/benefícios, devolvo para sua análise.
- Eu proponho uma ideia:
  - Você avalia, sugere melhorias, aprovamos juntos, só então implemento.

---

**Atenção:**
- Sempre discutir novas ideias antes de implementar.
- Priorizar modularização e clareza.
- Avaliar impacto antes de editar.
- Implementar em pequenos passos.
- Documentar decisões e próximos passos.

# Instrução de Prioridade para Prompts

Sempre que houver **TEXTO EM CAIXA ALTA ENTRE ASTERISCOS** em qualquer parte do prompt do usuário, priorize e execute essa instrução antes de qualquer outra, mesmo que esteja no final ou no meio de um texto grande. Isso serve para destacar prioridades, urgências ou etapas que devem ser feitas primeiro.

Exemplo:
- Se o usuário escrever: "faça X, Y, e **ANTES DE TUDO, FAÇA Z**", você deve executar Z antes de X e Y.

Essa regra deve ser seguida em todas as interações futuras.
