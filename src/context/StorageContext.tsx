import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { CROPS } from '../data/crops';
import type { CropProfile } from '../data/crops';
import { translations } from '../data/translations';
import type { Language, TranslationStrings } from '../data/translations';
import {
  interpretTemperature,
  interpretHumidity,
  interpretBattery,
  interpretFreshness,
  interpretSystemHealth
} from '../utils/statusEngine';
import type { MetricInterpretation } from '../utils/statusEngine';
import { calculateFreshness } from '../utils/freshnessEngine';
import type { FreshnessAnalysisResult } from '../utils/freshnessEngine';

export interface StorageBatch {
  id: string;
  cropId: string;
  cropName: string;
  cropIcon: string;
  quantityKg: number;
  farmerName: string;
  dateStored: string;
  storageDurationDays: number;
  temperature: number;
  humidity: number;
  freshnessScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'active' | 'retrieved' | 'quarantined';
}

export interface SmartAlert {
  id: string;
  type: 'temperature' | 'humidity' | 'freshness' | 'power' | 'battery' | 'door' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  farmerMessage: string;
  recommendedAction: string;
  timestamp: string;
  active: boolean;
}

export interface HistoricalDataPoint {
  time: string;
  timestamp: number;
  temperature: number;
  targetMin: number;
  targetMax: number;
  humidity: number;
  solarPower: number;
  coolingPower: number;
  battery: number;
  voc: number;
  freshness: number;
}

export interface StorageContextType {
  // Telemetry
  temperature: number;
  humidity: number;
  battery: number;
  batteryVoltage: number;
  batteryCurrent: number;
  solarPower: number;
  coolingPower: number;
  coolingActive: boolean;
  fansActive: boolean;
  doorOpen: boolean;
  gridPower: 'AVAILABLE' | 'FAILED';
  batteryMode: 'CHARGING' | 'DISCHARGING';
  voc: number;
  alcohol: number;
  h2s: number;
  nh3: number;
  dailySolarKwh: number;
  dailyConsumedKwh: number;
  systemHealth: number;
  storageDurationDays: number;

  // Selected crop
  selectedCrop: CropProfile;
  setSelectedCropId: (id: string) => void;

  // Modes & UI State
  farmerMode: boolean;
  setFarmerMode: (val: boolean) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
  activeTab: 'dashboard' | 'storage' | 'freshness' | 'energy' | 'alerts' | 'analytics' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'storage' | 'freshness' | 'energy' | 'alerts' | 'analytics' | 'settings') => void;

  // Batches
  batches: StorageBatch[];
  addBatch: (batch: Omit<StorageBatch, 'id' | 'freshnessScore' | 'riskLevel' | 'status'>) => void;
  removeBatch: (id: string) => void;

  // Alerts
  alerts: SmartAlert[];
  dismissAlert: (id: string) => void;
  addAlert: (alert: Omit<SmartAlert, 'id' | 'timestamp' | 'active'>) => void;

  // Interpretations
  tempInterp: MetricInterpretation;
  humidityInterp: MetricInterpretation;
  batteryInterp: MetricInterpretation;
  freshnessInterp: MetricInterpretation;
  systemInterp: MetricInterpretation;
  freshnessAnalysis: FreshnessAnalysisResult;

  // Analytics history
  historyRange: '1h' | '6h' | '24h' | '7d';
  setHistoryRange: (range: '1h' | '6h' | '24h' | '7d') => void;
  historicalData: HistoricalDataPoint[];

  // Demo simulation controls
  applySimulation: (scenario: 'normal' | 'temp_high' | 'humidity_high' | 'voc_increase' | 'freshness_warning' | 'power_failure' | 'battery_backup' | 'solar_charging' | 'door_open') => void;
  toggleDoor: () => void;
  setManualTemperature: (val: number) => void;
  setManualHumidity: (val: number) => void;
  setManualVoc: (val: number) => void;
  setManualBattery: (val: number) => void;

  // ESP32 Integration settings
  esp32Ip: string;
  setEsp32Ip: (ip: string) => void;
  esp32Port: number;
  setEsp32Port: (port: number) => void;
  mqttTopic: string;
  setMqttTopic: (topic: string) => void;
  isEsp32Connected: boolean;

  // "What does this mean?" Modal
  activeModalMetric: string | null;
  openMetricModal: (metricKey: string) => void;
  closeMetricModal: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Initial Batches
const INITIAL_BATCHES: StorageBatch[] = [
  {
    id: 'B001',
    cropId: 'tomato',
    cropName: 'Tomato (Hybrid Rama)',
    cropIcon: '🍅',
    quantityKg: 35,
    farmerName: 'Ramesh Patel',
    dateStored: '02 Sep 2026',
    storageDurationDays: 2,
    temperature: 8.4,
    humidity: 86,
    freshnessScore: 92,
    riskLevel: 'LOW',
    status: 'active'
  },
  {
    id: 'B002',
    cropId: 'beans',
    cropName: 'French Beans',
    cropIcon: '🫘',
    quantityKg: 20,
    farmerName: 'Sunita Devi',
    dateStored: '01 Sep 2026',
    storageDurationDays: 3,
    temperature: 8.4,
    humidity: 86,
    freshnessScore: 81,
    riskLevel: 'LOW',
    status: 'active'
  },
  {
    id: 'B003',
    cropId: 'leafy',
    cropName: 'Spinach (Palak)',
    cropIcon: '🥗',
    quantityKg: 15,
    farmerName: 'Anil Das',
    dateStored: '03 Sep 2026',
    storageDurationDays: 1,
    temperature: 8.4,
    humidity: 86,
    freshnessScore: 88,
    riskLevel: 'LOW',
    status: 'active'
  },
  {
    id: 'B004',
    cropId: 'chilli',
    cropName: 'Green Chilli (G4)',
    cropIcon: '🌶️',
    quantityKg: 25,
    farmerName: 'Lakshmi Rao',
    dateStored: '30 Aug 2026',
    storageDurationDays: 5,
    temperature: 8.4,
    humidity: 86,
    freshnessScore: 78,
    riskLevel: 'MEDIUM',
    status: 'active'
  }
];

export const StorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Telemetry State
  const [temperature, setTemperature] = useState<number>(8.4);
  const [humidity, setHumidity] = useState<number>(86);
  const [battery, setBattery] = useState<number>(78);
  const [batteryVoltage, setBatteryVoltage] = useState<number>(12.6);
  const [batteryCurrent, setBatteryCurrent] = useState<number>(5.8);
  const [solarPower, setSolarPower] = useState<number>(245);
  const [coolingPower, setCoolingPower] = useState<number>(72);
  const [coolingActive, setCoolingActive] = useState<boolean>(true);
  const [fansActive, setFansActive] = useState<boolean>(true);
  const [doorOpen, setDoorOpen] = useState<boolean>(false);
  const [gridPower, setGridPower] = useState<'AVAILABLE' | 'FAILED'>('AVAILABLE');
  const [batteryMode, setBatteryMode] = useState<'CHARGING' | 'DISCHARGING'>('CHARGING');
  const [storageDurationDays, setStorageDurationDays] = useState<number>(2);

  // Multi-Gas Sensors (Relative levels)
  const [voc, setVoc] = useState<number>(42);
  const [alcohol, setAlcohol] = useState<number>(18);
  const [h2s, setH2s] = useState<number>(4);
  const [nh3, setNh3] = useState<number>(8);

  // Daily Accumulators
  const [dailySolarKwh, setDailySolarKwh] = useState<number>(1.84);
  const [dailyConsumedKwh, setDailyConsumedKwh] = useState<number>(1.21);
  const [systemHealth, setSystemHealth] = useState<number>(96);

  // Crop & Configuration
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const selectedCrop = useMemo(() => {
    return CROPS.find(c => c.id === selectedCropId) || CROPS[0];
  }, [selectedCropId]);

  // UI Modes
  const [farmerMode, setFarmerMode] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'storage' | 'freshness' | 'energy' | 'alerts' | 'analytics' | 'settings'>('dashboard');

  // Batches
  const [batches, setBatches] = useState<StorageBatch[]>(INITIAL_BATCHES);

  // Active Alerts
  const [alerts, setAlerts] = useState<SmartAlert[]>([
    {
      id: 'alt-init-1',
      type: 'freshness',
      severity: 'info',
      title: 'STORAGE SAFE',
      farmerMessage: 'Storage conditions are normal and produce is fresh.',
      recommendedAction: 'Keep chamber closed and maintain current solar charging.',
      timestamp: 'Just now',
      active: true
    }
  ]);

  // ESP32 Integration settings
  const [esp32Ip, setEsp32Ip] = useState<string>('192.168.1.104');
  const [esp32Port, setEsp32Port] = useState<number>(80);
  const [mqttTopic, setMqttTopic] = useState<string>('agri/coldstorage/scs001/telemetry');
  const [isEsp32Connected, setIsEsp32Connected] = useState<boolean>(true);

  // "What does this mean?" Modal
  const [activeModalMetric, setActiveModalMetric] = useState<string | null>(null);

  // Analytics history range
  const [historyRange, setHistoryRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  // Current translation dictionary
  const t = useMemo(() => translations[language], [language]);

  // Freshness Engine Analysis
  const freshnessAnalysis = useMemo(() => {
    return calculateFreshness({
      vocSignal: voc,
      alcoholSignal: alcohol,
      h2sSignal: h2s,
      nh3Signal: nh3,
      temperature,
      humidity,
      storageDurationDays,
      crop: selectedCrop
    });
  }, [voc, alcohol, h2s, nh3, temperature, humidity, storageDurationDays, selectedCrop]);

  // Interpretations
  const tempInterp = useMemo(() => interpretTemperature(temperature, selectedCrop), [temperature, selectedCrop]);
  const humidityInterp = useMemo(() => interpretHumidity(humidity, selectedCrop), [humidity, selectedCrop]);
  const batteryInterp = useMemo(() => interpretBattery(battery, batteryMode === 'CHARGING'), [battery, batteryMode]);
  const freshnessInterp = useMemo(() => interpretFreshness(freshnessAnalysis.freshnessScore, freshnessAnalysis.deteriorationRisk), [freshnessAnalysis]);
  const systemInterp = useMemo(() => interpretSystemHealth(systemHealth), [systemHealth]);

  // Handle subtle live micro-fluctuations (every 3.5s) unless in active simulation lock
  useEffect(() => {
    const interval = setInterval(() => {
      // Natural micro fluctuations
      setTemperature(prev => {
        const delta = (Math.random() - 0.5) * 0.12;
        return Number((prev + delta).toFixed(2));
      });
      setHumidity(prev => {
        const delta = (Math.random() - 0.5) * 0.3;
        return Math.max(70, Math.min(99, Math.round(prev + delta)));
      });
      setSolarPower(prev => {
        if (gridPower === 'FAILED' && batteryMode === 'DISCHARGING') return prev;
        const delta = Math.round((Math.random() - 0.5) * 6);
        return Math.max(180, Math.min(310, prev + delta));
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [gridPower, batteryMode]);

  // Sync body class for farmer mode
  useEffect(() => {
    if (farmerMode) {
      document.body.classList.add('farmer-mode-active');
    } else {
      document.body.classList.remove('farmer-mode-active');
    }
  }, [farmerMode]);

  // Batch actions
  const addBatch = (newBatch: Omit<StorageBatch, 'id' | 'freshnessScore' | 'riskLevel' | 'status'>) => {
    const id = `B00${batches.length + 1}`;
    const batch: StorageBatch = {
      ...newBatch,
      id,
      freshnessScore: 94,
      riskLevel: 'LOW',
      status: 'active'
    };
    setBatches([batch, ...batches]);
  };

  const removeBatch = (id: string) => {
    setBatches(batches.filter(b => b.id !== id));
  };

  // Alert actions
  const dismissAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: false } : a));
  };

  const addAlert = (alertData: Omit<SmartAlert, 'id' | 'timestamp' | 'active'>) => {
    const newAlert: SmartAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      timestamp: 'Just now',
      active: true
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const toggleDoor = () => {
    const newState = !doorOpen;
    setDoorOpen(newState);
    if (newState) {
      addAlert({
        type: 'door',
        severity: 'warning',
        title: 'DOOR LEFT OPEN',
        farmerMessage: 'The cold storage door is open! Cold air is escaping.',
        recommendedAction: 'Close and latch the chamber door firmly.'
      });
      // Temp begins to rise
      setTemperature(prev => Number((prev + 1.8).toFixed(1)));
    } else {
      addAlert({
        type: 'door',
        severity: 'info',
        title: 'DOOR SECURE',
        farmerMessage: 'Cold chamber door is now securely closed.',
        recommendedAction: 'Cooling will restore target chill.'
      });
      setTemperature(prev => Number(Math.max(selectedCrop.idealTemp, prev - 1.2).toFixed(1)));
    }
  };

  // Manual adjustments
  const setManualTemperature = (val: number) => setTemperature(val);
  const setManualHumidity = (val: number) => setHumidity(val);
  const setManualVoc = (val: number) => setVoc(val);
  const setManualBattery = (val: number) => setBattery(val);

  // Modal handlers
  const openMetricModal = (key: string) => setActiveModalMetric(key);
  const closeMetricModal = () => setActiveModalMetric(null);

  // DEMO MODE SIMULATION SCENARIOS (Hardware Presentation Ready)
  const applySimulation = (scenario: 'normal' | 'temp_high' | 'humidity_high' | 'voc_increase' | 'freshness_warning' | 'power_failure' | 'battery_backup' | 'solar_charging' | 'door_open') => {
    switch (scenario) {
      case 'normal':
        setTemperature(8.4);
        setHumidity(86);
        setBattery(78);
        setBatteryVoltage(12.6);
        setSolarPower(245);
        setCoolingPower(72);
        setCoolingActive(true);
        setFansActive(true);
        setDoorOpen(false);
        setGridPower('AVAILABLE');
        setBatteryMode('CHARGING');
        setVoc(42);
        setAlcohol(18);
        setH2s(4);
        setNh3(8);
        setSystemHealth(96);
        addAlert({
          type: 'system',
          severity: 'info',
          title: 'NORMAL STORAGE RESTORED',
          farmerMessage: 'Temperature, moisture, and freshness are all in safe condition.',
          recommendedAction: 'Normal operation continuing.'
        });
        break;

      case 'temp_high':
        setTemperature(14.6);
        setCoolingPower(110);
        addAlert({
          type: 'temperature',
          severity: 'critical',
          title: 'TEMPERATURE HIGH ⚠',
          farmerMessage: 'Storage is getting warm (14.6°C). Vegetables may spoil if uncooled.',
          recommendedAction: 'Check cooling fans, ensure door is closed, and verify solar supply.'
        });
        break;

      case 'humidity_high':
        setHumidity(98);
        addAlert({
          type: 'humidity',
          severity: 'warning',
          title: 'HUMIDITY HIGH ⚠',
          farmerMessage: 'Moisture level is very high (98%). Water droplets may form on produce.',
          recommendedAction: 'Turn on circulation fan to disperse moisture pockets.'
        });
        break;

      case 'voc_increase':
        setVoc(118);
        setAlcohol(56);
        setH2s(16);
        setNh3(22);
        addAlert({
          type: 'freshness',
          severity: 'warning',
          title: 'SPOILAGE GAS SPIKE DETECTED ⚠',
          farmerMessage: 'Gas sensors detect early sign of rotting or softening produce.',
          recommendedAction: 'Check crates inside and consider early transport or sorting of affected crop.'
        });
        break;

      case 'freshness_warning':
        setVoc(165);
        setAlcohol(82);
        setH2s(31);
        setNh3(42);
        setTemperature(13.2);
        addAlert({
          type: 'freshness',
          severity: 'critical',
          title: 'FRESHNESS WARNING — HIGH RISK ✕',
          farmerMessage: 'Vegetable condition is deteriorating! Spoilage gas signature confirmed.',
          recommendedAction: 'Sort out decayed vegetables immediately to protect remaining good produce.'
        });
        break;

      case 'power_failure':
      case 'battery_backup':
        setGridPower('FAILED');
        setBatteryMode('DISCHARGING');
        setBattery(64);
        setBatteryVoltage(12.1);
        setSolarPower(60);
        setCoolingPower(70);
        addAlert({
          type: 'power',
          severity: 'critical',
          title: 'POWER FAILURE — BATTERY BACKUP ACTIVE ⚡',
          farmerMessage: 'Main power failed. Battery backup automatically took over. Cooling is continuing!',
          recommendedAction: 'Keep chamber door closed. Solar array will recharge battery during daylight.'
        });
        break;

      case 'solar_charging':
        setSolarPower(285);
        setBatteryMode('CHARGING');
        setBattery(88);
        setBatteryVoltage(13.2);
        addAlert({
          type: 'power',
          severity: 'info',
          title: 'HIGH SOLAR GENERATION ☀️',
          farmerMessage: 'Solar panels producing strong power (285W). Battery is charging fast.',
          recommendedAction: 'Ample power available for continuous deep chilling.'
        });
        break;

      case 'door_open':
        toggleDoor();
        break;
    }
  };

  // Generate historical data based on time range
  const historicalData: HistoricalDataPoint[] = useMemo(() => {
    const pointsCount = historyRange === '1h' ? 12 : historyRange === '6h' ? 24 : historyRange === '24h' ? 24 : 28;
    const now = Date.now();
    const stepMs = historyRange === '1h' ? 5 * 60 * 1000 : historyRange === '6h' ? 15 * 60 * 1000 : historyRange === '24h' ? 60 * 60 * 1000 : 6 * 60 * 60 * 1000;

    const data: HistoricalDataPoint[] = [];
    for (let i = pointsCount - 1; i >= 0; i--) {
      const ts = now - i * stepMs;
      const dateObj = new Date(ts);
      const timeStr = historyRange === '7d'
        ? `${dateObj.getDate()}/${dateObj.getMonth() + 1}`
        : `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

      // Simulate historical curve around current values
      const progress = (pointsCount - i) / pointsCount;
      const tDev = Math.sin(progress * Math.PI * 2) * 0.8;
      const tempVal = Number((temperature + tDev * 0.5 - 0.2).toFixed(1));
      const humVal = Math.round(humidity + Math.cos(progress * Math.PI * 2) * 2);
      const solVal = Math.round(Math.max(0, solarPower * Math.sin(progress * Math.PI)));
      const freshVal = Math.min(98, Math.max(50, Math.round(freshnessAnalysis.freshnessScore - i * 0.4)));

      data.push({
        time: timeStr,
        timestamp: ts,
        temperature: tempVal,
        targetMin: selectedCrop.minTemp,
        targetMax: selectedCrop.maxTemp,
        humidity: humVal,
        solarPower: solVal,
        coolingPower: 72,
        battery: Math.min(100, Math.max(40, Math.round(battery + tDev * 3))),
        voc: Math.round(voc + (Math.random() - 0.5) * 4),
        freshness: freshVal
      });
    }
    return data;
  }, [historyRange, temperature, humidity, solarPower, battery, voc, freshnessAnalysis.freshnessScore, selectedCrop]);

  return (
    <StorageContext.Provider
      value={{
        temperature,
        humidity,
        battery,
        batteryVoltage,
        batteryCurrent,
        solarPower,
        coolingPower,
        coolingActive,
        fansActive,
        doorOpen,
        gridPower,
        batteryMode,
        voc,
        alcohol,
        h2s,
        nh3,
        dailySolarKwh,
        dailyConsumedKwh,
        systemHealth,
        storageDurationDays,

        selectedCrop,
        setSelectedCropId,

        farmerMode,
        setFarmerMode,
        demoMode,
        setDemoMode,
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,

        batches,
        addBatch,
        removeBatch,

        alerts,
        dismissAlert,
        addAlert,

        tempInterp,
        humidityInterp,
        batteryInterp,
        freshnessInterp,
        systemInterp,
        freshnessAnalysis,

        historyRange,
        setHistoryRange,
        historicalData,

        applySimulation,
        toggleDoor,
        setManualTemperature,
        setManualHumidity,
        setManualVoc,
        setManualBattery,

        esp32Ip,
        setEsp32Ip,
        esp32Port,
        setEsp32Port,
        mqttTopic,
        setMqttTopic,
        isEsp32Connected,

        activeModalMetric,
        openMetricModal,
        closeMetricModal
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
