<template>
  <v-layout align-space-around justify-start column>
    <v-flex v-for="(f, i) in fields" :key="i">
      <v-text-field v-model="filtersValues[f.value]" :label="f.text"></v-text-field>
    </v-flex>
    <v-flex>
      <v-btn @click="setFilter" small>Применить</v-btn>
      <v-btn @click="cleanFilter()" small>Сбросить</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts" src="./PlotFilter.ts">
</script>


<style  >
</style>
