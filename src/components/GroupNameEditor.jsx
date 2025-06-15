import React, { useState, useRef, useEffect } from 'react';

/**
 * Componente para exibir e editar o nome de um grupo via double-click.
 * Props:
 *   name: string (nome atual do grupo)
 *   onRename: function (novoNome: string) => void
 *   style: objeto de estilo opcional
 */
export default function GroupNameEditor({ name, onRename, style = {} }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setValue(name);
  }, [name]);

  function handleDoubleClick() {
    setEditing(true);
  }

  function handleBlur() {
    setEditing(false);
    if (value.trim() && value !== name) {
      onRename(value.trim());
    } else {
      setValue(name); // volta ao valor original se vazio
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      inputRef.current.blur();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setValue(name);
    }
  }

  return editing ? (
    <input
      ref={inputRef}
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{
        fontSize: 15,
        fontFamily: 'Rajdhani, monospace',
        fontWeight: 600,
        color: '#4CC674',
        background: '#181A20',
        border: '1px solid #4CC674',
        borderRadius: 4,
        padding: '2px 6px',
        width: 120,
        ...style
      }}
      maxLength={32}
    />
  ) : (
    <span
      onDoubleClick={handleDoubleClick}
      style={{
        fontSize: 15,
        fontFamily: 'Rajdhani, monospace',
        fontWeight: 600,
        color: '#4CC674',
        background: 'transparent',
        borderRadius: 4,
        padding: '2px 6px',
        cursor: 'pointer',
        userSelect: 'text',
        ...style
      }}
      title="Clique duplo para renomear"
    >
      {name}
    </span>
  );
}
