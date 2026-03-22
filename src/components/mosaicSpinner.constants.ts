export type MosaicSpinnerCellId = '7' | '8' | '9' | '6' | '3' | '2' | '1' | '4';

export interface MosaicSpinnerCellDefinition {
  id: MosaicSpinnerCellId;
  stepIndex: number;
  fromX: -1 | 0 | 1;
  fromY: -1 | 0 | 1;
}

export type MosaicSpinnerGridItem =
  | { kind: 'cell'; cellId: MosaicSpinnerCellId }
  | { kind: 'center' };

export const MOSAIC_SPINNER_DURATION_MS = 4000;
export const MOSAIC_SPINNER_STEP_INTERVAL_MS = 500;
export const MOSAIC_SPINNER_ENTRY_DURATION_MS = 140;
export const MOSAIC_SPINNER_IMPACT_DURATION_MS = 110;
export const MOSAIC_SPINNER_IMPACT_DISTANCE_PX = 2;

export const MOSAIC_SPINNER_CELLS: readonly MosaicSpinnerCellDefinition[] = [
  { id: '7', stepIndex: 0, fromX: -1, fromY: -1 },
  { id: '8', stepIndex: 1, fromX: 0, fromY: -1 },
  { id: '9', stepIndex: 2, fromX: 1, fromY: -1 },
  { id: '6', stepIndex: 3, fromX: 1, fromY: 0 },
  { id: '3', stepIndex: 4, fromX: 1, fromY: 1 },
  { id: '2', stepIndex: 5, fromX: 0, fromY: 1 },
  { id: '1', stepIndex: 6, fromX: -1, fromY: 1 },
  { id: '4', stepIndex: 7, fromX: -1, fromY: 0 },
] as const;

export const MOSAIC_SPINNER_GRID_ITEMS: readonly MosaicSpinnerGridItem[] = [
  { kind: 'cell', cellId: '7' },
  { kind: 'cell', cellId: '8' },
  { kind: 'cell', cellId: '9' },
  { kind: 'cell', cellId: '4' },
  { kind: 'center' },
  { kind: 'cell', cellId: '6' },
  { kind: 'cell', cellId: '1' },
  { kind: 'cell', cellId: '2' },
  { kind: 'cell', cellId: '3' },
] as const;
