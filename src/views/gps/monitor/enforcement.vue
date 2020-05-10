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
            v-model="params.bb1" 
            placeholder="输入执法人员姓名" 
            class="input-with-select"
          >
            <el-select 
              slot="prepend" 
              v-model="params.select" 
              class="ka-carWidth"
              placeholder="间隔"
            >
              <el-option 
                label="30秒" 
                value="1" 
              />
              <el-option 
                label="15秒" 
                value="2" 
              />
              <el-option 
                label="10秒" 
                value="3" 
              />
              <el-option 
                label="1分钟" 
                value="4" 
              />
              <el-option 
                label="5分钟" 
                value="5" 
              />
            </el-select>
            <el-button 
              slot="append" 
              icon="el-icon-search" 
            />
          </el-input>
        </el-col>
      </el-form>
    </el-header>
    <el-main class="personal-info-wrapper">
      <el-checkbox-group 
        v-model="checkList" 
        class="ka-group"
      >
        <el-checkbox label="在线" />
        <el-checkbox label="离线" />
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
  private checkList: Array<any> = []
  private treeData: Array<any> = []
  private params: any = {}
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
