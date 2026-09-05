import type { CropProfile } from '../data/crops';

export interface FreshnessCalculationInput {
  vocSignal: number;       // Relative index (typically 20 - 200)
  alcoholSignal: number;   // Relative index (typically 10 - 150)
  h2sSignal: number;       // Relative index (typically 0 - 50)
  nh3Signal: number;       // Relative index (typically 2 - 80)
  temperature: number;     // °C
  humidity: number;        // %
  storageDurationDays: number; // Days stored
  crop: CropProfile;
  doorOpenCount24h?: number;
}

export interface FreshnessAnalysisResult {
  freshnessScore: number;  // 0 - 100
  deteriorationRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  statusWord: string;
  farmerExplanation: string;
  estimatedRemainingShelfLifeDays: number;
  contributingFactors: {
    factor: string;
    score: number; // 0-100
    impact: 'positive' | 'neutral' | 'negative';
    detail: string;
  }[];
  scientificSummary: string;
}

/**
 * Multi-sensor pattern fusion engine
 * Evaluates metabolic volatile buildup + thermal stress + moisture deviation + crop storage duration
 */
export function calculateFreshness(input: FreshnessCalculationInput): FreshnessAnalysisResult {
  const {
    vocSignal,
    alcoholSignal,
    h2sSignal,
    nh3Signal,
    temperature,
    humidity,
    storageDurationDays,
    crop
  } = input;

  // 1. Gas Array Signal Score (Relative response, baseline 40)
  // Normal baseline: VOC ~ 30-50, Alcohol ~ 10-25, H2S ~ 2-8, NH3 ~ 5-15
  let gasPenalty = 0;

  if (vocSignal > 55) {
    gasPenalty += (vocSignal - 55) * (crop.vocSensitivity === 'high' ? 0.45 : 0.25);
  }
  if (alcoholSignal > 30) {
    gasPenalty += (alcoholSignal - 30) * 0.4;
  }
  if (h2sSignal > 12) {
    gasPenalty += (h2sSignal - 12) * 1.2; // High indicator of sulfur/protein breakdown
  }
  if (nh3Signal > 20) {
    gasPenalty += (nh3Signal - 20) * 0.8; // Ammonia from amine deamination
  }

  // 2. Temperature Thermal Stress Penalty
  let tempPenalty = 0;
  if (temperature > crop.maxTemp) {
    tempPenalty = Math.pow(temperature - crop.maxTemp, 1.4) * 4.5;
  } else if (temperature < crop.minTemp) {
    tempPenalty = Math.max(0, (crop.minTemp - temperature) * 3.5);
  }

  // 3. Humidity Moisture Deviation Penalty
  let humidityPenalty = 0;
  if (humidity < crop.minHumidity) {
    humidityPenalty = (crop.minHumidity - humidity) * 0.7; // Drying out
  } else if (humidity > crop.maxHumidity) {
    humidityPenalty = (humidity - crop.maxHumidity) * 0.9; // Mold risk
  }

  // 4. Storage Duration Decay against expected cold storage days
  const durationRatio = Math.min(1.5, storageDurationDays / crop.standardShelfLifeColdDays);
  const durationPenalty = durationRatio * 25;

  // Total raw score out of 100
  const rawScore = 100 - (gasPenalty * 0.4 + tempPenalty * 0.3 + humidityPenalty * 0.15 + durationPenalty * 0.15);
  const freshnessScore = Math.max(12, Math.min(99, Math.round(rawScore)));

  // Risk categorization
  let deteriorationRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let statusWord = 'FRESH ✓';
  let farmerExplanation = 'Vegetables are in good condition. Very little sign of deterioration.';

  if (freshnessScore >= 80) {
    deteriorationRisk = 'LOW';
    statusWord = 'FRESH ✓';
    farmerExplanation = 'Vegetables are in good condition. Safe to hold or bring to market.';
  } else if (freshnessScore >= 60) {
    deteriorationRisk = 'MEDIUM';
    statusWord = 'MONITOR ⚠';
    farmerExplanation = 'Produce is beginning to age naturally. Recommend selling within a few days.';
  } else if (freshnessScore >= 40) {
    deteriorationRisk = 'HIGH';
    statusWord = 'WARNING ⚠';
    farmerExplanation = 'Significant deterioration risk detected. Inspect crates and remove softening items.';
  } else {
    deteriorationRisk = 'CRITICAL';
    statusWord = 'HIGH RISK ✕';
    farmerExplanation = 'High risk of spoilage! Discard rotten items immediately to save remaining produce.';
  }

  // Estimate remaining shelf life
  const remainingDays = Math.max(
    1,
    Math.round((crop.standardShelfLifeColdDays - storageDurationDays) * (freshnessScore / 100))
  );

  const contributingFactors = [
    {
      factor: 'Gas Array Pattern',
      score: Math.max(10, Math.min(100, Math.round(100 - gasPenalty))),
      impact: gasPenalty > 30 ? ('negative' as const) : gasPenalty > 15 ? ('neutral' as const) : ('positive' as const),
      detail: `Relative VOC: ${vocSignal} | Alcohol: ${alcoholSignal} | H2S: ${h2sSignal} | NH3: ${nh3Signal}`
    },
    {
      factor: 'Chamber Thermal Zone',
      score: Math.max(10, Math.min(100, Math.round(100 - tempPenalty * 2))),
      impact: tempPenalty > 15 ? ('negative' as const) : tempPenalty > 5 ? ('neutral' as const) : ('positive' as const),
      detail: `${temperature.toFixed(1)}°C (Target: ${crop.minTemp}–${crop.maxTemp}°C)`
    },
    {
      factor: 'Moisture Preservation',
      score: Math.max(10, Math.min(100, Math.round(100 - humidityPenalty * 2))),
      impact: humidityPenalty > 10 ? ('negative' as const) : ('positive' as const),
      detail: `${humidity}% RH (Target: ${crop.minHumidity}–${crop.maxHumidity}%)`
    },
    {
      factor: 'Storage Ageing',
      score: Math.max(10, Math.min(100, Math.round(100 - durationPenalty * 3))),
      impact: durationRatio > 0.8 ? ('negative' as const) : durationRatio > 0.5 ? ('neutral' as const) : ('positive' as const),
      detail: `${storageDurationDays} days stored of expected ${crop.standardShelfLifeColdDays} days`
    }
  ];

  return {
    freshnessScore,
    deteriorationRisk,
    statusWord,
    farmerExplanation,
    estimatedRemainingShelfLifeDays: remainingDays,
    contributingFactors,
    scientificSummary: `Multi-sensor fusion combines relative gas response (${vocSignal} rVOC, ${alcoholSignal} rAlcohol) with chamber thermal delta (${(temperature - crop.idealTemp).toFixed(1)}°C) and storage duration to calculate a probabilistic freshness rating without destructive sampling.`
  };
}
