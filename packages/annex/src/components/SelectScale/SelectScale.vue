<template>
  <v-select :items="selectScaleItems" filled label="Масштаб" v-model="scale">
    <template v-slot:item="{ item }">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{item.text}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
    </template>
  </v-select>
</template>

<script lang="ts" src="./SelectScale.ts">
</script>


<style>
</style>
