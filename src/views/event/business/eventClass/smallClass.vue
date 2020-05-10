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
        prop="classCode"
        label="编码"
        width="200"
      />
      <el-table-column
        prop="className"
        label="名称"
        width="200"
      />
      <el-table-column
        prop="orderNo"
        label="排序号"
        width="70"
      />
      <el-table-column
        prop="disposeTimeA"
        label="一般性处置时限（时）"
        width="300"
      />
      <el-table-column
        prop="disposeTimeB"
        label="工程性处置时限（时）"
        width="300"
      />
      <el-table-column
        prop="disposeTimeC"
        label="特殊性处置时限（时）"
        width="300"
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
      width="500px"
    >
      <el-form
        ref="classSetting"
        label-position="right"
        class="ke-form"
        :rules="rules"
        label-width="150px"
        :model="classSetting"
      >
        <el-form-item
          label="名称"
          prop="className"
        >
          <el-input v-model="classSetting.className" />
        </el-form-item>
        <el-form-item
          label="编码"
          prop="classCode"
        >
          <el-input v-model="classSetting.classCode" />
        </el-form-item>
        <el-form-item
          label="主管部门联系人"
          prop="directorPerson"
        >
          <el-input v-model="classSetting.directorPerson" />
        </el-form-item>
        <el-form-item
          label="上班时段(开始)"
          prop="worktimeStart"
        >
          <el-input v-model="classSetting.worktimeStart" />
        </el-form-item>
        <el-form-item
          label="上班时段(结束)"
          prop="worktimeEnd"
        >
          <el-input v-model="classSetting.worktimeEnd" />
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="orderNo"
        >
          <el-input v-model="classSetting.orderNo" />
        </el-form-item>
        <el-form-item
          label="部件图层号"
          prop="partsIndex"
        >
          <el-input v-model="classSetting.partsIndex" />
        </el-form-item>
        <!--<el-form-item label="类型" prop="type">-->
        <!--<el-select v-model="commonLanguage.type" placeholder="请选择类型">-->
        <!--<el-option label="系统" value="1"></el-option>-->
        <!--<el-option label="个人" value="2"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item
          label="是否核实"
          prop="isverify"
        >
          <el-checkbox-group v-model="classSetting.isverify">
            <el-checkbox
              label=""
              name="isverify"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="核实时限"
          prop="verifyTime"
        >
          <el-input v-model="classSetting.verifyTime" />
        </el-form-item>
        <el-form-item
          label="是否核查"
          prop="ischeck"
        >
          <el-checkbox-group v-model="classSetting.ischeck">
            <el-checkbox
              label=""
              name="ischeck" 
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="核查时限"
          prop="checkTime"
        >
          <el-input v-model="classSetting.checkTime" />
        </el-form-item>
        <el-form-item
          label="启用一般性处置时限"
          prop="use_disposeTimeA"
        >
          <el-checkbox-group v-model="classSetting.use_disposeTimeA">
            <el-checkbox
              label=""
              name="use_disposeTimeA" 
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="一般性处置时限"
          prop="disposeTimeA"
        >
          <el-input v-model="classSetting.disposeTimeA" />
        </el-form-item>
        <el-form-item
          label="启用工程性处置时限"
          prop="use_disposeTimeB"
        >
          <el-checkbox-group v-model="classSetting.use_disposeTimeB">
            <el-checkbox
              label=""
              name="use_disposeTimeB" 
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="工程性处置时限"
          prop="disposeTimeB"
        >
          <el-input v-model="classSetting.disposeTimeB" />
        </el-form-item>
        <el-form-item
          label="启用特殊性处置时限"
          prop="use_disposeTimeC"
        >
          <el-checkbox-group v-model="classSetting.use_disposeTimeC">
            <el-checkbox
              label=""
              name="use_disposeTimeC"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="特殊性处置时限"
          prop="disposeTimeC"
        >
          <el-input v-model="classSetting.disposeTimeC" />
        </el-form-item>
        <el-form-item
          label="是否申请不设时限"
          prop="is_usetime"
        >
          <el-checkbox-group v-model="classSetting.is_usetime">
            <el-checkbox
              label=""
              name="is_usetime" 
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="是否估算时限"
          prop="isreckon"
        >
          <el-checkbox-group v-model="classSetting.isreckon">
            <el-checkbox
              label=""
              name="isreckon" 
            />
          </el-checkbox-group>
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
    name: 'classSetting'
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
    // 搜索数据源
    private searchData: object = {
      name: '',
      tel: '',
      sex: ''
    }
    // 表单
    private classSetting: any = {}
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
        url: '/eventClass/findEventClassSettingByPage?param.parentId=1',
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
      this.classSetting = {}
    }
    private handleEdit(index: number, row: any): void{
      this.dialog.title = '修改区域'
      this.dialog.visible = true
      this.classSetting = this.shallowCopy(row)
    }
    private handleSave():void {
      let form = this.$refs.classSetting as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          this.$http.request({
            url: '/eventClass/addOrUpdateEventClassSetting',
            method: 'post',
            data: this.classSetting
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
      this.searchData = {}
    }
    private async handleSearch() {
      this.$base.win.msg('查询成功', 'success')
      this.items = await this.$http.request({
        url: '/eventClass/findEventClassSettingByPage?param.parentId=1',
        method: 'post',
        data: this.searchData
      })
    }
    private handleDelete(index: number, row: any): void {
      this.$base.win.confirm('你确定删除？').then(() => {
        this.$http.request({
          url: '/eventClass/delEventClass',
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
