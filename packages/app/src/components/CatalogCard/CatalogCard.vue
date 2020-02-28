<template>
  <v-card :color="card.color" dark>
    <v-img v-if="card.src" :src="card.src" height="200px"></v-img>

    <v-card-title primary-title dark>
      <div>
        <div class="headline">{{card.title}}</div>
        <span class="grey--text">{{card.description}}</span>
      </div>
    </v-card-title>

    <v-card-actions v-if="card.actions">
      <v-btn
        text
        v-for="(action, i) in getCardActions()"
        :key="i"
        @click="onCardActionClick(action)"
      >{{action.title}}</v-btn>

      <v-spacer></v-spacer>
      <v-btn v-if="card.info" icon @click="infoShow = !infoShow">
        <v-icon>{{ infoShow ? svg.mdiChevronDown : svg.mdiChevronUp }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-slide-y-transition>
      <v-card-text v-show="infoShow">{{card.info}}</v-card-text>
    </v-slide-y-transition>
  </v-card>
</template>

<script lang="ts" src="./CatalogCard.ts">
</script>


<style  >
</style>
