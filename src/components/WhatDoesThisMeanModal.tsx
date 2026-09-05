import React from 'react';
import { useStorage } from '../context/StorageContext';
import { HelpCircle, X, CheckCircle2, AlertTriangle, ShieldCheck, Wrench, Sprout } from 'lucide-react';

export const WhatDoesThisMeanModal: React.FC = () => {
  const {
    activeModalMetric,
    closeMetricModal,
    tempInterp,
    humidityInterp,
    batteryInterp,
    freshnessInterp,
    systemInterp,
    temperature,
    humidity,
    battery,
    voc,
    alcohol,
    h2s,
    nh3,
    selectedCrop
  } = useStorage();

  if (!activeModalMetric) return null;

  let modalData = {
    title: 'Metric Explanation',
    badge: 'SAFE ✓',
    badgeColor: 'good',
    currentVal: '',
    farmerAdvice: '',
    technicalDetails: '',
    impactOnCrops: ''
  };

  if (activeModalMetric === 'temperature') {
    modalData = {
      title: `${tempInterp.whatDoesThisMean.title} (${selectedCrop.name})`,
      badge: tempInterp.statusWord,
      badgeColor: tempInterp.statusLevel,
      currentVal: `${temperature.toFixed(1)}°C (Target: ${selectedCrop.minTemp}°C–${selectedCrop.maxTemp}°C)`,
      farmerAdvice: tempInterp.whatDoesThisMean.farmerAdvice,
      technicalDetails: tempInterp.whatDoesThisMean.technicalDetails,
      impactOnCrops: tempInterp.whatDoesThisMean.impactOnCrops
    };
  } else if (activeModalMetric === 'humidity') {
    modalData = {
      title: `${humidityInterp.whatDoesThisMean.title} (${selectedCrop.name})`,
      badge: humidityInterp.statusWord,
      badgeColor: humidityInterp.statusLevel,
      currentVal: `${humidity}% (Target: ${selectedCrop.minHumidity}%–${selectedCrop.maxHumidity}%)`,
      farmerAdvice: humidityInterp.whatDoesThisMean.farmerAdvice,
      technicalDetails: humidityInterp.whatDoesThisMean.technicalDetails,
      impactOnCrops: humidityInterp.whatDoesThisMean.impactOnCrops
    };
  } else if (activeModalMetric === 'battery') {
    modalData = {
      title: batteryInterp.whatDoesThisMean.title,
      badge: batteryInterp.statusWord,
      badgeColor: batteryInterp.statusLevel,
      currentVal: `${battery}% (12.6V Deep-Cycle Pack)`,
      farmerAdvice: batteryInterp.whatDoesThisMean.farmerAdvice,
      technicalDetails: batteryInterp.whatDoesThisMean.technicalDetails,
      impactOnCrops: batteryInterp.whatDoesThisMean.impactOnCrops
    };
  } else if (activeModalMetric === 'freshness') {
    modalData = {
      title: freshnessInterp.whatDoesThisMean.title,
      badge: freshnessInterp.statusWord,
      badgeColor: freshnessInterp.statusLevel,
      currentVal: `Score: ${freshnessInterp.technicalSummary}`,
      farmerAdvice: freshnessInterp.whatDoesThisMean.farmerAdvice,
      technicalDetails: freshnessInterp.whatDoesThisMean.technicalDetails,
      impactOnCrops: freshnessInterp.whatDoesThisMean.impactOnCrops
    };
  } else if (activeModalMetric === 'voc') {
    modalData = {
      title: 'Relative Volatile Organic Compounds (VOC)',
      badge: voc < 60 ? 'NORMAL ✓' : 'ELEVATED ⚠',
      badgeColor: voc < 60 ? 'good' : 'warning',
      currentVal: `${voc} (Relative response index)`,
      farmerAdvice: voc < 60 ? 'Air is clean. No rotting smell or deterioration gases.' : 'Slight ripening gas buildup. Open door briefly to ventilate.',
      technicalDetails: 'Metal-oxide semiconductor (MOS) sensor response. Detects ethylene, terpene and ester emissions from respiration.',
      impactOnCrops: 'Excess ethylene stimulates neighboring crates of tomatoes and greens to prematurely ripen and senesce.'
    };
  } else if (activeModalMetric === 'alcohol') {
    modalData = {
      title: 'Ethanol / Fermentation Gas Indicator',
      badge: alcohol < 30 ? 'NORMAL ✓' : 'FERMENTING ⚠',
      badgeColor: alcohol < 30 ? 'good' : 'warning',
      currentVal: `${alcohol} (Relative signal index)`,
      farmerAdvice: 'Shows if vegetables are beginning to ferment or soften under stagnant air.',
      technicalDetails: 'High ethanol vapor indicates anaerobic metabolism inside bruised fruit or bacterial rot.',
      impactOnCrops: 'Tissues develop off-flavors, water-soaked appearance, and cellular breakdown.'
    };
  } else if (activeModalMetric === 'solar') {
    modalData = {
      title: 'Solar Photovoltaic Generation',
      badge: 'WORKING ☀️',
      badgeColor: 'good',
      currentVal: '245 W (Active Generation)',
      farmerAdvice: 'Free sunlight is powering the cooling units and charging the battery reserve.',
      technicalDetails: '400Wp Monocrystalline panel with MPPT tracking at 18.2V Vmp.',
      impactOnCrops: 'Provides continuous power without burning expensive diesel or depending on grid outages.'
    };
  } else if (activeModalMetric === 'cooling') {
    modalData = {
      title: 'Peltier Thermoelectric Cooling',
      badge: 'WORKING ❄️',
      badgeColor: 'good',
      currentVal: '72 W Cooling Draw',
      farmerAdvice: 'Solid-state cooling maintains safe chill with zero toxic refrigerants and zero compressor noise.',
      technicalDetails: 'Dual TEC1-12706 Peltier modules powered via high-efficiency buck converter with PWM thermostat control.',
      impactOnCrops: 'Maintains steady thermal chilling to slow down plant metabolic rates.'
    };
  }

  return (
    <div className="what-modal-backdrop" onClick={closeMetricModal}>
      <div className="what-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="wm-header">
          <div className="wm-header-title-wrap">
            <span className="wm-badge-icon">
              <HelpCircle size={20} />
            </span>
            <div>
              <h3>What Does This Mean?</h3>
              <span className="wm-subtitle">Farmer & Technical Dual Explanation</span>
            </div>
          </div>
          <button className="wm-close-btn" onClick={closeMetricModal}>
            <X size={20} />
          </button>
        </div>

        {/* Metric Identity Banner */}
        <div className="wm-metric-banner">
          <div>
            <div className="wm-metric-name">{modalData.title}</div>
            <div className="wm-metric-val">{modalData.currentVal}</div>
          </div>
          <span className={`status-pill ${modalData.badgeColor}`}>
            {modalData.badge}
          </span>
        </div>

        {/* 3 Information Cards */}
        <div className="wm-details-list">
          {/* 1. Farmer Plain Language */}
          <div className="wm-detail-card farmer-tint">
            <div className="wmd-header">
              <span className="wmd-icon">🌾</span>
              <strong>Simple Farmer Explanation & Action</strong>
            </div>
            <p className="wmd-text">{modalData.farmerAdvice}</p>
          </div>

          {/* 2. Crop Quality Impact */}
          <div className="wm-detail-card crop-tint">
            <div className="wmd-header">
              <Sprout size={18} className="text-green" />
              <strong>Impact on Stored Vegetables & Produce</strong>
            </div>
            <p className="wmd-text">{modalData.impactOnCrops}</p>
          </div>

          {/* 3. Engineering & Sensor Details */}
          <div className="wm-detail-card tech-tint">
            <div className="wmd-header">
              <Wrench size={18} className="text-blue" />
              <strong>Technical Hardware & Sensor Metrology</strong>
            </div>
            <p className="wmd-text text-mono">{modalData.technicalDetails}</p>
          </div>
        </div>

        <div className="wm-footer">
          <button className="wm-understand-btn" onClick={closeMetricModal}>
            <CheckCircle2 size={16} />
            <span>Understood, Return to Dashboard</span>
          </button>
        </div>
      </div>

      <style>{`
        .what-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(5px);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .what-modal-card {
          background: #ffffff;
          width: 100%;
          max-width: 580px;
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .wm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .wm-header-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .wm-badge-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e0f2fe;
          color: #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wm-header-title-wrap h3 {
          font-size: 1.25rem;
          color: #0f172a;
        }
        .wm-subtitle {
          font-size: 0.78rem;
          color: #64748b;
        }
        .wm-close-btn {
          color: #64748b;
          padding: 4px;
          border-radius: 50%;
        }
        .wm-close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .wm-metric-banner {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .wm-metric-name {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
        }
        .wm-metric-val {
          font-size: 0.85rem;
          color: #475569;
        }
        .wm-details-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wm-detail-card {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .farmer-tint { background: #f0fdf4; border: 1.5px solid #86efac; }
        .crop-tint { background: #fffbeb; border: 1.5px solid #fde047; }
        .tech-tint { background: #f8fafc; border: 1.5px solid #cbd5e1; }
        .wmd-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #1e293b;
        }
        .wmd-icon { font-size: 1.2rem; }
        .wmd-text {
          font-size: 0.9rem;
          color: #334155;
          line-height: 1.45;
        }
        .text-mono {
          font-family: var(--font-mono);
          font-size: 0.82rem;
        }
        .wm-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 8px;
        }
        .wm-understand-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          background: #16a34a;
          color: white;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .wm-understand-btn:hover {
          background: #15803d;
        }
      `}</style>
    </div>
  );
};
