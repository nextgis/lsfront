<template>
  <v-app>
    <loading-component v-if="globalLoading" :text="loadingText"></loading-component>
    <v-container v-else-if="globalErrorMessage" fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-flex tag="h1" class="headline pb-2">{{appName}}</v-flex>
          <v-alert type="error">{{globalErrorMessage}}</v-alert>
          <v-btn
            class="mt-3"
            color="primary"
            @click="logOut"
            @keyup.enter="logOut"
          >Войти под другим пользователем</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <router-view v-else></router-view>
    <confirm-dialog-component ref="confirm"></confirm-dialog-component>
    <select-file-dialog-component ref="file"></select-file-dialog-component>
    <snackbar-component ref="snackbar"></snackbar-component>
  </v-app>
</template>

<script lang="ts" src="./App.ts">
</script>


<style lang="css" scoped>
* {
  padding: 0;
  margin: 0;
}
</style>
