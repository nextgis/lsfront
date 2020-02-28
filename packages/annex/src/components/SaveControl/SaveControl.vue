<template>
  <v-speed-dial
    class="save-control"
    v-model="fab"
    :top="top"
    :bottom="bottom"
    :right="right"
    :left="left"
    :direction="direction"
    :open-on-hover="hover"
    :transition="transition"
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="blue darken-2" dark fab>
        <v-icon v-if="fab">{{svg.close}}</v-icon>
        <v-icon v-else>{{svg.tools}}</v-icon>
      </v-btn>
    </template>
    <v-btn fab dark small color="green" @click="save">
      <v-icon dark>{{svg.save}}</v-icon>
    </v-btn>
    <v-btn fab dark small color="indigo" @click="image">
      <v-icon dark>{{svg.image}}</v-icon>
    </v-btn>
    <!-- <v-btn fab dark small color="red" @click="remove">
      <v-icon dark>{{svg.remove}}</v-icon>
    </v-btn> -->
  </v-speed-dial>
</template>

<script lang="ts" src="./SaveControl.ts">
</script>


<style scoped>
.save-control {
  position: fixed;
}
</style>
