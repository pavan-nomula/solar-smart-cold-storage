import React from 'react';
import { useStorage } from '../context/StorageContext';
import { getBatteryBlocks } from '../utils/statusEngine';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sun,
  Snowflake,
  ShieldCheck,
  DoorClosed,
  DoorOpen
} from 'lucide-react';

export const FarmerModeView: React.FC = () => {
  const {
    t,
    temperature,
    humidity,
    battery,
    solarPower,
    coolingActive,
    doorOpen,
    toggleDoor,
    tempInterp,
    humidityInterp,
    batteryInterp,
    freshnessInterp,
    selectedCrop,
    alerts,
    openMetricModal
  } = useStorage();

  const batteryBlocks = getBatteryBlocks(battery);
  const activeAlerts = alerts.filter(a => a.active && a.severity !== 'info');

  return (
    <div className="farmer-mode-container">
      {/* Top Banner for Farmer Mode */}
      <div className="farmer-mode-header">
        <div className="farmer-mode-title-wrap">
          <span className="farmer-badge-highlight">🌾 {t.farmerMode} ON</span>
          <h2>{selectedCrop.icon} {selectedCrop.name} Storage Status</h2>
        </div>
        <p className="farmer-simple-sub">
          Simple glance view. If everything has green checkmarks (✓), your produce is 100% safe.
        </p>
      </div>

      {/* Main Urgent Alert Banner if any issue */}
      {activeAlerts.length > 0 ? (
        <div className="farmer-alert-card warning-state">
          <div className="farmer-alert-icon">⚠</div>
          <div className="farmer-alert-content">
            <h3 className="farmer-alert-title">{activeAlerts[0].title}</h3>
            <p className="farmer-alert-text">{activeAlerts[0].farmerMessage}</p>
            <div className="farmer-action-advice">
              👉 <strong>What you should do:</strong> {activeAlerts[0].recommendedAction}
            </div>
          </div>
        </div>
      ) : (
        <div className="farmer-alert-card safe-state">
          <div className="farmer-alert-icon">✓</div>
          <div className="farmer-alert-content">
            <h3 className="farmer-alert-title">ALL SYSTEMS SAFE ✓</h3>
            <p className="farmer-alert-text">No alerts. Produce is kept cold and fresh automatically.</p>
          </div>
        </div>
      )}

      {/* Large Farmer Grid Cards */}
      <div className="farmer-cards-grid">
        {/* CARD 1: VEGETABLES FRESHNESS */}
        <div className={`farmer-card ${freshnessInterp.statusLevel}`} onClick={() => openMetricModal('freshness')}>
          <div className="farmer-card-top">
            <span className="farmer-card-emoji">{selectedCrop.icon}</span>
            <span className="farmer-param-name">{t.metrics.freshness}</span>
            <button className="farmer-help-btn" title="What does this mean?">
              <HelpCircle size={18} />
            </button>
          </div>
          <div className="farmer-status-huge">
            {freshnessInterp.statusWord}
          </div>
          <div className="farmer-progress-wrapper">
            <div className="farmer-fill-bar" style={{ width: `${freshnessInterp.statusLevel === 'good' ? 92 : 55}%` }} />
          </div>
          <div className="farmer-simple-sentence">
            “{freshnessInterp.farmerExplanation}”
          </div>
        </div>

        {/* CARD 2: TEMPERATURE */}
        <div className={`farmer-card ${tempInterp.statusLevel}`} onClick={() => openMetricModal('temperature')}>
          <div className="farmer-card-top">
            <span className="farmer-card-emoji">🌡️</span>
            <span className="farmer-param-name">{t.metrics.temperature}</span>
            <button className="farmer-help-btn" title="What does this mean?">
              <HelpCircle size={18} />
            </button>
          </div>
          <div className="farmer-status-huge">
            {tempInterp.statusWord}
          </div>
          <div className="farmer-secondary-val">
            Chamber: <strong>{temperature.toFixed(1)}°C</strong>
            <span className="target-pill">Target: {selectedCrop.minTemp}–{selectedCrop.maxTemp}°C</span>
          </div>
          <div className="farmer-simple-sentence">
            “{tempInterp.farmerExplanation}”
          </div>
        </div>

        {/* CARD 3: MOISTURE / HUMIDITY */}
        <div className={`farmer-card ${humidityInterp.statusLevel}`} onClick={() => openMetricModal('humidity')}>
          <div className="farmer-card-top">
            <span className="farmer-card-emoji">💧</span>
            <span className="farmer-param-name">{t.metrics.humidity}</span>
            <button className="farmer-help-btn" title="What does this mean?">
              <HelpCircle size={18} />
            </button>
          </div>
          <div className="farmer-status-huge">
            {humidityInterp.statusWord}
          </div>
          <div className="farmer-secondary-val">
            Moisture: <strong>{humidity}%</strong> (Target: {selectedCrop.minHumidity}–{selectedCrop.maxHumidity}%)
          </div>
          <div className="farmer-simple-sentence">
            “{humidityInterp.farmerExplanation}”
          </div>
        </div>

        {/* CARD 4: BATTERY LEVEL (Phone style blocks) */}
        <div className={`farmer-card ${batteryInterp.statusLevel}`} onClick={() => openMetricModal('battery')}>
          <div className="farmer-card-top">
            <span className="farmer-card-emoji">🔋</span>
            <span className="farmer-param-name">{t.metrics.battery}</span>
            <button className="farmer-help-btn" title="What does this mean?">
              <HelpCircle size={18} />
            </button>
          </div>
          <div className="farmer-status-huge">
            {batteryInterp.statusWord}
          </div>
          {/* Visual battery blocks representation: ████████░░ */}
          <div className="battery-blocks-display">
            <span className="battery-blocks-filled">{batteryBlocks.filled}</span>
            <span className="battery-blocks-empty">{batteryBlocks.empty}</span>
            <span className="battery-pct-label">{battery}%</span>
          </div>
          <div className="farmer-simple-sentence">
            “{batteryInterp.farmerExplanation}”
          </div>
        </div>

        {/* CARD 5: SOLAR POWER */}
        <div className="farmer-card good" onClick={() => openMetricModal('solar')}>
          <div className="farmer-card-top">
            <span className="farmer-card-emoji">☀️</span>
            <span className="farmer-param-name">{t.metrics.solarPower}</span>
            <button className="farmer-help-btn" title="What does this mean?">
              <HelpCircle size={18} />
            </button>
          </div>
          <div className="farmer-status-huge">
            WORKING ✓
          </div>
          <div className="farmer-secondary-val">
            Generating: <strong>{solarPower} W</strong> Clean Free Solar Power
          </div>
          <div className="farmer-simple-sentence">
            “{t.farmerExplanations.solarGood}”
          </div>
        </div>

        {/* CARD 6: PELTIER COOLING */}
        <div className="farmer-card good" onClick={() => openMetricModal('cooling')}>
          <div className="farmer-card-top">
            <span className="farmer-card-emoji">❄️</span>
            <span className="farmer-param-name">{t.metrics.cooling}</span>
            <button className="farmer-help-btn" title="What does this mean?">
              <HelpCircle size={18} />
            </button>
          </div>
          <div className="farmer-status-huge">
            WORKING ✓
          </div>
          <div className="farmer-secondary-val">
            Peltier Modules: <strong>ACTIVE</strong> • Circulation Fans: <strong>RUNNING</strong>
          </div>
          <div className="farmer-simple-sentence">
            “{t.farmerExplanations.coolingGood}”
          </div>
        </div>
      </div>

      <style>{`
        .farmer-mode-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }
        .farmer-mode-header {
          background: #ffffff;
          padding: 20px;
          border-radius: var(--radius-lg);
          border: 2px solid #86efac;
          box-shadow: var(--shadow-sm);
          margin-bottom: 20px;
        }
        .farmer-mode-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        .farmer-badge-highlight {
          background: #16a34a;
          color: white;
          padding: 4px 12px;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }
        .farmer-mode-header h2 {
          font-size: 1.6rem;
          color: #0f172a;
        }
        .farmer-simple-sub {
          color: #475569;
          font-size: 1rem;
        }
        .farmer-alert-card {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          padding: 18px 24px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
        }
        .farmer-alert-card.safe-state {
          background: #f0fdf4;
          border: 2px solid #22c55e;
        }
        .farmer-alert-card.safe-state .farmer-alert-icon {
          background: #22c55e;
          color: white;
        }
        .farmer-alert-card.warning-state {
          background: #fef2f2;
          border: 2px solid #ef4444;
          animation: pulse-ring 2s infinite;
        }
        .farmer-alert-card.warning-state .farmer-alert-icon {
          background: #ef4444;
          color: white;
        }
        .farmer-alert-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: 900;
          flex-shrink: 0;
        }
        .farmer-alert-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .farmer-alert-text {
          font-size: 1rem;
          color: #334155;
        }
        .farmer-action-advice {
          margin-top: 8px;
          background: #ffffff;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 0.95rem;
          color: #0f172a;
        }
        .farmer-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }
        .farmer-card {
          background: #ffffff;
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-md);
          border: 3px solid transparent;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .farmer-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }
        .farmer-card.good {
          border-color: #22c55e;
          background: #f0fdf4;
        }
        .farmer-card.warning {
          border-color: #eab308;
          background: #fefce8;
        }
        .farmer-card.critical {
          border-color: #ef4444;
          background: #fef2f2;
        }
        .farmer-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .farmer-card-emoji {
          font-size: 2.5rem;
        }
        .farmer-param-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .farmer-help-btn {
          color: #64748b;
          padding: 4px;
          border-radius: 50%;
        }
        .farmer-help-btn:hover {
          color: #0f172a;
          background: rgba(0,0,0,0.06);
        }
        .farmer-status-huge {
          font-size: 2.1rem;
          font-weight: 900;
          letter-spacing: -0.01em;
          margin-bottom: 8px;
        }
        .farmer-card.good .farmer-status-huge {
          color: #15803d;
        }
        .farmer-card.warning .farmer-status-huge {
          color: #a16207;
        }
        .farmer-card.critical .farmer-status-huge {
          color: #b91c1c;
        }
        .farmer-secondary-val {
          font-size: 1rem;
          color: #475569;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .target-pill {
          background: #e2e8f0;
          color: #334155;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .farmer-progress-wrapper {
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .farmer-fill-bar {
          height: 100%;
          background: #22c55e;
          border-radius: 6px;
        }
        .battery-blocks-display {
          font-family: var(--font-mono);
          font-size: 1.4rem;
          letter-spacing: 2px;
          margin: 10px 0 14px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .battery-blocks-filled {
          color: #16a34a;
        }
        .battery-blocks-empty {
          color: #cbd5e1;
        }
        .battery-pct-label {
          font-size: 1rem;
          font-family: var(--font-main);
          font-weight: 800;
          color: #0f172a;
        }
        .farmer-simple-sentence {
          font-size: 1rem;
          font-style: italic;
          color: #1e293b;
          font-weight: 600;
          border-top: 1px dashed rgba(0,0,0,0.12);
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
};
