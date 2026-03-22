<script setup lang="ts">
import { computed, ref } from 'vue';
import { getHelloWorld } from './api/hello';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

const status = ref<RequestStatus>('idle');
const responseBody = ref<string>('');
const errorMessage = ref<string>('');

const isLoading = computed(() => status.value === 'loading');

async function handleButtonClick(): Promise<void> {
  status.value = 'loading';
  responseBody.value = '';
  errorMessage.value = '';

  try {
    const result = await getHelloWorld();
    responseBody.value = result;
    status.value = 'success';
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'The request failed for an unknown reason.';
    status.value = 'error';
  }
}
</script>

<template>
  <main class="app-shell">
    <section class="panel">
      <p class="eyebrow">MosaicMaker</p>
      <h1>Hello world API check</h1>
      <p class="description">
        This minimal Vue boilerplate calls the local Python API on
        <code>/api/hello-world</code>.
      </p>

      <button
        class="primary-button"
        type="button"
        :disabled="isLoading"
        @click="handleButtonClick"
      >
        {{ isLoading ? 'Loading...' : 'Call hello-world' }}
      </button>

      <p v-if="status === 'idle'" class="hint">
        Click the button to test the API connection.
      </p>

      <div
        v-else-if="status === 'success'"
        class="message message-success"
        aria-live="polite"
      >
        <h2>Response</h2>
        <pre>{{ responseBody }}</pre>
      </div>

      <div
        v-else-if="status === 'error'"
        class="message message-error"
        role="alert"
      >
        <h2>Request failed</h2>
        <p>{{ errorMessage }}</p>
      </div>
    </section>
  </main>
</template>
