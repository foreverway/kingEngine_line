<template>
  <event :type-id="3" />
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import event from './main.vue'
@Component({
  components: {
    event
  }
})
export default class extends Vue {
 
}
</script>
 
<style lang="scss" scoped>
</style>
