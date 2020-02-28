<template>
  <RestoreError v-if="isError" :returnPath="'/' + module.keyname + '/list'"></RestoreError>
  <LoadingComponent v-else-if="!isLoading"></LoadingComponent>
  <v-stepper v-model="step" v-else>
    <v-stepper-items>
      <v-stepper-content step="1">
        <ThirdAnnexSelectList
          :selected="selected"
          v-on:update:selected="onUpdateSelected"
          :annex3ids="annex3ids"
        ></ThirdAnnexSelectList>
      </v-stepper-content>

      <v-stepper-content step="2">
        <div v-if="step === 2 && this.selected.length">
          <v-row no-gutters>
            <v-col cols="12" sm="4">
              <v-navigation-drawer permanent>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="title">Настройка макета</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

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
              </v-navigation-drawer>
            </v-col>
            <v-col cols="12" sm="4">
              <v-row no-gutters>
                <v-col cols="12" v-for="lesid in lesids" :key="lesid" class="pb-2">
                  <SheetLayoutComponent
                    v-if="step === 2"
                    class="sheet-layout"
                    :ref="'SheetLayout' + lesid"
                    :lesids="lesid"
                    :bounds="getSheetBounds(lesid)"
                    :inputAttributions="inputAttributions"
                  ></SheetLayoutComponent>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <SaveControl @save="save" exportClass="sheet-layout" :fileName="fileName"></SaveControl>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>

</template>

<script lang="ts" src="./FourthAnnex.ts">
</script>


<style  scoped>
</style>
