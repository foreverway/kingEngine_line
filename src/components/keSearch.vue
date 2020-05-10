<template>
  <el-popover
    v-model="visible"
    placement="bottom-end"
    width="790"
    class="ke-popover-button"
    trigger="manual"
    popper-class="ccc"
  >
    <div class="ke-popover-center search">
      <el-form
        class="ke-search"
        label-width="77px"
      >
        <el-row class="header">
          <el-col :span="4">
            逻辑
          </el-col>
          <el-col :span="2">
            (
          </el-col>
          <el-col :span="4">
            条件
          </el-col>
          <el-col :span="5">
            查询字段 
          </el-col>
          <el-col :span="6">
            查询值
          </el-col>
          <el-col :span="2">
            )
          </el-col>
          <el-col :span="1">
            &nbsp;
          </el-col>
        </el-row>
        <div style="height:200px;">
          <el-scrollbar
            class="ke-scrollbar"
            style="height:100%"
          >
            <el-row
              v-for="(node,index) in senior"
              :key="index"
              @click="handleRow(node)"
            >
              <el-col :span="4">
                <el-select v-model="node.where">
                  <el-option
                    value="and"
                    label="并且"
                  />
                  <el-option
                    value="or"
                    label="或者"
                  />
                </el-select>
              </el-col>
              <el-col :span="2">
                <el-switch v-model="node.left" />
              </el-col>
              <el-col :span="4">
                <el-select v-model="node.condition">
                  <el-option
                    v-for="(item,key) in conditions"
                    :key="key"
                    :value="item.value"
                    :label="item.text"
                  />
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="node.field"
                  @change="handleChange(node)"
                >
                  <el-option
                    v-for="(item,key) in selectFields"
                    :key="key"
                    :value="item.value"
                    :label="item.name"
                  />
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input
                  v-if="node.type==='input'"
                  v-model="node.value"
                />
                <el-select
                  v-else-if="node.type==='select'"
                  v-model="node.value"
                >
                  <el-option
                    value="11"
                    label="测试"
                  />
                </el-select>
                <el-date-picker
                  v-else-if="node.type==='date'"
                  v-model="node.value"
                  type="date"
                />
                <el-date-picker
                  v-else-if="node.type==='datetime'"
                  v-model="node.value"
                  type="datetime"
                />
                <el-input
                  v-else
                  v-model="node.value"
                />
              </el-col>
              <el-col :span="2">
                <el-switch v-model="node.right" />
              </el-col>
              <el-col :span="1">
                <i
                  class="el-icon-delete red"
                  @click="handleRemove(node)"
                />
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
      </el-form>
      <div
        slot="footer"
        class="ke-search-buttons"
      >
        <el-button @click="visible = false">
          取 消
        </el-button>
        <el-button
          id="add"
          v-power
          @click="handleCreate"
        >
          <svg-icon name="add" />新增条件
        </el-button>
        <el-button
          type="primary"
          @click="visible = false"
        >
          查 询
        </el-button>
      </div>
    </div>
    <el-button
      slot="reference"
      class="button"
      @click="visible = true"
    >
      <svg-icon name="moveSearch" />自定义查询
    </el-button>
  </el-popover>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import KeSet from '@/components/set/keSet.vue'

@Component({
  components: {   
    KeSet
  }
})
export default class extends Vue {
    private senior:Array<any>=[]
    private visible:boolean = false
    @Prop()private selectFields:any
    private conditions:Array<any> = [
      { text: '等于', value: '=' }, { text: '不等于', value: '<>' },
      { text: '大于', value: '>' }, { text: '大于等于', value: '>=' },
      { text: '小于', value: '<' }, { text: '小于等于', value: '<=' },
      { text: '包含', value: 'like' }, { text: '不包含', value: 'not like' }
    ]
    private handleCreate(){
      this.senior.push({ guid: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0; let v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      }) })
    }
    private handleRemove(node:any){
      this.senior.splice(this.senior.findIndex((item) => item.guid === node.guid), 1)
    }
    private handleChange(node:any){
      debugger
      let item = this.selectFields.find((i) => i.value === node.field)
      node.type = item.type
    }
}
</script>
<style lang="scss" scoped>
.ke-popover-button{
  margin: 0 10px 0 0;
}
  .search{
    .el-row{
      margin-bottom: 8px;
    }
    .el-col{
      padding: 0 8px;
      height:45px;
      line-height: 42px;
    }
    .header{
      background: #f5f5f5;
    }
    .red{
      color:#f35454;
      cursor: pointer;
      &:hover{
        color:#f32d2d;
      }
    }
  }
</style>
