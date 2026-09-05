import React from 'react';
import { useStorage } from '../context/StorageContext';
import {
  Sparkles,
  AlertCircle,
  Wind,
  Layers,
  Thermometer,
  Droplets,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  Activity,
  ArrowRight
} from 'lucide-react';

export const FreshnessView: React.FC = () => {
  const {
    t,
    voc,
    alcohol,
    h2s,
    nh3,
    temperature,
    humidity,
    storageDurationDays,
    selectedCrop,
    freshnessAnalysis,
    freshnessInterp,
    openMetricModal,
    farmerMode
  } = useStorage();

  return (
    <div className="freshness-view-container">
      {/* Top Banner */}
      <div className="freshness-hero-card">
        <div className="freshness-hero-text">
          <span className="innovation-badge">
            <Sparkles size={14} /> AI-ASSISTED MULTI-SENSOR FRESHNESS MONITOR
          </span>
          <h2>Intelligent Freshness & Spoilage Prediction</h2>
          <p className="freshness-hero-sub">
            Real-time pattern analysis across VOC, Ethanol, Sulfides, Ammonia, and chamber micro-climate to provide early deterioration warnings before visible rot occurs.
          </p>
        </div>

        <div className="freshness-score-badge-card">
          <div className="score-big-circle">
            <span className="score-num">{freshnessAnalysis.freshnessScore}</span>
            <span className="score-total">/100</span>
          </div>
          <div className="score-meta">
            <span className={`score-status-chip ${freshnessInterp.statusLevel}`}>
              {freshnessInterp.statusWord}
            </span>
            <span className="risk-level-tag">
              Deterioration Risk: <strong>{freshnessAnalysis.deteriorationRisk}</strong>
            </span>
            <span className="farmer-1liner">
              “{freshnessInterp.farmerExplanation}”
            </span>
          </div>
        </div>
      </div>

      {/* Scientific Notice Banner (Req 12 & 18) */}
      <div className="scientific-notice-box">
        <div className="notice-icon">🔬</div>
        <div>
          <h4>Sensor Metrology & Scientific Guidance</h4>
          <p>
            Agricultural gas sensors (metal oxide array) are labeled as <strong>Relative Sensor Response</strong> rather than uncalibrated absolute ppm concentrations. Elevated signals are evaluated together with temperature duration ({storageDurationDays} days) and respiration kinetics of <strong>{selectedCrop.name}</strong> to assess deterioration probability without damaging produce.
          </p>
        </div>
      </div>

      {/* SECTION 18: GAS & VOC SENSOR ANALYSIS GRID */}
      <div className="gas-array-section">
        <div className="section-title-row">
          <div>
            <h3>Multi-Gas & VOC Sensor Array</h3>
            <p className="sub-text">Relative chemical response calibrated to baseline ambient air</p>
          </div>
          <span className="gas-status-tag safe">
            👃 Air Status: NORMAL ✓
          </span>
        </div>

        <div className="gas-cards-grid">
          {/* SENSOR 1: VOC */}
          <div className="gas-card">
            <div className="gc-header">
              <span className="gc-name">Relative VOC Level</span>
              <button className="tooltip-trigger" onClick={() => openMetricModal('voc')}>?</button>
            </div>
            <div className="gc-value-row">
              <span className="gc-value">{voc}</span>
              <span className="gc-unit">Signal Index</span>
            </div>
            <div className="gc-bar-track">
              <div
                className="gc-bar-fill"
                style={{
                  width: `${Math.min(100, (voc / 150) * 100)}%`,
                  background: voc < 60 ? '#16a34a' : voc < 100 ? '#eab308' : '#dc2626'
                }}
              />
            </div>
            <div className="gc-footer">
              <span>Baseline: 35-50</span>
              <span className="gc-status-word">{voc < 60 ? 'NORMAL ✓' : 'ELEVATED ⚠'}</span>
            </div>
            <div className="gc-farmer-text">
              “{voc < 60 ? 'No volatile rot gases detected' : 'Trace ripening esters present'}”
            </div>
          </div>

          {/* SENSOR 2: ALCOHOL / ETHANOL */}
          <div className="gas-card">
            <div className="gc-header">
              <span className="gc-name">Ethanol / Fermentation Signal</span>
              <button className="tooltip-trigger" onClick={() => openMetricModal('alcohol')}>?</button>
            </div>
            <div className="gc-value-row">
              <span className="gc-value">{alcohol}</span>
              <span className="gc-unit">Response Index</span>
            </div>
            <div className="gc-bar-track">
              <div
                className="gc-bar-fill"
                style={{
                  width: `${Math.min(100, (alcohol / 100) * 100)}%`,
                  background: alcohol < 30 ? '#16a34a' : alcohol < 60 ? '#eab308' : '#dc2626'
                }}
              />
            </div>
            <div className="gc-footer">
              <span>Baseline: 10-25</span>
              <span className="gc-status-word">{alcohol < 30 ? 'NORMAL ✓' : 'FERMENTATION ⚠'}</span>
            </div>
            <div className="gc-farmer-text">
              “{alcohol < 30 ? 'Aerobic crisp condition' : 'Anaerobic yeast softening warning'}”
            </div>
          </div>

          {/* SENSOR 3: H2S (HYDROGEN SULFIDE) */}
          <div className="gas-card">
            <div className="gc-header">
              <span className="gc-name">Hydrogen Sulfide (H₂S) Signal</span>
              <button className="tooltip-trigger" onClick={() => openMetricModal('h2s')}>?</button>
            </div>
            <div className="gc-value-row">
              <span className="gc-value">{h2s}</span>
              <span className="gc-unit">Sensor Response</span>
            </div>
            <div className="gc-bar-track">
              <div
                className="gc-bar-fill"
                style={{
                  width: `${Math.min(100, (h2s / 40) * 100)}%`,
                  background: h2s < 10 ? '#16a34a' : h2s < 20 ? '#eab308' : '#dc2626'
                }}
              />
            </div>
            <div className="gc-footer">
              <span>Baseline: 2-8</span>
              <span className="gc-status-word">{h2s < 10 ? 'NORMAL ✓' : 'SULFUR ALERT ⚠'}</span>
            </div>
            <div className="gc-farmer-text">
              “{h2s < 10 ? 'No protein breakdown decay' : 'Tissue cell wall breakdown detected'}”
            </div>
          </div>

          {/* SENSOR 4: NH3 (AMMONIA) */}
          <div className="gas-card">
            <div className="gc-header">
              <span className="gc-name">Ammonia (NH₃) Signal</span>
              <button className="tooltip-trigger" onClick={() => openMetricModal('nh3')}>?</button>
            </div>
            <div className="gc-value-row">
              <span className="gc-value">{nh3}</span>
              <span className="gc-unit">Sensor Response</span>
            </div>
            <div className="gc-bar-track">
              <div
                className="gc-bar-fill"
                style={{
                  width: `${Math.min(100, (nh3 / 50) * 100)}%`,
                  background: nh3 < 16 ? '#16a34a' : nh3 < 30 ? '#eab308' : '#dc2626'
                }}
              />
            </div>
            <div className="gc-footer">
              <span>Baseline: 4-15</span>
              <span className="gc-status-word">{nh3 < 16 ? 'NORMAL ✓' : 'AMINE ALERT ⚠'}</span>
            </div>
            <div className="gc-farmer-text">
              “{nh3 < 16 ? 'Leaf proteins intact' : 'Microbial deamination detected'}”
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 19: DETERIORATION RISK DECISION ENGINE */}
      <div className="decision-engine-card">
        <div className="de-header">
          <div className="de-title-wrap">
            <Activity size={20} className="de-icon" />
            <div>
              <h3>Multi-Input Deterioration Decision Engine</h3>
              <p>How 6 sensor dimensions synthesize into the final Freshness Score</p>
            </div>
          </div>
          <span className="de-model-tag">Non-Destructive Sensing Pipeline</span>
        </div>

        {/* Visual Flow Matrix */}
        <div className="decision-flow-grid">
          <div className="flow-column inputs-column">
            <div className="flow-col-title">Primary Sensor Inputs</div>
            
            <div className="flow-node">
              <div className="node-icon-row">
                <Thermometer size={16} />
                <span>Chamber Temperature</span>
              </div>
              <strong>{temperature.toFixed(1)}°C</strong>
              <span className="node-sub">Target: {selectedCrop.minTemp}–{selectedCrop.maxTemp}°C</span>
            </div>

            <div className="flow-node">
              <div className="node-icon-row">
                <Droplets size={16} />
                <span>Relative Humidity</span>
              </div>
              <strong>{humidity}%</strong>
              <span className="node-sub">Target: {selectedCrop.minHumidity}–{selectedCrop.maxHumidity}%</span>
            </div>

            <div className="flow-node">
              <div className="node-icon-row">
                <Wind size={16} />
                <span>Multi-Gas Sensor Array</span>
              </div>
              <strong>VOC {voc} • EtOH {alcohol}</strong>
              <span className="node-sub">H₂S {h2s} • NH₃ {nh3}</span>
            </div>

            <div className="flow-node">
              <div className="node-icon-row">
                <Clock size={16} />
                <span>Storage Age</span>
              </div>
              <strong>{storageDurationDays} Days In Storage</strong>
              <span className="node-sub">Standard Life: {selectedCrop.standardShelfLifeColdDays}d</span>
            </div>
          </div>

          <div className="flow-arrow-column">
            <div className="flow-arrow-circle">
              <ArrowRight size={20} />
            </div>
            <span className="engine-fusion-label">Pattern Fusion Engine</span>
          </div>

          <div className="flow-column synthesis-column">
            <div className="flow-col-title">Contributing Breakdown</div>
            {freshnessAnalysis.contributingFactors.map((f, idx) => (
              <div key={idx} className="factor-pill-card">
                <div className="fpc-top">
                  <span className="fpc-name">{f.factor}</span>
                  <span className={`fpc-impact ${f.impact}`}>{f.impact.toUpperCase()}</span>
                </div>
                <div className="fpc-score-bar">
                  <div className="fpc-bar-fill" style={{ width: `${f.score}%` }} />
                </div>
                <div className="fpc-detail">{f.detail}</div>
              </div>
            ))}
          </div>

          <div className="flow-arrow-column">
            <div className="flow-arrow-circle">
              <ArrowRight size={20} />
            </div>
            <span className="engine-fusion-label">Final Evaluation</span>
          </div>

          <div className="flow-column output-column">
            <div className="flow-col-title">Actionable Recommendation</div>

            <div className="final-output-card">
              <div className="foc-crop-banner">
                <span className="foc-icon">{selectedCrop.icon}</span>
                <div>
                  <h4>{selectedCrop.name}</h4>
                  <span>Freshness Score: <strong>{freshnessAnalysis.freshnessScore}%</strong></span>
                </div>
              </div>

              <div className="foc-status-box">
                <span className="foc-badge">{freshnessAnalysis.statusWord}</span>
                <span className="foc-risk">Risk: {freshnessAnalysis.deteriorationRisk}</span>
              </div>

              <div className="foc-shelf-life">
                Estimated Remaining Safe Storage:
                <div className="shelf-life-days">~{freshnessAnalysis.estimatedRemainingShelfLifeDays} Days</div>
              </div>

              <div className="foc-action">
                <strong>Recommended Farmer Action:</strong>
                <p>
                  {freshnessAnalysis.freshnessScore >= 80
                    ? 'Produce is in prime grade. No intervention required.'
                    : freshnessAnalysis.freshnessScore >= 60
                    ? 'Plan to transport to local market within 48 hours for optimal pricing.'
                    : 'Inspect crates inside chamber. Remove soft items to prevent ethylene transmission.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .freshness-view-container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px;
        }
        .freshness-hero-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
        }
        .innovation-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f3e8ff;
          color: #7e22ce;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .freshness-hero-text h2 {
          font-size: 1.6rem;
          color: #0f172a;
        }
        .freshness-hero-sub {
          color: #64748b;
          font-size: 0.92rem;
          max-width: 680px;
        }
        .freshness-score-badge-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f8fafc;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
        }
        .score-big-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }
        .score-num {
          font-size: 1.6rem;
          font-weight: 900;
          line-height: 1;
        }
        .score-total {
          font-size: 0.72rem;
          opacity: 0.8;
        }
        .score-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .score-status-chip {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 800;
          width: fit-content;
        }
        .score-status-chip.good { background: #dcfce7; color: #15803d; }
        .score-status-chip.warning { background: #fef9c3; color: #854d0e; }
        .score-status-chip.critical { background: #fee2e2; color: #991b1b; }
        .risk-level-tag {
          font-size: 0.82rem;
          color: #334155;
        }
        .farmer-1liner {
          font-size: 0.82rem;
          color: #475569;
          font-style: italic;
        }
        .scientific-notice-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: var(--radius-md);
          padding: 14px 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 24px;
        }
        .notice-icon {
          font-size: 1.5rem;
        }
        .scientific-notice-box h4 {
          font-size: 0.95rem;
          color: #1e40af;
          margin-bottom: 2px;
        }
        .scientific-notice-box p {
          font-size: 0.85rem;
          color: #334155;
          line-height: 1.45;
        }
        .gas-array-section {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .section-title-row h3 {
          font-size: 1.3rem;
          color: #0f172a;
        }
        .sub-text {
          font-size: 0.85rem;
          color: #64748b;
        }
        .gas-status-tag {
          font-size: 0.82rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
        }
        .gas-status-tag.safe { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
        .gas-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
        .gas-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .gc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .gc-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
        }
        .gc-value-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin: 4px 0;
        }
        .gc-value {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .gc-unit {
          font-size: 0.78rem;
          color: #64748b;
        }
        .gc-bar-track {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .gc-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .gc-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .gc-status-word {
          color: #16a34a;
          font-weight: 700;
        }
        .gc-farmer-text {
          font-size: 0.78rem;
          color: #475569;
          font-style: italic;
          border-top: 1px dashed #e2e8f0;
          padding-top: 6px;
          margin-top: 4px;
        }
        .decision-engine-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .de-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .de-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .de-icon { color: #0284c7; }
        .de-title-wrap h3 {
          font-size: 1.3rem;
          color: #0f172a;
        }
        .de-title-wrap p {
          font-size: 0.85rem;
          color: #64748b;
        }
        .de-model-tag {
          font-size: 0.78rem;
          font-weight: 700;
          background: #eff6ff;
          color: #1e40af;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .decision-flow-grid {
          display: flex;
          align-items: stretch;
          gap: 16px;
          flex-wrap: wrap;
        }
        .flow-column {
          flex: 1 1 280px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .flow-col-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 6px;
        }
        .flow-node {
          background: #ffffff;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .node-icon-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 600;
        }
        .flow-node strong {
          font-size: 1rem;
          color: #0f172a;
        }
        .node-sub {
          font-size: 0.72rem;
          color: #94a3b8;
        }
        .flow-arrow-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 60px;
        }
        .flow-arrow-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e0f2fe;
          color: #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .engine-fusion-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          text-align: center;
        }
        .factor-pill-card {
          background: white;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .fpc-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .fpc-impact {
          font-size: 0.68rem;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .fpc-impact.positive { background: #dcfce7; color: #166534; }
        .fpc-impact.neutral { background: #fef9c3; color: #854d0e; }
        .fpc-impact.negative { background: #fee2e2; color: #991b1b; }
        .fpc-score-bar {
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }
        .fpc-bar-fill {
          height: 100%;
          background: #0284c7;
        }
        .fpc-detail {
          font-size: 0.72rem;
          color: #64748b;
        }
        .final-output-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 14px;
          border: 1px solid #cbd5e1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .foc-crop-banner {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .foc-icon { font-size: 1.8rem; }
        .foc-status-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0fdf4;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #86efac;
        }
        .foc-badge { font-weight: 800; color: #15803d; font-size: 0.9rem; }
        .foc-risk { font-size: 0.8rem; color: #166534; font-weight: 600; }
        .foc-shelf-life {
          font-size: 0.8rem;
          color: #475569;
        }
        .shelf-life-days {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
        }
        .foc-action {
          font-size: 0.78rem;
          color: #334155;
          background: #f8fafc;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
      `}</style>
    </div>
  );
};
