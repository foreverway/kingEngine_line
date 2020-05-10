<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <el-form
            class="ke-search"
            label-width="80px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="选择项目">
                  <el-select
                    v-model="select"
                    placeholder="请选择项目"
                    @change="handleChange"
                  >
                    <el-option
                      v-for="(item,key) in selectData"
                      :key="key"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main>
          <span
            v-for="item in data"
            :key="item"
          >
            <svg-icon :name="item" />
            <h3>{{ item }}</h3>
          </span>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
let baseUrl = 'http://192.168.200.157/AutoApi/auto/'
@Component({
})
export default class extends Vue {
    private selectData:Array<any>=[]
    private select:string=''
    private data:Array<string>=[]
    created() {
      axios.post(`${baseUrl}GetFilesItems`)
        .then((response:any) => {
          this.selectData = response.data.data.map((str:any) => {
            const node = str.split('|')
            return {value: node[0],name: node[1]}
          })
        })
    }
    private handleChange(val:string):void{
      axios.post(`${baseUrl}GetFiles?path=${val}`)
        .then((response:any) => {
          this.data = response.data.data
        })
    }
}
</script>
<style lang="scss" scoped>
.ke-search{
  .el-row{
    width:300px;
  }
}
 span{
     padding: 20px;
     display: inline-block;
     text-align: center;
     .svg-icon{
         width:50px;
         height:50px;
     }
     h3{
         margin-top: 10px;
         width: 100%;
         text-align:center;
     }
 }
</style>
