<template>
  <div class="departmentTree">
    <el-select
      v-model="selectValue"
      placeholder="请选择部门"
      @change="handleSelectChange"
    >
      <el-option
        v-for="(item,index) in list"
        :key="index"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class DepartmentTree extends Vue {
  @Prop({default: ''}) value:any
  private list: Array<any> = []
  private selectValue: any = ''
  created(){
    this.handleGetDepartmentTree()
  }
  mounted(){
    this.selectValue = this.value
  }
  private handleGetDepartmentTree(){
    this.$http({
      url: '/pmi/department/tree',
      method: 'get',
      data: {}
    }).then((res) => {
      this.list = res.data
      // console.log('res',res)
    })
  }
  private handleSelectChange(val){
    this.$emit('update:value',val)
  }
  @Watch('value')
  handleValueChange(newVal,oldVal){
    this.selectValue = newVal
  }
}
</script>

<style lang="scss" scoped>

</style>
