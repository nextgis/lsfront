<template>
  <div>
    <p class="p-p8">
      <span class="s-t1">
        Достоверность и полноту сведений, указанных на данной странице подтверждаю
      </span>&nbsp;
    </p>
    <p class="p-p9">&nbsp;</p>
    <table class="t-table1">
      <tr class="tr-table1_">
        <td class="td-table2_a td-bottom-border" v-for="a in inputAttributions" :key="a.name">
          <p class="p-p5">
            <span class="s-t1">{{a.value}}</span>&nbsp;
          </p>
        </td>
      </tr>
      <tr class="tr-table1_">
        <td class="td-table2_a" v-for="a in inputAttributions" :key="a.name">
          <p class="p-p5">
            <span class="s-t2">{{a.label}}</span>&nbsp;
          </p>
        </td>
      </tr>
    </table>
    <p class="p-p8">&nbsp;</p>
  </div>
</template>

<script lang="ts" src="./SheetFooterAttribution.ts">
</script>


<style scoped>
</style>
