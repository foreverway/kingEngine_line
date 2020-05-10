<template>
  <div class="roles-wrapper">
    <!-- <el-input v-model="roles.name"></el-input> -->
    <el-transfer
      v-model="value"
      filterable
      style="text-align: left; display: block;"
      :titles="['可选择角色', '已选择角色']"
      :props="{
        key: 'id',
        label: 'roleName'
      }"
      :data="rolesData"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'AppRoleManagerRoles',
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Array, default: {} }) roles !: any
  private pageName: string = '部门管理'
  private input: string = ''
  private value: any = []
  private rolesData: Array<any> = []
  created() {
    this.initData()
    this.initValue()
  }
  // 初始化角色数据
  private initData(): void {
    this.$http.request({
      url: '/role/findRolesByPage',
      method: 'post',
      data: {
        name: ''
      }
    }).then((res: any) => {
      console.log(res)
      this.rolesData = res.rows
    })
  }
  private initValue(): void {
    let data = this.$base.common.extend(this.roles)
    if (data.length) {
      data.forEach((ele: any) => {
        this.value.push(ele.id)
      })
    }
  }
  // 选中的时候数据变化
  private handleChange(value: any, direction: any, movedKeys: any) {
    // console.log(value, direction, movedKeys)
    // let selectValue = this.$base.common.extend(value)
    // console.log(this.formateDta(selectValue, this.rolesData))
  }
  // 处理选中的数据
  private formateDta(value: any, data: any) {
    let arr:any = []
    value.forEach((ele: any) => {
      data.forEach((els: any) => {
        if (ele === els.id) {
          arr.push(els)
        }
      })
    })
    return arr
  }
  private commitRoles() {
    let res = new Promise((resolve, reject) => {
      // console.log(this.value)
      let selectValue = this.$base.common.extend(this.value)
      // console.log(this.formateDta(selectValue, this.rolesData))
      let selectRoles = this.formateDta(selectValue, this.rolesData)
      this.$emit('update:roles', selectRoles)
      resolve()
    })
    return res
  }
}
</script>
<style lang="scss" scoped>
.roles-wrapper{
  // padding: 0 10px;
  box-sizing: border-box;
  height: 350px;
  // overflow-y: auto;
  // padding-left: 70px;
  padding-bottom: 20px;
  .el-checkbox-group{
    .el-checkbox{
      display: block;
    }
  }
  // .el-transfer{
  //   width: 100%;
  // }
  // .el-transfer-panel{
  //   width: 45%;
  // }
}
</style>
