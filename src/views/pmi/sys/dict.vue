<template>
  <div class="ke-body">
    <el-row class="ke-search">
      <el-col
        :span="9"
        class="buttons"
      >
        <el-button
          type="success"
          @click="handleCreate"
        >
          新增
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
        width="50"
        label=""
      />
      <el-table-column
        prop="dictName"
        label="名称"
        width="160"
      />
      <el-table-column
        prop="dictValue"
        label="值"
        width="120"
      />
      <el-table-column
        prop="createUserId"
        label="创建人"
        width="150"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="200"
      />
      <el-table-column
        prop="note"
        label="备注"
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
        ref="dictionary"
        label-position="right"
        class="ke-form"
        :rules="rules"
        label-width="80px"
        :model="dictionary"
      >
        <el-form-item
          label="名称"
          prop="dictName"
        >
          <el-input v-model="dictionary.dictName" />
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="orderNo"
        >
          <el-input v-model="dictionary.orderNo" />
        </el-form-item>
        <el-form-item
          label="值"
          prop="dictValue"
        >
          <el-input v-model="dictionary.dictValue" />
        </el-form-item>
        <el-form-item
          label="开启图标"
          prop="is_use_icon"
        >
          <el-checkbox-group v-model="dictionary.is_use_icon">
            <el-checkbox
              label=""
              name="is_use_icon"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="图标"
          prop="iconCss"
        >
          <el-input v-model="dictionary.iconCss" />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="note"
        >
          <el-input
            v-model="dictionary.note"
            type="textarea"
          />
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
  @Component({
    name: 'dictionary'
  })
export default class extends Vue {
    // 验证
    private rules: any = {
      // dictName: [
      //   { required: true, message: '请输入名称' }
      // ],
      // dictValue: [
      //   { required: true, message: '请输入字典值' }
      // ]
    }
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
    private dictionary: any = {}
    // 弹框控制
    private dialog: any = {
      title: '',
      visible: false
    }
    async created() {
      this.load(1)
    }
    private load(page: number): void{
      this.listLoading = true
      this.$http.request({
        url: '/dictionary/findDictionaryByPage',
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
      this.dictionary = {}
    }
    private handleEdit(index: number, row: any): void{
      this.dialog.title = '修改区域'
      this.dialog.visible = true
      this.dictionary = this.shallowCopy(row)
    }
    private handleSave():void {
      let form = this.$refs.dictionary as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          this.$http.request({
            url: '/dictionary/addOrUpdateDictionary',
            method: 'post',
            data: this.dictionary
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
      this.$base.win.msg('重置成功', 'success')
      this.searchData = {}
    }
    private async handleSearch() {
      this.$base.win.msg('查询成功', 'success')
      this.items = await this.$http.request({
        url: '/dictionary/findDictionaryByPage',
        method: 'post',
        data: this.searchData
      })
    }
    private handleDelete(index: number, row: any): void {
      this.$base.win.confirm('你确定删除？').then(() => {
        this.$http.request({
          url: '/dictionary/delDictionary',
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
