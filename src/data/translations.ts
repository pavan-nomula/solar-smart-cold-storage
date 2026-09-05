export type Language = 'en' | 'hi' | 'as' | 'bn' | 'te';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  farmerMode: string;
  techMode: string;
  systemOnline: string;
  storageId: string;
  location: string;
  farmerBanner: string;
  nav: {
    dashboard: string;
    storage: string;
    freshness: string;
    energy: string;
    alerts: string;
    analytics: string;
    settings: string;
  };
  metrics: {
    temperature: string;
    humidity: string;
    battery: string;
    freshness: string;
    spoilageRisk: string;
    solarPower: string;
    cooling: string;
    fans: string;
    door: string;
    systemHealth: string;
  };
  statusWords: {
    good: string;
    safe: string;
    fresh: string;
    mostlyFull: string;
    working: string;
    optimal: string;
    monitor: string;
    attention: string;
    warning: string;
    highRisk: string;
    lowRisk: string;
    noProblem: string;
    powerFailure: string;
    batteryBackup: string;
  };
  farmerExplanations: {
    tempGood: string;
    tempHigh: string;
    humidityGood: string;
    humidityHigh: string;
    batteryFull: string;
    batteryLow: string;
    freshnessGood: string;
    freshnessWarning: string;
    solarGood: string;
    coolingGood: string;
    doorClosed: string;
    doorOpen: string;
    systemGood: string;
  };
  crops: {
    selectCrop: string;
    tomato: string;
    cabbage: string;
    beans: string;
    leafy: string;
    chilli: string;
    potato: string;
    carrot: string;
    apple: string;
  };
  demoMode: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: "SMART COLD STORE",
    tagline: "Protecting farm produce with solar-powered cooling and intelligent monitoring.",
    farmerMode: "Farmer Mode",
    techMode: "Technical Mode",
    systemOnline: "ESP32 Online",
    storageId: "Storage ID: SCS-001",
    location: "Village Collection Centre",
    farmerBanner: "Your vegetables are being monitored automatically.",
    nav: {
      dashboard: "Dashboard",
      storage: "Storage",
      freshness: "Freshness",
      energy: "Energy",
      alerts: "Alerts",
      analytics: "Analytics",
      settings: "Settings"
    },
    metrics: {
      temperature: "Temperature",
      humidity: "Moisture / Humidity",
      battery: "Battery Backup",
      freshness: "Produce Freshness",
      spoilageRisk: "Spoilage Risk",
      solarPower: "Solar Power",
      cooling: "Peltier Cooling",
      fans: "Circulation Fans",
      door: "Chamber Door",
      systemHealth: "System Health"
    },
    statusWords: {
      good: "GOOD",
      safe: "SAFE",
      fresh: "FRESH",
      mostlyFull: "MOSTLY FULL",
      working: "WORKING",
      optimal: "OPTIMAL",
      monitor: "MONITOR",
      attention: "ATTENTION",
      warning: "WARNING",
      highRisk: "HIGH RISK",
      lowRisk: "LOW RISK",
      noProblem: "NO PROBLEM",
      powerFailure: "POWER FAILURE",
      batteryBackup: "BATTERY ACTIVE"
    },
    farmerExplanations: {
      tempGood: "Temperature is good and inside target range.",
      tempHigh: "Storage is getting warm. Check cooling system.",
      humidityGood: "Moisture level is suitable for vegetables.",
      humidityHigh: "Moisture is high. Check ventilation.",
      batteryFull: "Battery is mostly full and ready.",
      batteryLow: "Battery is low. Allow solar charging.",
      freshnessGood: "Vegetables are in good condition. Very little deterioration.",
      freshnessWarning: "Vegetables may be deteriorating. Check immediately.",
      solarGood: "Solar power is actively charging the unit.",
      coolingGood: "Cooling system is maintaining safe chill.",
      doorClosed: "Storage door is tightly closed.",
      doorOpen: "Storage door is open! Close door to save cold air.",
      systemGood: "All sensors and systems are working properly."
    },
    crops: {
      selectCrop: "Select Stored Crop",
      tomato: "Tomato",
      cabbage: "Cabbage",
      beans: "Beans",
      leafy: "Leafy Vegetables (Spinach)",
      chilli: "Green Chilli",
      potato: "Potato",
      carrot: "Carrot",
      apple: "Apple"
    },
    demoMode: "Hardware Simulator"
  },
  hi: {
    appName: "स्मार्ट कोल्ड स्टोर",
    tagline: "सौर-ऊर्जा आधारित शीत भंडारण और फल-सब्जियों की ताज़गी की स्वचालित निगरानी।",
    farmerMode: "किसान मोड",
    techMode: "तकनीकी मोड",
    systemOnline: "ईएसपी32 सक्रिय (ऑनलाइन)",
    storageId: "भंडार क्रमांक: SCS-001",
    location: "ग्राम संकलन केंद्र",
    farmerBanner: "आपकी सब्जियां सुरक्षित हैं और स्वचालित निगरानी में हैं।",
    nav: {
      dashboard: "डैशबोर्ड",
      storage: "भंडारण",
      freshness: "ताज़गी",
      energy: "सौर ऊर्जा",
      alerts: "चेतावनी",
      analytics: "विश्लेषण",
      settings: "सेटिंग्स"
    },
    metrics: {
      temperature: "तापमान",
      humidity: "नमी (आर्द्रता)",
      battery: "बैटरी बैकअप",
      freshness: "सब्जियों की ताज़गी",
      spoilageRisk: "खराबी का खतरा",
      solarPower: "सौर ऊर्जा",
      cooling: "कूलिंग सिस्टम",
      fans: "पंखे",
      door: "भंडार का दरवाज़ा",
      systemHealth: "सिस्टम की स्थिति"
    },
    statusWords: {
      good: "उत्तम ✓",
      safe: "सुरक्षित ✓",
      fresh: "ताज़ा ✓",
      mostlyFull: "लगभग पूरी भरी",
      working: "सक्रिय (चालू) ✓",
      optimal: "अनुकूलतम ✓",
      monitor: "ध्यान दें ⚠",
      attention: "सावधानी ⚠",
      warning: "चेतावनी ⚠",
      highRisk: "उच्च जोखिम ✕",
      lowRisk: "कम जोखिम ✓",
      noProblem: "सब ठीक है ✓",
      powerFailure: "बिजली बंद",
      batteryBackup: "बैटरी बैकअप चालू"
    },
    farmerExplanations: {
      tempGood: "तापमान सही है और सुरक्षित सीमा में है।",
      tempHigh: "तापमान बढ़ रहा है। कूलिंग सिस्टम जांचें।",
      humidityGood: "नमी की मात्रा सब्जियों के लिए उत्तम है।",
      humidityHigh: "नमी अधिक है। हवा का संचार जांचें।",
      batteryFull: "बैटरी ज्यादातर भरी हुई है और तैयार है।",
      batteryLow: "बैटरी कम है। धूप में चार्ज होने दें।",
      freshnessGood: "सब्जियां बहुत अच्छी स्थिति में हैं।",
      freshnessWarning: "सब्जियां खराब होने की संभावना है। जांच करें।",
      solarGood: "सोलर पैनल से बिजली बन रही है।",
      coolingGood: "कूलिंग सिस्टम ठंडक बनाए रख रहा है।",
      doorClosed: "भंडार का दरवाज़ा ठीक से बंद है।",
      doorOpen: "दरवाज़ा खुला है! ठंडक बचाने के लिए बंद करें।",
      systemGood: "सभी उपकरण और सेंसर सही काम कर रहे हैं।"
    },
    crops: {
      selectCrop: "भंडारित फसल चुनें",
      tomato: "टमाटर",
      cabbage: "पत्ता गोभी",
      beans: "बीन्स / फलियां",
      leafy: "हरी पत्तेदार सब्जियां (पालक)",
      chilli: "हरी मिर्च",
      potato: "आलू",
      carrot: "गाजर",
      apple: "सेब"
    },
    demoMode: "हार्डवेयर सिम्युलेटर"
  },
  as: {
    appName: "স্মাৰ্ট ক'ল্ড ষ্টোৰ",
    tagline: "সৌৰশক্তি চালিত শীতভঁৰাল আৰু শাক-পাচলিৰ সতেজতা নিৰীক্ষণ ব্যৱস্থা।",
    farmerMode: "কৃষক মোড",
    techMode: "কাৰিকৰী মোড",
    systemOnline: "ইএছপি৩২ অনলাইন",
    storageId: "ভঁৰাল নং: SCS-001",
    location: "গাঁও সংগ্ৰহ কেন্দ্ৰ",
    farmerBanner: "আপোনাৰ শাক-পাচলি স্বয়ংক্ৰিয়ভাৱে নিৰীক্ষণ কৰা হৈছে।",
    nav: {
      dashboard: "ডেচব'ৰ্ড",
      storage: "ভঁৰাল",
      freshness: "সতেজতা",
      energy: "সৌৰ শক্তি",
      alerts: "সতৰ্কতা",
      analytics: "পৰিসংখ্যা",
      settings: "ছেটিংছ"
    },
    metrics: {
      temperature: "উত্তাপ (তাপমাত্ৰা)",
      humidity: "আৰ্দ্ৰতা",
      battery: "বেটাৰী বেকআপ",
      freshness: "পাচলিৰ সতেজতা",
      spoilageRisk: "নষ্ট হোৱাৰ আশংকা",
      solarPower: "সৌৰ শক্তি",
      cooling: "কুলিং ব্যৱস্থা",
      fans: "ফেন",
      door: "ভঁৰালৰ দুৱাৰ",
      systemHealth: "ব্যৱস্থাৰ অৱস্থা"
    },
    statusWords: {
      good: "ভাল ✓",
      safe: "নিৰাপদ ✓",
      fresh: "সতেজ ✓",
      mostlyFull: "প্ৰায় পূৰ্ণ",
      working: "চলি আছে ✓",
      optimal: "উত্তম ✓",
      monitor: "লক্ষ্য ৰাখক ⚠",
      attention: "মনোযোগ ⚠",
      warning: "সাৱধান ⚠",
      highRisk: "বিপদজনক ✕",
      lowRisk: "কম আশংকা ✓",
      noProblem: "সকলো ঠিকে আছে ✓",
      powerFailure: "বিদ্যুৎ সংযোগ বন্ধ",
      batteryBackup: "বেটাৰী আৰম্ভ"
    },
    farmerExplanations: {
      tempGood: "তাপমাত্ৰা শাক-পাচলিৰ বাবে নিৰাপদ অৱস্থাত আছে।",
      tempHigh: "তাপমাত্ৰা বাঢ়িছে। কুলিং ব্যৱস্থা পৰীক্ষা কৰক।",
      humidityGood: "আৰ্দ্ৰতাৰ মাত্ৰা উপযুক্ত।",
      humidityHigh: "আৰ্দ্ৰতা বেছি হৈছে। পৰীক্ষা কৰক।",
      batteryFull: "বেটাৰী যথেষ্ট চাৰ্জ হৈ আছে।",
      batteryLow: "বেটাৰী কমিছে। সৌৰ চাৰ্জ হ'বলৈ দিয়ক।",
      freshnessGood: "শাক-পাচলি ভাল আৰু সতেজ অৱস্থাত আছে।",
      freshnessWarning: "শাক-পাচলি নষ্ট হোৱাৰ লক্ষণ দেখা গৈছে।",
      solarGood: "সৌৰশক্তিৰ উৎপাদন চলি আছে।",
      coolingGood: "ঠাণ্ডা কৰা ব্যৱস্থাই সুন্দৰকৈ কাম কৰিছে।",
      doorClosed: "ভঁৰালৰ দুৱাৰ বন্ধ আছে।",
      doorOpen: "দুৱাৰখন খোলা আছে! শীঘ্ৰে বন্ধ কৰক।",
      systemGood: "সকলো ছেন্সৰ আৰু ব্যৱস্থা সঠিকভাৱে কাম কৰিছে।"
    },
    crops: {
      selectCrop: "শস্য বাছনি কৰক",
      tomato: "বিলাহী",
      cabbage: "বন্ধাকবি",
      beans: "উৰহী / বীন",
      leafy: "শাক-পাচলি (পালেং শাক)",
      chilli: "কেঁচা জলকীয়া",
      potato: "আলু",
      carrot: "গাজৰ",
      apple: "আপেল"
    },
    demoMode: "হাৰ্ডৱেৰ ছিমুলেটৰ"
  },
  bn: {
    appName: "স্মার্ট কোল্ড স্টোর",
    tagline: "সৌরশক্তি চালিত মিনি কোল্ড স্টোরেজ এবং শাকসবজির সতেজতা পর্যবেক্ষণ।",
    farmerMode: "কৃষক মোড",
    techMode: "প্রযুক্তিগত মোড",
    systemOnline: "ESP32 অনলাইন",
    storageId: "সংগ্রহাগার আইডি: SCS-001",
    location: "গ্রাম সংগ্রহ কেন্দ্র",
    farmerBanner: "আপনার শাকসবজি স্বয়ংক্রিয়ভাবে পর্যবেক্ষণ করা হচ্ছে।",
    nav: {
      dashboard: "ড্যাশবোর্ড",
      storage: "সংগ্রহাগার",
      freshness: "সতেজতা",
      energy: "সৌরশক্তি",
      alerts: "সতর্কতা",
      analytics: "পরিসংখ্যান",
      settings: "সেটিংস"
    },
    metrics: {
      temperature: "তাপমাত্রা",
      humidity: "আর্দ্রতা",
      battery: "ব্যাটারি ব্যাকআপ",
      freshness: "সবজির সতেজতা",
      spoilageRisk: "নষ্ট হওয়ার ঝুঁকি",
      solarPower: "সৌরশক্তি",
      cooling: "কুলিং ব্যবস্থা",
      fans: "পাখা",
      door: "দরজা",
      systemHealth: "সিস্টেম স্বাস্থ্য"
    },
    statusWords: {
      good: "ভালো ✓",
      safe: "নিরাপদ ✓",
      fresh: "সতেজ ✓",
      mostlyFull: "প্রায় পূর্ণ",
      working: "চলছে ✓",
      optimal: "অনুকূল ✓",
      monitor: "নজর রাখুন ⚠",
      attention: "সতর্কতা ⚠",
      warning: "সতর্কবার্তা ⚠",
      highRisk: "উচ্চ ঝুঁকি ✕",
      lowRisk: "কম ঝুঁকি ✓",
      noProblem: "কোনো সমস্যা নেই ✓",
      powerFailure: "বিদ্যুৎ বিভ্রাট",
      batteryBackup: "ব্যাটারি চালু"
    },
    farmerExplanations: {
      tempGood: "তাপমাত্রা স্বাভাবিক ও নিরাপদ মাত্রায় রয়েছে।",
      tempHigh: "তাপমাত্রা বাড়ছে। কুলিং সিস্টেম পরীক্ষা করুন।",
      humidityGood: "আর্দ্রতার মাত্রা শাকসবজির জন্য উপযুক্ত।",
      humidityHigh: "আর্দ্রতা বেশি। বায়ু চলাচল পরীক্ষা করুন।",
      batteryFull: "ব্যাটারি পূর্ণ এবং প্রস্তুত অবস্থায় আছে।",
      batteryLow: "ব্যাটারি কমে গেছে। সৌর শক্তিতে চার্জ হতে দিন।",
      freshnessGood: "শাকসবজি খুব ভালো অবস্থায় আছে।",
      freshnessWarning: "শাকসবজি নষ্ট হওয়ার ঝুঁকি রয়েছে। অবিলম্বে দেখুন।",
      solarGood: "সৌর প্যানেল সক্রিয়ভাবে কাজ করছে।",
      coolingGood: "কুলিং ব্যবস্থা তাপমাত্রা নিয়ন্ত্রণ করছে।",
      doorClosed: "সংগ্রহাগারের দরজা সঠিকভাবে বন্ধ।",
      doorOpen: "দরজা খোলা আছে! ঠান্ডা বাতাস ধরে রাখতে বন্ধ করুন।",
      systemGood: "সমস্ত সেন্সর ও সিস্টেম স্বাভাবিক কাজ করছে।"
    },
    crops: {
      selectCrop: "সংরক্ষিত ফসল নির্বাচন করুন",
      tomato: "টমেটো",
      cabbage: "বাঁধাকপি",
      beans: "শিম / বরবটি",
      leafy: "শাকসবজি (পালং শাক)",
      chilli: "কাঁচা লঙ্কা",
      potato: "আলু",
      carrot: "গাজর",
      apple: "আপেল"
    },
    demoMode: "হার্ডওয়্যার সিমুলেটর"
  },
  te: {
    appName: "స్మార్ట్ కోల్డ్ స్టోర్",
    tagline: "సౌరశక్తితో నడిచే కోల్డ్ స్టోరేజ్ మరియు కూరగాయల తాజాదనం నిరంతర పర్యవేక్షణ.",
    farmerMode: "రైతు మోడ్",
    techMode: "సాంకేతిక మోడ్",
    systemOnline: "ESP32 ఆన్‌లైన్",
    storageId: "నిల్వ ఐడీ: SCS-001",
    location: "గ్రామ సేకరణ కేంద్రం",
    farmerBanner: "మీ కూరగాయలు ఆటోమేటిక్‌గా నిరంతరం పర్యవేక్షించబడుతున్నాయి.",
    nav: {
      dashboard: "డ్యాష్‌బోర్డ్",
      storage: "నిల్వ",
      freshness: "తాజాదనం",
      energy: "సౌరశక్తి",
      alerts: "హెచ్చరికలు",
      analytics: "విశ్లేషణ",
      settings: "సెట్టింగ్స్"
    },
    metrics: {
      temperature: "ఉష్ణోగ్రత",
      humidity: "తేమ శాతం",
      battery: "బ్యాటరీ బ్యాకప్",
      freshness: "కూరగాయల తాజాదనం",
      spoilageRisk: "పాడయ్యే ప్రమాదం",
      solarPower: "సౌర శక్తి",
      cooling: "కూలింగ్ వ్యవస్థ",
      fans: "ఫ్యాన్లు",
      door: "నిల్వ గది తలుపు",
      systemHealth: "సిస్టమ్ పనితీరు"
    },
    statusWords: {
      good: "మంచిది ✓",
      safe: "సురక్షితం ✓",
      fresh: "తాజా ✓",
      mostlyFull: "దాదాపు నిండింది",
      working: "పనిచేస్తోంది ✓",
      optimal: "అనుకూలం ✓",
      monitor: "గమనించండి ⚠",
      attention: "శ్రద్ధ వహించండి ⚠",
      warning: "హెచ్చరిక ⚠",
      highRisk: "తీవ్ర ప్రమాదం ✕",
      lowRisk: "తక్కువ ప్రమాదం ✓",
      noProblem: "సమస్య లేదు ✓",
      powerFailure: "కరెంట్ పోయింది",
      batteryBackup: "బ్యాటరీ బ్యాకప్ ఆన్"
    },
    farmerExplanations: {
      tempGood: "ఉష్ణోగ్రత సరైన పరిధిలో సురక్షితంగా ఉంది.",
      tempHigh: "వేడి పెరుగుతోంది. కూలింగ్ వ్యవస్థను సరిచూడండి.",
      humidityGood: "కూరగాయలకు తేమ శాతం సరిగ్గా ఉంది.",
      humidityHigh: "తేమ ఎక్కువగా ఉంది. వెంటిలేషన్ చూడండి.",
      batteryFull: "బ్యాటరీ పూర్తిగా నిండి సిద్ధంగా ఉంది.",
      batteryLow: "బ్యాటరీ తక్కువగా ఉంది. సోలార్ చార్జింగ్ కానివ్వండి.",
      freshnessGood: "కూరగాయలు చాలా మంచి నాణ్యతతో తాజాగా ఉన్నాయి.",
      freshnessWarning: "కూరగాయలు పాడయ్యే అవకాశం ఉంది. వెంటనే తనిఖీ చేయండి.",
      solarGood: "సోలార్ ప్యానెల్ సమర్థవంతంగా విద్యుత్ ఉత్పత్తి చేస్తోంది.",
      coolingGood: "కూలింగ్ వ్యవస్థ నిరంతర చల్లదనాన్ని ఇస్తోంది.",
      doorClosed: "నిల్వ గది తలుపు సరిగ్గా మూసి ఉంది.",
      doorOpen: "తలుపు తెరిచి ఉంది! చల్లటి గాలి బయటకు పోకుండా మూయండి.",
      systemGood: "అన్ని సెన్సార్లు, పరికరాలు చక్కగా పనిచేస్తున్నాయి."
    },
    crops: {
      selectCrop: "నిల్వ చేసిన పంటను ఎంచుకోండి",
      tomato: "టమాట",
      cabbage: "క్యాబేజీ",
      beans: "చిక్కుడు / బీన్స్",
      leafy: "ఆకుకూరలు (పాలకూర)",
      chilli: "పచ్చిమిర్చి",
      potato: "బంగాళాదుంప",
      carrot: "క్యారెట్",
      apple: "ఆపిల్"
    },
    demoMode: "హార్డ్‌వేర్ సిమ్యులేటర్"
  }
};
