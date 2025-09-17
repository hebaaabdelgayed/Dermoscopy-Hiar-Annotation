export enum FeatureType {
  VELLUS_HAIR = 'Vellus Hair',
  TERMINAL_HAIR = 'Terminal Hair',
  ANAGEN_HAIR = 'Anagen Hair',
  TELOGEN_HAIR = 'Telogen Hair',
  FOLLICULAR_UNIT_1 = 'FU (1 Hair)',
  FOLLICULAR_UNIT_2 = 'FU (2 Hairs)',
  FOLLICULAR_UNIT_3_PLUS = 'FU (3+ Hairs)',
}

export interface Feature {
  id: FeatureType;
  label: string;
  color: string;
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  type: FeatureType;
  radius: number;
}

export interface Stats {
  [key: string]: number;
}
