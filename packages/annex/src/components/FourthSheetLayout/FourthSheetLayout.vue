<template>
  <RestoreError v-if="isError"></RestoreError>
  <v-sheet v-else :elevation="3" color="white" class="sheet-layout mx-auto" height="1133" width="804" light>
    <div class="calibre" id="calibre_link-0">
      <p class="p-p">
        <span class="s-t">Приложение 4</span>&nbsp;
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
        <span class="s-t1">Cхема(ы) размещения лесосеки, объекта лесной инфраструктуры,</span>&nbsp;
      </p>
      <p class="p-p2">
        <span class="s-t1">лесоперерабатывабщей инфраструктуры и объекта, несвязанного</span>&nbsp;
      </p>
      <p class="p-p2">
        <span class="s-t1">с созданием лесной инфраструктуры в {{year}}г.</span>&nbsp;
      </p>
      <p class="p-p2">
        <span class="s-t1" v-if="ngwMap && plot">{{properties.REG}}, {{properties.MUN}}</span>&nbsp;
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
              <span class="s-t1" v-if="ngwMap && properties[a.field]">{{properties[a.field]}}</span>
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
              <select v-model="sheetScale">
                <option v-for="(item, i) in selectScaleItems" :value="item.value" :key="i">{{item.text}}</option>
              </select>
            </p>
            <!-- <p class="p-p6">
              <span class="s-t1">1:{{sheetScale ? activeScaleHumanize : '-'}}</span>&nbsp;
            </p>-->
          </td>
        </tr>
      </table>
      <p class="p-p3">&nbsp;</p>

      <v-row class="map-block">
        <v-col class="map-block-col" cols="7">
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
        </v-col>
        <v-col class="map-block-col" cols="5">
          <div class="map-table-container">
            <table class="t-table_map">
              <tr class="tr-table1_">
                <td class="td-table1_a">
                  <p class="p-p5">
                    <span class="s-t1">Площадь общая, га</span>
                  </p>
                </td>
                <td class="td-table1_a">
                  <p class="p-p5">
                    <span class="s-t1">Площадь эксплуатационная, га</span>
                  </p>
                </td>
              </tr>

              <tr class="tr-table1_">
                <td class="td-table1_a">
                  <p class="p-p5">
                    <span class="s-t1">{{properties.AREA_REAL || '-'}}</span>
                  </p>
                </td>
                <td class="td-table1_a">
                  <p class="p-p5">
                    <span class="s-t1">{{properties.AREA_OPER || '-'}}</span>
                  </p>
                </td>
              </tr>
            </table>
          </div>
          <div class="map-table-container">
            <GeodesyTableComponent
              v-if="plotNgwMap"
              :plotNgwMap="plotNgwMap"
              :turnPointsLayerId="turnPointsLayerId"
              :referencePointLayerId="referencePointLayerId"
            ></GeodesyTableComponent>
          </div>
        </v-col>
      </v-row>

      <p class="p-p9">&nbsp;</p>
      <p class="p-p9">&nbsp;</p>
      <p class="p-p9">&nbsp;</p>

      <SheetFooterAttribution :inputAttributions="inputAttributions"></SheetFooterAttribution>
    </div>
  </v-sheet>
</template>

<script lang="ts" src="./FourthSheetLayout.ts">
</script>


<style scoped>
.map-block {
  height: 600px;
}

.map-table-container {
  height: 50%;
}

.plot-ngw-map {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
</style>
