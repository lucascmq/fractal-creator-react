import React, { useEffect, useRef } from 'react';
import './OpacityPopover.css';

// Popover de configurações rápidas da shape
export default function ShapePopover({ 
  x, 
  y, 
  value, 
  onChange, 
  onClose, 
  layer, 
  onMoveLayer, 
  canMoveUp, 
  canMoveDown,
  maskValue = 0,
  onChangeMask
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
      <label style={{ marginBottom: 8, display: 'block' }}>
        Opacidade
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
      <label style={{ marginBottom: 8, display: 'block' }}>
        Mask Opacity
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={maskValue}
          onChange={e => onChangeMask(Number(e.target.value))}
        />
        <span>{Math.round(maskValue * 100)}%</span>
      </label>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
        <button
          title="Mover camada para cima"
          style={{ opacity: canMoveUp ? 1 : 0.4 }}
          disabled={!canMoveUp}
          onClick={() => onMoveLayer('up')}
        >↑</button>
        <span style={{ color: '#7DF9A6', fontSize: 13 }}>Camada: {layer}</span>
        <button
          title="Mover camada para baixo"
          style={{ opacity: canMoveDown ? 1 : 0.4 }}
          disabled={!canMoveDown}
          onClick={() => onMoveLayer('down')}
        >↓</button>
      </div>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
}
