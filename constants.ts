import { Feature, FeatureType } from './types';

export const FEATURES: Feature[] = [
  { id: FeatureType.VELLUS_HAIR, label: 'Vellus Hair', color: '#34d399' }, // Emerald
  { id: FeatureType.TERMINAL_HAIR, label: 'Terminal Hair', color: '#f87171' }, // Red
  { id: FeatureType.ANAGEN_HAIR, label: 'Anagen Hair', color: '#22d3ee' }, // Cyan
  { id: FeatureType.TELOGEN_HAIR, label: 'Telogen Hair', color: '#f97316' }, // Orange
  { id: FeatureType.FOLLICULAR_UNIT_1, label: 'FU (1 Hair)', color: '#60a5fa' }, // Blue
  { id: FeatureType.FOLLICULAR_UNIT_2, label: 'FU (2 Hairs)', color: '#a78bfa' }, // Violet
  { id: FeatureType.FOLLICULAR_UNIT_3_PLUS, label: 'FU (3+ Hairs)', color: '#f472b6' }, // Pink
];
