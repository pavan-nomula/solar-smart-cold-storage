import React, { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import { CROPS } from '../data/crops';
import type { CropProfile } from '../data/crops';
import {
  PackagePlus,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Scale,
  Calendar,
  Layers,
  Thermometer,
  Droplets,
  HelpCircle
} from 'lucide-react';

export const StorageBatchesView: React.FC = () => {
  const {
    t,
    batches,
    addBatch,
    removeBatch,
    selectedCrop,
    setSelectedCropId,
    temperature,
    humidity
  } = useStorage();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCropForBatch, setSelectedCropForBatch] = useState<string>(selectedCrop.id);
  const [farmerNameInput, setFarmerNameInput] = useState('');
  const [quantityKgInput, setQuantityKgInput] = useState('25');

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const cropObj = CROPS.find(c => c.id === selectedCropForBatch) || CROPS[0];
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    addBatch({
      cropId: cropObj.id,
      cropName: cropObj.name,
      cropIcon: cropObj.icon,
      quantityKg: parseFloat(quantityKgInput) || 20,
      farmerName: farmerNameInput.trim() || 'Village Farmer',
      dateStored: today,
      storageDurationDays: 1,
      temperature,
      humidity
    });

    setIsAddModalOpen(false);
    setFarmerNameInput('');
    setQuantityKgInput('25');
  };

  const totalKg = batches.reduce((acc, b) => acc + b.quantityKg, 0);

  return (
    <div className="batches-view-container">
      {/* Top Header */}
      <div className="batches-header-card">
        <div className="batches-header-info">
          <span className="batches-badge">📦 CHAMBER INVENTORY</span>
          <h2>Storage Batch Management</h2>
          <p>
            Track individual farmer crates, storage dates, freshness degradation, and dynamic shelf-life forecasting.
          </p>
        </div>

        <div className="batches-header-stats">
          <div className="stat-pill">
            <span className="stat-number">{batches.length}</span>
            <span className="stat-label">Batches</span>
          </div>
          <div className="stat-pill">
            <span className="stat-number">{totalKg} kg</span>
            <span className="stat-label">Stored Produce</span>
          </div>
          <button className="add-batch-btn" onClick={() => setIsAddModalOpen(true)}>
            <PackagePlus size={18} />
            <span>Add New Batch</span>
          </button>
        </div>
      </div>

      {/* Selected Crop Guideline Matrix */}
      <div className="crop-guideline-card">
        <div className="guideline-top">
          <div className="guideline-crop-title">
            <span className="guideline-icon">{selectedCrop.icon}</span>
            <div>
              <h3>Active Storage Profile: {selectedCrop.name}</h3>
              <p>{selectedCrop.storageAdvice}</p>
            </div>
          </div>
          <div className="guideline-change-crop">
            <label>Switch Active Monitored Crop:</label>
            <select
              value={selectedCrop.id}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="crop-switch-dropdown"
            >
              {CROPS.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="guideline-metrics-grid">
          <div className="guideline-metric">
            <span className="gm-label">Recommended Temp</span>
            <span className="gm-value">{selectedCrop.minTemp}°C – {selectedCrop.maxTemp}°C</span>
            <span className={`gm-status ${temperature >= selectedCrop.minTemp && temperature <= selectedCrop.maxTemp ? 'safe' : 'warn'}`}>
              Current: {temperature.toFixed(1)}°C {temperature >= selectedCrop.minTemp && temperature <= selectedCrop.maxTemp ? '✓ Safe' : '⚠ Action'}
            </span>
          </div>

          <div className="guideline-metric">
            <span className="gm-label">Recommended Humidity</span>
            <span className="gm-value">{selectedCrop.minHumidity}% – {selectedCrop.maxHumidity}%</span>
            <span className={`gm-status ${humidity >= selectedCrop.minHumidity && humidity <= selectedCrop.maxHumidity ? 'safe' : 'warn'}`}>
              Current: {humidity}% {humidity >= selectedCrop.minHumidity && humidity <= selectedCrop.maxHumidity ? '✓ Good' : '⚠ Action'}
            </span>
          </div>

          <div className="guideline-metric">
            <span className="gm-label">Expected Cold Life</span>
            <span className="gm-value">{selectedCrop.standardShelfLifeColdDays} Days</span>
            <span className="gm-sub">vs {selectedCrop.standardShelfLifeAmbientDays} days ambient (uncooled)</span>
          </div>

          <div className="guideline-metric">
            <span className="gm-label">Farmer Storage Tip</span>
            <span className="gm-tip">“{selectedCrop.farmerNote}”</span>
          </div>
        </div>
      </div>

      {/* Batches Table (Section 15) */}
      <div className="batches-table-card">
        <div className="table-header-row">
          <h3>Storage Batches Currently in Chamber</h3>
          <span className="table-sub">Live comparisons against current storage conditions</span>
        </div>

        <div className="table-responsive">
          <table className="batches-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Crop & Farmer</th>
                <th>Quantity</th>
                <th>Date Stored</th>
                <th>Duration</th>
                <th>Chamber Temp</th>
                <th>Chamber Humidity</th>
                <th>Freshness Score</th>
                <th>Risk Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className={b.riskLevel === 'HIGH' ? 'row-alert' : ''}>
                  <td className="batch-id-cell">
                    <strong>{b.id}</strong>
                  </td>
                  <td>
                    <div className="batch-crop-cell">
                      <span className="crop-table-icon">{b.cropIcon}</span>
                      <div>
                        <div className="batch-crop-name">{b.cropName}</div>
                        <div className="batch-farmer-name">Farmer: {b.farmerName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="qty-badge">{b.quantityKg} kg</span>
                  </td>
                  <td>{b.dateStored}</td>
                  <td>
                    <span className="duration-pill">
                      <Clock size={12} /> {b.storageDurationDays} days
                    </span>
                  </td>
                  <td>
                    <strong>{b.temperature.toFixed(1)}°C</strong>
                  </td>
                  <td>
                    <strong>{b.humidity}%</strong>
                  </td>
                  <td>
                    <div className="table-freshness-cell">
                      <div className="table-fresh-bar-bg">
                        <div
                          className="table-fresh-bar-fill"
                          style={{
                            width: `${b.freshnessScore}%`,
                            background: b.freshnessScore >= 80 ? '#22c55e' : b.freshnessScore >= 60 ? '#eab308' : '#ef4444'
                          }}
                        />
                      </div>
                      <span className="table-fresh-pct">{b.freshnessScore}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`risk-badge ${b.riskLevel.toLowerCase()}`}>
                      {b.riskLevel}
                    </span>
                  </td>
                  <td>
                    <div className="table-action-btns">
                      <button
                        className="delete-batch-btn"
                        onClick={() => removeBatch(b.id)}
                        title="Remove batch (produce sold or retrieved)"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Batch Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="add-batch-modal">
            <div className="modal-top">
              <h3>Add Produce Batch to Cold Storage</h3>
              <button className="close-modal-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddBatch} className="modal-form">
              <div className="form-group">
                <label>Select Crop</label>
                <select
                  value={selectedCropForBatch}
                  onChange={(e) => setSelectedCropForBatch(e.target.value)}
                  className="modal-input"
                >
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Farmer / Cooperative Member Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patel, Shanti Devi"
                  value={farmerNameInput}
                  onChange={(e) => setFarmerNameInput(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Weight (Kilograms - kg)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantityKgInput}
                  onChange={(e) => setQuantityKgInput(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-note">
                Chamber will automatically apply targeted thermal hysteresis and multi-gas thresholds for this produce.
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save & Register Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .batches-view-container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px;
        }
        .batches-header-card {
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
        .batches-badge {
          font-size: 0.75rem;
          font-weight: 800;
          color: #0369a1;
          letter-spacing: 0.05em;
        }
        .batches-header-info h2 {
          font-size: 1.6rem;
          color: #0f172a;
          margin: 4px 0;
        }
        .batches-header-info p {
          color: #64748b;
          font-size: 0.92rem;
          max-width: 600px;
        }
        .batches-header-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .stat-pill {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 10px 18px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-number {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
        }
        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
        }
        .add-batch-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #16a34a;
          color: white;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.92rem;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
          transition: background 0.2s;
        }
        .add-batch-btn:hover {
          background: #15803d;
        }
        .crop-guideline-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
          border: 1.5px solid #86efac;
          border-radius: var(--radius-lg);
          padding: 22px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .guideline-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 18px;
          padding-bottom: 16px;
          border-bottom: 1px solid #dcfce7;
        }
        .guideline-crop-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .guideline-icon {
          font-size: 2.2rem;
        }
        .guideline-crop-title h3 {
          font-size: 1.3rem;
          color: #14532d;
        }
        .guideline-crop-title p {
          font-size: 0.88rem;
          color: #475569;
        }
        .guideline-change-crop {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .guideline-change-crop label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #15803d;
        }
        .crop-switch-dropdown {
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px solid #86efac;
          background: white;
          font-weight: 600;
          font-size: 0.88rem;
          color: #0f172a;
          cursor: pointer;
        }
        .guideline-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .guideline-metric {
          background: #ffffff;
          padding: 14px;
          border-radius: var(--radius-sm);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .gm-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .gm-value {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
        }
        .gm-status {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
        }
        .gm-status.safe { background: #dcfce7; color: #15803d; }
        .gm-status.warn { background: #fee2e2; color: #b91c1c; }
        .gm-sub {
          font-size: 0.75rem;
          color: #64748b;
        }
        .gm-tip {
          font-size: 0.82rem;
          color: #15803d;
          font-weight: 600;
          font-style: italic;
        }
        .batches-table-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .table-header-row {
          margin-bottom: 18px;
        }
        .table-header-row h3 {
          font-size: 1.25rem;
          color: #0f172a;
        }
        .table-sub {
          font-size: 0.85rem;
          color: #64748b;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .batches-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .batches-table th {
          padding: 12px 14px;
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .batches-table td {
          padding: 14px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
          color: #1e293b;
        }
        .batch-crop-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .crop-table-icon { font-size: 1.4rem; }
        .batch-crop-name { font-weight: 700; color: #0f172a; }
        .batch-farmer-name { font-size: 0.78rem; color: #64748b; }
        .qty-badge {
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.82rem;
        }
        .duration-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          color: #475569;
        }
        .table-freshness-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .table-fresh-bar-bg {
          width: 70px;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .table-fresh-bar-fill {
          height: 100%;
          border-radius: 4px;
        }
        .table-fresh-pct {
          font-weight: 800;
          font-size: 0.82rem;
        }
        .risk-badge {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 9999px;
          text-transform: uppercase;
        }
        .risk-badge.low { background: #dcfce7; color: #15803d; }
        .risk-badge.medium { background: #fef9c3; color: #854d0e; }
        .risk-badge.high { background: #fee2e2; color: #991b1b; }
        .delete-batch-btn {
          color: #94a3b8;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.15s;
        }
        .delete-batch-btn:hover {
          color: #dc2626;
          background: #fee2e2;
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 20px;
        }
        .add-batch-modal {
          background: white;
          width: 100%;
          max-width: 480px;
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-xl);
        }
        .modal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .modal-top h3 {
          font-size: 1.25rem;
          color: #0f172a;
        }
        .close-modal-btn {
          color: #64748b;
          font-size: 1.2rem;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
        }
        .modal-input {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #cbd5e1;
          font-size: 0.95rem;
          outline: none;
        }
        .modal-input:focus {
          border-color: #0284c7;
        }
        .form-note {
          font-size: 0.78rem;
          color: #64748b;
          background: #f8fafc;
          padding: 8px 12px;
          border-radius: 6px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }
        .btn-cancel {
          padding: 9px 16px;
          border-radius: 8px;
          font-weight: 600;
          color: #64748b;
        }
        .btn-confirm {
          padding: 9px 18px;
          border-radius: 8px;
          background: #16a34a;
          color: white;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
