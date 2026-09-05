import React from 'react';
import { useStorage } from '../context/StorageContext';
import {
  BarChart3,
  Thermometer,
  Droplets,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    t,
    temperature,
    humidity,
    historyRange,
    setHistoryRange,
    historicalData,
    selectedCrop,
    tempInterp,
    humidityInterp
  } = useStorage();

  // Compute stats for Temperature
  const tempValues = historicalData.map(d => d.temperature);
  const minTemp = Math.min(...tempValues);
  const maxTemp = Math.max(...tempValues);
  const avgTemp = Number((tempValues.reduce((a, b) => a + b, 0) / tempValues.length).toFixed(1));

  // Compute stats for Humidity
  const humValues = historicalData.map(d => d.humidity);
  const minHum = Math.min(...humValues);
  const maxHum = Math.max(...humValues);
  const avgHum = Math.round(humValues.reduce((a, b) => a + b, 0) / humValues.length);

  // SVG Chart Dimensions
  const chartWidth = 700;
  const chartHeight = 220;
  const padding = 30;

  // Render SVG Path for temperature
  const tempMinScale = Math.min(minTemp - 2, selectedCrop.minTemp - 2);
  const tempMaxScale = Math.max(maxTemp + 2, selectedCrop.maxTemp + 2);
  const getTempY = (val: number) => {
    return chartHeight - padding - ((val - tempMinScale) / (tempMaxScale - tempMinScale)) * (chartHeight - padding * 2);
  };
  const getX = (idx: number, total: number) => {
    return padding + (idx / (total - 1)) * (chartWidth - padding * 2);
  };

  const tempPoints = historicalData.map((d, i) => `${getX(i, historicalData.length)},${getTempY(d.temperature)}`).join(' ');
  const safeZoneYTop = getTempY(selectedCrop.maxTemp);
  const safeZoneYBottom = getTempY(selectedCrop.minTemp);

  // Render SVG Path for humidity
  const humMinScale = Math.min(50, minHum - 5);
  const humMaxScale = 100;
  const getHumY = (val: number) => {
    return chartHeight - padding - ((val - humMinScale) / (humMaxScale - humMinScale)) * (chartHeight - padding * 2);
  };
  const humPoints = historicalData.map((d, i) => `${getX(i, historicalData.length)},${getHumY(d.humidity)}`).join(' ');
  const humSafeYTop = getHumY(selectedCrop.maxHumidity);
  const humSafeYBottom = getHumY(selectedCrop.minHumidity);

  const isTempStable = maxTemp - minTemp < 2.5 && maxTemp <= selectedCrop.maxTemp;

  return (
    <div className="analytics-view-container">
      {/* Analytics Header */}
      <div className="analytics-header-card">
        <div>
          <span className="analytics-badge">📈 TELEMETRY ANALYTICS</span>
          <h2>Storage Micro-Climate History</h2>
          <p>
            Historical logging of thermal consistency and humidity preservation for <strong>{selectedCrop.name}</strong>.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="time-range-bar">
          {(['1h', '6h', '24h', '7d'] as const).map(range => (
            <button
              key={range}
              className={`range-btn ${historyRange === range ? 'active' : ''}`}
              onClick={() => setHistoryRange(range)}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 16: TEMPERATURE ANALYTICS */}
      <div className="analytics-chart-card">
        <div className="chart-title-bar">
          <div className="ct-left">
            <div className="icon-badge temp-badge">
              <Thermometer size={18} />
            </div>
            <div>
              <h3>Temperature History & Safe Crop Band</h3>
              <span className="ct-sub">Target Safe Zone for {selectedCrop.name}: {selectedCrop.minTemp}°C – {selectedCrop.maxTemp}°C</span>
            </div>
          </div>

          <div className={`farmer-interpretation-pill ${isTempStable ? 'safe' : 'warn'}`}>
            {isTempStable ? '“Temperature stable ✓”' : '“Temperature changed. Check cooling ⚠”'}
          </div>
        </div>

        {/* Temperature Stats Strip */}
        <div className="stats-strip">
          <div className="stat-item">
            <span className="si-label">Current</span>
            <strong className="si-val">{temperature.toFixed(1)}°C</strong>
          </div>
          <div className="stat-item">
            <span className="si-label">Minimum</span>
            <strong className="si-val">{minTemp.toFixed(1)}°C</strong>
          </div>
          <div className="stat-item">
            <span className="si-label">Average</span>
            <strong className="si-val">{avgTemp.toFixed(1)}°C</strong>
          </div>
          <div className="stat-item">
            <span className="si-label">Maximum</span>
            <strong className="si-val">{maxTemp.toFixed(1)}°C</strong>
          </div>
          <div className="stat-item">
            <span className="si-label">Hysteresis Band</span>
            <strong className="si-val">±0.5°C PWM</strong>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="svg-chart-wrapper">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="responsive-svg-chart">
            {/* Shaded Safe Band */}
            <rect
              x={padding}
              y={safeZoneYTop}
              width={chartWidth - padding * 2}
              height={Math.max(4, safeZoneYBottom - safeZoneYTop)}
              fill="rgba(34, 197, 94, 0.15)"
              stroke="rgba(34, 197, 94, 0.4)"
              strokeDasharray="4 4"
            />
            <text
              x={chartWidth - padding - 6}
              y={safeZoneYTop + 14}
              textAnchor="end"
              fill="#16a34a"
              fontSize="10"
              fontWeight="700"
            >
              Optimal Safe Band ({selectedCrop.minTemp}–{selectedCrop.maxTemp}°C)
            </text>

            {/* Baseline Grid lines */}
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#cbd5e1" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />

            {/* Temperature Line */}
            <polyline
              fill="none"
              stroke="#dc2626"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={tempPoints}
            />

            {/* Data point dots */}
            {historicalData.map((d, i) => (
              <circle
                key={i}
                cx={getX(i, historicalData.length)}
                cy={getTempY(d.temperature)}
                r="3.5"
                fill="#ffffff"
                stroke="#dc2626"
                strokeWidth="2"
              />
            ))}

            {/* X-axis labels */}
            {historicalData.filter((_, i) => i % Math.ceil(historicalData.length / 6) === 0).map((d, i) => (
              <text
                key={i}
                x={getX(i * Math.ceil(historicalData.length / 6), historicalData.length)}
                y={chartHeight - 8}
                fontSize="10"
                fill="#64748b"
                textAnchor="middle"
              >
                {d.time}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* SECTION 17: HUMIDITY ANALYTICS */}
      <div className="analytics-chart-card">
        <div className="chart-title-bar">
          <div className="ct-left">
            <div className="icon-badge hum-badge">
              <Droplets size={18} />
            </div>
            <div>
              <h3>Moisture & Humidity Analytics</h3>
              <span className="ct-sub">Target Moisture: {selectedCrop.minHumidity}% – {selectedCrop.maxHumidity}%</span>
            </div>
          </div>

          <div className={`farmer-interpretation-pill ${humidity >= selectedCrop.minHumidity && humidity <= selectedCrop.maxHumidity ? 'safe' : 'warn'}`}>
            {humidity >= selectedCrop.minHumidity && humidity <= selectedCrop.maxHumidity
              ? '“Moisture level is good ✓”'
              : '“Moisture is high. Please check storage conditions ⚠”'}
          </div>
        </div>

        {/* Humidity Stats Strip */}
        <div className="stats-strip">
          <div className="stat-item">
            <span className="si-label">Current</span>
            <strong className="si-val text-blue">{humidity}%</strong>
          </div>
          <div className="stat-item">
            <span className="si-label">Minimum</span>
            <strong className="si-val">{minHum}%</strong>
          </div>
          <div className="stat-item">
            <span className="si-label">Average</span>
            <strong className="si-val">{avgHum}%</strong>
          </div>
          <div className="stat-item">
            <span className="si-label">Maximum</span>
            <strong className="si-val">{maxHum}%</strong>
          </div>
          <div className="stat-item">
            <span className="si-label">Dew Point Margin</span>
            <strong className="si-val">+1.8°C</strong>
          </div>
        </div>

        {/* SVG Chart for Humidity */}
        <div className="svg-chart-wrapper">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="responsive-svg-chart">
            {/* Shaded Humidity Safe Band */}
            <rect
              x={padding}
              y={humSafeYTop}
              width={chartWidth - padding * 2}
              height={Math.max(4, humSafeYBottom - humSafeYTop)}
              fill="rgba(2, 132, 199, 0.12)"
              stroke="rgba(2, 132, 199, 0.35)"
              strokeDasharray="4 4"
            />
            <text
              x={chartWidth - padding - 6}
              y={humSafeYTop + 14}
              textAnchor="end"
              fill="#0284c7"
              fontSize="10"
              fontWeight="700"
            >
              Recommended RH ({selectedCrop.minHumidity}–{selectedCrop.maxHumidity}%)
            </text>

            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#cbd5e1" strokeWidth="1" />

            {/* Humidity Polyline */}
            <polyline
              fill="none"
              stroke="#0284c7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={humPoints}
            />

            {/* Dots */}
            {historicalData.map((d, i) => (
              <circle
                key={i}
                cx={getX(i, historicalData.length)}
                cy={getHumY(d.humidity)}
                r="3.5"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="2"
              />
            ))}

            {/* X Labels */}
            {historicalData.filter((_, i) => i % Math.ceil(historicalData.length / 6) === 0).map((d, i) => (
              <text
                key={i}
                x={getX(i * Math.ceil(historicalData.length / 6), historicalData.length)}
                y={chartHeight - 8}
                fontSize="10"
                fill="#64748b"
                textAnchor="middle"
              >
                {d.time}
              </text>
            ))}
          </svg>
        </div>
      </div>

      <style>{`
        .analytics-view-container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px;
        }
        .analytics-header-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .analytics-badge {
          font-size: 0.75rem;
          font-weight: 800;
          color: #2563eb;
          letter-spacing: 0.04em;
        }
        .analytics-header-card h2 {
          font-size: 1.6rem;
          color: #0f172a;
          margin: 4px 0;
        }
        .analytics-header-card p {
          color: #64748b;
          font-size: 0.92rem;
        }
        .time-range-bar {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 8px;
          gap: 4px;
        }
        .range-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748b;
          transition: all 0.15s;
        }
        .range-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: var(--shadow-sm);
        }
        .analytics-chart-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .chart-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 18px;
        }
        .ct-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .temp-badge { background: #fee2e2; color: #dc2626; }
        .hum-badge { background: #e0f2fe; color: #0284c7; }
        .ct-left h3 {
          font-size: 1.25rem;
          color: #0f172a;
        }
        .ct-sub {
          font-size: 0.8rem;
          color: #64748b;
        }
        .farmer-interpretation-pill {
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
          font-style: italic;
        }
        .farmer-interpretation-pill.safe {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #86efac;
        }
        .farmer-interpretation-pill.warn {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
          background: #f8fafc;
          padding: 12px 18px;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
          margin-bottom: 18px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .si-label {
          font-size: 0.72rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
        }
        .si-val {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
        }
        .text-blue { color: #0284c7; }
        .svg-chart-wrapper {
          width: 100%;
          overflow-x: auto;
        }
        .responsive-svg-chart {
          width: 100%;
          max-height: 260px;
        }
      `}</style>
    </div>
  );
};
