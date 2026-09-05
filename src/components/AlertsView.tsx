import React, { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check,
  Zap,
  Thermometer,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const {
    t,
    alerts,
    dismissAlert,
    applySimulation
  } = useStorage();

  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'all') return true;
    return a.severity === severityFilter;
  });

  const activeCount = alerts.filter(a => a.active).length;

  return (
    <div className="alerts-view-container">
      {/* Top Banner */}
      <div className="alerts-header-card">
        <div className="alerts-header-info">
          <span className="alerts-badge">
            <Bell size={14} /> ACTION-ORIENTED SMART ALERTS
          </span>
          <h2>Intelligent Farm Notifications</h2>
          <p>
            Alerts never display cryptic error codes. Every notification describes the condition in plain words and specifies exactly what action the farmer should take.
          </p>
        </div>

        <div className="alerts-header-actions">
          <button
            className={`sound-toggle-btn ${soundEnabled ? 'on' : 'off'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle Buzzer Notification Simulation"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>Buzzer: {soundEnabled ? 'ENABLED' : 'MUTED'}</span>
          </button>

          {/* Filter tabs */}
          <div className="severity-filter-bar">
            {(['all', 'critical', 'warning', 'info'] as const).map(sev => (
              <button
                key={sev}
                className={`filter-btn ${severityFilter === sev ? 'active' : ''}`}
                onClick={() => setSeverityFilter(sev)}
              >
                {sev.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="alerts-feed-card">
        <div className="feed-title-bar">
          <h3>Current Active & Historic Alerts ({filteredAlerts.length})</h3>
          <span className="feed-sub">Sorted by timestamp (most recent first)</span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="empty-alerts-state">
            <CheckCircle2 size={48} className="empty-check" />
            <h4>No Alerts in this Category</h4>
            <p>All environmental conditions and solar subsystems are running optimally.</p>
          </div>
        ) : (
          <div className="alerts-list">
            {filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className={`alert-item-card ${alert.severity} ${!alert.active ? 'resolved' : ''}`}
              >
                <div className="aic-icon-col">
                  {alert.severity === 'critical' ? (
                    <XCircle size={24} className="icon-critical" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle size={24} className="icon-warning" />
                  ) : (
                    <CheckCircle2 size={24} className="icon-info" />
                  )}
                </div>

                <div className="aic-body">
                  <div className="aic-top-row">
                    <div className="aic-title-group">
                      <h4 className="aic-title">{alert.title}</h4>
                      <span className={`aic-severity-pill ${alert.severity}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      {!alert.active && <span className="resolved-pill">RESOLVED ✓</span>}
                    </div>
                    <span className="aic-time">{alert.timestamp}</span>
                  </div>

                  {/* Farmer Plain-Language Explanation */}
                  <div className="aic-farmer-msg">
                    “{alert.farmerMessage}”
                  </div>

                  {/* Clear Recommended Action (Section 25) */}
                  <div className="aic-action-recommendation">
                    <span className="action-tag">👉 Recommended Action:</span>
                    <span className="action-detail">{alert.recommendedAction}</span>
                  </div>
                </div>

                <div className="aic-actions-col">
                  {alert.active && (
                    <button
                      className="dismiss-alert-btn"
                      onClick={() => dismissAlert(alert.id)}
                      title="Acknowledge and mark resolved"
                    >
                      <Check size={16} />
                      <span>Acknowledge</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Test Scenario Triggers (Req 24 & 25) */}
      <div className="alerts-test-card">
        <h4>⚡ Simulate Common Rural Scenarios</h4>
        <p>Trigger instant alert events to test farmer-friendly messaging:</p>
        <div className="test-buttons-row">
          <button
            className="test-btn"
            onClick={() => applySimulation('temp_high')}
          >
            <Thermometer size={14} /> Thermal Breach (14.6°C)
          </button>
          <button
            className="test-btn"
            onClick={() => applySimulation('humidity_high')}
          >
            💧 Moisture Spike (98%)
          </button>
          <button
            className="test-btn"
            onClick={() => applySimulation('freshness_warning')}
          >
            <Sparkles size={14} /> Spoilage Gas Detection
          </button>
          <button
            className="test-btn"
            onClick={() => applySimulation('power_failure')}
          >
            <Zap size={14} /> Power Grid Failure
          </button>
        </div>
      </div>

      <style>{`
        .alerts-view-container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px;
        }
        .alerts-header-card {
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
        .alerts-badge {
          font-size: 0.75rem;
          font-weight: 800;
          color: #dc2626;
          letter-spacing: 0.04em;
        }
        .alerts-header-info h2 {
          font-size: 1.6rem;
          color: #0f172a;
          margin: 4px 0;
        }
        .alerts-header-info p {
          color: #64748b;
          font-size: 0.92rem;
          max-width: 650px;
        }
        .alerts-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .sound-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          border: 1px solid #cbd5e1;
        }
        .sound-toggle-btn.on { background: #f0fdf4; color: #16a34a; border-color: #86efac; }
        .sound-toggle-btn.off { background: #f1f5f9; color: #64748b; }
        .severity-filter-bar {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 8px;
          gap: 4px;
        }
        .filter-btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
        }
        .filter-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: var(--shadow-sm);
        }
        .alerts-feed-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .feed-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .feed-title-bar h3 {
          font-size: 1.25rem;
          color: #0f172a;
        }
        .feed-sub {
          font-size: 0.82rem;
          color: #64748b;
        }
        .empty-alerts-state {
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .empty-check { color: #22c55e; margin-bottom: 8px; }
        .empty-alerts-state h4 { font-size: 1.2rem; color: #0f172a; }
        .empty-alerts-state p { color: #64748b; font-size: 0.9rem; }
        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .alert-item-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px;
          border-radius: var(--radius-md);
          border: 1.5px solid transparent;
          background: #f8fafc;
          transition: all 0.2s;
        }
        .alert-item-card.critical {
          background: #fef2f2;
          border-color: #fca5a5;
        }
        .alert-item-card.warning {
          background: #fffbeb;
          border-color: #fde047;
        }
        .alert-item-card.info {
          background: #f0fdf4;
          border-color: #86efac;
        }
        .alert-item-card.resolved {
          opacity: 0.65;
          background: #f8fafc;
          border-color: #e2e8f0;
        }
        .aic-icon-col {
          padding-top: 2px;
        }
        .icon-critical { color: #dc2626; }
        .icon-warning { color: #d97706; }
        .icon-info { color: #16a34a; }
        .aic-body {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .aic-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .aic-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .aic-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }
        .aic-severity-pill {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .aic-severity-pill.critical { background: #fee2e2; color: #991b1b; }
        .aic-severity-pill.warning { background: #fef3c7; color: #92400e; }
        .aic-severity-pill.info { background: #dcfce7; color: #166534; }
        .resolved-pill {
          background: #e2e8f0;
          color: #475569;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .aic-time {
          font-size: 0.76rem;
          color: #64748b;
          font-family: var(--font-mono);
        }
        .aic-farmer-msg {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
        }
        .aic-action-recommendation {
          background: #ffffff;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 0.85rem;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .action-tag {
          font-weight: 800;
          color: #1e40af;
        }
        .action-detail {
          color: #0f172a;
          font-weight: 600;
        }
        .dismiss-alert-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          white-space: nowrap;
        }
        .dismiss-alert-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .alerts-test-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }
        .alerts-test-card h4 {
          font-size: 1rem;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .alerts-test-card p {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 12px;
        }
        .test-buttons-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .test-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          border: 1px solid #cbd5e1;
        }
        .test-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
      `}</style>
    </div>
  );
};
