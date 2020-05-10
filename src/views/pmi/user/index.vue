<template>
  <div class="ke-body">
    <el-form
      class="ke-search"
      label-width="80px"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item label="用户名">
            <el-input
              v-model="searchData.name"
              placeholder="请输入用户名"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="5"
          class="label"
        >
          <el-form-item label="性别">
            <el-select
              v-model="searchData.sex"
              placeholder="请选择"
            >
              <el-option
                v-for="sex in sexs"
                :key="sex.dictValue"
                :label="sex.dictName"
                :value="sex.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="5"
          class="label"
        >
          <el-form-item label="联系电话">
            <el-input
              v-model="searchData.tel"
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="用户名">
            <el-input
              v-model="searchData.name"
              placeholder="请输入用户名"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="5"
          class="label"
        >
          <el-form-item label="性别">
            <el-select
              v-model="searchData.sex"
              placeholder="请选择"
            >
              <el-option
                v-for="sex in sexs"
                :key="sex.dictValue"
                :label="sex.dictName"
                :value="sex.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="5"
          class="label"
        >
          <el-form-item label="联系电话">
            <el-input
              v-model="searchData.tel"
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="9"
          class="buttons"
        >
          <el-button
            type="primary"
            @click="handleSearch"
          >
            查询
          </el-button>
          <el-button
            type="warning"
            @click="handleReset"
          >
            重置
          </el-button>
          <el-button
            type="success"
            @click="handleCreate"
          >
            新增
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="items"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="50"
        label=""
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
      />
      <el-table-column
        prop="sex"
        label="姓别"
        width="80"
      />
      <el-table-column
        prop="age"
        label="年龄"
        width="80"
      />
      <el-table-column
        prop="tel"
        label="联系电话"
        width="150"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
      <el-table-column
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
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
        ref="ruleForm"
        label-position="right"
        class="ke-form"
        :rules="rules"
        label-width="80px"
        :model="form"
      >
        <el-form-item
          label="姓名"
          prop="name"
        >
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item
          label="性别"
          prop="sex"
        >
          <el-input v-model="form.sex" />
        </el-form-item>
        <el-form-item
          label="年龄"
          prop="age"
        >
          <el-input v-model="form.age" />
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="tel"
        >
          <el-input v-model="form.tel" />
        </el-form-item>
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
  name: 'User'
})
export default class extends Vue {
  // 验证
  private rules: any = {
    name: [
      { required: true, message: '请输入用户名' }
    ]
  }
  // 下拉
  private sexs: IDict[] = []
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 表格数据源
  private items: Array<any> = []
  // 搜索数据源
  private searchData: object = {
    name: '',
    tel: '',
    sex: ''
  }
  // 表单
  private form: any = {}
  // 弹框控制
  private dialog: any = {
    title: '',
    visible: false
  }
  async created() {
    this.load(1)
    this.sexs = await this.$base.dict.getItems('sex')
  }
  private load(page: number): void{
    this.listLoading = true
    this.$http.request({
      url: 'pmi/user/index',
      method: 'post',
      data: {
        page: page,
        rows: this.$base.grid.page
      }
    }).then((res: any) => {
      this.items = res.data
      this.listLoading = false
    })
  }
  private handlePage(currentPage: number): void {
    this.$base.win.msg(`第${currentPage}页`)
    this.load(currentPage)
  }
  private handleCreate(): void{
    this.dialog.title = '新增用户'
    this.dialog.visible = true
    this.form = {}
  }
  private handleEdit(index: number, row: any): void{
    this.dialog.title = '修改用户'
    this.dialog.visible = true
    this.form = this.shallowCopy(row)
  }
  private handleSave():void {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        this.$http.request({
          url: '/users/info',
          method: 'post',
          data: this.form
        }).then((res: any) => {
          if (res.code === 1) {
            this.load(1)
          }
          this.$base.win.msgJson(res)
        })
        form.resetFields()
        this.dialog.visible = false
      } else {
        // this.$base.win.msg('必填项不能为空')
        return false
      }
    })
  }
  private handleReset(): any {
    this.$base.win.msg('重置成功','success')
    this.searchData = {}
  }
  private async handleSearch() {
    this.$base.win.msg('查询成功','success')
    this.items = await this.$http.request({
      url: '/users/info',
      method: 'post',
      data: this.searchData
    })
  }
  private handleDelete(index: number, row: any): void {
    this.$base.win.confirm('你确定删除？').then(() => {
      this.$http.request({
        url: '/users/info',
        method: 'post',
        data: row
      }).then((res: any) => {
        this.load(1)
      }).catch(() => { })
    }).catch(() => { })
  }
  // 关闭弹出框时清空表单和验证
  @Watch('dialog.visible')
  private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
    if (val === false) {
      (this.$refs.ruleForm as ElForm).resetFields()
      this.$base.win.msg('关闭')
    }
  }
  private shallowCopy(src: Array<any>): any {
    let res: any = {}
    for (let prop in src) {
      if (src.hasOwnProperty(prop)) {
        res[prop] = src[prop]
      }
    }
    return res
  }
}
</script>

<style lang="scss" scoped>

</style>
