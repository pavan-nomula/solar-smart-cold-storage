import type { CropProfile } from '../data/crops';

export type StatusLevel = 'good' | 'warning' | 'critical' | 'info';

export interface MetricInterpretation {
  statusLevel: StatusLevel;
  statusWord: string;
  farmerExplanation: string;
  technicalSummary: string;
  whatDoesThisMean: {
    title: string;
    description: string;
    farmerAdvice: string;
    technicalDetails: string;
    impactOnCrops: string;
  };
}

/**
 * Evaluates Temperature against the selected crop's specific range
 */
export function interpretTemperature(
  temp: number,
  crop: CropProfile
): MetricInterpretation {
  const isTooCold = temp < crop.minTemp;
  const isTooWarm = temp > crop.maxTemp;
  const deviation = Math.abs(temp - crop.idealTemp);

  if (!isTooCold && !isTooWarm) {
    return {
      statusLevel: 'good',
      statusWord: 'SAFE ✓',
      farmerExplanation: 'Temperature is good and inside safe range.',
      technicalSummary: `Within optimal ${crop.minTemp}–${crop.maxTemp}°C range for ${crop.name}`,
      whatDoesThisMean: {
        title: 'Chamber Temperature (Safe)',
        description: `Current reading is ${temp.toFixed(1)}°C, which matches the target temperature for ${crop.name} (${crop.minTemp}°C to ${crop.maxTemp}°C).`,
        farmerAdvice: 'No action needed. The cooling system is working efficiently.',
        technicalDetails: 'Thermal sensor DS18B20 reading via ESP32 one-wire bus. Hysteresis band ±0.5°C.',
        impactOnCrops: 'Metabolic respiration rate of vegetables is kept at minimum, halting bacterial proliferation and texture loss.'
      }
    };
  } else if (temp > crop.maxTemp && temp <= crop.maxTemp + 3.0) {
    return {
      statusLevel: 'warning',
      statusWord: 'GETTING WARM ⚠',
      farmerExplanation: 'Storage is getting warm. Cooling is working to lower it.',
      technicalSummary: `${(temp - crop.maxTemp).toFixed(1)}°C above recommended threshold`,
      whatDoesThisMean: {
        title: 'Chamber Temperature (Elevated)',
        description: `The chamber is at ${temp.toFixed(1)}°C, slightly higher than the ${crop.maxTemp}°C limit for ${crop.name}.`,
        farmerAdvice: 'Keep the cold storage door firmly shut. Avoid loading uncooled warm bags all at once.',
        technicalDetails: 'Peltier modules operating at 100% duty cycle (PWM 255). Dual circulation fans active.',
        impactOnCrops: 'Higher temperatures speed up ripening, moisture evaporation, and ethylene sensitivity.'
      }
    };
  } else if (temp > crop.maxTemp + 3.0) {
    return {
      statusLevel: 'critical',
      statusWord: 'CRITICAL HOT ✕',
      farmerExplanation: 'Temperature is too high! Produce will spoil quickly.',
      technicalSummary: `Severe thermal breach: ${(temp - crop.maxTemp).toFixed(1)}°C above limit`,
      whatDoesThisMean: {
        title: 'Chamber Temperature (Critical High Alert)',
        description: `Storage chamber temperature has reached ${temp.toFixed(1)}°C. Normal limit is ${crop.maxTemp}°C.`,
        farmerAdvice: 'Check if door is left open, or check if battery/solar power is connected to the Peltier cooler!',
        technicalDetails: 'Safety thermal cutoff alert triggered. Check Peltier heatsink thermal dissipation and cold-side fan.',
        impactOnCrops: 'High spoilage acceleration. Microbes and fungal molds will bloom within 24 hours if uncorrected.'
      }
    };
  } else {
    return {
      statusLevel: 'warning',
      statusWord: 'TOO COLD ⚠',
      farmerExplanation: 'Temperature is lower than recommended. Risk of chill damage.',
      technicalSummary: `${(crop.minTemp - temp).toFixed(1)}°C below minimum threshold`,
      whatDoesThisMean: {
        title: 'Chamber Temperature (Chilling Risk)',
        description: `Reading is ${temp.toFixed(1)}°C, which is below ${crop.minTemp}°C for ${crop.name}.`,
        farmerAdvice: 'Some vegetables get damaged if frozen or too cold. Cooling duty cycle will adjust.',
        technicalDetails: 'Thermostat hysteresis will throttle Peltier PWM to avoid frost formation on produce.',
        impactOnCrops: 'Risk of chilling injury: water-soaked lesions, surface pitting, and loss of flavor.'
      }
    };
  }
}

/**
 * Evaluates Humidity against crop ideal moisture
 */
export function interpretHumidity(
  humidity: number,
  crop: CropProfile
): MetricInterpretation {
  if (humidity >= crop.minHumidity && humidity <= crop.maxHumidity) {
    return {
      statusLevel: 'good',
      statusWord: 'GOOD ✓',
      farmerExplanation: 'Moisture level is suitable. Vegetables stay crisp.',
      technicalSummary: `Ideal moisture: ${humidity}% (Target: ${crop.minHumidity}–${crop.maxHumidity}%)`,
      whatDoesThisMean: {
        title: 'Relative Humidity (Optimal)',
        description: `Humidity is at ${humidity}%, which keeps vegetables crisp without drying out.`,
        farmerAdvice: 'Moisture is ideal. No water spraying or dehumidification required.',
        technicalDetails: 'Measured by DHT22 / SHT31 sensor. High humidity slows cellular transpiration.',
        impactOnCrops: 'Prevents weight loss, flaccidity, and shrinkage of fresh produce.'
      }
    };
  } else if (humidity > crop.maxHumidity) {
    return {
      statusLevel: 'warning',
      statusWord: 'MOISTURE HIGH ⚠',
      farmerExplanation: 'Air is very humid. Check for water condensation.',
      technicalSummary: `${humidity}% is above recommended ${crop.maxHumidity}% limit`,
      whatDoesThisMean: {
        title: 'Relative Humidity (Excess Moisture)',
        description: `Moisture level is ${humidity}%. Excess dampness can accumulate on leaf surfaces.`,
        farmerAdvice: 'Check that internal air circulation fan is running to prevent stagnant moisture pockets.',
        technicalDetails: 'Dew point margin is narrow (< 1.2°C). Condensed moisture risk on cold walls.',
        impactOnCrops: 'Free water droplets encourage bacterial soft rot and Botrytis cinerea (grey mold).'
      }
    };
  } else {
    return {
      statusLevel: 'warning',
      statusWord: 'DRY AIR ⚠',
      farmerExplanation: 'Air is too dry. Vegetables may lose weight and shrivel.',
      technicalSummary: `${humidity}% is below minimum ${crop.minHumidity}% requirement`,
      whatDoesThisMean: {
        title: 'Relative Humidity (Low Moisture)',
        description: `Humidity has dropped to ${humidity}%, below the ${crop.minHumidity}% required for ${crop.name}.`,
        farmerAdvice: 'Moisture in produce will evaporate into the dry air. Keep chamber sealed.',
        technicalDetails: 'Vapor Pressure Deficit (VPD) is elevated, accelerating transpirational water loss.',
        impactOnCrops: 'Produces wilting, limpness, and reduces commercial saleable weight.'
      }
    };
  }
}

/**
 * Evaluates Battery Level (0-100%)
 * 90-100 = FULL, 60-89 = GOOD, 30-59 = LOW, 0-29 = CRITICAL
 */
export function interpretBattery(
  battery: number,
  isCharging: boolean
): MetricInterpretation {
  if (battery >= 90) {
    return {
      statusLevel: 'good',
      statusWord: 'FULL 🔋',
      farmerExplanation: isCharging ? 'Battery is full and solar is charging.' : 'Battery is full and ready for night cooling.',
      technicalSummary: `${battery}% capacity | LiFePO4 / Lead-Carbon nominal voltage`,
      whatDoesThisMean: {
        title: 'Battery Backup (Fully Charged)',
        description: `The energy storage unit is at ${battery}% state of charge.`,
        farmerAdvice: 'Battery is fully ready. The cold store has enough reserve power for evening and night hours.',
        technicalDetails: '12.8V / 24V Deep-Cycle Pack with Smart BMS. Overcharge protection engaged.',
        impactOnCrops: 'Guarantees uninterrupted Peltier cooling throughout the night or cloudy spells.'
      }
    };
  } else if (battery >= 60) {
    return {
      statusLevel: 'good',
      statusWord: 'GOOD 🔋',
      farmerExplanation: 'Battery is mostly full. System running smoothly.',
      technicalSummary: `${battery}% capacity | Normal operating band`,
      whatDoesThisMean: {
        title: 'Battery Backup (Healthy & Stable)',
        description: `Battery is at ${battery}%. Sufficient charge for continuous operation.`,
        farmerAdvice: 'Normal operation. Solar power easily covers day cooling while topping up battery.',
        technicalDetails: 'Coulomb-counting state of charge estimation calibrated to battery discharge curve.',
        impactOnCrops: 'Safe continuous cold chain operation.'
      }
    };
  } else if (battery >= 30) {
    return {
      statusLevel: 'warning',
      statusWord: 'LOW BATTERY ⚠',
      farmerExplanation: 'Battery is getting low. Need solar daylight or grid support.',
      technicalSummary: `${battery}% capacity | Approaching depth-of-discharge threshold`,
      whatDoesThisMean: {
        title: 'Battery Backup (Moderate Reserve)',
        description: `Battery state has dropped to ${battery}%.`,
        farmerAdvice: 'Avoid opening the cold chamber door frequently to preserve cold temperature.',
        technicalDetails: 'Battery voltage under load is approaching 12.0V cut-in warning threshold.',
        impactOnCrops: 'If battery drains completely, chamber will warm up gradually.'
      }
    };
  } else {
    return {
      statusLevel: 'critical',
      statusWord: 'CRITICAL LOW ✕',
      farmerExplanation: 'Battery is very low! Allow solar charging immediately.',
      technicalSummary: `${battery}% capacity | Low Voltage Disconnect (LVD) imminent`,
      whatDoesThisMean: {
        title: 'Battery Backup (Critical Drain Alert)',
        description: `Battery is critically discharged at ${battery}%.`,
        farmerAdvice: 'Urgent: Ensure solar panels are clean of dust, or connect backup AC grid charger.',
        technicalDetails: 'Smart load shedding enabled. Low voltage cutoff safety protocol will trigger at < 10.8V.',
        impactOnCrops: 'Without active cooling, temperature will rise to ambient within 3–4 hours.'
      }
    };
  }
}

/**
 * Evaluates Produce Freshness (0-100%)
 * 80-100 = FRESH, 60-79 = MONITOR, 40-59 = WARNING, 0-39 = HIGH RISK
 */
export function interpretFreshness(
  freshness: number,
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
): MetricInterpretation {
  if (freshness >= 80) {
    return {
      statusLevel: 'good',
      statusWord: 'FRESH ✓',
      farmerExplanation: 'Vegetables are in good condition. Safe for storage and market.',
      technicalSummary: `Freshness Index: ${freshness}/100 | Risk: ${riskLevel}`,
      whatDoesThisMean: {
        title: 'Produce Freshness (Peak Quality)',
        description: `Multi-sensor analysis calculates a high freshness score of ${freshness}/100.`,
        farmerAdvice: 'Your produce is in prime market condition with high crispness and nutritional value.',
        technicalDetails: 'VOC array shows baseline metabolic emissions; no anaerobic fermentation spikes.',
        impactOnCrops: 'Maximum commercial market price and zero consumer rejection.'
      }
    };
  } else if (freshness >= 60) {
    return {
      statusLevel: 'warning',
      statusWord: 'MONITOR ⚠',
      farmerExplanation: 'Vegetables look okay, but slight ageing detected. Plan to sell soon.',
      technicalSummary: `Freshness Index: ${freshness}/100 | Risk: ${riskLevel}`,
      whatDoesThisMean: {
        title: 'Produce Freshness (Moderate Ageing)',
        description: `Freshness score is ${freshness}/100. Trace ripening gases detected.`,
        farmerAdvice: 'Check produce visually. Consider taking this batch to market within 2–3 days.',
        technicalDetails: 'Ethanol & volatile ester signal elevated 1.8x over baseline. Ripening progression detected.',
        impactOnCrops: 'Slight softening of cell walls and natural sugar-acid ratio shifting.'
      }
    };
  } else if (freshness >= 40) {
    return {
      statusLevel: 'warning',
      statusWord: 'WARNING ⚠',
      farmerExplanation: 'Deterioration warning! Sort out bad vegetables immediately.',
      technicalSummary: `Freshness Index: ${freshness}/100 | Risk: ${riskLevel}`,
      whatDoesThisMean: {
        title: 'Produce Freshness (Early Spoilage Alert)',
        description: `Freshness has degraded to ${freshness}/100 with elevated gas indicators.`,
        farmerAdvice: 'Open chamber and inspect crates. Remove any decaying or bruised items before rot spreads.',
        technicalDetails: 'Multi-gas signature shows anaerobic byproducts (H2S / NH3 / Volatiles) indicating bacterial or fungal activity.',
        impactOnCrops: 'Rotting vegetables emit ethylene and microbes that will quickly infect adjacent crates.'
      }
    };
  } else {
    return {
      statusLevel: 'critical',
      statusWord: 'HIGH RISK ✕',
      farmerExplanation: 'High risk of spoilage! Take urgent action and remove affected produce.',
      technicalSummary: `Freshness Index: ${freshness}/100 | Severe Risk`,
      whatDoesThisMean: {
        title: 'Produce Freshness (Severe Degradation)',
        description: `Freshness score is critically low at ${freshness}/100. High organic decay gases.`,
        farmerAdvice: 'Immediate inspection needed. Dispose of spoiled crop, sanitize chamber crate, and ventilate.',
        technicalDetails: 'Pronounced sulfide/ammonia and high VOC gas signatures detected by multi-channel array.',
        impactOnCrops: 'Substantial batch loss. Prevent cross-contamination of remaining stock.'
      }
    };
  }
}

/**
 * Evaluates Overall System Health (0-100%)
 * 90-100 = EXCELLENT, 70-89 = GOOD, 50-69 = ATTENTION, <50 = CRITICAL
 */
export function interpretSystemHealth(health: number): MetricInterpretation {
  if (health >= 90) {
    return {
      statusLevel: 'good',
      statusWord: 'EXCELLENT ✓',
      farmerExplanation: 'Everything is working properly. All parts are healthy.',
      technicalSummary: `Overall Health: ${health}% | All 8 Subsystems Nominal`,
      whatDoesThisMean: {
        title: 'System Health (Optimal Performance)',
        description: `Overall hardware integrity index is ${health}%.`,
        farmerAdvice: 'The cold storage unit is running at peak condition. Keep solar panels clean from dust.',
        technicalDetails: 'ESP32 heartbeat stable, I2C bus error rate 0%, Peltier thermals optimal, fan RPM normal.',
        impactOnCrops: 'Rock-solid temperature and freshness stability.'
      }
    };
  } else if (health >= 70) {
    return {
      statusLevel: 'good',
      statusWord: 'GOOD ✓',
      farmerExplanation: 'System is working normally with minor variations.',
      technicalSummary: `Overall Health: ${health}% | Operational`,
      whatDoesThisMean: {
        title: 'System Health (Normal Operation)',
        description: `System health is ${health}%. Minor telemetry or thermal variance noted.`,
        farmerAdvice: 'System is operating reliably.',
        technicalDetails: 'Telemetry transmission latency < 500ms, all primary sensors responsive.',
        impactOnCrops: 'Nominal protection.'
      }
    };
  } else if (health >= 50) {
    return {
      statusLevel: 'warning',
      statusWord: 'ATTENTION ⚠',
      farmerExplanation: 'One or more sensors or fans need checking.',
      technicalSummary: `Overall Health: ${health}% | Component warning`,
      whatDoesThisMean: {
        title: 'System Health (Component Check Needed)',
        description: `Hardware health is reduced to ${health}%.`,
        farmerAdvice: 'Check cables, fans, and sensor connections at the ESP32 control box.',
        technicalDetails: 'Possible elevated heatsink temp or sensor data jitter.',
        impactOnCrops: 'Cooling efficiency may drop if fans are partially blocked.'
      }
    };
  } else {
    return {
      statusLevel: 'critical',
      statusWord: 'CRITICAL ✕',
      farmerExplanation: 'Hardware error detected! Service or inspect immediately.',
      technicalSummary: `Overall Health: ${health}% | Hardware subsystem fault`,
      whatDoesThisMean: {
        title: 'System Health (Critical Hardware Fault)',
        description: `System health has fallen to ${health}%. Critical components are reporting faults.`,
        farmerAdvice: 'Contact local technician or check power wiring immediately.',
        technicalDetails: 'Peltier circuit or sensor communication fault. Failsafe mode engaged.',
        impactOnCrops: 'Severe risk of thermal loss if not resolved promptly.'
      }
    };
  }
}

/**
 * Formats a visual smartphone-style block battery indicator (████████░░)
 */
export function getBatteryBlocks(percentage: number): { filled: string; empty: string; text: string } {
  const totalBlocks = 10;
  const filledCount = Math.max(0, Math.min(10, Math.round(percentage / 10)));
  const emptyCount = totalBlocks - filledCount;
  return {
    filled: '█'.repeat(filledCount),
    empty: '░'.repeat(emptyCount),
    text: '█'.repeat(filledCount) + '░'.repeat(emptyCount)
  };
}
