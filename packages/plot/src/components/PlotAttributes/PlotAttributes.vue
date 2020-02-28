<template>
  <v-layout v-if="plot" align-space-around justify-start column>
    <v-flex v-for="(f, i) in fields" :key="i">
      <v-select
        v-if="lookupTables[f.value]"
        v-model="plot.feature.properties[f.value]"
        :label="f.text"
        :items="getLookupItems(f)"
        :disabled="!editable"
      ></v-select>
      <v-text-field
        v-else
        v-on:change="(val) => setFieldValue(f, val)"
        :value="getFieldValue(f, plot.feature.properties[f.value])"
        :label="f.text"
        :disabled="!editable"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script lang="ts" src="./PlotAttributes.ts">
</script>


<style  >
</style>
