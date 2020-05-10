<template>
  <div class="roles-wrapper">
    <!-- <el-input v-model="roles.name"></el-input> -->
    <el-transfer
      v-model="value"
      class="roles-el-transfer"
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: String, default: '' }) activeName !: string
  @Prop({ type: Array, default: [] }) roles !: any
  @Prop({ type: Number, default: 0 }) types !: number // 详情参数
  @Prop({ type: Number, default: 0 }) id !: number
  private pageName: string = '部门管理'
  private input: string = ''
  private value: any = []
  private rolesData: Array<any> = []
  created() {
    this.initData()
  }
  // 初始化角色数据
  private initData(): void {
    this.$http.request({
      url: '/pmi/role/list',
      method: 'get',
      params: {}
    }).then((res: any) => {
      let list = res.data
      if (this.types === 1){
        list.forEach((el: any ,i ) => {
          list[i].disabled = true
        })
      } 
      this.rolesData = list
    })
  }
  private initValue(): void {
    let data = this.$base.common.extend(this.roles)
    if (data.length) {
      data.forEach((ele: any) => {
        if (this.value.join(',').indexOf(ele.id) === -1) {
          this.value.push(ele.id)
        }
      })
    }
  }
  // 选中的时候数据变化
  private handleChange(value: any, direction: any, movedKeys: any) {
    let array:any = []
    value.forEach((els: any) => {
      array.push({ id: els })
    })
    this.$emit('update:roles', array)
  }
  // 处理选中的数据
  private formateDta(value: any, data: any) {
    let arr:any = []
    value.forEach((ele: any) => {
      data.forEach((els: any) => {
        if (ele === els.id) {
          arr.push(els.id)
        }
      })
    })
    return arr
  }
  private commitRoles() {
    let res = new Promise((resolve, reject) => {
      let selectValue = this.$base.common.extend(this.value)
      let selectRoles = this.formateDta(selectValue, this.rolesData)
      console.log(selectRoles)
      if (selectRoles.length === 0) {
        selectRoles = [0]
      }
      this.$emit('update:roles', selectRoles)
      resolve()
    })
    return res
  }
  @Watch('roles')
  private onDialogVisibleChanged(val: any, oldVal: boolean): void {
    if (this.id ) {
      this.initValue()
    } 
  }
}
</script>

<style lang="scss">
.roles-el-transfer{
  .el-transfer-panel{
    .el-transfer-panel__body{
      height: 300px;
    }
  }
}
</style>

<style lang="scss" scoped>
.roles-wrapper{
  // padding: 0 10px;
  box-sizing: border-box;
  height: 416px;
  // overflow-y: auto;
  // padding-left: 70px;
  // padding-top: 20px;
  // padding-bottom: 20px;
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
