import React from 'react';

/**
 * Painel de propriedades para edição de linhas.
 * Props:
 *   line: objeto da linha selecionada
 *   onUpdate: (props) => void
 */
export default function LinePropertiesBox({ line, onUpdate }) {
  if (!line) return null;

  // Handlers
  const handleTypeChange = (e) => {
    onUpdate({ ...line, isDashed: e.target.value === 'dashed' });
  };
  const handleOpacityChange = (e) => {
    onUpdate({ ...line, opacity: Number(e.target.value) });
  };
  const handleWidthChange = (e) => {
    onUpdate({ ...line, strokeWidth: Number(e.target.value) });
  };
  // Handlers para dash
  const handleDashLengthChange = (e) => {
    onUpdate({ ...line, dashLength: Number(e.target.value) });
  };
  const handleDashSpacingChange = (e) => {
    onUpdate({ ...line, dashSpacing: Number(e.target.value) });
  };

  return (
    <div style={{
      background: 'transparent',
      border: 'none',
      borderRadius: 12,
      padding: 0,
      margin: '0 auto 8px auto',
      minHeight: 'auto',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 340,
      minWidth: 220,
      boxSizing: 'border-box',
      gap: 0
    }}>
      {/* Primeira linha: Tipo (coluna 1) e dash (coluna 2, sempre visível) */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', marginBottom: 24 }}>
        {/* Coluna 1: Tipo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 120, flex: 1 }}>
          <label style={{ color: '#7DF9A6', fontSize: 15, fontFamily: 'Rajdhani, monospace', fontWeight: 500, marginBottom: 2, textAlign: 'left' }}>Tipo</label>
          <select value={line.isDashed ? 'dashed' : 'solid'} onChange={handleTypeChange} style={{ width: 120, fontSize: 15, borderRadius: 6, padding: '6px 12px', background: '#181A20', color: '#7DF9A6', border: '1.5px solid #4CC674', marginTop: 2, marginBottom: 2, textAlign: 'left' }}>
            <option value="solid">Contínua</option>
            <option value="dashed">Pontilhada</option>
          </select>
        </div>
        {/* Coluna 2: Dash sempre visível, desabilitado se não for pontilhada */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', minWidth: 0, marginLeft: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label style={{ color: '#7DF9A6', fontSize: 13, marginBottom: 2 }}>Tamanho do traço</label>
              <input type="number" min={2} max={40} step={1} value={line.dashLength ?? 12} onChange={handleDashLengthChange} disabled={!line.isDashed} style={{ width: 48, background: '#181A20', color: '#7DF9A6', border: '1.5px solid #4CC674', borderRadius: 4, fontSize: 13, textAlign: 'center', opacity: line.isDashed ? 1 : 0.5 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label style={{ color: '#7DF9A6', fontSize: 13, marginBottom: 2 }}>Espaço</label>
              <input type="number" min={2} max={40} step={1} value={line.dashSpacing ?? 8} onChange={handleDashSpacingChange} disabled={!line.isDashed} style={{ width: 48, background: '#181A20', color: '#7DF9A6', border: '1.5px solid #4CC674', borderRadius: 4, fontSize: 13, textAlign: 'center', opacity: line.isDashed ? 1 : 0.5 }} />
            </div>
          </div>
        </div>
      </div>
      {/* Segunda linha: Opacidade e Largura lado a lado */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 32, width: '100%', marginBottom: 8 }}>
        {/* Opacidade */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1 }}>
          <label style={{ color: '#7DF9A6', fontSize: 13, fontFamily: 'Rajdhani, monospace', fontWeight: 500, marginBottom: 2 }}>Opacidade</label>
          <div style={{ background: 'rgba(0,0,0,0.7)', border: '1.5px solid #4CC674', borderRadius: 6, padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 8px rgba(76, 198, 116, 0.5)', width: 100, height: 28 }}>
            <input type="range" min={0} max={1} step={0.01} value={line.opacity ?? 1} onChange={handleOpacityChange} style={{ width: '100%', cursor: 'pointer', touchAction: 'none', background: 'linear-gradient(to right, rgba(125, 249, 166, 0.1), rgba(125, 249, 166, 0.7))', height: '8px', borderRadius: '4px', WebkitAppearance: 'none', appearance: 'none', border: 'none', zIndex: 100, pointerEvents: 'all', boxShadow: 'none' }} className="opacity-slider light-slider" />
          </div>
          <input type="number" min={0} max={1} step={0.01} value={line.opacity ?? 1} onChange={handleOpacityChange} style={{ width: 38, marginTop: 2, background: '#181A20', color: '#7DF9A6', border: '1.5px solid #4CC674', borderRadius: 4, fontSize: 13, textAlign: 'center' }} />
        </div>
        {/* Largura */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1 }}>
          <label style={{ color: '#7DF9A6', fontSize: 13, fontFamily: 'Rajdhani, monospace', fontWeight: 500, marginBottom: 2 }}>Largura</label>
          <div style={{ background: 'rgba(0,0,0,0.7)', border: '1.5px solid #4CC674', borderRadius: 6, padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 8px rgba(76, 198, 116, 0.5)', width: 100, height: 28 }}>
            <input type="range" min={1} max={8} step={1} value={line.strokeWidth ?? 2} onChange={handleWidthChange} style={{ width: '100%', cursor: 'pointer', touchAction: 'none', background: 'linear-gradient(to right, rgba(125, 249, 166, 0.1), rgba(125, 249, 166, 0.7))', height: '8px', borderRadius: '4px', WebkitAppearance: 'none', appearance: 'none', border: 'none', zIndex: 100, pointerEvents: 'all', boxShadow: 'none' }} className="opacity-slider light-slider" />
          </div>
          <input type="number" min={1} max={8} step={1} value={line.strokeWidth ?? 2} onChange={handleWidthChange} style={{ width: 38, marginTop: 2, background: '#181A20', color: '#7DF9A6', border: '1.5px solid #4CC674', borderRadius: 4, fontSize: 13, textAlign: 'center' }} />
        </div>
      </div>
    </div>
  );
}
