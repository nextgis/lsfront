<template>
<div>

  <table v-if="referencePointGeodesy" class="t-table_map geodesy-table reference-table">
    <tr class="tr-table1_">
      <td class="td-table1_a" colspan="5">
        <p class="p-p5">
          <span class="s-t1">Привязка</span>
        </p>
      </td>
    </tr>
    <tr class="tr-table1_" v-for="(g, i) in referencePointGeodesy" :key="i">
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">{{g.from.name}} - {{g.to.name}}</span>
        </p>
      </td>
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">{{g.direction}}</span>
        </p>
      </td>
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">{{g.distance}}</span>
        </p>
      </td>
    </tr>
  </table>

  <table class="t-table_map geodesy-table">
    <tr class="tr-table1_">
      <td class="td-table1_a" colspan="5">
        <p class="p-p5">
          <span class="s-t1">Лесосека</span>
        </p>
      </td>
    </tr>

    <tr class="tr-table1_">
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">№ лесосеки</span>
        </p>
      </td>
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">Площадь лесосеки</span>
        </p>
      </td>
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">№№ точек</span>
        </p>
      </td>
      <td class="td-table1_a">
        <p class="p-p5">
          <!-- <span class="s-t1">Направление линий (румб, А)</span> -->
          <span class="s-t1">Азимут</span>
        </p>
      </td>
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">длина линий, м</span>
        </p>
      </td>
    </tr>
    <tr class="tr-table1_" v-for="(g, i) in turnPointGeodesy" :key="i">
      <td class="td-table1_a">
        <!-- <p class="p-p5">
          <span class="s-t1">№ лесосеки</span>
        </p>-->
      </td>
      <td class="td-table1_a">
        <!-- <p class="p-p5">
          <span class="s-t1">Площадь лесосеки</span>
        </p>-->
      </td>
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">{{g.from.name}} - {{g.to.name}}</span>
        </p>
      </td>
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">{{g.direction}}</span>
        </p>
      </td>
      <td class="td-table1_a">
        <p class="p-p5">
          <span class="s-t1">{{g.distance}}</span>
        </p>
      </td>
    </tr>
  </table>
</div>
</template>

<script lang="ts" src="./GeodesyTable.ts">
</script>


<style scoped>
  .geodesy-table {
    font-size: 7pt;
  }

  .reference-table {
    width: 100%;
  }

  .reference-table tr:last-child td {
    border-bottom: none;
  }
</style>
