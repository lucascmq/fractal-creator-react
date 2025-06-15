import React, { useEffect, useRef } from 'react';
import './OpacityPopover.css';

// Popover para ajuste de opacidade local sobre a forma selecionada
export default function OpacityPopover({ x, y, value, onChange, onClose }) {
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

  // Foco automático no input
  useEffect(() => {
    if (ref.current) {
      const input = ref.current.querySelector('input');
      if (input) input.focus();
    }
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-popover"
      style={{ left: x, top: y }}
    >
      <label>
        Opacidade local
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
        <span>{Math.round(value * 100)}%</span>
      </label>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
}
