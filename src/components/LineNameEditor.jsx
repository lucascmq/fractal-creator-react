import React, { useState, useEffect } from 'react';

export default function LineNameEditor({ name, onRename, style }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name || 'Linha');

  // Sincroniza o valor do input com o nome vindo das props
  useEffect(() => {
    setValue(name || 'Linha');
  }, [name]);

  function handleBlur() {
    setEditing(false);
    if (value.trim() && value !== name) {
      onRename(value.trim());
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setValue(name || 'Linha');
    }
  }

  return editing ? (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      style={{
        fontSize: 15,
        fontWeight: 700,
        color: '#4CC674',
        background: 'rgba(0,0,0,0.7)',
        border: '1.5px solid #4CC674',
        borderRadius: 4,
        padding: 12,
        minWidth: 60,
        ...style
      }}
    />
  ) : (
    <span
      title="Clique duas vezes para renomear"
      onDoubleClick={() => setEditing(true)}
      style={{
        cursor: 'pointer',
        fontSize: 24,
        fontWeight: 700,
        color: '#4CC674',
        width: '100%',
        textAlign: 'center',
        marginTop: 2,
        padding: 12,
        ...style
      }}
    >
      {value || 'Linha'}
    </span>
  );
}
