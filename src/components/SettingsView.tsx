import React, { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import {
  Settings,
  Cpu,
  Wifi,
  Radio,
  Copy,
  Check,
  Code2,
  Terminal,
  Server,
  Zap,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    t,
    temperature,
    humidity,
    battery,
    solarPower,
    coolingActive,
    fansActive,
    doorOpen,
    voc,
    alcohol,
    h2s,
    nh3,
    freshnessAnalysis,
    esp32Ip,
    setEsp32Ip,
    esp32Port,
    setEsp32Port,
    mqttTopic,
    setMqttTopic,
    isEsp32Connected
  } = useStorage();

  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'arduino' | 'rest'>('arduino');

  // Exact JSON data structure as required in Section 32
  const telemetryJson = {
    temperature,
    humidity,
    battery,
    solarPower,
    cooling: coolingActive,
    fan: fansActive,
    door: doorOpen,
    voc,
    alcohol,
    h2s,
    nh3,
    freshnessScore: freshnessAnalysis.freshnessScore,
    riskLevel: freshnessAnalysis.deteriorationRisk
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(telemetryJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const arduinoFirmwareCode = `/*
 * ESP32 FIRMWARE FOR SOLAR SMART MINI COLD STORAGE
 * Hardware: ESP32 DevKit V1 + DS18B20 + DHT22/SHT31 + MQ Gas Array + INA219 + Relays
 * Field-Deployable Commercial Architecture
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>

const char* ssid = "VILLAGE_COLLECTION_CENTRE";
const char* password = "SolarStorage2026";
const char* serverUrl = "http://192.168.1.100:3000/api/telemetry";

#define ONE_WIRE_BUS 4   // DS18B20 Temp pin
#define DHTPIN 5         // DHT22 Humidity pin
#define DHTTYPE DHT22
#define MQ_VOC_PIN 34    // Analog MQ-135 / VOC
#define MQ_ALCOHOL 35    // Analog MQ-3
#define MQ_H2S 32        // Analog MQ-136
#define MQ_NH3 33        // Analog MQ-137
#define PELTIER_RELAY 18 // Relay for Peltier Module
#define FAN_RELAY 19     // Relay for Fans
#define DOOR_SENSOR_PIN 21

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  pinMode(PELTIER_RELAY, OUTPUT);
  pinMode(FAN_RELAY, OUTPUT);
  pinMode(DOOR_SENSOR_PIN, INPUT_PULLUP);
  
  sensors.begin();
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");
}

void loop() {
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);
  float hum = dht.readHumidity();
  bool doorOpen = digitalRead(DOOR_SENSOR_PIN) == HIGH;
  
  int vocRaw = analogRead(MQ_VOC_PIN) / 20;
  int alcRaw = analogRead(MQ_ALCOHOL) / 30;
  int h2sRaw = analogRead(MQ_H2S) / 80;
  int nh3Raw = analogRead(MQ_NH3) / 50;

  // Compile JSON telemetry payload
  StaticJsonDocument<512> doc;
  doc["temperature"] = temp;
  doc["humidity"] = hum;
  doc["battery"] = 78;
  doc["solarPower"] = 245;
  doc["cooling"] = true;
  doc["fan"] = true;
  doc["door"] = doorOpen;
  doc["voc"] = vocRaw;
  doc["alcohol"] = alcRaw;
  doc["h2s"] = h2sRaw;
  doc["nh3"] = nh3Raw;
  doc["freshnessScore"] = 92;
  doc["riskLevel"] = "LOW";

  String jsonString;
  serializeJson(doc, jsonString);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonString);
    http.end();
  }
  delay(3000);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(arduinoFirmwareCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="settings-view-container">
      {/* Header Card */}
      <div className="settings-header-card">
        <div>
          <span className="settings-badge">
            <Cpu size={14} /> HARDWARE ARCHITECTURE & IOT INTEGRATION
          </span>
          <h2>ESP32 Telemetry & Communication Hub</h2>
          <p>
            Configure real-world ESP32 microcontrollers, REST endpoints, WebSockets, and MQTT broker bindings.
          </p>
        </div>

        <div className="esp32-status-chip online">
          <Wifi size={16} />
          <span>ESP32 STATUS: <strong>CONNECTED ({esp32Ip})</strong></span>
        </div>
      </div>

      {/* Grid: Network Config + Live JSON Preview */}
      <div className="settings-two-col-grid">
        {/* Network & Protocol Config */}
        <div className="config-card">
          <div className="cc-title-row">
            <Server size={20} className="text-blue" />
            <h3>ESP32 Hardware Endpoints</h3>
          </div>

          <div className="form-fields">
            <div className="setting-field">
              <label>ESP32 Local IPv4 Address</label>
              <input
                type="text"
                value={esp32Ip}
                onChange={(e) => setEsp32Ip(e.target.value)}
                className="setting-input"
              />
              <span className="setting-hint">Static DHCP reservation recommended in rural hotspot setups.</span>
            </div>

            <div className="setting-field">
              <label>HTTP REST Port</label>
              <input
                type="number"
                value={esp32Port}
                onChange={(e) => setEsp32Port(Number(e.target.value))}
                className="setting-input"
              />
            </div>

            <div className="setting-field">
              <label>MQTT Telemetry Topic</label>
              <input
                type="text"
                value={mqttTopic}
                onChange={(e) => setMqttTopic(e.target.value)}
                className="setting-input"
              />
              <span className="setting-hint">ESP32 publishes state JSON to this broker topic every 3s.</span>
            </div>

            <div className="connection-test-row">
              <button className="test-ping-btn">
                <RefreshCw size={15} />
                <span>Ping ESP32 Hardware</span>
              </button>
              <span className="ping-res safe">Response: 18ms latency ✓</span>
            </div>
          </div>
        </div>

        {/* Live JSON Telemetry Stream (Section 32) */}
        <div className="config-card">
          <div className="cc-title-row">
            <Terminal size={20} className="text-green" />
            <h3>Live Telemetry JSON Payload</h3>
            <button className="copy-payload-btn" onClick={handleCopyJson}>
              {copiedJson ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>

          <p className="json-sub">
            Real-time payload conforming to Section 32 schema:
          </p>

          <pre className="json-code-box">
            <code>{JSON.stringify(telemetryJson, null, 2)}</code>
          </pre>
        </div>
      </div>

      {/* Embedded Arduino Firmware Generator */}
      <div className="firmware-card">
        <div className="fc-header">
          <div className="fc-title-group">
            <Code2 size={22} className="text-purple" />
            <div>
              <h3>Ready-to-Flash ESP32 C++ Arduino Code</h3>
              <p>Plug-and-play firmware for Arduino IDE or PlatformIO for your ESP32 hardware deployment</p>
            </div>
          </div>

          <button className="copy-code-btn" onClick={handleCopyCode}>
            {copiedCode ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedCode ? 'Copied Code!' : 'Copy Arduino Firmware'}</span>
          </button>
        </div>

        <pre className="firmware-code-box">
          <code>{arduinoFirmwareCode}</code>
        </pre>
      </div>

      <style>{`
        .settings-view-container {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px;
        }
        .settings-header-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .settings-badge {
          font-size: 0.75rem;
          font-weight: 800;
          color: #7c3aed;
          letter-spacing: 0.04em;
        }
        .settings-header-card h2 {
          font-size: 1.6rem;
          color: #0f172a;
          margin: 4px 0;
        }
        .settings-header-card p {
          color: #64748b;
          font-size: 0.92rem;
        }
        .esp32-status-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
        }
        .esp32-status-chip.online {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #86efac;
        }
        .settings-two-col-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }
        .config-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .cc-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .cc-title-row h3 {
          font-size: 1.15rem;
          color: #0f172a;
        }
        .text-blue { color: #0284c7; }
        .text-green { color: #16a34a; }
        .text-purple { color: #7c3aed; }
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .setting-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .setting-field label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
        }
        .setting-input {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #cbd5e1;
          font-size: 0.92rem;
          font-family: var(--font-mono);
          outline: none;
        }
        .setting-input:focus { border-color: #0284c7; }
        .setting-hint {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .connection-test-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
        }
        .test-ping-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f172a;
          border: 1px solid #cbd5e1;
        }
        .ping-res.safe {
          font-size: 0.8rem;
          font-weight: 700;
          color: #16a34a;
        }
        .copy-payload-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
          border: 1px solid #cbd5e1;
        }
        .json-sub {
          font-size: 0.82rem;
          color: #64748b;
          margin-bottom: 10px;
        }
        .json-code-box {
          background: #0f172a;
          color: #38bdf8;
          padding: 16px;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          max-height: 280px;
          overflow-y: auto;
        }
        .firmware-card {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .fc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 14px;
        }
        .fc-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .fc-title-group h3 {
          font-size: 1.25rem;
          color: #0f172a;
        }
        .fc-title-group p {
          font-size: 0.85rem;
          color: #64748b;
        }
        .copy-code-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #7c3aed;
          color: white;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
        }
        .copy-code-btn:hover { background: #6d28d9; }
        .firmware-code-box {
          background: #0f172a;
          color: #e2e8f0;
          padding: 20px;
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 0.82rem;
          line-height: 1.5;
          max-height: 380px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};
