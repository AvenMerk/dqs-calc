<template>
  <main-table></main-table>
</template>

<script>
import MainTable from './MainTable.vue';
import {Component, Vue} from "vue-property-decorator";

@Component({
  name: "MainWrapper",
  components: {MainTable}
})

export default class MainWrapper extends Vue {

}
</script>

<style scoped>

</style>