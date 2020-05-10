<template>
  <el-container class="personal-info-wrapper1">
    <el-header
      height="auto"
      class="ka-car"
    >
      <el-form
        :model="params"
        class="ke-search"
        label-width="77px"
      >
        <el-col :span="24">
          <el-input
            v-model="input1"
            placeholder="输入车牌号"
            prefix-icon="el-icon-search"
            @input="searchZoning"
          />
        </el-col>
      </el-form>
    </el-header>
    <el-main class="personal-info-wrapper">
      <el-checkbox-group 
        v-model="checkList" 
        class="ka-group"
      >
        <el-checkbox label="显示车牌号" />
        <el-checkbox label="显示离线车辆" />
      </el-checkbox-group>
      <el-scrollbar class="tree-container">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          highlight-current
          node-key="id"
          @node-click="handleNodeClick"
        />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({
  name: 'PersonalInfo'
})
export default class extends Vue {
  private treeData: Array<any> = []
  private params: any = {}
  private checkList: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'name'
  }

  created() {
    // UserModule.GetUserInfo(userName)
    this.initTreeData()
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/pmi/help/tree',
        method: 'post',
        data: {}
      })
      .then((res: any) => {
        this.treeData = res.data
      })
  }
  private searcContent(data: string): void {
    // this.params.parentId = Number(data.id)
    // this.initTableData()
  }
  private handleNodeClick(data: any): void {
    // this.params.parentId = Number(data.id)
    // this.initTableData()
  }
  private searchZoning(data: string): void {
    // this.params.parentId = Number(data.id)
    // this.initTableData()
  }
}
</script>
<style lang="scss">
  .personal-info-wrapper1{
    .el-input-group__prepend {
      .el-select{
        margin-right: 0px;
      }
    }
    .el-input-group__prepend{
      padding: 0 5px;
    }
    .ka-carWidth {
      .el-input {
        width: 90px;
      }
    }
    .input-with-select {
      .el-input-group__prepend {
        background-color: #fff;
      }
    }
    .el-main{
      padding: 5px 10px;
    }
  }
  .ka-car{
    .el-row{
      margin-bottom: 5px!important;
    }
  }
</style>
<style lang="scss" scoped>
.personal-info-wrapper1{
    .el-header{
      padding: 0px;
    }
    padding: 0px;
    .ka-result{
      color: #999;
      line-height: 20px;
    }
    .ka-list{
      padding: 5px;
      display: flex;
      line-height: 20px;
      border-bottom: 1px solid #E4E7ED;
      i{
        font-size: 26px;
        color: #409EFF;
        align-self: center;
        margin-right: 5px;
      }
    }
    .ka-list:hover{
      background: #EBEEF5;
      padding: 5px;
    }
    .ka-group{
      margin: 10px 0;
    }
  }
  .ka-interval{
    margin-top: 10px;
  }
</style>
