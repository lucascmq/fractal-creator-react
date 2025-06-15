// Componente para gerenciar as configurações do editor de fractais
// Permite configurar grid, snap, texto central, etc.

import React from 'react';
import { COLORS } from '../utils/colors';

export default function ConfigPanel({ 
  settings = {}, 
  onSettingsChange = () => {}, 
  onClearAll = () => {},
  onResetView = () => {},
  onInputBlur = () => {}
}) {
  // Handler para alterações de checkbox
  const handleSettingChange = (setting) => (e) => {
    onSettingsChange({
      ...settings,
      [setting]: e.target.checked
    });
  };
  
  // Handler para alteração do texto central
  const handleCenterTextChange = (e) => {
    onSettingsChange({
      ...settings,
      centerText: e.target.value
    });
  };

  // Handler para alteração da divisão do grid
  const handleGridDivisionChange = (e) => {
    const val = Number(e.target.value);
    if ([2,4,8,16].includes(val)) {
      onSettingsChange({ ...settings, gridDivisions: val });
    }
  };

  // Handler para scroll no select de divisões
  const handleGridDivisionWheel = (e) => {
    e.preventDefault();
    const divisors = [2, 4, 8, 16];
    const currentIdx = divisors.indexOf(settings.gridDivisions || 4);
    let nextIdx = currentIdx;
    if (e.deltaY > 0 && currentIdx < divisors.length - 1) nextIdx++;
    if (e.deltaY < 0 && currentIdx > 0) nextIdx--;
    if (nextIdx !== currentIdx) {
      onSettingsChange({ ...settings, gridDivisions: divisors[nextIdx], showGrid: true });
    }
  };  // Handler para scroll no slider de intensidade do grid
  const handleGridIntensityWheel = (e) => {
    e.stopPropagation(); // Impede que suba para o LeftPanel
    
    const currentValue = settings.gridIntensity || 0.3;
    const step = 0.1; // Incremento de 10% (10 frames total: 0.05 → 1.0)
    let newValue = currentValue;
    
    if (e.deltaY > 0) { // Scroll para baixo - diminui
      newValue = Math.max(0.05, currentValue - step);
    } else { // Scroll para cima - aumenta
      newValue = Math.min(1, currentValue + step);
    }
    
    onSettingsChange({ ...settings, gridIntensity: parseFloat(newValue.toFixed(2)) });
  };

  return (
    <div>
      <div className="control-group">
        <label style={{ color: '#4CC674', marginBottom: 12, display: 'block', textAlign: 'left' }}>🔲 Configurações do Grid:</label>
        <div className="config-row" style={{ width: '100%', flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
          <label htmlFor="gridDivisions" style={{ textAlign: 'center', marginBottom: 6, fontWeight: 500 }}>Divisão do Grid:</label>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 120, overflow: 'auto', marginTop: 6, marginBottom: 10 }}>
            <select
              id="gridDivisions"
              value={[2,4,8,16].includes(settings.gridDivisions) ? settings.gridDivisions : 4}
              onChange={handleGridDivisionChange}
              onWheel={handleGridDivisionWheel}
              style={{ width: '100%', textAlign: 'center' }}
            >
              <option value={2}>2x2</option>
              <option value={4}>4x4</option>
              <option value={8}>8x8</option>
              <option value={16}>16x16</option>
            </select>
          </div>
        </div>
        <div className="config-row" style={{ width: '100%', flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
          <label htmlFor="gridIntensity" style={{ textAlign: 'center', marginBottom: 6, fontWeight: 500 }}>Intensidade do grid:</label>          <input
            type="range"
            id="gridIntensity"
            min={0.05}
            max={1}
            step={0.01}
            value={settings.gridIntensity || 0.3}
            onChange={e => onSettingsChange({ ...settings, gridIntensity: parseFloat(e.target.value) })}
            onWheel={handleGridIntensityWheel}
            onBlur={() => {
              onInputBlur(); // Retorna foco para o painel
            }}
            tabIndex={0} // Torna o slider focável
            style={{ width: 120, outline: 'none' }}
          />
        </div>
        <div className="config-row" style={{ width: '100%', flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
          <label htmlFor="dashedGrid" style={{ textAlign: 'center', marginBottom: 6, fontWeight: 500 }}>Estilo das linhas do grid:</label>
          <button
            id="dashedGrid"
            onClick={() => onSettingsChange({ ...settings, dashedGrid: !settings.dashedGrid })}
            style={{ width: 120, padding: '6px 0', borderRadius: 4, border: `1px solid #4CC674`, background: settings.dashedGrid ? '#222' : '#4CC674', color: settings.dashedGrid ? '#4CC674' : '#222', fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}
          >
            {settings.dashedGrid ? 'Pontilhada' : 'Contínua'}
          </button>
        </div>
        <div className="config-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={settings.showGrid !== false}
              onChange={e => onSettingsChange({ ...settings, showGrid: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            Ligar grid
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={settings.snapToGrid}
              onChange={e => onSettingsChange({ ...settings, snapToGrid: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            Snap to grid
          </label>
        </div>
      </div>
      
      <div className="control-group">
        <label style={{ color: '#4CC674', marginBottom: 12, display: 'block', textAlign: 'left' }}>💬 Configurações Visuais:</label>
        <div className="tech-checkbox">
          <input 
            type="checkbox" 
            id="showCenterText" 
            checked={settings.showCenterText} 
            onChange={handleSettingChange('showCenterText')}
          />
          <label htmlFor="showCenterText">Mostrar texto central</label>
        </div>
        
        {/* Input para o texto central - aparece apenas quando o checkbox está marcado */}
        {settings.showCenterText && (
          <div className="text-input-control">
            <input
              type="text"
              value={settings.centerText || ''}
              onChange={handleCenterTextChange}
              placeholder="Digite uma frase para o centro..."
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: `1px solid ${COLORS.primary}`,
                borderRadius: '4px',
                color: COLORS.secondary,
                fontFamily: 'Rajdhani, monospace',
                outline: 'none'
              }}
            />
          </div>
        )}      </div>
      
      <div className="control-group">
        <label>🗑️ Ações:</label>
        <div className="btn-group">
          <button onClick={onClearAll} className="editor-btn">Limpar Tudo</button>
          <button onClick={onResetView} className="editor-btn">Resetar Visualização</button>
        </div>
      </div>
    </div>
  );
}
