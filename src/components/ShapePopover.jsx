import React, { useEffect, useRef, useState } from 'react';
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
  onChangeMask,
  onModeChange // Nova prop
}) {
  const ref = useRef();
  // Novo: estado local para alternância Opacity/Dark
  const [mode, setMode] = useState('opacity'); // 'opacity' ou 'dark'

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

  // Handler do slider principal
  const handleSlider = (v) => {
    if (mode === 'opacity') onChange(v);
    else onChangeMask(v);
  };
  // Valor do slider principal
  const sliderValue = mode === 'opacity' ? value : maskValue;

  return (
    <div
      ref={ref}
      className="opacity-popover"
      style={{ left: x, top: y, minWidth: 220 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button
            onClick={() => { setMode('opacity'); onModeChange('opacity'); }}
            style={{
              background: mode === 'opacity' ? '#4CC674' : 'transparent',
              color: mode === 'opacity' ? '#181A20' : '#7DF9A6',
              border: '2px solid #4CC674',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              padding: '4px 16px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Opacity
          </button>
          <button
            onClick={() => { setMode('dark'); onModeChange('dark'); }}
            style={{
              background: mode === 'dark' ? '#4CC674' : 'transparent',
              color: mode === 'dark' ? '#181A20' : '#7DF9A6',
              border: '2px solid #4CC674',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              padding: '4px 16px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Dark
          </button>
        </div>
        <label style={{ width: '100%', marginBottom: 8, display: 'block', color: '#7DF9A6', fontWeight: 600, fontSize: 15 }}>
          {mode === 'opacity' ? 'Opacidade da forma' : 'Opacidade da máscara'}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={sliderValue}
            onChange={e => handleSlider(Number(e.target.value))}
            style={{ width: '100%', marginTop: 4 }}
          />
          <span style={{ marginLeft: 8 }}>{Math.round(sliderValue * 100)}%</span>
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0', justifyContent: 'center' }}>
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
