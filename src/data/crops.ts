export interface CropProfile {
  id: string;
  name: string;
  icon: string;
  translationKey: 'tomato' | 'cabbage' | 'beans' | 'leafy' | 'chilli' | 'potato' | 'carrot' | 'apple';
  minTemp: number; // °C
  maxTemp: number; // °C
  idealTemp: number; // °C
  minHumidity: number; // %
  maxHumidity: number; // %
  idealHumidity: number; // %
  standardShelfLifeColdDays: number;
  standardShelfLifeAmbientDays: number;
  vocSensitivity: 'high' | 'medium' | 'low';
  storageAdvice: string;
  farmerNote: string;
}

export const CROPS: CropProfile[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    icon: '🍅',
    translationKey: 'tomato',
    minTemp: 8.0,
    maxTemp: 12.0,
    idealTemp: 10.0,
    minHumidity: 85,
    maxHumidity: 92,
    idealHumidity: 88,
    standardShelfLifeColdDays: 21,
    standardShelfLifeAmbientDays: 5,
    vocSensitivity: 'high',
    storageAdvice: 'Keep between 8°C - 12°C. Lower temperatures cause chilling injury; higher leads to rapid ripening.',
    farmerNote: 'Keep tomatoes cool but not freezing. High moisture prevents wrinkling.'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    icon: '🥬',
    translationKey: 'cabbage',
    minTemp: 0.0,
    maxTemp: 4.0,
    idealTemp: 2.0,
    minHumidity: 90,
    maxHumidity: 98,
    idealHumidity: 95,
    standardShelfLifeColdDays: 60,
    standardShelfLifeAmbientDays: 10,
    vocSensitivity: 'medium',
    storageAdvice: 'Needs near-freezing chill and high humidity to prevent wilting and yellowing.',
    farmerNote: 'Cabbage loves cold and high moisture. Keep ventilation steady.'
  },
  {
    id: 'beans',
    name: 'French Beans',
    icon: '🫘',
    translationKey: 'beans',
    minTemp: 5.0,
    maxTemp: 8.0,
    idealTemp: 6.5,
    minHumidity: 85,
    maxHumidity: 95,
    idealHumidity: 90,
    standardShelfLifeColdDays: 14,
    standardShelfLifeAmbientDays: 3,
    vocSensitivity: 'medium',
    storageAdvice: 'Sensitive to chilling injury below 5°C (causes russeting and decay).',
    farmerNote: 'Keep beans cool and fresh. Avoid temperatures below 5°C.'
  },
  {
    id: 'leafy',
    name: 'Leafy Vegetables (Spinach / Palak)',
    icon: '🥗',
    translationKey: 'leafy',
    minTemp: 1.0,
    maxTemp: 4.0,
    idealTemp: 2.5,
    minHumidity: 92,
    maxHumidity: 98,
    idealHumidity: 95,
    standardShelfLifeColdDays: 12,
    standardShelfLifeAmbientDays: 2,
    vocSensitivity: 'high',
    storageAdvice: 'High respiration rate produces rapid ethylene and moisture loss. Must be kept cold & damp.',
    farmerNote: 'Leafy greens dry up very quickly. Keep humidity very high!'
  },
  {
    id: 'chilli',
    name: 'Green Chilli',
    icon: '🌶️',
    translationKey: 'chilli',
    minTemp: 7.0,
    maxTemp: 10.0,
    idealTemp: 8.5,
    minHumidity: 85,
    maxHumidity: 95,
    idealHumidity: 90,
    standardShelfLifeColdDays: 28,
    standardShelfLifeAmbientDays: 6,
    vocSensitivity: 'low',
    storageAdvice: 'Chilling injury below 7°C causes pitting and calyx discoloration.',
    farmerNote: 'Keep chillies cool and crisp. Avoid damp condensation on stems.'
  },
  {
    id: 'potato',
    name: 'Seed / Table Potato',
    icon: '🥔',
    translationKey: 'potato',
    minTemp: 4.0,
    maxTemp: 10.0,
    idealTemp: 7.0,
    minHumidity: 85,
    maxHumidity: 95,
    idealHumidity: 90,
    standardShelfLifeColdDays: 120,
    standardShelfLifeAmbientDays: 20,
    vocSensitivity: 'low',
    storageAdvice: 'Prevent light exposure to stop greening. Maintain dark, cool, humid air.',
    farmerNote: 'Store in darkness to avoid greening. Mild chill preserves texture.'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    icon: '🥕',
    translationKey: 'carrot',
    minTemp: 0.5,
    maxTemp: 4.0,
    idealTemp: 2.0,
    minHumidity: 95,
    maxHumidity: 100,
    idealHumidity: 98,
    standardShelfLifeColdDays: 90,
    standardShelfLifeAmbientDays: 8,
    vocSensitivity: 'medium',
    storageAdvice: 'Requires very high humidity to stay crunchy and sweet.',
    farmerNote: 'Carrots stay sweet and crunchy in near-freezing high humidity.'
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: '🍎',
    translationKey: 'apple',
    minTemp: 1.0,
    maxTemp: 4.0,
    idealTemp: 2.0,
    minHumidity: 90,
    maxHumidity: 95,
    idealHumidity: 92,
    standardShelfLifeColdDays: 90,
    standardShelfLifeAmbientDays: 14,
    vocSensitivity: 'high',
    storageAdvice: 'High ethylene emitter; keep well ventilated if stored near other produce.',
    farmerNote: 'Keep cold. Apples emit ripening gas; ensure air circulation.'
  }
];
