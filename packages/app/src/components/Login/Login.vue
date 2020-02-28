<template>
  <v-content v-if="!user">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-flex tag="h1" class="headline pb-2">{{appName}}</v-flex>
          <v-form>
            <v-text-field
              v-model="auth.login"
              label="Имя пользователя"
              name="login"
              :prepend-icon="svg.mdiAccount"
              type="text"
            ></v-text-field>

            <v-text-field
              v-model="auth.password"
              label="Пароль"
              name="password"
              :prepend-icon="svg.mdiLock"
              type="password"
            ></v-text-field>
          </v-form>
          <v-spacer></v-spacer>

          <v-alert v-if="isError" type="error">
            Не удалось войти
          </v-alert>

          <v-btn v-if="isLoading" color="primary" disabled>
            <v-progress-circular indeterminate></v-progress-circular>
          </v-btn>
          <v-btn v-else color="primary" @click="login" @keyup.enter="login" :disabled="!isValid">Войти</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts" src="./Login.ts">
</script>


<style lang="css" >
</style>
