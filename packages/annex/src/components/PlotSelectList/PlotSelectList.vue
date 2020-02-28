<template>
  <v-content class="pa-0">
    <loading-component v-if="isLoading"></loading-component>
    <v-data-table
      v-else
      :headers="fields"
      :items="items"
      hide-default-footer
      disable-pagination
      class="elevation-1"
      v-model="syncedSelected"
      :single-select="singleSelect"
      show-select
    ></v-data-table>
  </v-content>
</template>

<script lang="ts" src="./PlotSelectList.ts">
</script>


<style>
</style>
