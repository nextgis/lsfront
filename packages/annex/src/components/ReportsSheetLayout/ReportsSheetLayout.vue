<template>
  <v-sheet :elevation="3" color="white" class="mx-auto" height="1133" width="804" light>
    <div class="calibre" id="calibre_link-0">
      <p class="p-p1">&nbsp;</p>
      <p class="p-p2">
        <span class="s-t1"><strong>{{ title }}</strong></span>
      </p>

      <p class="p-p3">&nbsp;</p>
      <div class="plot-ngw-map">
        <plot-ngw-map
          v-if="lesids"
          class
          ref="PlotNgwMap"
          :fit="!bounds"
          :resourcesIds="lesids"
          :layersOptions="layersOptions"
        ></plot-ngw-map>
      </div>
      <p class="p-p1">&nbsp;</p>
      <table class="t-table t-table_map">
        <tr class="tr-table1_">
          <td class="td-table1_a">
            <p class="p-p4 col-p-center">
              <span class="s-t1">Масштаб</span>&nbsp;
            </p>
          </td>
          <td class="td-table1_a">
            <p class="p-p5">
              <span class="s-t1">1:{{activeScale ? activeScaleHumanize : '-'}}</span>&nbsp;
            </p>
          </td>
        </tr>
        <tr class="tr-table1_">
          <td class="td-table1_a" colspan="2">
            <p class="p-p4 col-p-center">
              <span class="s-t1 table-title">Организация</span>&nbsp;
            </p>
          </td>
        </tr>
        <tr class="tr-table1_" v-for="s in orgAttributes" :key="s.name">
          <td class="td-table1_a">
            <p class="p-p4">
              <span class="s-t1">{{s.label}}</span>&nbsp;
            </p>
          </td>
          <td class="td-table1_a">
            <p class="p-p5">
              <span class="s-t1" v-if="s.value">{{s.value}}</span>
              <span class="s-t1" v-else>-</span>&nbsp;
            </p>
          </td>
        </tr>

        <tr class="tr-table1_">
          <td class="td-table1_a" colspan="2">
            <p class="p-p4 col-p-center">
              <span class="s-t1 table-title">Лесной участок</span>&nbsp;
            </p>
          </td>
        </tr>
        <tr class="tr-table1_" v-for="a in plotAttributes" :key="a.name">
          <td class="td-table1_a">
            <p class="p-p4">
              <span class="s-t1">{{a.name}}</span>&nbsp;
            </p>
          </td>
          <td class="td-table1_a">
            <p class="p-p5">
              <span
                class="s-t1"
                v-if="ngwMap && plot.feature && plot.feature.properties[a.field]"
              >{{plot.feature.properties[a.field]}}</span>
              <span class="s-t1" v-else>-</span>&nbsp;
            </p>
          </td>
        </tr>

        <tr class="tr-table1_">
          <td class="td-table1_a" colspan="2">
            <p class="p-p4 col-p-center">
              <span class="s-t1 table-title">Космический снимок</span>&nbsp;
            </p>
          </td>
        </tr>
        <tr class="tr-table1_" v-for="s in satelliteAttributes" :key="s.name">
          <td class="td-table1_a">
            <p class="p-p4">
              <span class="s-t1">{{s.label}}</span>&nbsp;
            </p>
          </td>
          <td class="td-table1_a">
            <p class="p-p5">
              <span class="s-t1" v-if="s.value">{{s.value}}</span>
              <span class="s-t1" v-else>-</span>&nbsp;
            </p>
          </td>
        </tr>
      </table>
    </div>
  </v-sheet>
</template>

<script lang="ts" src="./ReportsSheetLayout.ts">
</script>

<style scoped>
.plot-ngw-map {
  width: 100%;
  height: 500px;
  border-radius: 0;
}

.table-title {
  font-weight: 700;
}

@page {
  margin-bottom: 5pt;
  margin-top: 5pt;
}
</style>
