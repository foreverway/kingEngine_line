<template>
  <div
    v-loading="loading"
    class="basic"
  >
    <el-form
      ref="eventClass"
      :model="tableData"
      :rules="rules"
      label-width="100px"
    >
      <!-- {{ tableData }} -->
      <el-form-item
        label="角色名称"
        prop="roleName"
      >
        <el-input
          v-model="tableData.roleName"
          placeholder="请输入角色名称"
          maxlength="32"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        label="角色编码"
        prop="roleCode"
      >
        <el-input
          v-model="tableData.roleCode"
          placeholder="请输入角色编码"
          maxlength="32"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        label="排序号"
        prop="orderNo"
      >
        <el-input
          v-model.trim="tableData.orderNo"
          placeholder="请输入排序号"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="角色类型"
        prop="openType"
      >
        <!-- <ke-dict 
          v-model="tableData.roleType" 
          type="select"
          code="jslx"
        /> -->
        <el-select
          ref="tree"
          :value="text"
          clearable
          placeholder="请选择角色类型"
          @clear="handleClear"
        >
          <el-option
            :value="tableData.roleType"
            style="height: auto"
          >
            <el-tree
              ref="treeCascader"
              :data="roleType"
              node-key="id"
              :expand-on-click-node="false"
              highlight-current
              :props="defaultPropst"
              @current-change="handleCheckChange"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="所属区域"
        prop="areaId"
      >
        <ke-tree
          v-model="tableData.areaId"
          placeholder="请选择所属区域"
        />
      </el-form-item>
      <!-- <el-form-item
        label="状态"
        prop="dbStatus"
      >
        <el-radio-group v-model="tableData.dbStatus">
          <el-radio
            v-for="(item, i) in dbStatusOptions"
            :key="i"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>-->
      <el-form-item
        label="备注"
        prop="note"
      >
        <el-input
          v-model="tableData.note"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { METHODS } from 'http'
@Component({
  name: 'Basic'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: String, default: '' }) activeName !: string
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = true
  private text: String = ''
  private roleType: any = []
  //  [{
  //   label: '一级 1',
  //   id: '1',
  //   children: [{
  //     label: '二级 1-1',
  //     id: '2',
  //     children: [{
  //       label: '三级 1-1-1',
  //       id: '3'
  //     }]
  //   }]
  // }]
  private defaultPropst: any= {
    children: 'children',
    label: 'dictName',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private defaultProps: any= {
    children: 'children',
    label: 'areaName',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  };
  private observerOptions: Array<any> = [
    {
      value: 1,
      label: '是'
    },
    {
      value: 0,
      label: '否'
    }
  ];
  private dbStatusOptions: Array<any> = [
    {
      value: 1,
      label: '正常'
    },
    {
      value: 0,
      label: '删除'
    }
  ];
  private rules: object = {
    roleName: [
      {
        required: true,
        pattern: '[^ \x22]+',
        message: '请输入角色名称',
        trigger: 'change'
      }
    ],
    roleCode: [
      {
        required: true,
        pattern: '[^ \x22]+',
        message: '请输入角色编码',
        trigger: 'change'
      }

      // validator: this.validateRoleCode,
    ],
    note: [{ max: 400, message: '描述不能超过400个字符', trigger: 'blur' }],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      {
        validator(rule, value, callback) {
          if (
            Number.isInteger(Number(value)) &&
            (Number(value) > 0 || Number(value) === 0)
          ) {
            callback()
          } else {
            callback(new Error('请输入大于等于0的数字'))
          }
        },
        trigger: 'change'
      }
    ]
  };
  private validateRoleCode(rule: any, value: string, callback: any) {
    if (!value) {
      return callback(new Error('请输入角色编码'))
    }
    this.hasRoleCode(value).then((res: any) => {
      if (res) {
        let reg = /^[0-9a-zA-Z]+$/
        if (reg.test(value)) {
          return callback()
        }
        return callback(new Error('角色编码格式不正确'))
      }
      return callback(new Error('角色编码存在'))
    })
  }
  created() {
    this.formateData()
    this.getRoleType()
    this.loading = false
  }
  private hasRoleCode(code: string): any {
    // 验证角色编码是否存在
    return this.$http
      .request({
        url: '/role/validRoleCode',
        method: 'post',
        data: {
          roleCode: code
        }
      })
      .then((res: any) => {
        return true
      })
      .catch((err: any) => {
        console.log(err)
        return false
      })
  }
  async getRoleType() {
    debugger
    // this.roleType = await this.$base.dict.getItems('jslx')
    // console.log(this.roleType)
  }
  private formateData(): void {
    let data = this.tableData
    console.log(this.tableData)
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.eventClass as ElForm
      form.validate(async (valid: boolean) => {
        if (valid) {
          this.$emit('update:selectionItem', this.tableData)
          resolve()
        } else {
          this.$emit('update:activeName', 'first')
          // this.$base.win.msg('必填项不能为空')
          return false
        }
      })
    })
    return res
  }
  handleCheckChange(data:any, node:any) {
    (this.$refs.tree as any).blur()
    this.text = data.label
    this.tableData.roleType = data.id
    debugger
    // this.$emit('change', data, this.$refs.tree)
  }
  handleClear(){
    // this.$emit('input', '')
    this.tableData.roleType = ''
    this.text = ''
  }
  @Watch('selectionItem')
  private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
    this.tableData = val
  }
}
</script>

<style lang="scss" scoped>
.basic {
  height: 380px;
}
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
.el-input,
.el-select,
.el-cascader {
  width: 100%;
}
// .el-tabs__content{
//   padding: 0 40px;
//   box-sizing: border-box;
//   height: 350px;
// }
</style>
