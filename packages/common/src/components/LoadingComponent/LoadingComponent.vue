<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
          <!-- <v-flex v-if="text" tag="h1" class="text-center headline pb-2">{{text}}</v-flex> -->
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts" src="./LoadingComponent.ts">
</script>


<style  scoped>
.loading-content {
  width: 100%;
  height: 100%;
}
</style>
