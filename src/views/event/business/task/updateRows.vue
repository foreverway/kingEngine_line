<template>
  <div class="list">
    <el-table
      ref="table"
      v-loading="loading"
      :data="items"
      stripe
      height="100%"
      style="width: 96%"
    >
      <el-table-column
        type="index"
        width="40"
        fixed
      />
      <el-table-column
        prop="modifyUser"
        label="操作员"
        width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createTime"
        label="修改时间"
        align="left"
        header-align="left"
        show-overflow-tooltip
      />
      <el-table-column
        prop="id"
        label=""
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleOpen(scope.row.id)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <event-update
      v-if="dialog.visible"
      :dialog.sync="dialog"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  components: {
    EventUpdate: () => import('./components/eventUpdate.vue')
  }
})
export default class extends Vue {
    private loading: boolean = true
    private items: Array<any> = []
    private dialog: any = {
      title: '案件修改记录对比',
      visible: false
    }
     @Prop({default: 0}) private id!:number
     private created(){
       this.load()
     }
     private load(){
       this.$http.post('evt/modifyLog/findModifyLogPageByEventId',{id: this.id}).then((res:any) => {
         this.items = res.rows
         this.loading = false
       })
     }
     private handleOpen(id:number):void{
       this.dialog.visible = true
       this.dialog.data = id
     }
}
</script>
 
<style lang="scss" scoped>
.list{
  height:460px;
  overflow: hidden;
}
</style>
