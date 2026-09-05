import React, { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Thermometer,
  Droplets,
  Wind,
  Battery,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const DemoSimulationBar: React.FC = () => {
  const {
    demoMode,
    setDemoMode,
    applySimulation,
    temperature,
    humidity,
    voc,
    battery,
    setManualTemperature,
    setManualHumidity,
    setManualVoc,
    setManualBattery
  } = useStorage();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!demoMode) return null;

  return (
    <div className="demo-simulation-bar-fixed">
      <div className="demo-bar-inner">
        <div className="demo-header-strip">
          <div className="demo-title-group">
            <span className="demo-badge">⚡ HARDWARE TELEMETRY CONTROLLER</span>
            <span className="demo-hint">
              1-Click scenarios to test hardware failsafes & deterioration warning engine
            </span>
          </div>

          <div className="demo-controls-right">
            <button
              className="toggle-expand-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse sliders" : "Expand sliders"}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              <span>{isExpanded ? "Minimize" : "Manual Sliders"}</span>
            </button>
            <button
              className="close-demo-bar-btn"
              onClick={() => setDemoMode(false)}
              title="Close Simulator Bar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 1-Click Scenario Buttons (Section 28) */}
        <div className="demo-scenarios-row">
          <button
            className="scenario-btn normal"
            onClick={() => applySimulation('normal')}
          >
            <RotateCcw size={14} /> Normal Storage (8.4°C, 86%)
          </button>

          <button
            className="scenario-btn warn-temp"
            onClick={() => applySimulation('temp_high')}
          >
            <Thermometer size={14} /> Temp High (14.6°C)
          </button>

          <button
            className="scenario-btn warn-hum"
            onClick={() => applySimulation('humidity_high')}
          >
            <Droplets size={14} /> Humidity High (98%)
          </button>

          <button
            className="scenario-btn warn-voc"
            onClick={() => applySimulation('voc_increase')}
          >
            <Wind size={14} /> VOC Gas Spike (Rot Warning)
          </button>

          <button
            className="scenario-btn warn-fresh"
            onClick={() => applySimulation('freshness_warning')}
          >
            <Sparkles size={14} /> Severe Spoilage Risk
          </button>

          <button
            className="scenario-btn warn-power"
            onClick={() => applySimulation('power_failure')}
          >
            <Zap size={14} /> ⚡ Power Grid Cut (Battery Backup)
          </button>

          <button
            className="scenario-btn good-solar"
            onClick={() => applySimulation('solar_charging')}
          >
            ☀️ Peak Solar (285W)
          </button>
        </div>

        {/* Collapsible Manual Sliders */}
        {isExpanded && (
          <div className="manual-sliders-drawer">
            <div className="slider-item">
              <div className="slider-header">
                <span>Temp: <strong>{temperature.toFixed(1)}°C</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.2"
                value={temperature}
                onChange={(e) => setManualTemperature(parseFloat(e.target.value))}
                className="custom-range"
              />
            </div>

            <div className="slider-item">
              <div className="slider-header">
                <span>Humidity: <strong>{humidity}%</strong></span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="1"
                value={humidity}
                onChange={(e) => setManualHumidity(parseInt(e.target.value))}
                className="custom-range"
              />
            </div>

            <div className="slider-item">
              <div className="slider-header">
                <span>Relative VOC: <strong>{voc}</strong></span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="2"
                value={voc}
                onChange={(e) => setManualVoc(parseInt(e.target.value))}
                className="custom-range"
              />
            </div>

            <div className="slider-item">
              <div className="slider-header">
                <span>Battery Reserve: <strong>{battery}%</strong></span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={battery}
                onChange={(e) => setManualBattery(parseInt(e.target.value))}
                className="custom-range"
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .demo-simulation-bar-fixed {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #0f172a;
          color: white;
          border-top: 2px solid #f59e0b;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.35);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .demo-bar-inner {
          max-width: 1500px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .demo-header-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .demo-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .demo-badge {
          background: #f59e0b;
          color: #0f172a;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 800;
          font-size: 0.72rem;
          letter-spacing: 0.04em;
        }
        .demo-hint {
          font-size: 0.78rem;
          color: #94a3b8;
        }
        .demo-controls-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toggle-expand-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: #cbd5e1;
          background: #1e293b;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .close-demo-bar-btn {
          color: #94a3b8;
          padding: 4px;
          border-radius: 4px;
        }
        .close-demo-bar-btn:hover {
          color: white;
          background: rgba(255,255,255,0.1);
        }
        .demo-scenarios-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 2px;
        }
        .scenario-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
          transition: transform 0.15s, filter 0.15s;
        }
        .scenario-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .scenario-btn.normal { background: #15803d; color: white; }
        .scenario-btn.warn-temp { background: #b91c1c; color: white; }
        .scenario-btn.warn-hum { background: #0369a1; color: white; }
        .scenario-btn.warn-voc { background: #b45309; color: white; }
        .scenario-btn.warn-fresh { background: #7e22ce; color: white; }
        .scenario-btn.warn-power { background: #dc2626; color: white; animation: pulse-ring 2s infinite; }
        .scenario-btn.good-solar { background: #d97706; color: white; }
        .manual-sliders-drawer {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          background: #1e293b;
          padding: 10px 14px;
          border-radius: 8px;
          margin-top: 4px;
        }
        .slider-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .slider-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #cbd5e1;
        }
        .slider-header strong {
          color: #38bdf8;
        }
        .custom-range {
          width: 100%;
          accent-color: #38bdf8;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
