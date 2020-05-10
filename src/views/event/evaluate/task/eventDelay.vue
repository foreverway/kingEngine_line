<template>
  <div class="ke-body">
    <el-row class="ke-search">
      <el-col
        :span="2"
        class="label"
      >
        智慧城管
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="param.year"
          placeholder="请选择年份"
        >
          <el-option
            v-for="year in years"
            :key="year.dictValue"
            :label="year.dictName"
            :value="year.dictValue"
          />
        </el-select>
      </el-col>
      <el-col
        :span="1"
        class="label"
      >
        字第
      </el-col>
      <el-col :span="2">
        <el-input />
      </el-col>
      <el-col
        :span="1"
        class="label"
      >
        号
      </el-col>
      <el-col
        :span="9"
        class="buttons"
      >
        <el-button
          type="primary"
          icon="el-icon-search"
        >
          查询
        </el-button>
        <el-button type="warning">
          <svg-icon name="reset" />重置
        </el-button>
        <el-button
          type="success"
          @click="handleCreate"
        >
          审核
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="items"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="40"
      />
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column
        prop="eventCodeStr"
        label="案件号"
        width="200"
      />
      <el-table-column
        prop="applyTypeStr"
        label="申请类型"
        width="200"
      />
      <el-table-column
        prop="applyTime"
        label="申请时间"
        width="200"
      />
      <el-table-column
        prop="applyName"
        label="申请人"
        width="200"
      />
      <el-table-column
        prop="deptName"
        label="申请单位"
        width="200"
      />
      <el-table-column
        prop="applyReason"
        label="申请理由"
      />
    </el-table>
    <el-pagination
      background
      class="ke-page"
      layout="prev, pager, next,total,jumper"
      :total="1000"
      @current-change="handlePage"
    />
    <div class="ke-clear" />
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="440px"
    >
      <el-form
        ref="eventDelay"
        label-position="right"
        class="ke-form"
        :rules="rules"
        label-width="80px"
        :model="eventDelay"
      >
        <el-form-item
          label="名称"
          prop="className"
        >
          <el-input v-model="eventDelay.className" />
        </el-form-item>
        <el-form-item
          label="编码"
          prop="classCode"
        >
          <el-input v-model="eventDelay.classCode" />
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="orderNo"
        >
          <el-input v-model="eventDelay.orderNo" />
        </el-form-item>
        <!--<el-form-item label="类型" prop="type">-->
        <!--<el-select v-model="commonLanguage.type" placeholder="请选择类型">-->
        <!--<el-option label="系统" value="1"></el-option>-->
        <!--<el-option label="个人" value="2"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import IDict from '@/interface/dict'
  @Component({
    name: 'eventDelay'
  })
export default class extends Vue {
    // 验证
    private rules: any = {
      // className: [
      //   { required: true, message: '请输入名称' }
      // ],
      // classCode: [
      //   { required: true, message: '请输入编码' }
      // ]
    }
    // 表格数据是否正在加载
    private listLoading: boolean = true
    // 表格数据源
    private items: Array<any> = []
    private years: IDict[] = []
    // 搜索数据源
    private param: object = {
      name: '',
      year: '',
      sex: ''
    }
    // 表单
    private eventDelay: any = {}
    // 弹框控制
    private dialog: any = {
      title: '',
      visible: false
    }
    async created() {
      this.load(1)
      this.selectLoad()
    }
    private async selectLoad() {
      this.years = await this.$base.dict.getItems('year')
    }
    private load(page: number): void{
      this.listLoading = true
      this.$http.request({
        url: '/eventDelay/findEventDelayByPage',
        method: 'post',
        data: {
          page: page,
          rows: this.$base.grid.page
        }
      }).then((res: any) => {
        console.log(res)
        this.items = res.rows
        this.listLoading = false
      })
    }
    private handlePage(currentPage: number): void {
      this.$base.win.msg(`第${currentPage}页`)
      this.load(currentPage)
    }
    private handleCreate(): void{
      this.dialog.title = '新增区域'
      this.dialog.visible = true
      this.eventDelay = {}
    }
    private handleSave():void {
      let form = this.$refs.eventClass as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          this.$http.request({
            url: '/eventDelay/addEventDelay',
            method: 'post',
            data: this.eventDelay
          }).then((res: any) => {
            if (res.code === 1) {
              this.load(1)
            }
            this.$base.win.msgJson(res)
          })
          form.resetFields()
          this.dialog.visible = false
        } else {
          this.$base.win.msg('必填项不能为空')
          return false
        }
      })
    }
    private handleReset(): any {
      this.$base.win.msg('重置成功', 'success')
      this.param = {}
    }
    private async handleSearch() {
      this.$base.win.msg('查询成功', 'success')
      this.items = await this.$http.request({
        url: '/eventDelay/findEventDelayByPage',
        method: 'post',
        data: this.param
      })
    }
    // 关闭弹出框时清空表单和验证
    @Watch('dialog.visible')
    private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
      if (val === false) {
        (this.$refs.ruleForm as ElForm).resetFields()
        this.$base.win.msg('关闭')
      }
    }
}
</script>

<style lang="scss" scoped>

</style>
