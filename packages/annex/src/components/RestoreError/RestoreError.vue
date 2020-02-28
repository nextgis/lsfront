<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-alert prominent type="error">
            <v-row align="center">
              <v-col class="grow">{{text}}</v-col>
              <v-col class="shrink" v-if="returnPath">
                <v-btn @click="goTo">перейти в список</v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts" src="./RestoreError.ts">
</script>


<style>
</style>
