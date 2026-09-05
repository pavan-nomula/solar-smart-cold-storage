import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory hardware telemetry store
let latestTelemetry = {
  temperature: 8.4,
  humidity: 86.0,
  battery: 78.0,
  batteryVoltage: 12.8,
  solarPower: 125.0,
  coolingActive: true,
  coolingPower: 65.0,
  voc: 28.0,
  alcohol: 10.0,
  doorOpen: false,
  freshness: 92,
  lastUpdated: null,
  isLiveHardware: false
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Endpoint for ESP32 to POST live sensor readings
app.post('/api/telemetry', (req, res) => {
  try {
    const data = req.body;
    console.log('[ESP32 Telemetry Received]:', data);

    latestTelemetry = {
      temperature: data.temperature !== undefined ? Number(data.temperature) : latestTelemetry.temperature,
      humidity: data.humidity !== undefined ? Number(data.humidity) : latestTelemetry.humidity,
      battery: data.battery !== undefined ? Number(data.battery) : latestTelemetry.battery,
      batteryVoltage: data.batteryVoltage !== undefined ? Number(data.batteryVoltage) : 12.8,
      solarPower: data.solarPower !== undefined ? Number(data.solarPower) : latestTelemetry.solarPower,
      coolingActive: data.coolingActive !== undefined ? Boolean(data.coolingActive) : latestTelemetry.coolingActive,
      coolingPower: data.coolingPower !== undefined ? Number(data.coolingPower) : 65.0,
      voc: data.voc !== undefined ? Number(data.voc) : latestTelemetry.voc,
      alcohol: data.alcohol !== undefined ? Number(data.alcohol) : latestTelemetry.alcohol,
      doorOpen: data.doorOpen !== undefined ? Boolean(data.doorOpen) : latestTelemetry.doorOpen,
      freshness: data.freshness !== undefined ? Number(data.freshness) : latestTelemetry.freshness,
      lastUpdated: Date.now(),
      isLiveHardware: true
    };

    return res.status(200).json({
      success: true,
      message: 'Telemetry received successfully',
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error processing telemetry:', error);
    return res.status(400).json({ success: false, error: 'Invalid payload' });
  }
});

// Endpoint for Dashboard to fetch current telemetry
app.get('/api/telemetry', (req, res) => {
  // If no hardware data received in the last 45 seconds, mark isLiveHardware as false
  const now = Date.now();
  const isRecent = latestTelemetry.lastUpdated && (now - latestTelemetry.lastUpdated < 45000);

  res.json({
    ...latestTelemetry,
    isLiveHardware: Boolean(isRecent)
  });
});

// Serve static frontend assets from Vite build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all other requests to index.html (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`- Dashboard: http://localhost:${PORT}`);
  console.log(`- API Telemetry: http://localhost:${PORT}/api/telemetry`);
});
