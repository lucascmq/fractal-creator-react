import React from 'react';
import './OpacityPopover.css';
import LinePropertiesBox from './LinePropertiesBox';
import LineNameEditor from './LineNameEditor';

/**
 * Painel flutuante para edição de propriedades de linha no canvas.
 * Props:
 *   line: objeto da linha selecionada
 *   onUpdate: (props) => void
 *   onClose: () => void
 */
export default function LinePopover({ line, onUpdate, onClose }) {
  if (!line) return null;
  function handleRename(newName) {
    onUpdate({ ...line, name: newName });
  }
  return (
    <div className="opacity-popover" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
      <LineNameEditor name={line.name} onRename={handleRename} style={{ fontSize: 24, fontWeight: 700, color: '#4CC674', width: '100%', textAlign: 'center', marginTop: 0 }} />
      <button onClick={onClose} className="close-btn" style={{ position: 'absolute', top: 6, right: 8 }}>
        ×
      </button>
      <LinePropertiesBox line={line} onUpdate={onUpdate} />
    </div>
  );
}
