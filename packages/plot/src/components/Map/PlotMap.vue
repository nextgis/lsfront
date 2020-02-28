<template>
  <v-layout align-space-between justify-space-between column fill-height>
    <v-flex style="flex:0;">
      <v-toolbar dense color="primary">
        <v-app-bar-nav-icon @click.stop="attrDrawer = !attrDrawer"></v-app-bar-nav-icon>
        <v-toolbar-items>
          <v-btn
            v-for="(item, i) in toolbarItemsLeft"
            :key="i"
            :icon="$vuetify.breakpoint.smAndDown"
            :disabled="isDisabled(item)"
            @click="onMenuItemClick(item)"
            text
          >
            <v-icon class="hidden-md-and-up">{{item.icon}}</v-icon>
            <span class="hidden-sm-and-down">{{ item.title }}</span>
          </v-btn>
        </v-toolbar-items>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn
            v-for="(item, i) in toolbarItemsRight"
            :key="i"
            :icon="$vuetify.breakpoint.smAndDown"
            :disabled="isDisabled(item)"
            @click="onMenuItemClick(item)"
            text
          >
            <v-icon class="hidden-md-and-up">{{item.icon}}</v-icon>
            <span class="hidden-sm-and-down">{{ item.title }}</span>
          </v-btn>
        </v-toolbar-items>
        <v-app-bar-nav-icon @click.stop="layersDrawer = !layersDrawer"></v-app-bar-nav-icon>
      </v-toolbar>
    </v-flex>
    <v-flex style="flex:auto;">
      <plot-ngw-map
        ref="PlotNgwMap"
        :lesid="lesid"
        :createPlotHighlightLayerPopup="createPlotHighlightLayerPopup"
        :fit="fit"
      ></plot-ngw-map>
      <!-- <vue-ngw-map ref="NgwMap" full-filling :connector="connector" :qmsId="487"> -->
      <!-- </vue-ngw-map> -->
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
      <ngw-layers-list
        v-if="plotNgwMap.baseLayers"
        :hide-webmap-root="false"
        :ngwMap="ngwMap"
        :include="plotNgwMap.baseLayers"
        notOnlyNgwLayer
      ></ngw-layers-list>
      <v-spacer></v-spacer>
      <div class="ma-3" v-if="mode==='show'">
        Фильтр
        <PlotFilter v-model="plotFilter" :filteredFields="filteredFields"></PlotFilter>
      </div>
    </v-navigation-drawer>

    <v-navigation-drawer v-if="ngwMap" v-model="attrDrawer" hide-overlay absolute>
      <template v-slot:prepend>
        <v-toolbar dense color="primary">
          <v-toolbar-title>Атрибуты</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon text @click.stop="attrDrawer = !attrDrawer">
            <v-icon>{{svg.mdiClose}}</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <v-layout v-if="plotNgwMap.plot" justify-center class="pa-2">
        <v-flex>
          <v-btn v-if="mode!=='edit'" @click.stop="mode='edit'">редактировать</v-btn>
        </v-flex>
      </v-layout>
      <plot-attributes
        class="pl-1 pr-2"
        v-if="plotNgwMap.plot"
        :plot="plotNgwMap.plot"
        :editable="mode==='edit'"
      ></plot-attributes>
      <p class="pa-2" v-else>Лесосека не добавлена</p>
    </v-navigation-drawer>

    <v-overlay :value="overlay">
      <p>Необходимо заполнить атрибуты лесосеки</p>
      <v-btn
        @click="overlay = false; attrDrawer = true; mode = 'edit'"
      >Открыть редактирование атрибутов</v-btn>
    </v-overlay>
    <v-overlay :value="isLoading">
      <loading-component></loading-component>
    </v-overlay>
  </v-layout>
</template>

<script lang="ts" src="./PlotMap.ts">
</script>

<style scoped>
.full-height {
  width: 100%;
  height: 100%;
}
</style>

<style>
.leaflet-pane.leaflet-popup-pane {
  z-index: 2001;
}

.leaflet-pane.leaflet-tooltip-pane {
  z-index: 2002;
}
</style>
