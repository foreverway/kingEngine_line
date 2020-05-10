<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
  >
    <div
      style="height: 430px"
      class="scroll-container"
    >
      <el-scrollbar
        class="ke-scrollbar"
        style="height:100%"
      >
        <el-form
          label-width="85px"
          class="ke-search"
        >
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
            <el-col :span="12">
              <el-form-item label="案件来源">
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
            <el-col :span="12">
              <el-form-item label="案件类别">
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
              <el-form-item label="举报时间">
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
            <el-col :span="12">
              <el-form-item label="案件等级">
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
            <el-col
              :span="12"
              class="align-left"
            >
              <el-form-item label="案件坐标">
                <span>114.123123</span>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              class="align-left"
            >
              <el-form-item label="工作网络">
                <span>114.123123</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
              class="align-left"
            >
              <el-form-item label="单元网络">
                <span>1231238487172</span>
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
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="24"
              class="align-left"
            >
              <el-form-item
                label="需要回复"
              >
                <el-row>
                  <el-col
                    class="align-left"
                    :span="24"
                  >
                    <el-radio-group style="margin-left:20px">
                      <el-radio>是</el-radio>
                      <el-radio>否</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
                <el-row class="margin-top">
                  <el-col :span="12">
                    <el-form-item label="回复方式">
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
                <el-row class="margin-top">
                  <el-col :span="12">
                    <el-form-item label="回复号码">
                      <el-input />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="接受角色">
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
        </el-form>
      </el-scrollbar>
    </div>
    <div class="opeate-buttons">
      <el-button @click="handleCancel">
        <svg-icon name="close" />关闭
      </el-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="save" />暂存
      </el-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="save" />不受理
      </el-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="save" />受理
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Regist extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private params:any = {
    address: ''
  }
  private addressOptions: any = [
    {
      label: '南山区',
      value: '南山区'
    }
  ]
}
</script>
<style scoped>
.align-left >>> .el-form-item__content{
    text-align: left;
}
</style>
<style lang="scss">
.margin-top{
    margin-top: 10px !important;
}
.opeate-buttons {
  text-align: right;
}
.scroll-container{
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
