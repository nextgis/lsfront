<template>
  <LoadingComponent v-if="isLoading"></LoadingComponent>
  <RestoreError v-else-if="isError" :returnPath="'/' + module.keyname + '/list'"></RestoreError>
  <v-stepper v-model="step" v-else>
    <v-stepper-items>
      <v-stepper-content step="1">
        <plot-select-list
          :selected="selectedPlots"
          v-on:update:selected="onUpdateSelected"
          :lesids="lesids"
          :singleSelect="singleSelect"
        ></plot-select-list>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-row no-gutters>
          <v-col cols="12" sm="4">
            <v-navigation-drawer permanent>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="title">Настройка макета</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-btn text tile block @click="step = 1">
                <v-icon dark>{{svg.left}}</v-icon>Выбрать лесосеку
              </v-btn>

              <v-select :items="modes" filled label="Режим" v-model="mode"></v-select>
              <SelectScale v-model="activeScale"></SelectScale>
              <SatelliteSelector v-if="ngwMap" :ngwMap="ngwMap" v-model="satellite"></SatelliteSelector>

              <v-form ref="form" class="pl-3 pr-3">
                <v-text-field
                  v-for="a in visibleInputAttributions"
                  class
                  :key="a.name"
                  v-model="a.value"
                  :label="a.label || a.name"
                  required
                ></v-text-field>
              </v-form>

              <ngw-layers-list
                ref="NgwLayersList"
                v-if=" step === 2 && selectedPlots[0] && selectedPlots[0].id && ngwMap"
                :hide-webmap-root="false"
                :ngwMap="ngwMap"
                :selection="selectionLayers"
              ></ngw-layers-list>
            </v-navigation-drawer>
          </v-col>
          <v-col cols="12" sm="4">
            <SheetLayoutComponent
              class="sheet-layout"
              ref="SheetLayout"
              v-if="step === 2 && selectedPlots[0] && selectedPlots[0].id"
              :inputAttributions="inputAttributions"
              :lesids="selectedPlots.map(x=>x.id).join(',')"
              :bounds="bounds"
              :scale="activeScale"
              v-on:update:scale="updateActiveScale"
            ></SheetLayoutComponent>
          </v-col>
        </v-row>

        <SaveControl @save="save" exportClass="sheet-layout" :fileName="fileName"></SaveControl>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>

</template>

<script lang="ts" src="./Reports.ts">
</script>


<style  scoped>
</style>
