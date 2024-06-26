<template>
  <v-app class="mt-0">
      <main-wrapper />
  </v-app>
</template>

<script>
import { Component, Vue} from 'vue-property-decorator';
import MainWrapper from "./components/MainWrapper";

@Component({
  name: 'App',
  components: {MainWrapper}
})
export default class extends Vue {
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html {
  overflow-y: hidden !important;
}
</style>
