<template>
  <v-app>
    <v-app-bar flat app color="primary">
      <v-btn v-if="activeCatalog" icon to="/">
        <v-icon>{{ svg.mdiHome }}</v-icon>
      </v-btn>
      <v-toolbar-title></v-toolbar-title>
      <span class="title">{{appName || 'loading...'}}</span>
      <v-subheader v-if="activeCatalog">{{ activeCatalog.item.title }}</v-subheader>

      <v-menu offset-y v-if="activeCatalog && activeCatalog.item.actions.length > 1">
        <template v-slot:activator="{ on }">
          <v-btn text small v-on="on">
            {{ activeCatalog.action.title }}
            <v-icon right>{{svg.mdiChevronDown}}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(action, index) in getAnotherActions(activeCatalog.action.title)"
            :key="index"
            @click="goTo(action)"
          >
            <v-list-item-title class="ma-1 text-center">{{ action.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-spacer></v-spacer>

      <user-popover-menu></user-popover-menu>
    </v-app-bar>

    <v-content>
      <router-view :key="$route.fullPath"></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts" src="./MainPage.ts">
</script>


<style lang="css" scoped>
* {
  padding: 0;
  margin: 0;
}

.header {
  backface-visibility: hidden;
  background-color: #e5eef7;
  border-bottom: 1px solid #d3e3f2;
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  font-weight: 400;
  height: 43px;
  left: 0;
  line-height: 43px;
  min-height: 43px;
  padding-left: 0;
  padding-right: 0;
  position: fixed;
  right: 0;
  top: 0;
  white-space: nowrap;
  width: 100%;
  z-index: 40;
}

.nowrap {
  white-space: nowrap !important;
}
</style>
