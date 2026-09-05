import React from 'react';
import { useStorage } from '../context/StorageContext';
import { getBatteryBlocks } from '../utils/statusEngine';
import {
  Sun,
  BatteryCharging,
  Zap,
  Snowflake,
  Wind,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Power,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const EnergyView: React.FC = () => {
  const {
    t,
    solarPower,
    battery,
    batteryVoltage,
    batteryCurrent,
    coolingPower,
    coolingActive,
    fansActive,
    gridPower,
    batteryMode,
    dailySolarKwh,
    dailyConsumedKwh,
    selectedCrop,
    temperature,
    applySimulation,
    farmerMode
  } = useStorage();

  const batteryBlocks = getBatteryBlocks(battery);
  const netPower = solarPower - coolingPower;

  return (
    <div className="energy-view-container">
      {/* Top Banner */}
      <div className="energy-header-card">
        <div className="energy-header-text">
          <span className="solar-badge">
            <Sun size={14} /> AUTONOMOUS OFF-GRID SOLAR MICROGRID
          </span>
          <h2>Solar Power & Energy Management</h2>
          <p>
            Smart MPPT charge controller and battery backup keeping Peltier solid-state chillers running 24/7 in off-grid rural villages.
          </p>
        </div>

        <div className="energy-quick-stats">
          <div className="eq-box">
            <span className="eq-label">Daily Solar Harvest</span>
            <span className="eq-val text-solar">{dailySolarKwh} kWh</span>
          </div>
          <div className="eq-box">
            <span className="eq-label">Daily Consumption</span>
            <span className="eq-val text-cooling">{dailyConsumedKwh} kWh</span>
          </div>
          <div className="eq-box">
            <span className="eq-label">Net Daily Surplus</span>
            <span className="eq-val text-green">+{(dailySolarKwh - dailyConsumedKwh).toFixed(2)} kWh</span>
          </div>
        </div>
      </div>

      {/* SECTION 23: POWER FAILURE STATUS & SIMULATION TOGGLE */}
      <div className={`power-status-card ${gridPower === 'FAILED' ? 'failure-mode' : 'normal-mode'}`}>
        <div className="ps-left">
          <div className="ps-icon-wrap">
            <Power size={26} />
          </div>
          <div>
            <div className="ps-title-row">
              <h3>Grid Power Status: <strong>{gridPower}</strong></h3>
              <span className={`ps-pill ${gridPower === 'AVAILABLE' ? 'safe' : 'alert'}`}>
                {gridPower === 'AVAILABLE' ? 'GRID CONNECTED / OPTIONAL' : '⚡ POWER FAILURE DETECTED'}
              </span>
            </div>
            <p className="ps-desc">
              {gridPower === 'FAILED'
                ? 'Main power is unavailable. Cooling is continuing automatically using solar battery reserve!'
                : 'Primary power operates off rooftop solar with automated battery charging.'}
            </p>
          </div>
        </div>

        <div className="ps-action-wrap">
          <button
            className={`simulate-cut-btn ${gridPower === 'FAILED' ? 'restore' : 'cut'}`}
            onClick={() => applySimulation(gridPower === 'FAILED' ? 'normal' : 'power_failure')}
          >
            {gridPower === 'FAILED' ? '✓ Restore Main Grid' : '⚡ Simulate Power Cut'}
          </button>
        </div>
      </div>

      {/* SECTION 20: ANIMATED ENERGY FLOW DIAGRAM */}
      <div className="energy-flow-section">
        <div className="flow-title-row">
          <div>
            <h3>Real-Time Energy Flow</h3>
            <p>Animated energy pathways from photovoltaic array to cold chamber</p>
          </div>
          <span className="live-flow-rate">
            Net Generation: <strong>+{netPower} W</strong>
          </span>
        </div>

        <div className="flow-nodes-container">
          {/* NODE 1: SOLAR PANEL */}
          <div className="flow-node-box solar-node">
            <div className="node-head">
              <Sun size={24} className="node-icon solar-spin" />
              <span className="node-name">Solar Array</span>
            </div>
            <div className="node-big-metric">
              {solarPower} <span className="unit">W</span>
            </div>
            <div className="node-status-text safe">GENERATING ☀️</div>
            <div className="node-sub">Monocrystalline 400Wp</div>
          </div>

          <div className="flow-arrow-wire">
            <div className="arrow-wire-line" />
            <span className="wire-flow-label">{solarPower}W</span>
          </div>

          {/* NODE 2: CHARGE CONTROLLER (MPPT) */}
          <div className="flow-node-box mppt-node">
            <div className="node-head">
              <Cpu size={24} className="node-icon" />
              <span className="node-name">MPPT Controller</span>
            </div>
            <div className="node-big-metric">
              97.8 <span className="unit">% Eff.</span>
            </div>
            <div className="node-status-text safe">TRACKING PEAK ✓</div>
            <div className="node-sub">Algorithm: Perturb & Observe</div>
          </div>

          <div className="flow-arrow-wire">
            <div className="arrow-wire-line" />
            <span className="wire-flow-label">
              {batteryMode === 'CHARGING' ? `Charge ${batteryCurrent}A` : `Draw ${batteryCurrent}A`}
            </span>
          </div>

          {/* NODE 3: BATTERY BACKUP */}
          <div className="flow-node-box battery-node">
            <div className="node-head">
              <BatteryCharging size={24} className="node-icon" />
              <span className="node-name">Battery Storage</span>
            </div>
            <div className="node-big-metric">
              {battery} <span className="unit">%</span>
            </div>
            <div className="node-status-text safe">{batteryMode} 🔋</div>
            <div className="node-sub">{batteryVoltage.toFixed(1)}V • Deep Cycle</div>
          </div>

          <div className="flow-arrow-wire">
            <div className="arrow-wire-line" />
            <span className="wire-flow-label">{coolingPower}W</span>
          </div>

          {/* NODE 4: PELTIER COOLING & STORAGE */}
          <div className="flow-node-box cooling-node">
            <div className="node-head">
              <Snowflake size={24} className="node-icon" />
              <span className="node-name">Peltier Cooler</span>
            </div>
            <div className="node-big-metric">
              {coolingPower} <span className="unit">W</span>
            </div>
            <div className="node-status-text safe">ACTIVE CHILLING ❄️</div>
            <div className="node-sub">Chamber: {temperature.toFixed(1)}°C</div>
          </div>
        </div>
      </div>

      {/* SECTION 22: COOLING HARDWARE SPECIFICATIONS */}
      <div className="hardware-cards-grid">
        {/* COOLING SYSTEM STATUS */}
        <div className="hw-card">
          <div className="hw-card-header">
            <div className="hw-title-row">
              <Snowflake size={20} className="hw-icon-cool" />
              <div>
                <h4>Peltier Thermoelectric Modules</h4>
                <span>Dual TEC1-12706 Semiconductor Array</span>
              </div>
            </div>
            <span className="hw-status-badge active">ONLINE</span>
          </div>

          <div className="hw-param-list">
            <div className="hw-param-row">
              <span>Module 1 Status</span>
              <strong className="text-green">RUNNING (12V / 3A)</strong>
            </div>
            <div className="hw-param-row">
              <span>Module 2 Status</span>
              <strong className="text-green">RUNNING (12V / 3A)</strong>
            </div>
            <div className="hw-param-row">
              <span>Cooling Power Consumption</span>
              <strong>{coolingPower} W</strong>
            </div>
            <div className="hw-param-row">
              <span>Cold Side Delta-T</span>
              <strong>-14.2°C vs Ambient</strong>
            </div>
          </div>
        </div>

        {/* FANS & HEAT DISSIPATION */}
        <div className="hw-card">
          <div className="hw-card-header">
            <div className="hw-title-row">
              <Wind size={20} className="hw-icon-fan" />
              <div>
                <h4>Circulation & Exhaust Fans</h4>
                <span>Forced convection heat rejection</span>
              </div>
            </div>
            <span className="hw-status-badge active">ONLINE</span>
          </div>

          <div className="hw-param-list">
            <div className="hw-param-row">
              <span>Hot-Side Heat Sink Fan</span>
              <strong className="text-green">ACTIVE (2400 RPM)</strong>
            </div>
            <div className="hw-param-row">
              <span>Cold-Side Chamber Circulation</span>
              <strong className="text-green">ACTIVE (1800 RPM)</strong>
            </div>
            <div className="hw-param-row">
              <span>Heat Dissipation Block</span>
              <strong>Anodized Aluminum Multi-Fin</strong>
            </div>
            <div className="hw-param-row">
              <span>Thermal Cutoff Safe Limit</span>
              <strong>65.0°C (Current: 38.4°C Safe)</strong>
            </div>
          </div>
        </div>

        {/* BATTERY BACKUP HEALTH */}
        <div className="hw-card">
          <div className="hw-card-header">
            <div className="hw-title-row">
              <BatteryCharging size={20} className="hw-icon-batt" />
              <div>
                <h4>Battery Subsystem (12.8V Pack)</h4>
                <span>LiFePO4 / Lead-Carbon Deep Reserve</span>
              </div>
            </div>
            <span className="hw-status-badge active">NOMINAL</span>
          </div>

          <div className="hw-param-list">
            <div className="hw-param-row">
              <span>State of Charge (SOC)</span>
              <strong>{battery}% ({batteryBlocks.text})</strong>
            </div>
            <div className="hw-param-row">
              <span>Pack Terminal Voltage</span>
              <strong>{batteryVoltage.toFixed(1)} V</strong>
            </div>
            <div className="hw-param-row">
              <span>Autonomy Reserve Without Sun</span>
              <strong>~16 Hours Continuous</strong>
            </div>
            <div className="hw-param-row">
              <span>BMS Cell Balance</span>
              <strong className="text-green">BALANCED (3.25V/cell)</strong>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .energy-view-container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px;
        }
        .energy-header-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .solar-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fef3c7;
          color: #b45309;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .energy-header-text h2 {
          font-size: 1.6rem;
          color: #0f172a;
        }
        .energy-header-text p {
          color: #64748b;
          font-size: 0.92rem;
          max-width: 650px;
        }
        .energy-quick-stats {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .eq-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 12px 18px;
          display: flex;
          flex-direction: column;
        }
        .eq-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }
        .eq-val {
          font-size: 1.3rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .text-solar { color: #d97706; }
        .text-cooling { color: #2563eb; }
        .text-green { color: #16a34a; }
        .power-status-card {
          border-radius: var(--radius-md);
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }
        .power-status-card.normal-mode {
          background: #f0fdf4;
          border: 1.5px solid #86efac;
        }
        .power-status-card.failure-mode {
          background: #fef2f2;
          border: 2px solid #ef4444;
          animation: pulse-ring 2s infinite;
        }
        .ps-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .ps-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          box-shadow: var(--shadow-sm);
        }
        .normal-mode .ps-icon-wrap { color: #16a34a; }
        .failure-mode .ps-icon-wrap { color: #dc2626; }
        .ps-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 2px;
        }
        .ps-title-row h3 {
          font-size: 1.15rem;
          color: #0f172a;
        }
        .ps-pill {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 800;
        }
        .ps-pill.safe { background: #dcfce7; color: #15803d; }
        .ps-pill.alert { background: #fee2e2; color: #b91c1c; }
        .ps-desc {
          font-size: 0.88rem;
          color: #475569;
        }
        .simulate-cut-btn {
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          transition: all 0.2s;
        }
        .simulate-cut-btn.cut {
          background: #dc2626;
          color: white;
        }
        .simulate-cut-btn.cut:hover { background: #b91c1c; }
        .simulate-cut-btn.restore {
          background: #16a34a;
          color: white;
        }
        .simulate-cut-btn.restore:hover { background: #15803d; }
        .energy-flow-section {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .flow-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .flow-title-row h3 {
          font-size: 1.3rem;
          color: #0f172a;
        }
        .flow-title-row p {
          font-size: 0.85rem;
          color: #64748b;
        }
        .live-flow-rate {
          background: #f1f5f9;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.85rem;
          color: #0f172a;
        }
        .flow-nodes-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 10px 0;
        }
        .flow-node-box {
          flex: 1 1 180px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s;
        }
        .flow-node-box:hover {
          transform: translateY(-2px);
        }
        .solar-node { border-color: #fde047; background: #fffbeb; }
        .mppt-node { border-color: #cbd5e1; }
        .battery-node { border-color: #86efac; background: #f0fdf4; }
        .cooling-node { border-color: #bfdbfe; background: #eff6ff; }
        .node-head {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .node-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }
        .node-big-metric {
          font-size: 1.8rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
        }
        .node-big-metric .unit {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 600;
        }
        .node-status-text {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .node-status-text.safe { color: #15803d; }
        .node-sub {
          font-size: 0.72rem;
          color: #64748b;
        }
        .flow-arrow-wire {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 50px;
        }
        .arrow-wire-line {
          width: 40px;
          height: 3px;
          background: #94a3b8;
          border-radius: 2px;
          position: relative;
        }
        .wire-flow-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: #475569;
          font-family: var(--font-mono);
        }
        .hardware-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }
        .hw-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 22px;
          box-shadow: var(--shadow-sm);
        }
        .hw-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        .hw-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hw-title-row h4 {
          font-size: 1rem;
          color: #0f172a;
        }
        .hw-title-row span {
          font-size: 0.75rem;
          color: #64748b;
        }
        .hw-icon-cool { color: #0284c7; }
        .hw-icon-fan { color: #7c3aed; }
        .hw-icon-batt { color: #16a34a; }
        .hw-status-badge {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .hw-status-badge.active { background: #dcfce7; color: #15803d; }
        .hw-param-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .hw-param-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #475569;
        }
        .hw-param-row strong {
          color: #0f172a;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
