<template>
  <v-sheet :elevation="3" color="white" class="sheet-layout mx-auto" height="1133" width="804" light>
    <div class="calibre" id="calibre_link-0">
      <p class="p-p">
        <span class="s-t">Приложение 3</span>&nbsp;
      </p>
      <p class="p-p">
        <span class="s-t">к лесной декларации</span>&nbsp;
      </p>
      <p class="p-p">
        <span class="s-t">утвержденной приказом</span>&nbsp;
      </p>
      <p class="p-p">
        <span class="s-t">Минприроды России</span>&nbsp;
      </p>
      <p class="p-p">
        <span class="s-t">от 16.01.2015 г. № 17</span>&nbsp;
      </p>
      <p class="p-p1">&nbsp;</p>
      <p class="p-p2">
        <span class="s-t1">Общая схема расположения мест проведения работ</span>&nbsp;
      </p>
      <p class="p-p2">
        <span class="s-t1">при использовании лесов в {{year}} г.</span>&nbsp;
      </p>
      <p class="p-p2">
        <span
          class="s-t1"
          v-if="ngwMap && plot"
        >{{plot.feature.properties.REG}}, {{plot.feature.properties.MUN}}</span>&nbsp;
      </p>
      <p class="p-p3">&nbsp;</p>
      <table class="t-table">
        <col class="tc-table1_a" />

        <col class="tc-table1_b" />

        <tr class="tr-table1_" v-for="a in attributes" :key="a.name">
          <td class="td-table1_a">
            <p class="p-p4">
              <span class="s-t1">{{a.name}}</span>&nbsp;
            </p>
          </td>
          <td class="td-table1_a td-bottom-border">
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
          <td class="td-table1_a">
            <p class="p-p4">
              <span class="s-t1">Масштаб</span>&nbsp;
            </p>
          </td>
          <td class="td-table1_a td-bottom-border">
            <p class="p-p6">
              <span class="s-t1">1:{{activeScale ? activeScaleHumanize : '-'}}</span>&nbsp;
            </p>
          </td>
        </tr>
      </table>
      <p class="p-p3">&nbsp;</p>
      <div class="plot-ngw-map">
        <plot-ngw-map
          v-if="lesids"
          class
          ref="PlotNgwMap"
          :fit="!bounds"
          :resourcesIds="lesids"
          :webmap="webmap"
          :layersOptions="layersOptions"
        ></plot-ngw-map>
      </div>
      <p class="p-p9">&nbsp;</p>
      <p class="p-p9">&nbsp;</p>
      <p class="p-p9">&nbsp;</p>

      <SheetFooterAttribution :inputAttributions="inputAttributions"></SheetFooterAttribution>
    </div>
  </v-sheet>
</template>

<script lang="ts" src="./ThirdSheetLayout.ts">
</script>


<style scoped>
.plot-ngw-map {
  width: 100%;
  height: 600px;
  border-radius: 0;
}

.calibre {
  display: block;
  font-size: 0.75em;
  margin-top: 1cm;
  margin-left: 1cm;
  margin-right: 1cm;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 1cm;
}
</style>
