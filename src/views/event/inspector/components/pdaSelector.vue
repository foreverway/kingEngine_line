<template>
  <div class="pdaSelector">
    <el-input
      v-model="id"
      placeholder="请选择PDA"
      :disabled="disabled"
      @focus="handleFocus"
    >
      <i
        slot="suffix"
        class="el-input__icon el-icon-search"
      />
    </el-input>
    <el-dialog
      v-dialog-drag
      title="选择PDA"
      :visible.sync="showSelectDialog"
      width="600px"
      :append-to-body="true"
    >
      <div style="height: 300px">
        <el-scrollbar
          class="ke-scrollbar"
          style="height:100%"
        >
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            stripe
            @row-click="handleClickRow"
          >
            <el-table-column
              label="IEMI号"
              prop="imei"
              align="center"
            />
            <el-table-column
              label="城管通号"
              prop="num"
              align="center"
            />
            <el-table-column
              label="版本"
              prop="version"
              align="center"
            />
            <el-table-column
              label="使用情况"
              prop="pdaStatus"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.pdaStatus | dictFilter(statusDict) }}
              </template>
            </el-table-column>
            <el-table-column
              label="用途"
              prop="pdaUse"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.pdaStatus | dictFilter(useDict) }}
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <div class="footer">
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper,sizes"
          :total="total"
          :page-sizes="[10,20,30,50,100]"
          :page-size.sync="params.rows"
          :current-page.sync="params.page"
          @current-change="handlePage"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
  filters: {
    dictFilter: function(val,dict){
      for (let i of dict){
        if (i.dictValue === val){
          return i.dictName
        }
      }
    }
  }
})
export default class PdaSelector extends Vue {
  @Prop({ default: '' }) pdaId:any
  @Prop({ default: false }) disabled:any
  private id: any = ''
  private params = {
    page: 1,
    rows: this.$base.grid.page
  }
  private total: number = 0
  private showSelectDialog: boolean = false
  private useDict: Array<any> =[]
  private statusDict: Array<any> = []
  private tableData: Array<any> = []
  private loading: boolean = true
  created(){
    this.handleGetUseDict()
    this.handleGetStatusDict()
    this.initTableData()
  }
  mounted(){
    this.id = this.pdaId
  }
  @Watch('pdaId')
  handlePdaChange(newVal,oldVal){
    this.id = newVal
  }

  private handlePage(val): void {
    this.params.page = val
    this.initTableData()
  }
  private handleFocus(){
    if (this.disabled){
      return false
    }
    this.showSelectDialog = true
  }
  private initTableData(){
    this.$http({
      url: '/obs/observer/findAllPdaByPage',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.tableData = res.rows
      this.$nextTick(() => {
        this.loading = false
      })
    })
  }
  async handleGetStatusDict(){
    let res = await this.$base.dict.getItems('obs_pda_status')
    this.statusDict = res
  }
  async handleGetUseDict(){
    let res = await this.$base.dict.getItems('obs_pda_use')
    this.useDict = res
  }
  private handleClickRow(row: any){
    this.$emit('update:pdaId',row.id)
    this.id = row.id
    this.showSelectDialog = false
  }
}
</script>

<style lang="scss">
.footer{
  height: 40px !important;
}
</style>
