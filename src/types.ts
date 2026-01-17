export type PetType = 'cat' | 'dog';
export type PetColor = 'base' | 'black' | 'brown' | 'whiteandbrown';
export type Gender = 'male' | 'female' | 'other';
export type ClothingSlot = 'head' | 'eyes' | 'torso' | 'paws';

export type ClothingItem = {
  id: string;
  slot: ClothingSlot;
  assetKey: string;
  name?: string;
};

export type Pet = {
  id: string;
  name: string;
  type: PetType;
  color: PetColor;
  gender: Gender;
  hunger: number; // 0-100
  hygiene: number; // 0-100
  money: number; // currency earned

  // Enhanced stats
  energy: number; // 0-100
  happiness: number; // 0-100
  health: number; // 0-100 (calculated)

  clothes: Record<ClothingSlot, string | null>;
  createdAt: number;
  lastUpdated: number; // Track last update time
  isSleeping?: boolean; // Track sleep state
  sleepStartTime?: number; // When sleep began
};

export type AnimationState =
  | 'idle'
  | 'eating'
  | 'bathing'
  | 'happy'
  | 'sleeping'
  | 'playing'
  | 'tired'
  | 'sick';

export type TreatmentType = 'antibiotic' | 'antiInflammatory';

export type PetMood =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'critical';

export type StatLevel = {
  value: number;
  level: 'high' | 'medium' | 'low' | 'critical';
  color: string;
};