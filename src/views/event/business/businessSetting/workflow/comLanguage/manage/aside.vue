<template>
  <div
    class="nav-wrapper ke-body"
    :class="{
      'w190': !show, 'w30': show
    }"
  >
    <header>
      <span v-show="!show">流程列表</span>
      <i
        class="el-icon-arrow-left"
        @click="show = !show"
      />
    </header>
    <el-collapse
      v-model="activeName"
      accordion
      :data="items"
    >
      <div
        v-for="(item,index) in items"
        :key="index"
        @click="getTableData(index,items)"
      >
        <el-collapse-item
          :title="item.processDefinitionName"
          :name="index"
        >
          <div>
            <el-table
              :data="tableData"
              border
              fit
              highlight-current-row
              style="width: 100%"
              @row-click="handleClickRow"
            >
              <el-table-column
                align="center"
                label="起始流程"
                prop="source.activityName"
                width="140"
              />
              <el-table-column
                align="center"
                label="操作"
                width="68"
              >
                发送至
              </el-table-column>
              <el-table-column
                align="center"
                label="结束流程"
                prop="target.activityName"
              />
            </el-table>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'App'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  private params: any= {
    allVersion: true
  }
  private show: boolean = false
  // 列表数据
  private tableData: Array<any> = []

  created() {
    this.load()
  }
  data() {
    return {
      activeName: 0
    }
  }
  private items: Array<any> = []
  private load(): void {
    this.$http.request({
      url: '/event/queryAllFlowData',
      method: 'post',
      data: this.params
    }).then((res: any) => {
      this.items = res.rows
    })
  }
  // 获取流程环节
  private getTableData(index:any, items:any):void{
    this.$http.request({
      url: `/workTache/getWorkTacheList?processDefinitionKey=${items[index].processDefinitionKey}`,
      method: 'get',
      data: {}
    }).then((res: any) => {
      this.tableData = res.rows
    })
  }
  // 选中行时
  private handleClickRow(row: any) {
    console.log(row)
    // this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
}
</script>
<style lang="scss" scoped>
.w190{
  width: 381px;
  transition: all linear 0.4s;
}
.w30{
  width: 30px;
  transition: all linear 0.4s;
}
.nav-wrapper{

  header{
    display: flex;
    justify-content: space-between;
    color: #4a5460;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 30px;
    i{
      font-weight: 600;
      cursor: pointer;
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      border-radius: 2px;
      &:hover{
        background-color: rgb(238, 238, 238);
      }
    }
  }
}
</style>
