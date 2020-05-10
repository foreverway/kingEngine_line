<template>
  <el-dialog
    :append-to-body="true"
    :title="dialog.title"
    width="680px"
    :visible.sync="dialog.visible"
  >
    <el-form>
      <el-form-item label="选择班次">
        <el-row>
          <el-col :span="8">
            <el-select
              v-model="selectId"
            >
              <el-option
                v-for="(item,index) in dialog.classes"
                :key="index"
                :label="item.cname"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
   
    <el-transfer
      v-model="value"
      filterable
      style="height:400px"
      :titles="['可选工作人员 ', '已选工作人员']"
      :props="{
        key: 'id',
        label: 'userName'
      }"
      :data="data"
    />
    <div
      slot="footer"
      class="dr-dialog-footer"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取 消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmit('ruleForm')"
      >
        <svg-icon name="save" />确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop() private dialog:any
  private loading:boolean=false
  private data: Array<any> = []
  private value: Array<any> = []
  private selectId:any=''
  created() {
    this.initData()
    this.selectId = this.dialog.id
  }
  // 初始化
  private async initData() {
    await this.$http.request({
      url: '/evt/operatorWorkSchedule/findWorkScheduleByWorkDateAndNo',
      method: 'post',
      data: {
        workDate: this.dialog.date,
        workNoId: this.dialog.id
      }
    }).then((res:any) => {
      res.data.map((item,index) => {
        this.value.push(item.operatorUser)
      })
    })

    await this.$http.request({
      url: '/evt/operatorWorkSchedule/findUserScheduleList',
      method: 'post'
    })
      .then((res:any) => {
        this.data = res.data
      })
  }
  private handleSubmit() {
    if (this.value.length === 0){
      this.$base.win.msg('没有选择排班人员')
    } else {
      let result:Array<any> = []
      for (const key in this.data) {
        if (this.value.indexOf(this.data[key].id) > -1){
          result.push(this.data[key].id)
        }
      }
      let params:any = {
        operatorUsers: result,
        workDate: this.dialog.date,
        workNoId: this.selectId
      }
      this.$http.request({
        url: '/evt/operatorWorkSchedule/addOperatorWorkSchedule',
        data: params
      }).then((res:any) => {
        if (res.code === 200){
          this.$emit('setItem')
          this.handleCancel()
        }
      })
  
    }
  }
  private handleCancel(): void {
    this.$emit('update:dialog', {
      visible: false
    })
  }
}
</script>
<style scoped>

</style>
