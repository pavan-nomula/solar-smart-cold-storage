import React, { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import type { Language } from '../data/translations';
import {
  Snowflake,
  Sun,
  Wifi,
  Clock,
  User,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Zap,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    farmerMode,
    setFarmerMode,
    demoMode,
    setDemoMode,
    activeTab,
    setActiveTab,
    isEsp32Connected,
    alerts
  } = useStorage();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) +
        ' • ' +
        now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlertCount = alerts.filter(a => a.active && a.severity !== 'info').length;

  const navItems = [
    { id: 'dashboard' as const, label: t.nav.dashboard, icon: Layers },
    { id: 'storage' as const, label: t.nav.storage, icon: ShieldCheck },
    { id: 'freshness' as const, label: t.nav.freshness, icon: Sparkles },
    { id: 'energy' as const, label: t.nav.energy, icon: Zap },
    { id: 'alerts' as const, label: t.nav.alerts, icon: Bell, badge: activeAlertCount > 0 ? activeAlertCount : null },
    { id: 'analytics' as const, label: t.nav.analytics, icon: BarChart3 },
    { id: 'settings' as const, label: t.nav.settings, icon: Settings }
  ];

  const languageLabels: Record<Language, string> = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    as: 'অসমীয়া (Assamese)',
    bn: 'বাংলা (Bengali)',
    te: 'తెలుగు (Telugu)'
  };

  return (
    <header className="navbar-container">
      {/* Top Utility Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="system-status-pill">
            <span className={isEsp32Connected ? "pulse-dot" : "pulse-dot-red"} />
            <span className="system-status-text">
              {isEsp32Connected ? t.systemOnline : "ESP32 Offline"}
            </span>
          </div>
          <span className="live-pill">LIVE 1.0s</span>
          <div className="datetime-display">
            <Clock size={13} />
            <span>{currentTime}</span>
          </div>
        </div>

        <div className="top-bar-right">
          {/* Hardware Telemetry Simulation Bar Pill */}
          <button
            className={`demo-toggle-btn ${demoMode ? 'active' : ''}`}
            onClick={() => setDemoMode(!demoMode)}
            title="Toggle Live Hardware Telemetry Simulator Bar"
          >
            <SlidersHorizontal size={14} />
            <span>Live Simulator {demoMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Farmer Mode Toggle Switch */}
          <div className="mode-switch-wrapper">
            <span className={`mode-label ${!farmerMode ? 'selected' : ''}`}>Tech Mode</span>
            <button
              className={`mode-toggle-pill ${farmerMode ? 'farmer-active' : ''}`}
              onClick={() => setFarmerMode(!farmerMode)}
              aria-label="Toggle Farmer Mode"
            >
              <span className="toggle-thumb" />
            </button>
            <span className={`mode-label ${farmerMode ? 'selected highlight-farmer' : ''}`}>
              🌾 {t.farmerMode}
            </span>
          </div>

          {/* Language Selector */}
          <div className="language-selector-wrapper">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="language-select"
              aria-label="Select Language"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
              <option value="as">🇮🇳 অসমীয়া (Assamese)</option>
              <option value="bn">🇮🇳 বাংলা (Bengali)</option>
              <option value="te">🇮🇳 తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="main-navbar">
        <div className="logo-section" onClick={() => setActiveTab('dashboard')}>
          <div className="logo-icon-box">
            <Snowflake className="snow-icon" size={24} />
            <Sun className="sun-badge" size={14} />
          </div>
          <div className="logo-text-box">
            <div className="logo-title">
              <span className="brand-smart">SMART</span>
              <span className="brand-cold">COLD STORE</span>
            </div>
            <div className="logo-sub">Solar IoT • Village Mini Storage</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="nav-badge-alert">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <style>{`
        .navbar-container {
          background: #ffffff;
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow-sm);
        }
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 24px;
          background: #0f172a;
          color: #f8fafc;
          font-size: 0.8rem;
          flex-wrap: wrap;
          gap: 10px;
        }
        .top-bar-left, .top-bar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .system-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(34, 197, 94, 0.15);
          padding: 2px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          font-weight: 600;
          color: #4ade80;
        }
        .live-pill {
          font-size: 0.68rem;
          font-weight: 800;
          background: #2563eb;
          color: white;
          padding: 1px 6px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .datetime-display {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
          font-family: var(--font-mono);
          font-size: 0.78rem;
        }
        .demo-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          background: #334155;
          color: #e2e8f0;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid #475569;
          transition: all 0.2s;
        }
        .demo-toggle-btn:hover {
          background: #475569;
        }
        .demo-toggle-btn.active {
          background: #f59e0b;
          color: #0f172a;
          border-color: #d97706;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
        }
        .mode-switch-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1e293b;
          padding: 3px 8px;
          border-radius: 9999px;
          border: 1px solid #334155;
        }
        .mode-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          transition: color 0.2s;
        }
        .mode-label.selected {
          color: #e2e8f0;
        }
        .mode-label.highlight-farmer {
          color: #4ade80;
          font-weight: 700;
        }
        .mode-toggle-pill {
          width: 36px;
          height: 18px;
          border-radius: 18px;
          background: #475569;
          position: relative;
          padding: 2px;
          transition: background 0.25s;
        }
        .mode-toggle-pill.farmer-active {
          background: #16a34a;
        }
        .toggle-thumb {
          display: block;
          width: 14px;
          height: 14px;
          background: #ffffff;
          border-radius: 50%;
          transition: transform 0.25s;
        }
        .mode-toggle-pill.farmer-active .toggle-thumb {
          transform: translateX(18px);
        }
        .language-select {
          background: #1e293b;
          color: #f8fafc;
          border: 1px solid #334155;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          outline: none;
        }
        .main-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          max-width: 1500px;
          margin: 0 auto;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .logo-icon-box {
          position: relative;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);
        }
        .sun-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          color: #f59e0b;
          background: #ffffff;
          border-radius: 50%;
          padding: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .logo-title {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          display: flex;
          gap: 6px;
        }
        .brand-smart {
          color: #0369a1;
        }
        .brand-cold {
          color: #0f172a;
        }
        .logo-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
        }
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.15s;
          position: relative;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }
        .nav-link.active {
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 700;
        }
        .nav-badge-alert {
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 9999px;
        }
        @media (max-width: 900px) {
          .main-navbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .nav-menu {
            width: 100%;
            padding-bottom: 4px;
          }
        }
      `}</style>
    </header>
  );
};
