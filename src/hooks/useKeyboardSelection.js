/**
 * @fileoverview Hook customizado para gerenciar seleção múltipla via teclas modificadoras
 * @description Implementa seleção múltipla usando Shift/Ctrl e limpa seleção com Escape.
 * Essencial para operações em lote e edição simultânea de múltiplos elementos.
 * @author Lucas Camargo
 * @version 1.0.0
 * @since 2025-06-15
 */

import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar seleção múltipla com teclas modificadoras (Shift/Ctrl)
 * 
 * @description Este hook implementa:
 * - Detecção global de teclas Shift, Ctrl/Cmd e Escape
 * - Seleção múltipla: Ctrl+clique adiciona/remove da seleção
 * - Seleção única: clique normal substitui seleção atual
 * - Limpar seleção: tecla Escape limpa toda a seleção
 * - Prevenção de propagação: evita conflitos com outros handlers
 * - Modo de edição: desabilita seleção quando em modo de edição
 * - Cross-platform: funciona em Windows (Ctrl), Mac (Cmd) e Linux
 * 
 * @param {Object} options - Configurações do hook
 * @param {Function} options.onClearSelection - Callback executado para limpar toda a seleção
 * @param {Function} options.onToggleElementSelection - Callback para alternar seleção de um elemento
 * @param {boolean} options.isEditingShape - Se está em modo de edição (desabilita seleção)
 * @param {Array<{id: string, type: string}>} [options.selectedElements=[]] - Array de elementos atualmente selecionados
 * 
 * @returns {Object} Objeto contendo o estado e funções de seleção
 * @returns {Object} returns.keysPressed - Estado atual das teclas modificadoras
 * @returns {boolean} returns.keysPressed.shift - Se a tecla Shift está pressionada
 * @returns {boolean} returns.keysPressed.ctrl - Se a tecla Ctrl/Cmd está pressionada
 * @returns {Function} returns.handleElementSelect - Função para processar clique em elemento
 * @returns {Function} returns.isElementSelected - Verifica se um elemento está selecionado
 * 
 * @example
 * ```jsx
 * import { useKeyboardSelection } from './hooks/useKeyboardSelection';
 * 
 * function ElementList({ elements, onSelect, onClear, isEditing }) {
 *   const { 
 *     keysPressed, 
 *     handleElementSelect, 
 *     isElementSelected 
 *   } = useKeyboardSelection({
 *     onClearSelection: onClear,
 *     onToggleElementSelection: onSelect,
 *     isEditingShape: isEditing,
 *     selectedElements: elements.filter(el => el.selected)
 *   });
 * 
 *   return (
 *     <div>
 *       {elements.map(element => (
 *         <div
 *           key={element.id}
 *           className={isElementSelected(element.id) ? 'selected' : ''}
 *           onClick={(e) => handleElementSelect(element.id, element.type, e)}
 *         >
 *           {element.name}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @see {@link docs/HOOKS_TECHNICAL.md} Para documentação técnica completa
 */
export const useKeyboardSelection = ({
  onClearSelection, 
  onToggleElementSelection, 
  isEditingShape,
  selectedElements = []
}) => {
  // Estado para controlar teclas pressionadas
  const [keysPressed, setKeysPressed] = useState({
    shift: false,
    ctrl: false
  });

  // Verifica se um elemento está selecionado
  const isElementSelected = (id) => {
    return selectedElements.some(el => el.id === id);
  };

  // Função para lidar com seleção de elementos
  const handleElementSelect = (id, type, e) => {
    // Se estiver em modo de edição não faz seleção
    if (isEditingShape) return;
    
    // Se shift ou ctrl estão pressionados, permite seleção múltipla
    if (keysPressed.shift || keysPressed.ctrl) {
      onToggleElementSelection(id, type);
      e.cancelBubble = true; // Impede que o clique chegue ao Stage
    } else {
      // Se não tem tecla modificadora, limpa seleção e seleciona apenas este elemento
      onClearSelection();
      onToggleElementSelection(id, type);
      e.cancelBubble = true;
    }
  };

  // Gerencia keydown/keyup para seleção múltipla (shift/ctrl)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setKeysPressed(prev => ({ ...prev, shift: true }));
      } else if (e.key === 'Control' || e.key === 'Meta') { // Meta para Mac
        setKeysPressed(prev => ({ ...prev, ctrl: true }));
      } else if (e.key === 'Escape') {
        onClearSelection(); // Limpa seleção ao pressionar ESC
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setKeysPressed(prev => ({ ...prev, shift: false }));
      } else if (e.key === 'Control' || e.key === 'Meta') {
        setKeysPressed(prev => ({ ...prev, ctrl: false }));
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onClearSelection]);

  return {
    keysPressed,
    handleElementSelect,
    isElementSelected
  };
};
