import React, { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import { CROPS } from '../data/crops';
import {
  Sun,
  Snowflake,
  Battery,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
  Zap,
  Radio,
  DoorClosed,
  DoorOpen,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Gauge,
  Activity,
  Wind,
  Wifi
} from 'lucide-react';

export const SimpleCleanDashboard: React.FC = () => {
  const {
    temperature,
    humidity,
    battery,
    batteryVoltage,
    solarPower,
    coolingActive,
    coolingPower,
    voc,
    alcohol,
    doorOpen,
    toggleDoor,
    selectedCrop,
    setSelectedCropId,
    language,
    setLanguage,
    applySimulation
  } = useStorage();

  const [showTechnical, setShowTechnical] = useState(false);
  const [lcdScreenIndex, setLcdScreenIndex] = useState<1 | 2>(1);

  // Live Telemetry from Render /api/telemetry
  const [telemetry, setTelemetry] = useState<any>(null);
  const [secondsAgo, setSecondsAgo] = useState<number | null>(null);
  const [testSending, setTestSending] = useState(false);

  // Poll /api/telemetry every 1.5 seconds
  useEffect(() => {
    let isMounted = true;
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setTelemetry(data);
            if (data.lastUpdated) {
              const diff = Math.max(0, Math.round((Date.now() - data.lastUpdated) / 1000));
              setSecondsAgo(diff);
            }
          }
        }
      } catch (err) {
        // Offline or dev mode
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isLive = Boolean(telemetry?.isLiveHardware);

  // Active readings: Use real hardware data if available, otherwise context mock
  const currentTemp = (isLive && telemetry?.temperature !== undefined) ? Number(telemetry.temperature) : temperature;
  const currentHum = (isLive && telemetry?.humidity !== undefined) ? Number(telemetry.humidity) : humidity;
  const currentBatt = (isLive && telemetry?.battery !== undefined) ? Number(telemetry.battery) : battery;
  const currentBattVolt = (isLive && telemetry?.batteryVoltage !== undefined) ? Number(telemetry.batteryVoltage) : batteryVoltage;
  const currentSolar = (isLive && telemetry?.solarPower !== undefined) ? Number(telemetry.solarPower) : solarPower;
  const currentCoolingActive = (isLive && telemetry?.coolingActive !== undefined) ? Boolean(telemetry.coolingActive) : coolingActive;
  const currentCoolingPower = (isLive && telemetry?.coolingPower !== undefined) ? Number(telemetry.coolingPower) : coolingPower;
  const currentVoc = (isLive && telemetry?.voc !== undefined) ? Number(telemetry.voc) : voc;
  const currentAlcohol = (isLive && telemetry?.alcohol !== undefined) ? Number(telemetry.alcohol) : alcohol;
  const currentDoorOpen = (isLive && telemetry?.doorOpen !== undefined) ? Boolean(telemetry.doorOpen) : doorOpen;

  // Quick bilingual dictionary for effortless farmer comprehension
  const isTe = language === 'te';
  const isHi = language === 'hi';

  // Calculate Freshness Score based on current readings
  const vocPenalty = Math.max(0, (currentVoc - 35) * 0.7);
  const alcoholPenalty = Math.max(0, (currentAlcohol - 20) * 1.2);
  const tempExcess = Math.max(0, currentTemp - selectedCrop.maxTemp);
  const tempPenalty = tempExcess * 4;
  const rawScore = Math.round(100 - vocPenalty - alcoholPenalty - tempPenalty);
  const freshnessScore = Math.max(25, Math.min(99, rawScore));

  // Determine Overall System Status & Farmer Statuses
  let freshnessStatus = 'FRESH ✓';
  let freshnessStatusTe = 'తాజాగా ఉంది ✓';
  let freshnessStatusHi = 'ताज़ा है ✓';
  let freshnessLevel: 'good' | 'warning' | 'critical' = 'good';
  let freshnessNote = 'Vegetables are in good condition. Safe for storage.';
  let freshnessNoteTe = 'కూరగాయలు మంచి స్థితిలో తాజాగా ఉన్నాయి. నిల్వ సురక్షితం.';
  let freshnessNoteHi = 'सब्जियां बहुत अच्छी स्थिति में हैं। सुरक्षित भंडारण।';

  if (freshnessScore < 60) {
    freshnessStatus = 'CRITICAL ✕';
    freshnessStatusTe = 'పాడయ్యే ప్రమాదం ✕';
    freshnessStatusHi = 'खराब होने का खतरा ✕';
    freshnessLevel = 'critical';
    freshnessNote = 'High deterioration risk! Remove affected items or sell immediately.';
    freshnessNoteTe = 'కూరగాయలు త్వరగా పాడయ్యే స్థితిలో ఉన్నాయి! వెంటనే మార్కెట్‌కు పంపండి.';
    freshnessNoteHi = 'सब्जियां खराब होने की कगार पर हैं! तुरंत उपयोग या बिक्री करें।';
  } else if (freshnessScore < 80) {
    freshnessStatus = 'ATTENTION ⚠';
    freshnessStatusTe = 'శ్రద్ధ వహించండి ⚠';
    freshnessStatusHi = 'ध्यान दें ⚠';
    freshnessLevel = 'warning';
    freshnessNote = 'Freshness is declining. Check produce and schedule for early sale.';
    freshnessNoteTe = 'తాజాదనం క్రమంగా తగ్గుతోంది. నిల్వను తనిఖీ చేసి త్వరగా విక్రయించండి.';
    freshnessNoteHi = 'ताजगी कम हो रही है। सब्जियों की जांच करें।';
  }

  // Temperature Status
  let tempStatus = 'SAFE ✓';
  let tempStatusTe = 'సురక్షితం ✓';
  let tempStatusHi = 'सुरक्षित ✓';
  let tempLevel: 'good' | 'warning' | 'critical' = 'good';
  let tempNote = 'Chamber is cold and preserving freshness.';
  let tempNoteTe = 'గది తగినంత చల్లగా ఉండి కూరగాయలను కాపాడుతోంది.';
  let tempNoteHi = 'कमरे में उचित ठंडक बनी हुई है।';

  if (currentTemp > selectedCrop.maxTemp + 3) {
    tempStatus = 'TOO WARM ✕';
    tempStatusTe = 'ఎక్కువ వేడి ✕';
    tempStatusHi = 'बहुत गर्म ✕';
    tempLevel = 'critical';
    tempNote = 'Temperature too high! Check door seal and Peltier cooler.';
    tempNoteTe = 'ఉష్ణోగ్రత చాలా ఎక్కువగా ఉంది! తలుపు మరియు కూలర్ తనిఖీ చేయండి.';
    tempNoteHi = 'तापमान बहुत अधिक है! दरवाजा और कूलर जांचें।';
  } else if (currentTemp > selectedCrop.maxTemp) {
    tempStatus = 'WARMING UP ⚠';
    tempStatusTe = 'వేడి పెరుగుతోంది ⚠';
    tempStatusHi = 'तापमान बढ़ रहा है ⚠';
    tempLevel = 'warning';
    tempNote = 'Slightly warm. Ensure storage door is kept tightly shut.';
    tempNoteTe = 'కాస్త వేడి పెరుగుతోంది. తలుపును సరిగ్గా మూసి ఉంచండి.';
    tempNoteHi = 'हल्का गर्म। सुनिश्चित करें कि दरवाजा बंद रहे।';
  }

  // Humidity Status
  let humStatus = 'GOOD ✓';
  let humStatusTe = 'సరిపడా తేమ ✓';
  let humStatusHi = 'उचित नमी ✓';
  let humLevel: 'good' | 'warning' | 'critical' = 'good';
  let humNote = 'Optimal moisture prevents vegetables from drying out.';
  let humNoteTe = 'సరిపడా తేమ శాతం వల్ల కూరగాయలు వాడిపోకుండా ఉంటాయి.';
  let humNoteHi = 'पर्याप्त नमी से सब्जियां ताज़ा रहती हैं और सूखती नहीं हैं।';

  if (currentHum < selectedCrop.minHumidity) {
    humStatus = 'TOO DRY ⚠';
    humStatusTe = 'తేమ తక్కువ ⚠';
    humStatusHi = 'कम नमी ⚠';
    humLevel = 'warning';
    humNote = 'Air is dry. Produce may lose weight or wither.';
    humNoteTe = 'గాలి పొడిగా ఉంది. కూరగాయలు తేమ కోల్పోయి వాడిపోవచ్చు.';
    humNoteHi = 'नमी कम है। सब्जियां सूख सकती हैं।';
  } else if (currentHum > selectedCrop.maxHumidity + 5) {
    humStatus = 'VERY HIGH ⚠';
    humStatusTe = 'తేమ ఎక్కువ ⚠';
    humStatusHi = 'अधिक नमी ⚠';
    humLevel = 'warning';
    humNote = 'Excess moisture. Ensure internal air circulation fan is running.';
    humNoteTe = 'తేమ చాలా ఎక్కువగా ఉంది. అంతర్గత ఫ్యాన్ తిరుగుతోందో లేదో చూడండి.';
    humNoteHi = 'अत्यधिक नमी। पंखा चालू रखें।';
  }

  // Battery Status
  let battStatus = 'MOSTLY FULL ✓';
  let battStatusTe = 'నిండుగా ఉంది ✓';
  let battStatusHi = 'लगभग भरा हुआ ✓';
  let battLevel: 'good' | 'warning' | 'critical' = 'good';
  let battNote = 'Backup ready for uninterrupted night cooling.';
  let battNoteTe = 'రాత్రి వేళ కూడా కూలింగ్ ఆగకుండా నడవడానికి బ్యాకప్ సిద్ధం.';
  let battNoteHi = 'रात में बिना रुकावट ठंडक के लिए पर्याप्त बैटरी उपलब्ध है।';

  if (currentBatt < 25) {
    battStatus = 'LOW BATTERY 🔴';
    battStatusTe = 'బ్యాటరీ తక్కువ 🔴';
    battStatusHi = 'कम बैटरी 🔴';
    battLevel = 'critical';
    battNote = 'Battery low! Allow solar charging before heavy cooling.';
    battNoteTe = 'బ్యాటరీ చార్జ్ తక్కువగా ఉంది! సోలార్ ద్వారా చార్జ్ అవ్వనివ్వండి.';
    battNoteHi = 'बैटरी बहुत कम है! सौर ऊर्जा से चार्ज होने दें।';
  } else if (currentBatt < 50) {
    battStatus = 'MEDIUM ⚡';
    battStatusTe = 'మధ్యస్థం ⚡';
    battStatusHi = 'मध्यम स्तर ⚡';
    battLevel = 'warning';
    battNote = 'Moderate battery charge. Solar charging is active.';
    battNoteTe = 'సాధారణ చార్జ్ ఉంది. సోలార్ ప్యానెల్ ఛార్జింగ్ చేస్తోంది.';
    battNoteHi = 'सामान्य चार्ज। सोलर चार्जिंग चालू है।';
  }

  // Solar Status
  const isSolarWorking = currentSolar > 25;
  const solarStatus = isSolarWorking ? 'WORKING ✓' : 'STANDBY (NIGHT)';
  const solarStatusTe = isSolarWorking ? 'పనిచేస్తోంది ✓' : 'స్టాండ్‌బై (రాత్రి)';
  const solarStatusHi = isSolarWorking ? 'काम कर रहा है ✓' : 'स्टैंडबाय (रात)';
  const solarLevel = isSolarWorking ? 'good' : 'warning';
  const solarNote = isSolarWorking
    ? 'Solar panel generating clean energy from sunlight.'
    : 'No sunlight. System running on battery backup.';
  const solarNoteTe = isSolarWorking
    ? 'సోలార్ ప్యానెల్ ఎండ నుండి ఉచిత కరెంట్‌ను ఉత్పత్తి చేస్తోంది.'
    : 'సూర్యరశ్మి లేదు. సిస్టమ్ బ్యాటరీ బ్యాకప్‌పై నడుస్తోంది.';
  const solarNoteHi = isSolarWorking
    ? 'सौर पैनल धूप से बिजली बना रहा है।'
    : 'धूप नहीं है। सिस्टम बैटरी बैकअप पर चल रहा है।';

  // Peltier Cooling Status
  const isCoolingActive = currentCoolingActive;
  const coolingStatus = isCoolingActive ? 'ACTIVE & COOLING ❄️' : 'OFF / IDLE';
  const coolingStatusTe = isCoolingActive ? 'కూలింగ్ ఆన్ ❄️' : 'ఆఫ్ లో ఉంది';
  const coolingStatusHi = isCoolingActive ? 'कूलिंग चालू ❄️' : 'बंद है';
  const coolingLevel = isCoolingActive ? 'good' : 'warning';
  const coolingNote = isCoolingActive
    ? 'Solid-state Peltier cooler is actively maintaining cold temperature.'
    : 'Peltier cooling is paused or temperature target reached.';
  const coolingNoteTe = isCoolingActive
    ? 'పెల్టియర్ కూలింగ్ యూనిట్ నిరంతరంగా చల్లదనాన్ని అందిస్తోంది.'
    : 'ఉష్ణోగ్రత సరైన పరిధికి రావడం వల్ల కూలింగ్ నిలిచింది.';
  const coolingNoteHi = isCoolingActive
    ? 'पेल्टियर कूलिंग सिस्टम ठंडक बनाए रख रहा है।'
    : 'टारगेट तापमान पर कूलिंग रुकी हुई है।';

  // Active Alert Detection
  const hasAlert =
    freshnessLevel !== 'good' ||
    tempLevel !== 'good' ||
    humLevel !== 'good' ||
    battLevel === 'critical' ||
    currentDoorOpen;

  // Helper to test send hardware packet directly from UI
  const handleTestPost = async () => {
    setTestSending(true);
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: 7.6,
          humidity: 88.0,
          battery: 85.0,
          batteryVoltage: 13.1,
          solarPower: 138.0,
          coolingActive: true,
          coolingPower: 65.0,
          voc: 24.0,
          alcohol: 8.0,
          doorOpen: false
        })
      });
      // Refresh telemetry
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
        setSecondsAgo(0);
      }
    } catch (err) {
      console.error('Test post failed:', err);
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div className="simple-dashboard">
      {/* 1. CLEAN TOP HEADER */}
      <header className="clean-header">
        <div className="header-container">
          <div className="brand-group">
            <div className="brand-icon-box">
              <Snowflake className="brand-icon" size={28} />
            </div>
            <div>
              <div className="brand-title-row">
                <h1 className="brand-title">
                  {isTe
                    ? 'సౌరశక్తి స్మార్ట్ మినీ కోల్డ్ స్టోరేజ్'
                    : isHi
                    ? 'सोलर स्मार्ट मिनी कोल्ड स्टोरेज'
                    : 'Solar Smart Mini Cold Storage'}
                </h1>
                
                {/* Live Hardware Telemetry Connection Badge */}
                <span className={`live-pill ${isLive ? 'live-active' : 'live-waiting'}`}>
                  <span className={`live-dot ${isLive ? 'pulse-green' : 'pulse-amber'}`}></span>
                  {isLive
                    ? isTe
                      ? `🟢 ESP32 లైవ్ హార్డ్‌వేర్ (${secondsAgo !== null ? `${secondsAgo}s క్రితం` : 'Live'})`
                      : isHi
                      ? `🟢 ESP32 लाइव हार्डवेयर (${secondsAgo !== null ? `${secondsAgo}s पहले` : 'Live'})`
                      : `🟢 ESP32 Live Hardware (${secondsAgo !== null ? `${secondsAgo}s ago` : 'Live'})`
                    : isTe
                    ? '🟡 సిమ్యులేషన్ మోడ్ (ESP32 కోసం వేచిచూస్తోంది)'
                    : isHi
                    ? '🟡 सिमुलेशन मोड (ESP32 की प्रतीक्षा)'
                    : '🟡 Simulation Mode (Waiting for ESP32...)'}
                </span>
              </div>
              <p className="brand-subtitle">
                {isTe
                  ? 'రైతుల కోసం సులభమైన తాజాదనం మరియు ఉష్ణోగ్రత పర్యవేక్షణ వ్యవస్థ'
                  : isHi
                  ? 'किसानों के लिए सरल ताजगी और तापमान निगरानी प्रणाली'
                  : 'Intelligent Freshness & Climate Monitoring for Perishable Crops'}
              </p>
            </div>
          </div>

          {/* Simple Language Selector */}
          <div className="lang-selector-group">
            <span className="lang-label">Language / భాష:</span>
            <div className="lang-toggle-pills">
              <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                English
              </button>
              <button
                className={`lang-btn ${language === 'te' ? 'active' : ''}`}
                onClick={() => setLanguage('te')}
              >
                తెలుగు
              </button>
              <button
                className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
                onClick={() => setLanguage('hi')}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {/* 2. CROP SELECTOR (FARMER SELECTS WHAT IS STORED) */}
        <section className="crop-selection-section">
          <div className="section-label-row">
            <span className="section-step-badge">1</span>
            <h2 className="section-title">
              {isTe
                ? 'ప్రస్తుతం నిల్వ చేసిన పంటను ఎంచుకోండి:'
                : isHi
                ? 'वर्तमान में संग्रहीत फसल चुनें:'
                : 'Selected Produce in Storage:'}
            </h2>
          </div>

          <div className="crops-scroll-container">
            {CROPS.slice(0, 5).map(crop => {
              const isSelected = selectedCrop.id === crop.id;
              let cropTeluguName = crop.name;
              if (crop.id === 'tomato') cropTeluguName = 'టమాట';
              else if (crop.id === 'cabbage') cropTeluguName = 'క్యాబేజీ';
              else if (crop.id === 'beans') cropTeluguName = 'చిక్కుడు / బీన్స్';
              else if (crop.id === 'leafy') cropTeluguName = 'ఆకుకూరలు (పాలకూర)';
              else if (crop.id === 'chilli') cropTeluguName = 'పచ్చిమిర్చి';

              return (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCropId(crop.id)}
                  className={`crop-pill-btn ${isSelected ? 'selected' : ''}`}
                >
                  <span className="crop-pill-icon">{crop.icon}</span>
                  <div className="crop-pill-text">
                    <span className="crop-pill-name">
                      {isTe ? cropTeluguName : crop.name}
                    </span>
                    <span className="crop-pill-temp">
                      {crop.minTemp}° - {crop.maxTemp}°C
                    </span>
                  </div>
                  {isSelected && <span className="crop-pill-check">✓</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. TOP SMART ALERT BANNER (HIGH VISIBILITY FOR FARMER) */}
        <section className="alert-banner-section">
          {hasAlert ? (
            <div className={`smart-banner warning`}>
              <div className="banner-icon-col">
                <AlertTriangle size={36} className="banner-alert-icon" />
              </div>
              <div className="banner-text-col">
                <div className="banner-headline-row">
                  <h3 className="banner-headline">
                    {freshnessLevel !== 'good'
                      ? isTe
                        ? '⚠️ కూరగాయల తాజాదనంలో మార్పు గమనించబడింది'
                        : isHi
                        ? '⚠️ सब्जियों की ताजगी में बदलाव देखा गया'
                        : '⚠️ FRESHNESS ALERT: Produce Deterioration Detected'
                      : tempLevel !== 'good'
                      ? isTe
                        ? '⚠️ ఉష్ణోగ్రత హెచ్చరిక: గది వేడెక్కుతోంది'
                        : isHi
                        ? '⚠️ तापमान चेतावनी: कमरा गर्म हो रहा है'
                        : '⚠️ TEMPERATURE WARNING: Chamber Warming Up'
                      : currentDoorOpen
                      ? isTe
                        ? '⚠️ నిల్వ గది తలుపు తెరిచి ఉంది'
                        : isHi
                        ? '⚠️ कोल्ड स्टोरेज का दरवाजा खुला है'
                        : '⚠️ STORAGE DOOR IS OPEN'
                      : isTe
                      ? '⚠️ బ్యాటరీ ఛార్జ్ తక్కువగా ఉంది'
                      : isHi
                      ? '⚠️ बैटरी चार्ज कम है'
                      : '⚠️ LOW BATTERY WARNING'}
                  </h3>
                  <span className="banner-badge action-needed">
                    {isTe ? 'శ్రద్ధ వహించండి' : isHi ? 'ध्यान दें' : 'Action Needed'}
                  </span>
                </div>
                <p className="banner-description">
                  {freshnessLevel !== 'good'
                    ? isTe
                      ? 'గ్యాస్ సెన్సార్లు (MQ-135 & MQ-3) కూరగాయలు పక్వానికి రావడం లేదా పాడయ్యే సంకేతాలను గుర్తించాయి.'
                      : isHi
                      ? 'गैस सेंसरों ने सब्जियों के पकने या खराब होने के प्रारंभिक संकेत पहचाने हैं।'
                      : 'Multi-gas sensors (MQ-135 & MQ-3) detected elevated volatile organic compounds or fermentation gasses.'
                    : tempLevel !== 'good'
                    ? isTe
                      ? 'ఉష్ణోగ్రత నిర్దేశించిన పరిమితి కంటే ఎక్కువైంది. పెల్టియర్ కూలింగ్ నడుస్తోంది.'
                      : isHi
                      ? 'तापमान सीमा से अधिक हो गया है। पेल्टियर कूलिंग चालू है।'
                      : `Chamber temperature is at ${currentTemp.toFixed(1)}°C, exceeding target limit of ${selectedCrop.maxTemp}°C.`
                    : currentDoorOpen
                    ? isTe
                      ? 'చల్లటి గాలి బయటకు పోకుండా తలుపును వెంటనే మూసివేయండి.'
                      : isHi
                      ? 'ठंडी हवा बाहर जाने से रोकने के लिए दरवाजा तुरंत बंद करें।'
                      : 'Please shut the insulated door immediately to maintain cold temperature.'
                    : isTe
                    ? 'సోలార్ ద్వారా బ్యాటరీ రీఛార్జ్ అయ్యేంత వరకు అదనపు భారాన్ని తగ్గించండి.'
                    : isHi
                    ? 'बैटरी चार्ज होने तक ऊर्जा की बचत करें।'
                    : 'Battery is below 25%. Allow solar panel to recharge the system.'}
                </p>
                <div className="farmer-action-box">
                  <span className="action-tag">{isTe ? 'రైతు చేయవలసిన పని:' : isHi ? 'किसान सलाह:' : 'Recommended Action:'}</span>
                  <span className="action-advice">
                    {freshnessLevel !== 'good'
                      ? isTe
                        ? 'నిల్వ ఉంచిన కూరగాయలను పరిశీలించి, పాడయ్యే అవకాశం ఉన్నవాటిని వేరు చేయండి లేదా వెంటనే మార్కెట్ కు తరలించండి.'
                        : isHi
                        ? 'सब्जियों की टोकरी की जांच करें और जल्द से जल्द मंडी ले जाएं।'
                        : 'Inspect the produce batch, sort out over-ripe items, and schedule for early sale/transport.'
                      : tempLevel !== 'good'
                      ? isTe
                        ? 'తలుపు గట్టిగా మూసి ఉంచండి. అకస్మాత్తుగా వేడి సరుకులను ఒకేసారి లోపల పెట్టవద్దు.'
                        : isHi
                        ? 'दरवाजा कसकर बंद रखें। नया गर्म माल एक साथ अंदर न रखें।'
                        : 'Ensure the door seal is completely airtight and circulation vents are clear.'
                      : currentDoorOpen
                      ? isTe
                        ? 'కోల్డ్ స్టోరేజ్ తలుపును వెంటనే మూసివేయండి.'
                        : isHi
                        ? 'दरवाजा तुरंत बंद करें।'
                        : 'Shut the cold chamber door to prevent cooling loss.'
                      : isTe
                      ? 'సోలార్ కనెక్షన్ సరిగ్గా ఉందో లేదో చూడండి.'
                      : isHi
                      ? 'सोलर पैनल कनेक्शन जांचें।'
                      : 'Check solar panel wiring and keep panel clean of dust.'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="smart-banner safe">
              <div className="banner-icon-col">
                <CheckCircle2 size={36} className="banner-safe-icon" />
              </div>
              <div className="banner-text-col">
                <div className="banner-headline-row">
                  <h3 className="banner-headline">
                    {isTe
                      ? 'అన్నీ సక్రమంగా ఉన్నాయి — కూరగాయలు భద్రంగా & తాజాగా ఉన్నాయి ✓'
                      : isHi
                      ? 'सब कुछ सामान्य है — सब्जियां पूरी तरह सुरक्षित और ताज़ा हैं ✓'
                      : 'ALL SYSTEMS NORMAL — PRODUCE IS FRESH & SAFE ✓'}
                  </h3>
                  <span className="banner-badge all-good">
                    {isTe ? 'సురక్షితం' : isHi ? 'सुरक्षित' : '100% Safe'}
                  </span>
                </div>
                <p className="banner-description">
                  {isTe
                    ? `ఉష్ణోగ్రత (${currentTemp.toFixed(1)}°C), తేమ (${Math.round(currentHum)}%) మరియు గ్యాస్ రీడింగ్స్ అన్నీ ${selectedCrop.name} కోసం ఆదర్శవంతంగా ఉన్నాయి. ఎటువంటి ఆందోళన అవసరం లేదు.`
                    : isHi
                    ? `तापमान (${currentTemp.toFixed(1)}°C) और नमी (${Math.round(currentHum)}%) दोनों ${selectedCrop.name} के लिए एकदम सही हैं। कोई समस्या नहीं है।`
                    : `Chamber temperature (${currentTemp.toFixed(1)}°C) and humidity (${Math.round(currentHum)}%) are within ideal range for ${selectedCrop.name}. Gas sensors detect clean air.`}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* 4. THE 6 PRIMARY FARMER-FRIENDLY STATUS CARDS */}
        <section className="farmer-cards-section">
          <div className="section-label-row">
            <span className="section-step-badge">2</span>
            <h2 className="section-title">
              {isTe
                ? 'సిస్టమ్ ప్రస్తుత పరిస్థితి (ఒక్క చూపులో అర్థమయ్యేలా):'
                : isHi
                ? 'सिस्टम की वर्तमान स्थिति (एक नज़र में समझें):'
                : 'Current Storage Conditions (Instant Farmer Glance):'}
            </h2>
          </div>

          <div className="farmer-cards-grid">
            {/* CARD 1: VEGETABLES FRESHNESS */}
            <div className={`farmer-card ${freshnessLevel}`}>
              <div className="card-top-row">
                <div className="card-title-group">
                  <span className="card-emoji">{selectedCrop.icon}</span>
                  <div>
                    <h3 className="card-title">
                      {isTe ? 'కూరగాయల తాజాదనం' : isHi ? 'सब्जियों की ताजगी' : 'Produce Freshness'}
                    </h3>
                    <span className="card-device-tag">
                      {isTe ? 'మల్టీ-గ్యాస్ విశ్లేషణ' : 'Multi-Gas AI'}
                    </span>
                  </div>
                </div>
                <span className={`status-badge-large ${freshnessLevel}`}>
                  {isTe ? freshnessStatusTe : isHi ? freshnessStatusHi : freshnessStatus}
                </span>
              </div>

              <div className="card-primary-value">
                <span className="value-num">{freshnessScore}%</span>
                <span className="value-sub">
                  {isTe ? 'తాజాదనం స్కోర్' : isHi ? 'ताजगी स्कोर' : 'Freshness Score'}
                </span>
              </div>

              <p className="card-friendly-note">
                {isTe ? freshnessNoteTe : isHi ? freshnessNoteHi : freshnessNote}
              </p>

              <div className="card-sub-pills">
                <span className="sub-pill">
                  💨 MQ-135 (VOC): <strong>{Math.round(currentVoc)} ppm</strong>
                </span>
                <span className="sub-pill">
                  🧪 MQ-3 (Alcohol): <strong>{Math.round(currentAlcohol)} ppm</strong>
                </span>
              </div>
            </div>

            {/* CARD 2: TEMPERATURE */}
            <div className={`farmer-card ${tempLevel}`}>
              <div className="card-top-row">
                <div className="card-title-group">
                  <span className="card-emoji">🌡️</span>
                  <div>
                    <h3 className="card-title">
                      {isTe ? 'నిల్వ ఉష్ణోగ్రత' : isHi ? 'भंडारण तापमान' : 'Storage Temperature'}
                    </h3>
                    <span className="card-device-tag">DHT11 / Probe</span>
                  </div>
                </div>
                <span className={`status-badge-large ${tempLevel}`}>
                  {isTe ? tempStatusTe : isHi ? tempStatusHi : tempStatus}
                </span>
              </div>

              <div className="card-primary-value">
                <span className="value-num">{currentTemp.toFixed(1)}°C</span>
                <span className="value-sub">
                  {isTe ? `లక్ష్యం: ${selectedCrop.minTemp}°-${selectedCrop.maxTemp}°C` : `Target: ${selectedCrop.minTemp}°-${selectedCrop.maxTemp}°C`}
                </span>
              </div>

              <p className="card-friendly-note">
                {isTe ? tempNoteTe : isHi ? tempNoteHi : tempNote}
              </p>

              <div className="card-sub-pills">
                <span className="sub-pill">
                  {isTe ? 'ఆదర్శ స్థాయి:' : 'Ideal Target:'} <strong>{selectedCrop.idealTemp}°C</strong>
                </span>
                <span className="sub-pill">
                  {isTe ? 'కూలింగ్ మోడ్:' : 'Cooling State:'} <strong>{currentCoolingActive ? 'ACTIVE ❄️' : 'IDLE'}</strong>
                </span>
              </div>
            </div>

            {/* CARD 3: HUMIDITY */}
            <div className={`farmer-card ${humLevel}`}>
              <div className="card-top-row">
                <div className="card-title-group">
                  <span className="card-emoji">💧</span>
                  <div>
                    <h3 className="card-title">
                      {isTe ? 'గాలిలో తేమ శాతం' : isHi ? 'कमरे में नमी' : 'Chamber Humidity'}
                    </h3>
                    <span className="card-device-tag">DHT11 Sensor</span>
                  </div>
                </div>
                <span className={`status-badge-large ${humLevel}`}>
                  {isTe ? humStatusTe : isHi ? humStatusHi : humStatus}
                </span>
              </div>

              <div className="card-primary-value">
                <span className="value-num">{Math.round(currentHum)}%</span>
                <span className="value-sub">
                  {isTe ? `లక్ష్యం: ${selectedCrop.minHumidity}% - ${selectedCrop.maxHumidity}%` : `Target: ${selectedCrop.minHumidity}% - ${selectedCrop.maxHumidity}%`}
                </span>
              </div>

              <p className="card-friendly-note">
                {isTe ? humNoteTe : isHi ? humNoteHi : humNote}
              </p>

              <div className="card-sub-pills">
                <span className="sub-pill">
                  {isTe ? 'పచ్చిదనం కాపాడే తేమ:' : 'Moisture State:'} <strong>{humLevel === 'good' ? 'OPTIMAL ✓' : 'CHECK'}</strong>
                </span>
              </div>
            </div>

            {/* CARD 4: BATTERY BACKUP */}
            <div className={`farmer-card ${battLevel}`}>
              <div className="card-top-row">
                <div className="card-title-group">
                  <span className="card-emoji">🔋</span>
                  <div>
                    <h3 className="card-title">
                      {isTe ? 'బ్యాటరీ నిల్వ' : isHi ? 'बैटरी बैकअप' : 'Battery Backup'}
                    </h3>
                    <span className="card-device-tag">12V Energy Storage</span>
                  </div>
                </div>
                <span className={`status-badge-large ${battLevel}`}>
                  {isTe ? battStatusTe : isHi ? battStatusHi : battStatus}
                </span>
              </div>

              <div className="card-primary-value">
                <span className="value-num">{Math.round(currentBatt)}%</span>
                <span className="value-sub">
                  {currentBattVolt.toFixed(1)}V DC Reserve
                </span>
              </div>

              <p className="card-friendly-note">
                {isTe ? battNoteTe : isHi ? battNoteHi : battNote}
              </p>

              <div className="card-sub-pills">
                <span className="sub-pill">
                  {isTe ? 'రాత్రి బ్యాకప్:' : 'Backup Status:'} <strong>{currentBatt > 50 ? 'READY ✓' : 'LIMITED'}</strong>
                </span>
                <span className="sub-pill">
                  {isTe ? 'వోల్టేజ్:' : 'Voltage:'} <strong>{currentBattVolt.toFixed(1)}V</strong>
                </span>
              </div>
            </div>

            {/* CARD 5: SOLAR POWER */}
            <div className={`farmer-card ${solarLevel}`}>
              <div className="card-top-row">
                <div className="card-title-group">
                  <span className="card-emoji">☀️</span>
                  <div>
                    <h3 className="card-title">
                      {isTe ? 'సౌర విద్యుత్ (సోలార్)' : isHi ? 'सौर ऊर्जा (सोलर)' : 'Solar Generation'}
                    </h3>
                    <span className="card-device-tag">PV Panel + MPPT</span>
                  </div>
                </div>
                <span className={`status-badge-large ${solarLevel}`}>
                  {isTe ? solarStatusTe : isHi ? solarStatusHi : solarStatus}
                </span>
              </div>

              <div className="card-primary-value">
                <span className="value-num">{Math.round(currentSolar)} W</span>
                <span className="value-sub">
                  {isTe ? 'సూర్యకాంతి నుండి శక్తి' : isHi ? 'धूप से ऊर्जा' : 'Clean Solar Output'}
                </span>
              </div>

              <p className="card-friendly-note">
                {isTe ? solarNoteTe : isHi ? solarNoteHi : solarNote}
              </p>

              <div className="card-sub-pills">
                <span className="sub-pill">
                  {isTe ? 'సోలార్ ప్యానెల్:' : 'Solar Panel:'} <strong>{isSolarWorking ? 'ACTIVE ☀️' : 'NIGHT 🌙'}</strong>
                </span>
                <span className="sub-pill">
                  {isTe ? 'ఛార్జ్ కంట్రోలర్:' : 'Charge Controller:'} <strong>MPPT OK</strong>
                </span>
              </div>
            </div>

            {/* CARD 6: PELTIER COOLING SYSTEM */}
            <div className={`farmer-card ${coolingLevel}`}>
              <div className="card-top-row">
                <div className="card-title-group">
                  <span className="card-emoji">❄️</span>
                  <div>
                    <h3 className="card-title">
                      {isTe ? 'పెల్టియర్ కూలింగ్ సిస్టమ్' : isHi ? 'पेल्टियर कूलिंग सिस्टम' : 'Peltier Cooling System'}
                    </h3>
                    <span className="card-device-tag">Solid-State Thermoelectric</span>
                  </div>
                </div>
                <span className={`status-badge-large ${coolingLevel}`}>
                  {isTe ? coolingStatusTe : isHi ? coolingStatusHi : coolingStatus}
                </span>
              </div>

              <div className="card-primary-value">
                <span className="value-num">{currentCoolingActive ? `${Math.round(currentCoolingPower)} W` : '0 W'}</span>
                <span className="value-sub">
                  {isTe ? 'కూలింగ్ పవర్' : 'Peltier Power'}
                </span>
              </div>

              <p className="card-friendly-note">
                {isTe ? coolingNoteTe : isHi ? coolingNoteHi : coolingNote}
              </p>

              <div className="card-sub-pills">
                <span className="sub-pill">
                  {isTe ? 'కూలింగ్ పద్ధతి:' : 'Cooling Method:'} <strong>Peltier (No Gas)</strong>
                </span>
                <span className="sub-pill">
                  {isTe ? 'సర్క్యులేషన్ ఫ్యాన్:' : 'Fans:'} <strong>ON ✓</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. AUTHENTIC 16x2 I2C LCD HARDWARE DISPLAY PREVIEW */}
        <section className="lcd-display-section">
          <div className="lcd-header-row">
            <div className="lcd-title-group">
              <span className="lcd-chip-icon">📟</span>
              <div>
                <h3 className="lcd-title">
                  {isTe
                    ? 'హార్డ్‌వేర్ 16×2 I2C LCD డిస్‌ప్లే'
                    : isHi
                    ? 'हार्डवेयर 16×2 LCD स्क्रीन'
                    : 'Physical Hardware 16×2 I2C LCD Display'}
                </h3>
                <p className="lcd-subtitle">
                  {isTe
                    ? 'కోల్డ్ స్టోరేజ్ బాక్స్ బయట అమర్చిన ఎల్ఈడీ స్క్రీన్‌పై కనిపించే సమాచారం:'
                    : 'Exact text displayed on the physical LCD mounted on the cold storage chamber:'}
                </p>
              </div>
            </div>

            <div className="lcd-screen-switch">
              <button
                className={`lcd-screen-btn ${lcdScreenIndex === 1 ? 'active' : ''}`}
                onClick={() => setLcdScreenIndex(1)}
              >
                Screen 1 (Climate)
              </button>
              <button
                className={`lcd-screen-btn ${lcdScreenIndex === 2 ? 'active' : ''}`}
                onClick={() => setLcdScreenIndex(2)}
              >
                Screen 2 (Power)
              </button>
            </div>
          </div>

          <div className="lcd-bezel">
            <div className="lcd-screw tl"></div>
            <div className="lcd-screw tr"></div>
            <div className="lcd-screw bl"></div>
            <div className="lcd-screw br"></div>

            <div className="lcd-screen-glass">
              {lcdScreenIndex === 1 ? (
                <>
                  <div className="lcd-row">
                    <span className="lcd-char">TEMP: {currentTemp.toFixed(1).padStart(4, ' ')}°C</span>
                    <span className="lcd-char">HUM : {Math.round(currentHum).toString().padStart(2, ' ')}%</span>
                  </div>
                  <div className="lcd-row">
                    <span className="lcd-char">FRESH: {freshnessScore}%</span>
                    <span className="lcd-char">
                      STATUS: {freshnessScore >= 80 ? 'FRESH' : freshnessScore >= 60 ? 'WARN ' : 'ALERT'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="lcd-row">
                    <span className="lcd-char">SOLAR: {Math.round(currentSolar).toString().padStart(3, ' ')}W</span>
                    <span className="lcd-char">BATT: {Math.round(currentBatt).toString().padStart(2, ' ')}%</span>
                  </div>
                  <div className="lcd-row">
                    <span className="lcd-char">COOL : {currentCoolingActive ? 'ACTIVE' : 'OFF   '}</span>
                    <span className="lcd-char">ESP32: OK</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 6. EXPANDABLE TECHNICAL & HARDWARE DETAILS */}
        <section className="tech-toggle-section">
          <button
            className="tech-accordion-btn"
            onClick={() => setShowTechnical(!showTechnical)}
          >
            <div className="tech-accordion-left">
              <Cpu size={22} className="tech-icon" />
              <div>
                <strong>
                  {isTe
                    ? 'సాంకేతిక మరియు సెన్సార్ల వివరాలు (చూడటానికి ఇక్కడ నొక్కండి)'
                    : isHi
                    ? 'तकनीकी एवं हार्डवेयर सेंसर विवरण (देखने के लिए क्लिक करें)'
                    : 'Technical & Hardware Sensor Architecture (Click to View)'}
                </strong>
                <p className="tech-accordion-sub">
                  {isTe
                    ? 'ESP32, DHT11, MQ-135, MQ-3, పెల్టియర్ మరియు సోలార్ వివరాలు'
                    : 'ESP32 telemetry, DHT11, MQ-135, MQ-3 gas sensor values, and Peltier energy circuit'}
                </p>
              </div>
            </div>
            <div className="tech-accordion-right">
              <span className="tech-accordion-badge">
                {showTechnical ? 'COLLAPSE' : 'EXPAND'}
              </span>
              {showTechnical ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          {showTechnical && (
            <div className="tech-details-body">
              <div className="tech-grid">
                <div className="tech-detail-card">
                  <div className="tech-card-header">
                    <Radio size={18} className="tech-card-icon" />
                    <h4>ESP32 Microcontroller</h4>
                  </div>
                  <ul className="tech-card-list">
                    <li><strong>Role:</strong> Central IoT Gateway, Sensor Polling & Cloud Transmission.</li>
                    <li><strong>Live Status:</strong> {isLive ? '🟢 Receiving Live Packets via HTTPS' : '🟡 Awaiting ESP32 connection'}.</li>
                    <li><strong>Display:</strong> 16×2 I2C LCD (PCF8574 interface at 0x27).</li>
                    <li><strong>Connection:</strong> Wi-Fi 802.11 b/g/n &rarr; Render Cloud.</li>
                  </ul>
                </div>

                <div className="tech-detail-card">
                  <div className="tech-card-header">
                    <Wind size={18} className="tech-card-icon" />
                    <h4>Intelligent Freshness Matrix</h4>
                  </div>
                  <ul className="tech-card-list">
                    <li>
                      <strong>MQ-135 Sensor:</strong> Detects VOCs & decomposing gases. Reading: <strong>{Math.round(currentVoc)} ppm</strong>.
                    </li>
                    <li>
                      <strong>MQ-3 Sensor:</strong> Alcohol / fermentation detection. Reading: <strong>{Math.round(currentAlcohol)} ppm</strong>.
                    </li>
                    <li>
                      <strong>Freshness Algorithm:</strong> Combines Gas + Temp + Humidity to calculate deterioration risk for {selectedCrop.name}.
                    </li>
                  </ul>
                </div>

                <div className="tech-detail-card">
                  <div className="tech-card-header">
                    <Zap size={18} className="tech-card-icon" />
                    <h4>Solar & Peltier Subsystem</h4>
                  </div>
                  <ul className="tech-card-list">
                    <li>
                      <strong>Energy Flow:</strong> Solar Panel (150W) ➔ Charge Controller ➔ 12V Battery ({Math.round(currentBatt)}%) ➔ Peltier Cooler ({currentCoolingActive ? `${Math.round(currentCoolingPower)}W` : '0W'}).
                    </li>
                    <li>
                      <strong>Cooling Mechanism:</strong> Solid-state Peltier Thermoelectric (TEC1-12706) with aluminum heat sinks.
                    </li>
                    <li>
                      <strong>Eco Advantage:</strong> No CFCs/HFCs, zero refrigerants, completely silent.
                    </li>
                  </ul>
                </div>

                <div className="tech-detail-card">
                  <div className="tech-card-header">
                    <DoorClosed size={18} className="tech-card-icon" />
                    <h4>Insulation Chamber & Door</h4>
                  </div>
                  <ul className="tech-card-list">
                    <li>
                      <strong>Chamber Construction:</strong> Double-wall PUF insulated chamber.
                    </li>
                    <li>
                      <strong>Door Sensor:</strong> Status: <strong>{currentDoorOpen ? 'OPEN ⚠️' : 'CLOSED ✓'}</strong>.
                    </li>
                    <li>
                      <strong>Climate Probe:</strong> DHT11 Temperature & Relative Humidity.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 7. QUICK DEMO SIMULATION BAR */}
      <footer className="demo-bar-fixed">
        <div className="demo-bar-inner">
          <div className="demo-bar-label">
            <Activity size={16} className="demo-pulse" />
            <span className="demo-text">
              {isTe ? 'డెమో టెస్టింగ్:' : 'Presentation Simulation:'}
            </span>
          </div>

          <div className="demo-buttons-group">
            <button
              className="demo-btn normal"
              onClick={() => applySimulation('normal')}
              title="Reset all sensors to safe, fresh conditions"
            >
              🟢 {isTe ? 'సాధారణం' : 'Normal'}
            </button>
            <button
              className="demo-btn warning"
              onClick={() => applySimulation('freshness_warning')}
              title="Simulate gas build-up from aging produce"
            >
              ⚠️ {isTe ? 'గ్యాస్ స్పైక్' : 'Spoilage Spike'}
            </button>
            <button
              className="demo-btn alert"
              onClick={() => applySimulation('temp_high')}
              title="Simulate temperature rise"
            >
              🌡️ {isTe ? 'ఎక్కువ వేడి' : 'High Temp'}
            </button>
            <button
              className="demo-btn battery"
              onClick={() => applySimulation('battery_backup')}
              title="Simulate solar disconnection / low battery"
            >
              🔋 {isTe ? 'బ్యాటరీ బ్యాకప్' : 'Low Solar'}
            </button>
            <button
              className={`demo-btn door ${currentDoorOpen ? 'open' : ''}`}
              onClick={toggleDoor}
              title="Simulate opening or closing the cold storage door"
            >
              {currentDoorOpen ? '🚪 Door: OPEN' : '🚪 Door: CLOSED'}
            </button>
            <button
              className="demo-btn test-post"
              onClick={handleTestPost}
              disabled={testSending}
              title="Send a sample hardware packet to Render API to test live sync"
            >
              📡 {testSending ? 'Sending...' : 'Test Cloud Packet'}
            </button>
          </div>
        </div>
      </footer>

      {/* CSS STYLES FOR THE SIMPLE CLEAN DASHBOARD */}
      <style>{`
        .simple-dashboard {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          padding-bottom: 80px;
        }

        .clean-header {
          background: #ffffff;
          border-bottom: 2px solid #e2e8f0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          padding: 16px 24px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .brand-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .brand-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
        }
        .brand-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .brand-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .brand-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin: 2px 0 0 0;
          font-weight: 500;
        }

        .live-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }
        .live-pill.live-active {
          background: #dcfce7;
          color: #15803d;
          border: 1.5px solid #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.25);
        }
        .live-pill.live-waiting {
          background: #fef9c3;
          color: #854d0e;
          border: 1.5px solid #eab308;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .pulse-green {
          background: #16a34a;
          box-shadow: 0 0 8px #16a34a;
          animation: pulse 1.5s infinite;
        }
        .pulse-amber {
          background: #d97706;
          box-shadow: 0 0 8px #d97706;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }

        .lang-selector-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lang-label {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 600;
        }
        .lang-toggle-pills {
          display: inline-flex;
          background: #f1f5f9;
          padding: 3px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }
        .lang-btn {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .lang-btn:hover {
          color: #0f172a;
        }
        .lang-btn.active {
          background: #0284c7;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);
        }

        .dashboard-content {
          max-width: 1280px;
          margin: 24px auto;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section-label-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .section-step-badge {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0284c7;
          color: white;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .section-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }

        .crops-scroll-container {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 6px;
        }
        .crop-pill-btn {
          flex: 1 0 auto;
          min-width: 180px;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .crop-pill-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-2px);
        }
        .crop-pill-btn.selected {
          border-color: #16a34a;
          background: #f0fdf4;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
        }
        .crop-pill-icon {
          font-size: 1.8rem;
        }
        .crop-pill-text {
          flex: 1;
        }
        .crop-pill-name {
          display: block;
          font-weight: 800;
          font-size: 0.95rem;
          color: #0f172a;
        }
        .crop-pill-temp {
          display: block;
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 600;
        }
        .crop-pill-check {
          background: #16a34a;
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 900;
        }

        .smart-banner {
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }
        .smart-banner.safe {
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
          border: 2px solid #86efac;
        }
        .smart-banner.warning {
          background: linear-gradient(135deg, #fffbeb 0%, #fefce8 100%);
          border: 2px solid #fde047;
        }
        .banner-alert-icon { color: #d97706; }
        .banner-safe-icon { color: #16a34a; }
        .banner-text-col { flex: 1; }
        .banner-headline-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .banner-headline {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .banner-badge {
          font-size: 0.78rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 9999px;
          text-transform: uppercase;
        }
        .banner-badge.all-good {
          background: #bbf7d0;
          color: #166534;
        }
        .banner-badge.action-needed {
          background: #fef08a;
          color: #854d0e;
        }
        .banner-description {
          font-size: 0.92rem;
          color: #334155;
          margin: 8px 0 0 0;
          line-height: 1.5;
        }
        .farmer-action-box {
          margin-top: 12px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid #fde047;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .action-tag {
          font-weight: 800;
          font-size: 0.85rem;
          color: #9a3412;
          background: #ffedd5;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .action-advice {
          font-weight: 700;
          font-size: 0.88rem;
          color: #1e293b;
        }

        .farmer-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }
        .farmer-card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .farmer-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.06);
        }
        .farmer-card.good {
          border-color: #bbf7d0;
          background: #ffffff;
        }
        .farmer-card.warning {
          border-color: #fde047;
          background: #fffef7;
        }
        .farmer-card.critical {
          border-color: #fca5a5;
          background: #fef2f2;
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }
        .card-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .card-emoji {
          font-size: 2.2rem;
          line-height: 1;
        }
        .card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .card-device-tag {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          display: block;
        }

        .status-badge-large {
          font-size: 0.85rem;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 9999px;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }
        .status-badge-large.good {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #86efac;
        }
        .status-badge-large.warning {
          background: #fef9c3;
          color: #854d0e;
          border: 1px solid #facc15;
        }
        .status-badge-large.critical {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #f87171;
        }

        .card-primary-value {
          margin: 18px 0 10px 0;
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .value-num {
          font-size: 2.3rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .value-sub {
          font-size: 0.88rem;
          color: #64748b;
          font-weight: 700;
        }

        .card-friendly-note {
          font-size: 0.92rem;
          color: #334155;
          line-height: 1.45;
          margin: 0 0 16px 0;
          flex-grow: 1;
          font-weight: 500;
        }

        .card-sub-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }
        .sub-pill {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 0.78rem;
          color: #475569;
        }
        .sub-pill strong {
          color: #0f172a;
        }

        .lcd-display-section {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 18px;
          padding: 24px;
        }
        .lcd-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .lcd-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lcd-chip-icon { font-size: 1.8rem; }
        .lcd-title {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0;
          color: #0f172a;
        }
        .lcd-subtitle {
          font-size: 0.82rem;
          color: #64748b;
          margin: 2px 0 0 0;
        }
        .lcd-screen-switch {
          display: flex;
          gap: 6px;
        }
        .lcd-screen-btn {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 6px;
          background: #f1f5f9;
          color: #475569;
          cursor: pointer;
        }
        .lcd-screen-btn.active {
          background: #0284c7;
          color: #ffffff;
        }

        .lcd-bezel {
          background: #1e293b;
          border-radius: 14px;
          padding: 18px 24px;
          position: relative;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.15);
          max-width: 600px;
          margin: 0 auto;
        }
        .lcd-screw {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #64748b;
          position: absolute;
        }
        .lcd-screw.tl { top: 8px; left: 8px; }
        .lcd-screw.tr { top: 8px; right: 8px; }
        .lcd-screw.bl { bottom: 8px; left: 8px; }
        .lcd-screw.br { bottom: 8px; right: 8px; }

        .lcd-screen-glass {
          background: #15803d;
          border: 3px solid #0f172a;
          border-radius: 6px;
          padding: 12px 18px;
          font-family: 'Courier New', Courier, monospace;
          color: #052e16;
          font-weight: 900;
          text-shadow: 0 0 3px rgba(255, 255, 255, 0.4);
          letter-spacing: 0.08em;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
        }
        .lcd-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.15rem;
          line-height: 1.6;
        }

        .tech-toggle-section {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
        }
        .tech-accordion-btn {
          width: 100%;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: #ffffff;
          transition: background 0.15s ease;
        }
        .tech-accordion-btn:hover { background: #f8fafc; }
        .tech-accordion-left {
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
        }
        .tech-icon { color: #0284c7; }
        .tech-accordion-sub {
          font-size: 0.82rem;
          color: #64748b;
          margin: 2px 0 0 0;
        }
        .tech-accordion-right {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #64748b;
        }
        .tech-accordion-badge {
          font-size: 0.72rem;
          font-weight: 800;
          background: #f1f5f9;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .tech-details-body {
          padding: 0 24px 24px 24px;
          border-top: 1px solid #f1f5f9;
        }
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }
        .tech-detail-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
        }
        .tech-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .tech-card-icon { color: #0284c7; }
        .tech-card-header h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .tech-card-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.82rem;
          color: #475569;
          line-height: 1.45;
        }
        .tech-card-list strong { color: #1e293b; }

        .demo-bar-fixed {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid #334155;
          padding: 10px 20px;
          z-index: 100;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.25);
        }
        .demo-bar-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .demo-bar-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 0.84rem;
          font-weight: 700;
        }
        .demo-pulse { color: #38bdf8; }
        .demo-text { color: #f1f5f9; }
        .demo-buttons-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .demo-btn {
          font-size: 0.8rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .demo-btn.normal { background: #15803d; }
        .demo-btn.normal:hover { background: #16a34a; }
        .demo-btn.warning { background: #ca8a04; }
        .demo-btn.warning:hover { background: #eab308; }
        .demo-btn.alert { background: #b91c1c; }
        .demo-btn.alert:hover { background: #dc2626; }
        .demo-btn.battery { background: #0369a1; }
        .demo-btn.battery:hover { background: #0284c7; }
        .demo-btn.door { background: #475569; }
        .demo-btn.door.open { background: #dc2626; }
        .demo-btn.test-post {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          border-color: #8b5cf6;
        }
        .demo-btn.test-post:hover {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        @media (max-width: 768px) {
          .farmer-cards-grid { grid-template-columns: 1fr; }
          .clean-header { padding: 12px 16px; }
          .brand-title { font-size: 1.15rem; }
          .crops-scroll-container { flex-wrap: nowrap; }
        }
      `}</style>
    </div>
  );
};
