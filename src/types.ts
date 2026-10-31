export type VolumeFormat = '0.5' | '1.0' | '1.5';
export type WaterType = 'sparkling' | 'still';
export type ModalKind = 'order' | 'retail' | 'privacy' | 'assets' | null;

export interface OrderSelection {
  volume: VolumeFormat;
  waterType: WaterType;
}
