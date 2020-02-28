<template>
  <v-layout align-space-between justify-space-between column fill-height>

    <v-flex style="flex:0;" v-if="ngwMap">
      <v-toolbar dense color="primary">
        <v-spacer></v-spacer>
        <v-app-bar-nav-icon @click.stop="layersDrawer = !layersDrawer"></v-app-bar-nav-icon>
      </v-toolbar>
    </v-flex>

    <v-flex style="flex:auto;">
      <vue-ngw-map
        ref="VueNgwMap"
        full-filling
        :connector="connector"
        :mapOptions="mapOptions"
      ></vue-ngw-map>
    </v-flex>
    <v-navigation-drawer v-if="ngwMap" v-model="layersDrawer" hide-overlay absolute right>
      <template v-slot:prepend>
        <v-toolbar dense color="primary">
          <v-toolbar-title>Слои</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon text @click.stop="layersDrawer = !layersDrawer">
            <v-icon>{{svg.mdiClose}}</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <ngw-layers-list :ngwMap="ngwMap" hideWebmapRoot></ngw-layers-list>
    </v-navigation-drawer>

    <v-overlay :value="isLoading">
      <loading-component></loading-component>
    </v-overlay>
  </v-layout>
</template>

<script lang="ts" src="./Overview.ts">
</script>

<style scoped>
.full-height {
  width: 100%;
  height: 100%;
}
</style>

<style>

.columns .column {
  display: inline-block;
}

.columns .is-two-fifths {
  width: 30%;
}

.leaflet-pane.leaflet-popup-pane {
  z-index: 2001;
}

.leaflet-pane.leaflet-tooltip-pane {
  z-index: 2002;
}
</style>
