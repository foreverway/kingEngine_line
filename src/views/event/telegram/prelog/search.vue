<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
  >
    <el-form
      class="ke-search margin-top"
      label-width="85px"
    > 
      <el-row>
        <el-col :span="12">
          <el-form-item label="案件类别">
            <el-select
              v-model="params.address"
              placeholder="全部"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属区域">
            <el-select
              v-model="params.address"
              placeholder="深圳"
            >
              <el-option
                v-for="item in addressOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="来件时间">
            <el-time-select
              v-model="incomeTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }"
              placeholder="选择时间"
            />
          </el-form-item>
        </el-col>
        <el-col
          class="label-center"
          :span="12"
        >
          <el-form-item
            label="至"
          >
            <el-time-select
              v-model="value"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }"
              placeholder="选择时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="举报人">
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="举报电话">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="事发位置">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="问题描述">
            <el-input type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="opeate-buttons">
      <el-button @click="handleCancel">
        <svg-icon name="close" />关闭
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
      >
        查询
      </el-button>
      <el-button
        type="warning"
        @click="handleSave"
      >
        <svg-icon name="reset" />重置
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Search extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private typeOptions:any = [{
    value: '全部',
    label: '全部'
  }]
  private params: any = {
    address: ''
  }
  private addressOptions: any = [
    {
      label: '宝安区',
      value: '宝安区'
    },
    {
      label: '南山区',
      value: '南山区'
    },
    {
      label: '罗湖区',
      value: '罗湖区'
    },{
      label: '福田区',
      value: '福田区'
    },{
      label: '龙岗区',
      value: '龙岗区'
    },{
      label: '盐田区',
      value: '盐田区'
    },{
      label: '龙华区',
      value: '龙华区'
    }
  ]
}
</script>
<style scoped>
.label-center >>> .el-form-item__label{
    text-align: center !important;
}
</style>
<style lang="scss">
.margin-top{
    margin-top: 15px;
}
.opeate-buttons {
  text-align: right;
}
</style>
