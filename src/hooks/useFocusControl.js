/**
 * @fileoverview Hook customizado para controle inteligente de foco entre sliders
 * @description Gerencia o foco automático baseado no valor do slider principal,
 * focando no slider mais relevante (opacidade ou escuridão) dependendo da posição.
 * @author Lucas Camargo
 * @version 1.0.0
 * @since 2025-06-15
 */

import { useRef, useEffect } from 'react';

/**
 * Hook para gerenciar foco inteligente dos sliders de Opacidade e Escuridão
 * 
 * @description Este hook implementa uma lógica de foco automático que:
 * - Foca no slider de opacidade quando o valor principal está no início (≤ 0.01)
 * - Foca no slider de escuridão quando o valor principal está no final (≥ 0.99)  
 * - Remove foco de ambos quando o valor está no meio (0.01 < valor < 0.99)
 * - Só atua quando o componente está em modo de edição
 * 
 * @param {Object} options - Configurações do hook
 * @param {number} options.sliderValue - Valor atual do slider principal (0.0 a 1.0)
 * @param {boolean} options.isEditingShape - Se o componente está em modo de edição
 * 
 * @returns {Object} Objeto contendo as referências dos sliders
 * @returns {React.RefObject<HTMLInputElement>} returns.opacitySliderRef - Ref para o slider de opacidade
 * @returns {React.RefObject<HTMLInputElement>} returns.darkSliderRef - Ref para o slider de escuridão
 * 
 * @example
 * ```jsx
 * import { useFocusControl } from './hooks/useFocusControl';
 * 
 * function SliderComponent({ value, isEditing }) {
 *   const { opacitySliderRef, darkSliderRef } = useFocusControl({
 *     sliderValue: value,
 *     isEditingShape: isEditing
 *   });
 * 
 *   return (
 *     <div>
 *       <input 
 *         type="range" 
 *         ref={opacitySliderRef}
 *         min={0} max={1} step={0.1}
 *       />
 *       <input 
 *         type="range" 
 *         ref={darkSliderRef}
 *         min={0} max={1} step={0.1}
 *       />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @see {@link docs/HOOKS_TECHNICAL.md} Para documentação técnica completa
 */
export const useFocusControl = ({ sliderValue, isEditingShape }) => {
  // Refs para os sliders internos
  const opacitySliderRef = useRef(null);
  const darkSliderRef = useRef(null);
  // Controle de foco inteligente baseado na posição do slider principal
  useEffect(() => {
    if (!isEditingShape) return; // Só aplica quando painel está ativo

    if (sliderValue <= 0.01) {
      // Início: foca no slider de Opacity
      if (opacitySliderRef.current) {
        opacitySliderRef.current.focus();
      }
      if (darkSliderRef.current) {
        darkSliderRef.current.blur();
      }
    } else if (sliderValue >= 0.99) {
      // Final: foca no slider de Dark
      if (darkSliderRef.current) {
        darkSliderRef.current.focus();
      }
      if (opacitySliderRef.current) {
        opacitySliderRef.current.blur();
      }
    } else {
      // Meio: remove foco de ambos
      if (opacitySliderRef.current) {
        opacitySliderRef.current.blur();
      }
      if (darkSliderRef.current) {
        darkSliderRef.current.blur();
      }
    }
  }, [sliderValue, isEditingShape]);
  return {
    opacitySliderRef,
    darkSliderRef
  };
};
