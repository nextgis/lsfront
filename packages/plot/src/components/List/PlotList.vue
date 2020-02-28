<template>
  <v-content class="pa-0">
    <loading-component v-if="isLoading"></loading-component>
    <v-data-table v-else :headers="fields" :items="items" hide-default-footer disable-pagination class="elevation-1">
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">{{svg.edit}}</v-icon>
        <v-icon small @click="deleteItem(item)">{{svg.delete}}</v-icon>
      </template>
    </v-data-table>
  </v-content>
</template>

<script lang="ts" src="./PlotList.ts">
</script>


<style  >
</style>
