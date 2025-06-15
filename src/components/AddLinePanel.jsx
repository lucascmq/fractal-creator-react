// Componente para adicionar uma linha ao fractal
// Exibe inputs para coordenadas X e Y e um botão para confirmar
// Boas práticas: use estados locais para os inputs e valide os valores antes de adicionar

import React, { useState } from 'react';

export default function AddLinePanel({ onAdd, onCancel }) {
  // Limites centrados
  const MIN = -250;
  const MAX = 250;
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(100);
  const [y2, setY2] = useState(100);
  const clamp = (val) => Math.max(MIN, Math.min(MAX, Number(val)));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nx1 = clamp(x1);
    const ny1 = clamp(y1);
    const nx2 = clamp(x2);
    const ny2 = clamp(y2);
    if ([nx1, ny1, nx2, ny2].some(v => isNaN(v))) return;
    onAdd({ x1: nx1, y1: ny1, x2: nx2, y2: ny2 });
  };
  return (
    <div className="control-group">
      <label>Adicionar Linha</label>
      <form onSubmit={handleSubmit}>
        <div className="coordinate-inputs">
          <div>
            <label>X1:</label>
            <input
              type="number"
              value={x1}
              min={MIN}
              max={MAX}
              onChange={e => setX1(e.target.value)}
            />
          </div>
          <div>
            <label>Y1:</label>
            <input
              type="number"
              value={y1}
              min={MIN}
              max={MAX}
              onChange={e => setY1(e.target.value)}
            />
          </div>
        </div>
        <div className="coordinate-inputs">
          <div>
            <label>X2:</label>
            <input
              type="number"
              value={x2}
              min={MIN}
              max={MAX}
              onChange={e => setX2(e.target.value)}
            />
          </div>
          <div>
            <label>Y2:</label>
            <input
              type="number"
              value={y2}
              min={MIN}
              max={MAX}
              onChange={e => setY2(e.target.value)}
            />
          </div>
        </div>
        <div className="slope-info">
          Inclinação: {(y2 - y1) !== 0 ? ((x2 - x1) / (y2 - y1)).toFixed(2) : '∞'}
        </div>
        <div className="btn-group">
          <button type="submit" className="editor-btn">Adicionar</button>
          <button type="button" onClick={onCancel} className="editor-btn">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
