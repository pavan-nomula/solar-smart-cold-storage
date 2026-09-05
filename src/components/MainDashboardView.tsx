import React from 'react';
import { useStorage } from '../context/StorageContext';
import { getBatteryBlocks } from '../utils/statusEngine';
import {
  Thermometer,
  Droplets,
  BatteryCharging,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
  Snowflake,
  Wind,
  DoorClosed,
  DoorOpen,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';

export const MainDashboardView: React.FC = () => {
  const {
    t,
    temperature,
    humidity,
    battery,
    batteryVoltage,
    batteryMode,
    solarPower,
    coolingPower,
    coolingActive,
    fansActive,
    doorOpen,
    toggleDoor,
    gridPower,
    tempInterp,
    humidityInterp,
    batteryInterp,
    freshnessInterp,
    freshnessAnalysis,
    selectedCrop,
    openMetricModal,
    setActiveTab,
    alerts
  } = useStorage();

  const batteryBlocks = getBatteryBlocks(battery);

  // Calculate circular gauge offset for Freshness (0-100)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (freshnessAnalysis.freshnessScore / 100) * circumference;

  // Temperature progress relative to safe crop range
  const tempRangeSpan = (selectedCrop.maxTemp + 6) - (selectedCrop.minTemp - 4);
  const tempOffsetRatio = Math.max(0, Math.min(100, ((temperature - (selectedCrop.minTemp - 4)) / tempRangeSpan) * 100));

  return (
    <div className="dashboard-view-container">
      {/* Power Failure / Battery Backup Prominent Alert */}
      {gridPower === 'FAILED' && (
        <div className="power-alert-banner">
          <div className="power-alert-left">
            <span className="power-alert-icon">⚡</span>
            <div>
              <h3 className="power-alert-title">POWER FAILURE DETECTED — BATTERY BACKUP ACTIVE</h3>
              <p className="power-alert-sub">
                Main grid power is unavailable. The system has seamlessly switched to Solar Battery Reserve. Cooling is continuing uninterrupted!
              </p>
            </div>
          </div>
          <div className="power-alert-badge">
            🔋 BATTERY MODE: DISCHARGING ({battery}%)
          </div>
        </div>
      )}

      {/* SECTION 6: FOUR PRIMARY STATUS CARDS */}
      <div className="primary-cards-grid">
        {/* CARD 1: TEMPERATURE */}
        <div className={`status-card ${tempInterp.statusLevel}`} id="card-temperature">
          <div className="card-top-row">
            <div className="card-title-group">
              <div className="icon-container temp-icon">
                <Thermometer size={22} />
              </div>
              <div>
                <span className="metric-label">{t.metrics.temperature}</span>
                <span className="crop-sublabel">Crop Target: {selectedCrop.minTemp}–{selectedCrop.maxTemp}°C</span>
              </div>
            </div>
            <button
              className="tooltip-trigger"
              onClick={() => openMetricModal('temperature')}
              title="What does this mean?"
            >
              ?
            </button>
          </div>

          <div className="card-value-row">
            <div className="big-numeric-value">
              {temperature.toFixed(1)}<span className="unit">°C</span>
            </div>
            <span className={`status-pill ${tempInterp.statusLevel}`}>
              {tempInterp.statusWord}
            </span>
          </div>

          {/* Range Slider Visualization */}
          <div className="metric-bar-track">
            <div
              className={`metric-bar-indicator ${tempInterp.statusLevel}`}
              style={{ left: `${tempOffsetRatio}%` }}
            />
            <div
              className="target-safe-zone"
              style={{
                left: `${((4) / tempRangeSpan) * 100}%`,
                width: `${((selectedCrop.maxTemp - selectedCrop.minTemp) / tempRangeSpan) * 100}%`
              }}
            />
          </div>
          <div className="range-limits-label">
            <span>Cold ({selectedCrop.minTemp - 4}°C)</span>
            <span className="safe-marker-text">Safe Band ({selectedCrop.minTemp}–{selectedCrop.maxTemp}°C)</span>
            <span>Warm ({selectedCrop.maxTemp + 6}°C)</span>
          </div>

          <div className="farmer-layer-box">
            <div className="farmer-badge-mini">🌾 Plain Language</div>
            <p className="farmer-phrase">“{tempInterp.farmerExplanation}”</p>
          </div>
        </div>

        {/* CARD 2: HUMIDITY */}
        <div className={`status-card ${humidityInterp.statusLevel}`} id="card-humidity">
          <div className="card-top-row">
            <div className="card-title-group">
              <div className="icon-container humidity-icon">
                <Droplets size={22} />
              </div>
              <div>
                <span className="metric-label">{t.metrics.humidity}</span>
                <span className="crop-sublabel">Crop Target: {selectedCrop.minHumidity}–{selectedCrop.maxHumidity}%</span>
              </div>
            </div>
            <button
              className="tooltip-trigger"
              onClick={() => openMetricModal('humidity')}
              title="What does this mean?"
            >
              ?
            </button>
          </div>

          <div className="card-value-row">
            <div className="big-numeric-value">
              {humidity}<span className="unit">%</span>
            </div>
            <span className={`status-pill ${humidityInterp.statusLevel}`}>
              {humidityInterp.statusWord}
            </span>
          </div>

          {/* Moisture Bar */}
          <div className="humidity-progress-track">
            <div
              className={`humidity-progress-fill ${humidityInterp.statusLevel}`}
              style={{ width: `${humidity}%` }}
            />
          </div>
          <div className="range-limits-label">
            <span>0% Dry</span>
            <span className="safe-marker-text">Optimal {selectedCrop.minHumidity}–{selectedCrop.maxHumidity}%</span>
            <span>100% Saturation</span>
          </div>

          <div className="farmer-layer-box">
            <div className="farmer-badge-mini">🌾 Plain Language</div>
            <p className="farmer-phrase">“{humidityInterp.farmerExplanation}”</p>
          </div>
        </div>

        {/* CARD 3: BATTERY */}
        <div className={`status-card ${batteryInterp.statusLevel}`} id="card-battery">
          <div className="card-top-row">
            <div className="card-title-group">
              <div className="icon-container battery-icon">
                <BatteryCharging size={22} />
              </div>
              <div>
                <span className="metric-label">{t.metrics.battery}</span>
                <span className="crop-sublabel">
                  Condition: <strong>GOOD</strong> • Charging: <strong>{batteryMode === 'CHARGING' ? 'YES ⚡' : 'NO'}</strong>
                </span>
              </div>
            </div>
            <button
              className="tooltip-trigger"
              onClick={() => openMetricModal('battery')}
              title="What does this mean?"
            >
              ?
            </button>
          </div>

          <div className="card-value-row">
            <div className="big-numeric-value">
              {battery}<span className="unit">%</span>
            </div>
            <span className={`status-pill ${batteryInterp.statusLevel}`}>
              {batteryInterp.statusWord}
            </span>
          </div>

          {/* Smartphone Battery Blocks Display (Req 6 & 7) */}
          <div className="battery-blocks-container">
            <div className="battery-blocks-row">
              <span className="blocks-filled">{batteryBlocks.filled}</span>
              <span className="blocks-empty">{batteryBlocks.empty}</span>
            </div>
            <div className="battery-tech-sub">
              Voltage: <strong>{batteryVoltage.toFixed(1)}V</strong> • Mode: {batteryMode}
            </div>
          </div>

          <div className="farmer-layer-box">
            <div className="farmer-badge-mini">🌾 Plain Language</div>
            <p className="farmer-phrase">“{batteryInterp.farmerExplanation}”</p>
          </div>
        </div>

        {/* CARD 4: FRESHNESS */}
        <div className={`status-card ${freshnessInterp.statusLevel}`} id="card-freshness">
          <div className="card-top-row">
            <div className="card-title-group">
              <div className="icon-container freshness-icon">
                <Sparkles size={22} />
              </div>
              <div>
                <span className="metric-label">{t.metrics.freshness}</span>
                <span className="crop-sublabel">
                  Deterioration Risk: <strong>{freshnessAnalysis.deteriorationRisk}</strong>
                </span>
              </div>
            </div>
            <button
              className="tooltip-trigger"
              onClick={() => openMetricModal('freshness')}
              title="What does this mean?"
            >
              ?
            </button>
          </div>

          <div className="freshness-card-body">
            <div className="freshness-circular-wrapper">
              <svg className="gauge-svg" width="128" height="128">
                <circle
                  className="gauge-bg"
                  cx="64"
                  cy="64"
                  r={radius}
                  strokeWidth="10"
                />
                <circle
                  className={`gauge-progress ${freshnessInterp.statusLevel}`}
                  cx="64"
                  cy="64"
                  r={radius}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="gauge-center-text">
                <span className="gauge-number">{freshnessAnalysis.freshnessScore}%</span>
                <span className="gauge-word">{freshnessAnalysis.deteriorationRisk} RISK</span>
              </div>
            </div>

            <div className="freshness-meta-col">
              <span className={`status-pill ${freshnessInterp.statusLevel}`}>
                {freshnessInterp.statusWord}
              </span>
              <div className="shelf-life-forecast">
                Est. Shelf Life: <strong>~{freshnessAnalysis.estimatedRemainingShelfLifeDays} days</strong>
              </div>
              <button
                className="view-freshness-btn"
                onClick={() => setActiveTab('freshness')}
              >
                Gas Analysis <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          <div className="farmer-layer-box">
            <div className="farmer-badge-mini">🌾 Plain Language</div>
            <p className="farmer-phrase">“{freshnessInterp.farmerExplanation}”</p>
          </div>
        </div>
      </div>

      {/* SECTION 11: LIVE STORAGE CONDITIONS GRID */}
      <div className="live-conditions-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Live Storage Conditions</h2>
            <p className="section-subtext">Comprehensive real-time telemetry from chamber ESP32 sensor array</p>
          </div>
          <span className="optimal-badge">
            <ShieldCheck size={16} /> STORAGE CONDITION: OPTIMAL ✓
          </span>
        </div>

        <div className="conditions-grid">
          <div className="condition-card">
            <div className="cond-icon-box temp-bg"><Thermometer size={20} /></div>
            <div className="cond-details">
              <span className="cond-title">Temperature</span>
              <div className="cond-val-row">
                <span className="cond-val">{temperature.toFixed(1)}°C</span>
                <span className="cond-status safe">SAFE ✓</span>
              </div>
              <span className="cond-explanation">“Temperature is good”</span>
            </div>
          </div>

          <div className="condition-card">
            <div className="cond-icon-box hum-bg"><Droplets size={20} /></div>
            <div className="cond-details">
              <span className="cond-title">Humidity</span>
              <div className="cond-val-row">
                <span className="cond-val">{humidity}%</span>
                <span className="cond-status safe">GOOD ✓</span>
              </div>
              <span className="cond-explanation">“Moisture level is suitable”</span>
            </div>
          </div>

          <div className="condition-card">
            <div className="cond-icon-box cool-bg"><Snowflake size={20} /></div>
            <div className="cond-details">
              <span className="cond-title">Cooling (Peltier)</span>
              <div className="cond-val-row">
                <span className="cond-val">ON ({coolingPower}W)</span>
                <span className="cond-status safe">WORKING ✓</span>
              </div>
              <span className="cond-explanation">“Cooling is maintaining chill”</span>
            </div>
          </div>

          <div className="condition-card">
            <div className="cond-icon-box fan-bg"><Wind size={20} /></div>
            <div className="cond-details">
              <span className="cond-title">Circulation Fans</span>
              <div className="cond-val-row">
                <span className="cond-val">ON (Dual Fans)</span>
                <span className="cond-status safe">WORKING ✓</span>
              </div>
              <span className="cond-explanation">“Even cold air distribution”</span>
            </div>
          </div>

          <div className="condition-card cursor-pointer" onClick={toggleDoor}>
            <div className={`cond-icon-box ${doorOpen ? 'door-open-bg' : 'door-closed-bg'}`}>
              {doorOpen ? <DoorOpen size={20} /> : <DoorClosed size={20} />}
            </div>
            <div className="cond-details">
              <span className="cond-title">Storage Door (Click to toggle)</span>
              <div className="cond-val-row">
                <span className="cond-val">{doorOpen ? 'OPEN' : 'CLOSED'}</span>
                <span className={`cond-status ${doorOpen ? 'warn' : 'safe'}`}>
                  {doorOpen ? 'ATTENTION ⚠' : 'SAFE ✓'}
                </span>
              </div>
              <span className="cond-explanation">
                {doorOpen ? '“Door open! Cold air escaping”' : '“Airtight seal maintained”'}
              </span>
            </div>
          </div>

          <div className="condition-card">
            <div className="cond-icon-box solar-bg"><Zap size={20} /></div>
            <div className="cond-details">
              <span className="cond-title">Solar & Power Flow</span>
              <div className="cond-val-row">
                <span className="cond-val">{solarPower}W</span>
                <span className="cond-status safe">SOLAR ACTIVE ☀️</span>
              </div>
              <span className="cond-explanation">“Solar power powering cooling”</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 13: FRESHNESS VISUAL SCALE & QUICK SUMMARY */}
      <div className="freshness-scale-section">
        <div className="scale-card">
          <div className="scale-header">
            <div>
              <h3 className="scale-title">Produce Freshness Index Scale</h3>
              <p className="scale-sub">Multi-sensor early deterioration warning scale for rural storage</p>
            </div>
            <div className="scale-current-chip">
              Current: <strong>{selectedCrop.name}</strong> • <strong>{freshnessAnalysis.freshnessScore}%</strong>
            </div>
          </div>

          {/* Stepped Scale Visual Indicator */}
          <div className="visual-scale-bar">
            <div className={`scale-step fresh-step ${freshnessAnalysis.freshnessScore >= 80 ? 'active-step' : ''}`}>
              <span className="step-icon">🥬</span>
              <span className="step-label">FRESH (80-100)</span>
              <span className="step-desc">Peak condition</span>
            </div>
            <div className={`scale-step monitor-step ${freshnessAnalysis.freshnessScore >= 60 && freshnessAnalysis.freshnessScore < 80 ? 'active-step' : ''}`}>
              <span className="step-icon">🔍</span>
              <span className="step-label">MONITOR (60-79)</span>
              <span className="step-desc">Normal ageing</span>
            </div>
            <div className={`scale-step warning-step ${freshnessAnalysis.freshnessScore >= 40 && freshnessAnalysis.freshnessScore < 60 ? 'active-step' : ''}`}>
              <span className="step-icon">⚠</span>
              <span className="step-label">WARNING (40-59)</span>
              <span className="step-desc">Softening / Risk</span>
            </div>
            <div className={`scale-step risk-step ${freshnessAnalysis.freshnessScore < 40 ? 'active-step' : ''}`}>
              <span className="step-icon">✕</span>
              <span className="step-label">HIGH RISK (0-39)</span>
              <span className="step-desc">Immediate action</span>
            </div>
          </div>

          <div className="scale-footer-explanation">
            <Info size={16} className="info-icon" />
            <span>
              <strong>Scientific Notice:</strong> Combines VOC relative signals, temperature deviations from {selectedCrop.idealTemp}°C, and storage duration to anticipate deterioration before visible mold occurs.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-view-container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px;
        }
        .power-alert-banner {
          background: linear-gradient(90deg, #b91c1c 0%, #dc2626 100%);
          color: white;
          padding: 16px 24px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.35);
          animation: pulse-ring 2s infinite;
        }
        .power-alert-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .power-alert-icon {
          font-size: 2rem;
          background: rgba(255,255,255,0.2);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .power-alert-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
        }
        .power-alert-sub {
          font-size: 0.88rem;
          color: #fecaca;
        }
        .power-alert-badge {
          background: #ffffff;
          color: #991b1b;
          padding: 6px 14px;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 0.82rem;
          white-space: nowrap;
        }
        .primary-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }
        .status-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 22px;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .status-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .status-card.good {
          border-top: 4px solid #22c55e;
        }
        .status-card.warning {
          border-top: 4px solid #eab308;
        }
        .status-card.critical {
          border-top: 4px solid #ef4444;
        }
        .card-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .card-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .icon-container {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .temp-icon { background: #fee2e2; color: #dc2626; }
        .humidity-icon { background: #e0f2fe; color: #0284c7; }
        .battery-icon { background: #dcfce7; color: #16a34a; }
        .freshness-icon { background: #f3e8ff; color: #9333ea; }
        .metric-label {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
        }
        .crop-sublabel {
          display: block;
          font-size: 0.76rem;
          color: #64748b;
        }
        .card-value-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .big-numeric-value {
          font-size: 2.5rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: #0f172a;
          line-height: 1;
        }
        .big-numeric-value .unit {
          font-size: 1.3rem;
          font-weight: 600;
          color: #64748b;
          margin-left: 2px;
        }
        .status-pill {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .status-pill.good {
          background: #dcfce7;
          color: #15803d;
        }
        .status-pill.warning {
          background: #fef9c3;
          color: #854d0e;
        }
        .status-pill.critical {
          background: #fee2e2;
          color: #991b1b;
        }
        .metric-bar-track {
          height: 10px;
          background: #e2e8f0;
          border-radius: 6px;
          position: relative;
          margin: 10px 0 6px 0;
          overflow: visible;
        }
        .target-safe-zone {
          position: absolute;
          top: 0;
          height: 100%;
          background: rgba(34, 197, 94, 0.35);
          border-radius: 4px;
        }
        .metric-bar-indicator {
          position: absolute;
          top: -4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          transform: translateX(-50%);
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .metric-bar-indicator.good { background: #16a34a; }
        .metric-bar-indicator.warning { background: #eab308; }
        .metric-bar-indicator.critical { background: #dc2626; }
        .range-limits-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #94a3b8;
          margin-bottom: 14px;
        }
        .safe-marker-text {
          color: #16a34a;
          font-weight: 700;
        }
        .humidity-progress-track {
          height: 10px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          margin: 10px 0 6px 0;
        }
        .humidity-progress-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.4s ease;
        }
        .humidity-progress-fill.good { background: #0284c7; }
        .humidity-progress-fill.warning { background: #eab308; }
        .humidity-progress-fill.critical { background: #dc2626; }
        .battery-blocks-container {
          margin: 8px 0 12px 0;
        }
        .battery-blocks-row {
          font-family: var(--font-mono);
          font-size: 1.25rem;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }
        .blocks-filled { color: #16a34a; }
        .blocks-empty { color: #cbd5e1; }
        .battery-tech-sub {
          font-size: 0.76rem;
          color: #64748b;
        }
        .freshness-card-body {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }
        .freshness-circular-wrapper {
          position: relative;
          width: 110px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gauge-svg {
          transform: rotate(-90deg);
          width: 110px;
          height: 110px;
        }
        .gauge-bg {
          fill: none;
          stroke: #f1f5f9;
        }
        .gauge-progress {
          fill: none;
          transition: stroke-dashoffset 0.5s ease;
        }
        .gauge-progress.good { stroke: #16a34a; }
        .gauge-progress.warning { stroke: #eab308; }
        .gauge-progress.critical { stroke: #dc2626; }
        .gauge-center-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .gauge-number {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
        }
        .gauge-word {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
        }
        .freshness-meta-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .shelf-life-forecast {
          font-size: 0.8rem;
          color: #334155;
        }
        .view-freshness-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #2563eb;
          padding: 3px 6px;
          border-radius: 4px;
          background: #eff6ff;
          width: fit-content;
        }
        .farmer-layer-box {
          margin-top: auto;
          background: #f8fafc;
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
        }
        .farmer-badge-mini {
          font-size: 0.7rem;
          font-weight: 800;
          color: #166534;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .farmer-phrase {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1e293b;
        }
        .live-conditions-section {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
        }
        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }
        .section-heading {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
        }
        .section-subtext {
          font-size: 0.88rem;
          color: #64748b;
        }
        .optimal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #dcfce7;
          color: #15803d;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 800;
          border: 1px solid #86efac;
        }
        .conditions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .condition-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          gap: 14px;
          transition: all 0.2s;
        }
        .condition-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: var(--shadow-sm);
        }
        .condition-card.cursor-pointer {
          cursor: pointer;
        }
        .cond-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .temp-bg { background: #fee2e2; color: #dc2626; }
        .hum-bg { background: #e0f2fe; color: #0284c7; }
        .cool-bg { background: #eff6ff; color: #2563eb; }
        .fan-bg { background: #f3e8ff; color: #7c3aed; }
        .door-closed-bg { background: #dcfce7; color: #16a34a; }
        .door-open-bg { background: #fee2e2; color: #dc2626; }
        .solar-bg { background: #fef3c7; color: #d97706; }
        .cond-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cond-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
        }
        .cond-val-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cond-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
        }
        .cond-status {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .cond-status.safe { background: #dcfce7; color: #15803d; }
        .cond-status.warn { background: #fee2e2; color: #b91c1c; }
        .cond-explanation {
          font-size: 0.76rem;
          color: #475569;
          font-style: italic;
        }
        .freshness-scale-section {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .scale-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .scale-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .scale-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
        }
        .scale-sub {
          font-size: 0.85rem;
          color: #64748b;
        }
        .scale-current-chip {
          background: #f1f5f9;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          color: #1e293b;
        }
        .visual-scale-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        .scale-step {
          padding: 14px;
          border-radius: var(--radius-md);
          border: 2px solid transparent;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #f8fafc;
          transition: all 0.2s;
        }
        .fresh-step { border-color: #86efac; }
        .monitor-step { border-color: #fde047; }
        .warning-step { border-color: #fca5a5; }
        .risk-step { border-color: #f87171; }
        .scale-step.active-step {
          transform: scale(1.03);
          box-shadow: var(--shadow-md);
        }
        .fresh-step.active-step { background: #f0fdf4; border-color: #22c55e; }
        .monitor-step.active-step { background: #fefce8; border-color: #eab308; }
        .warning-step.active-step { background: #fff7ed; border-color: #f97316; }
        .risk-step.active-step { background: #fef2f2; border-color: #ef4444; }
        .step-icon { font-size: 1.4rem; }
        .step-label { font-size: 0.88rem; font-weight: 800; color: #0f172a; }
        .step-desc { font-size: 0.75rem; color: #64748b; }
        .scale-footer-explanation {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #475569;
          background: #f8fafc;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          border: 1px solid #e2e8f0;
        }
        .info-icon { color: #2563eb; flex-shrink: 0; }
      `}</style>
    </div>
  );
};
