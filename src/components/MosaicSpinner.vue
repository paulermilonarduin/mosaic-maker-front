<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type HTMLAttributes,
} from 'vue';
import {
  MOSAIC_SPINNER_CELLS,
  MOSAIC_SPINNER_DURATION_MS,
  MOSAIC_SPINNER_ENTRY_DURATION_MS,
  MOSAIC_SPINNER_GRID_ITEMS,
  MOSAIC_SPINNER_IMPACT_DISTANCE_PX,
  MOSAIC_SPINNER_IMPACT_DURATION_MS,
  MOSAIC_SPINNER_STEP_INTERVAL_MS,
  type MosaicSpinnerCellDefinition,
  type MosaicSpinnerCellId,
} from './mosaicSpinner.constants';

type SpinnerSize = number | string;

interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  paused?: boolean;
  decorative?: boolean;
}

type SpinnerStyle = {
  '--spinner-size': string;
  '--spinner-entry-duration': string;
  '--spinner-impact-x': string;
  '--spinner-impact-y': string;
};

type SpinnerCellStyle = {
  '--cell-from-x': string;
  '--cell-from-y': string;
};

type ImpactOffset = {
  x: number;
  y: number;
};

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 96,
  label: 'Loading',
  paused: false,
  decorative: false,
});

const filledCellIds = ref<Set<MosaicSpinnerCellId>>(new Set());
const enteringCellId = ref<MosaicSpinnerCellId | null>(null);
const isImpactActive = ref(false);
const impactOffset = ref<ImpactOffset>({ x: 0, y: 0 });
const prefersReducedMotion = ref(false);
const scheduledTimeoutIds: number[] = [];
let removeReducedMotionListener: (() => void) | null = null;

const cellsById = new Map<MosaicSpinnerCellId, MosaicSpinnerCellDefinition>(
  MOSAIC_SPINNER_CELLS.map((cell) => [cell.id, cell])
);

const gridItems = MOSAIC_SPINNER_GRID_ITEMS.map((item) => {
  if (item.kind === 'center') {
    return item;
  }

  const cell = cellsById.get(item.cellId);

  if (!cell) {
    throw new Error(`Unknown spinner cell: ${item.cellId}`);
  }

  return {
    ...item,
    cell,
    style: getAnimatedCellStyle(cell.fromX, cell.fromY),
  };
});

const spinnerStyle = computed<SpinnerStyle>(() => ({
  '--spinner-size':
    typeof props.size === 'number' ? `${props.size}px` : props.size,
  '--spinner-entry-duration': `${MOSAIC_SPINNER_ENTRY_DURATION_MS}ms`,
  '--spinner-impact-x': `${impactOffset.value.x}px`,
  '--spinner-impact-y': `${impactOffset.value.y}px`,
}));

const containerAttributes = computed<HTMLAttributes>(() =>
  props.decorative
    ? { 'aria-hidden': true }
    : { role: 'status', 'aria-label': props.label }
);

function getAnimatedCellStyle(
  fromX: number,
  fromY: number
): SpinnerCellStyle {
  return {
    '--cell-from-x': String(fromX),
    '--cell-from-y': String(fromY),
  };
}

function scheduleTimeout(callback: () => void, delayMs: number): void {
  const timeoutId = window.setTimeout(callback, delayMs);
  scheduledTimeoutIds.push(timeoutId);
}

function clearScheduledTimeouts(): void {
  for (const timeoutId of scheduledTimeoutIds) {
    window.clearTimeout(timeoutId);
  }

  scheduledTimeoutIds.length = 0;
}

function resetTimelineState(): void {
  filledCellIds.value = new Set();
  enteringCellId.value = null;
  isImpactActive.value = false;
  impactOffset.value = { x: 0, y: 0 };
}

function fillAllPeripheralCells(): void {
  filledCellIds.value = new Set(MOSAIC_SPINNER_CELLS.map((cell) => cell.id));
  enteringCellId.value = null;
  isImpactActive.value = false;
  impactOffset.value = { x: 0, y: 0 };
}

function setFilledCell(cellId: MosaicSpinnerCellId): void {
  const nextFilledCells = new Set(filledCellIds.value);
  nextFilledCells.add(cellId);
  filledCellIds.value = nextFilledCells;
}

function triggerGridImpact(cell: MosaicSpinnerCellDefinition): void {
  impactOffset.value = {
    x: cell.fromX * MOSAIC_SPINNER_IMPACT_DISTANCE_PX,
    y: cell.fromY * MOSAIC_SPINNER_IMPACT_DISTANCE_PX,
  };
  isImpactActive.value = true;

  scheduleTimeout(() => {
    isImpactActive.value = false;
    impactOffset.value = { x: 0, y: 0 };
  }, MOSAIC_SPINNER_IMPACT_DURATION_MS);
}

function startTimelineCycle(): void {
  clearScheduledTimeouts();
  resetTimelineState();

  for (const cell of MOSAIC_SPINNER_CELLS) {
    const stepStartMs = cell.stepIndex * MOSAIC_SPINNER_STEP_INTERVAL_MS;
    const entryCompleteMs = stepStartMs + MOSAIC_SPINNER_ENTRY_DURATION_MS;

    scheduleTimeout(() => {
      enteringCellId.value = cell.id;
    }, stepStartMs);

    scheduleTimeout(() => {
      enteringCellId.value = null;
      setFilledCell(cell.id);
      triggerGridImpact(cell);
    }, entryCompleteMs);
  }

  scheduleTimeout(() => {
    startTimelineCycle();
  }, MOSAIC_SPINNER_DURATION_MS);
}

function syncAnimationState(): void {
  clearScheduledTimeouts();

  if (prefersReducedMotion.value) {
    fillAllPeripheralCells();
    return;
  }

  if (props.paused) {
    isImpactActive.value = false;
    impactOffset.value = { x: 0, y: 0 };
    return;
  }

  startTimelineCycle();
}

function updateReducedMotionPreference(mediaQuery: MediaQueryList | MediaQueryListEvent): void {
  prefersReducedMotion.value = mediaQuery.matches;
}

function getCellFillClass(cellId: MosaicSpinnerCellId): Record<string, boolean> {
  return {
    'is-entering': enteringCellId.value === cellId,
    'is-filled': filledCellIds.value.has(cellId),
  };
}

onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  updateReducedMotionPreference(mediaQuery);

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', updateReducedMotionPreference);
    removeReducedMotionListener = () => {
      mediaQuery.removeEventListener('change', updateReducedMotionPreference);
    };
  } else {
    mediaQuery.addListener(updateReducedMotionPreference);
    removeReducedMotionListener = () => {
      mediaQuery.removeListener(updateReducedMotionPreference);
    };
  }

  syncAnimationState();
});

watch([() => props.paused, prefersReducedMotion], () => {
  syncAnimationState();
});

onBeforeUnmount(() => {
  clearScheduledTimeouts();
  removeReducedMotionListener?.();
});
</script>

<template>
  <div
    class="mosaic-spinner"
    :class="{
      'is-impacting': isImpactActive,
      'is-paused': paused,
      'is-reduced-motion': prefersReducedMotion,
    }"
    :style="spinnerStyle"
    v-bind="containerAttributes"
  >
    <div class="mosaic-spinner__grid" aria-hidden="true">
      <template v-for="(item, itemIndex) in gridItems" :key="`${item.kind}-${itemIndex}`">
        <div
          v-if="item.kind === 'cell'"
          class="mosaic-spinner__cell"
          :style="item.style"
        >
          <span class="mosaic-spinner__fill" :class="getCellFillClass(item.cellId)" />
        </div>
        <div v-else class="mosaic-spinner__cell mosaic-spinner__cell--center">
          <span class="mosaic-spinner__center-fill" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.mosaic-spinner {
  --spinner-size: 96px;
  --spinner-cell-shadow: 0 10px 18px rgba(173, 165, 50, 0.18);
  --spinner-primary-border: #7600bc;
  --spinner-secondary-border: #8d8427;
  --spinner-grid-color: rgba(122, 128, 145, 0.55);
  --spinner-grid-fill: rgba(233, 236, 242, 0.72);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.mosaic-spinner__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  width: var(--spinner-size);
  height: var(--spinner-size);
  aspect-ratio: 1;
  background: transparent;
  transform-origin: center;
  transform: translate3d(0, 0, 0) scale(1);
  transition: transform 110ms cubic-bezier(0.2, 0.9, 0.28, 1);
  will-change: transform;
}

.mosaic-spinner.is-impacting .mosaic-spinner__grid {
  transform: translate3d(var(--spinner-impact-x), var(--spinner-impact-y), 0)
    scale(0.985);
}

.mosaic-spinner__cell {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  background: var(--spinner-grid-fill);
  box-shadow: inset 0 0 0 1px var(--spinner-grid-color);
}

.mosaic-spinner__cell--center {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--spinner-grid-fill);
}

.mosaic-spinner__fill {
  position: absolute;
  inset: 0;
  background: var(--color-secondary);
  box-shadow: inset 0 0 0 1px var(--spinner-secondary-border), var(--spinner-cell-shadow);
  opacity: 0;
  transform: translate(
      calc(var(--cell-from-x, 0) * 116%),
      calc(var(--cell-from-y, 0) * 116%)
    )
    scale(0.8);
  will-change: transform, opacity;
}

.mosaic-spinner__center-fill {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--color-primary);
  box-shadow: inset 0 0 0 1px var(--spinner-primary-border);
}

.mosaic-spinner__fill.is-filled {
  opacity: 1;
  transform: translate(0, 0) scale(1);
}

.mosaic-spinner__fill.is-entering {
  animation: mosaic-fill-entry var(--spinner-entry-duration)
    cubic-bezier(0.22, 0.92, 0.29, 1) both;
}

.mosaic-spinner.is-paused .mosaic-spinner__fill.is-entering {
  animation-play-state: paused;
}

@keyframes mosaic-fill-entry {
  from {
    opacity: 0.12;
    transform: translate(
        calc(var(--cell-from-x, 0) * 116%),
        calc(var(--cell-from-y, 0) * 116%)
      )
      scale(0.8);
  }

  58% {
    opacity: 1;
    transform: translate(0, 0) scale(1.08);
  }

  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mosaic-spinner__fill {
    opacity: 1;
    transform: translate(0, 0) scale(1);
    animation: none;
  }
}
</style>
