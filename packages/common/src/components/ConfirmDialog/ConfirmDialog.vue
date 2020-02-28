<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title class="headline">{{title}}</v-card-title>

      <v-card-text>{{message}}</v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary darken-1" text @click="agree">{{options.acceptText}}</v-btn>

        <v-btn v-if="options.rejectBtn" text @click="cancel">{{options.rejectText}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" src="./ConfirmDialog.ts">
</script>

<style >
</style>
