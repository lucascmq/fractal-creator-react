import React, { useEffect, useRef } from 'react';
import './OpacityPopover.css'; // Reutiliza o CSS existente

export default function GroupPopover({
  x,
  y,
  group,
  onUpdate,
  onClose
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

  // Foco automático no input (se houver)
  useEffect(() => {
    if (ref.current) {
      const input = ref.current.querySelector('input');
      if (input) input.focus();
    }
  }, []);

  // Handlers para rotação e escala (a serem implementados)
  const handleRotationChange = (e) => {
    const newRotation = Number(e.target.value);
    onUpdate({ rotation: newRotation });
  };

  const handleScaleChange = (e) => {
    const newScale = Number(e.target.value);
    onUpdate({ scale: newScale });
  };

  return (
    <div
      ref={ref}
      className="opacity-popover" // Reutiliza a classe CSS
      style={{ left: x, top: y, minWidth: 220 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <h3 style={{ color: '#7DF9A6', margin: '0 0 10px 0', fontSize: 18 }}>Editar Grupo</h3>
        
        {/* Controle de Rotação */}
        <label style={{ width: '100%', marginBottom: 8, display: 'block', color: '#7DF9A6', fontWeight: 600, fontSize: 15 }}>
          Rotação: {Math.round(group.rotation || 0)}°
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={group.rotation || 0}
            onChange={handleRotationChange}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        {/* Controle de Escala */}
        <label style={{ width: '100%', marginBottom: 8, display: 'block', color: '#7DF9A6', fontWeight: 600, fontSize: 15 }}>
          Escala: {((group.scale || 1) * 100).toFixed(0)}%
          <input
            type="range"
            min={0.1}
            max={5}
            step={0.01}
            value={group.scale || 1}
            onChange={handleScaleChange}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
      </div>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
}