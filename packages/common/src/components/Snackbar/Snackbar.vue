<template>
  <v-snackbar
      v-model="snackbar"
      :color="options.color"
      :timeout="options.timeout"
    >
      {{ text }}
      <v-btn
        text
        @click="snackbar = false"
      >
        Закрыть
      </v-btn>
    </v-snackbar>
</template>

<script lang="ts" src="./Snackbar.ts">
</script>

<style >
</style>
