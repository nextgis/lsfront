<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title class="headline">{{title}}</v-card-title>

      <v-file-input v-model="file" :accept="options.accept" :label="message"></v-file-input>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary darken-1" text @click="agree" :disabled="!file">{{options.acceptText}}</v-btn>

        <v-btn v-if="options.rejectBtn" text @click="cancel">{{options.rejectText}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" src="./SelectFileDialog.ts">
</script>

<style >
</style>
