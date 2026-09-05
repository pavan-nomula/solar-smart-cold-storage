import React from 'react';
import { useStorage } from '../context/StorageContext';
import { CROPS } from '../data/crops';
import {
  MapPin,
  Cpu,
  CheckCircle2,
  AlertCircle,
  DoorClosed,
  DoorOpen,
  Zap,
  Leaf,
  ChevronDown
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    t,
    selectedCrop,
    setSelectedCropId,
    doorOpen,
    toggleDoor,
    gridPower,
    batteryMode,
    battery,
    solarPower
  } = useStorage();

  return (
    <section className="hero-container">
      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-badges">
            <span className="hero-badge id-badge">
              <Cpu size={14} />
              {t.storageId}
            </span>
            <span className="hero-badge location-badge">
              <MapPin size={14} />
              {t.location}
            </span>
            <span className="hero-badge status-badge-op">
              <CheckCircle2 size={14} />
              OPERATIONAL
            </span>
          </div>

          <h1 className="hero-title">Smart Cold Storage</h1>
          <p className="hero-subtitle">{t.tagline}</p>

          <div className="farmer-reassurance-box">
            <span className="farmer-avatar-icon">👨‍🌾</span>
            <div className="farmer-reassurance-text">
              <strong>{t.farmerBanner}</strong>
              <span>Zero manual adjustment required • 100% Solar & Battery Autonomous</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          {/* Quick Crop Selector Widget */}
          <div className="quick-crop-card">
            <div className="quick-crop-header">
              <span className="quick-crop-label">{t.crops.selectCrop}:</span>
              <span className="crop-current-chip">
                {selectedCrop.icon} {selectedCrop.name}
              </span>
            </div>

            <div className="crop-select-row">
              <select
                className="hero-crop-dropdown"
                value={selectedCrop.id}
                onChange={(e) => setSelectedCropId(e.target.value)}
                aria-label="Select Stored Crop"
              >
                {CROPS.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.icon} {crop.name} (Ideal: {crop.idealTemp}°C | {crop.idealHumidity}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Quick System Indicators */}
            <div className="quick-indicators-grid">
              <button
                className={`quick-pill ${doorOpen ? 'door-open-warn' : 'door-closed-safe'}`}
                onClick={toggleDoor}
                title="Click to toggle chamber door state (simulate access)"
              >
                {doorOpen ? <DoorOpen size={16} /> : <DoorClosed size={16} />}
                <span>Door: <strong>{doorOpen ? 'OPEN ⚠' : 'CLOSED ✓'}</strong></span>
              </button>

              <div className="quick-pill power-pill">
                <Zap size={16} className={solarPower > 100 ? 'solar-active-icon' : ''} />
                <span>
                  Power: <strong>{gridPower === 'FAILED' ? 'BATTERY 🔋' : 'SOLAR ☀️'}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-container {
          background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
          border-bottom: 1px solid var(--border-subtle);
          padding: 24px;
        }
        .hero-content {
          max-width: 1500px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          flex-wrap: wrap;
        }
        .hero-left {
          flex: 1 1 500px;
        }
        .hero-badges {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
        }
        .id-badge {
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }
        .location-badge {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }
        .status-badge-op {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #86efac;
        }
        .hero-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.15;
          margin-bottom: 6px;
        }
        .hero-subtitle {
          font-size: 1.05rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          max-width: 680px;
        }
        .farmer-reassurance-box {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          padding: 10px 18px;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
          box-shadow: var(--shadow-sm);
        }
        .farmer-avatar-icon {
          font-size: 1.6rem;
        }
        .farmer-reassurance-text {
          display: flex;
          flex-direction: column;
          font-size: 0.88rem;
        }
        .farmer-reassurance-text strong {
          color: #166534;
          font-weight: 700;
        }
        .farmer-reassurance-text span {
          color: #64748b;
          font-size: 0.78rem;
        }
        .hero-right {
          flex: 0 1 420px;
        }
        .quick-crop-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 18px;
          box-shadow: var(--shadow-md);
        }
        .quick-crop-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .quick-crop-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .crop-current-chip {
          background: #f0fdf4;
          color: #166534;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
          border: 1px solid #bbf7d0;
        }
        .hero-crop-dropdown {
          width: 100%;
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          border: 1.5px solid #cbd5e1;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
          background: #f8fafc;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }
        .hero-crop-dropdown:focus {
          border-color: #0284c7;
          background: #ffffff;
        }
        .quick-indicators-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
        }
        .quick-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .door-closed-safe {
          background: #f0fdf4;
          color: #166534;
          border-color: #86efac;
        }
        .door-open-warn {
          background: #fef2f2;
          color: #991b1b;
          border-color: #fca5a5;
          animation: pulse-ring 1.5s infinite;
        }
        .power-pill {
          background: #eff6ff;
          color: #1e40af;
          border-color: #bfdbfe;
        }
        .solar-active-icon {
          color: #f59e0b;
        }
      `}</style>
    </section>
  );
};
