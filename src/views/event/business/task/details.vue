<template>
  <el-dialog
    :title="dialog.title"
    width="850px"
    :visible.sync="dialog.visible"
  >
    <event-details
      class="details"
      :row="row"
    />
    <footer>
      <span>当前环节：<span class="bold">办理登记</span> </span>
      <span>已用时间：<span class="orange">20分18秒</span> </span>
      <span>上一环节：（案件登记） </span>
      <span>办理意见：无 </span>
    </footer>
  </el-dialog>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import EventDetails from './components/details.vue'

@Component({
  components: {
    EventDetails
  }
})
export default class extends Vue {
  @Prop() private dialog:any
  private row:any={}
  created(){
    this.load()
  }
  load(){
    this.$http.post('evt/event/getToDoEventDetails',{id: this.dialog.data.id}).then((res:any) => {
      this.row = res.data
    })
  }
}
</script>

<style lang="scss" scoped>
footer{
  display: flex;
  justify-content: space-between;
  padding-top: 14px;
  margin-top: 20px;
  border-top:1px solid #CCCCCC;
}
.bold{
  font-weight: bold;
}
.orange{
  color: #FFBA00;
  font-weight: bold;
}
.details{
  .tabs{
    .el-tab-pane{
        overflow: auto;
        height:440px!important;
    }
  }
}
</style>
