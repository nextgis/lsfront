<template>
  <div>
    <div v-for="c in catalog" :key="c.title">
      <v-container fluid grid-list-md>
        <v-flex tag="h1" class="headline pb-2">{{c.title}}</v-flex>
        <v-layout row wrap>
          <v-flex v-for="card in c.cards" :key="card.id" class="ma-2 catalog-card" >
            <catalog-card :card="card" ></catalog-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts" src="./CatalogList.ts">
</script>


<style lang="css" scoped>
.catalog-card {
  max-width: 550px;
}
</style>
