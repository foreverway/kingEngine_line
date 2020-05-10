<template>
  <el-dialog
    :title="dialog.title"
    width="800px"
    :visible.sync="dialog.visible"
  >
    <flow :id="dialog.data.id" />
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import flow from './flow.vue'
@Component({
  components: {
    flow
  }
})
export default class extends Vue {
    @Prop()private dialog:any
}
</script>
 
<style lang="scss" scoped>

</style>
