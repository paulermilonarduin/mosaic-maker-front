<script setup lang="ts">
import MosaicSpinner from './MosaicSpinner.vue';

interface MosaicLoadingScreenProps {
  label?: string;
  message?: string;
  fullscreen?: boolean;
}

withDefaults(defineProps<MosaicLoadingScreenProps>(), {
  label: 'Loading',
  message: '',
  fullscreen: true,
});
</script>

<template>
  <section
    class="mosaic-loading-screen"
    :class="{ 'is-fullscreen': fullscreen }"
    role="status"
    aria-live="polite"
  >
    <MosaicSpinner
      class="mosaic-loading-screen__spinner"
      :size="fullscreen ? 124 : 104"
      :label="label"
      decorative
    />

    <div class="mosaic-loading-screen__copy">
      <p class="mosaic-loading-screen__label">{{ label }}</p>
      <p v-if="message" class="mosaic-loading-screen__message">{{ message }}</p>
    </div>
  </section>
</template>

<style scoped>
.mosaic-loading-screen {
  display: grid;
  justify-items: center;
  gap: 18px;
  width: 100%;
  padding: 28px;
  border: 1px solid var(--color-primary-border);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(247, 244, 255, 0.92));
  box-shadow: 0 24px 56px rgba(83, 86, 245, 0.12);
  text-align: center;
}

.mosaic-loading-screen.is-fullscreen {
  min-height: 100vh;
  place-content: center;
  border: 0;
  border-radius: 0;
  background:
    radial-gradient(circle at top, rgba(155, 0, 245, 0.16), transparent 28%),
    radial-gradient(circle at bottom right, rgba(83, 86, 245, 0.12), transparent 26%),
    linear-gradient(180deg, #fffdf0 0%, #f7f2ff 100%);
  box-shadow: none;
}

.mosaic-loading-screen__spinner {
  filter: drop-shadow(0 18px 30px rgba(155, 0, 245, 0.12));
}

.mosaic-loading-screen__copy {
  display: grid;
  gap: 8px;
  max-width: 32rem;
}

.mosaic-loading-screen__label {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text);
}

.mosaic-loading-screen__message {
  margin: 0;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .mosaic-loading-screen {
    padding: 24px 20px;
    border-radius: 20px;
  }
}
</style>
