<template>
  <v-menu v-if="user" v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>{{ svg.mdiAccount }}</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{user.display_name}}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn @click="logOut">
              <v-icon>{{svg.mdiExitToApp}}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="menu = false">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts" src="./UserPopoverMenu.ts">
</script>


<style>
</style>
