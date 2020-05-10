<!-- eslint-disable no-irregular-whitespace -->
<template>
  <el-dialog
    v-dialog-drag
    title="人员详情"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <el-tabs v-model="tabActive">
      <el-tab-pane
        label="人员详情"
        name="first"
      >
        <el-form
          label-width="100px"
          label-position="right"
        >
          <el-row>
            <el-col :span="15">
              <el-row>
                <el-col
                  class="search-item"
                  :span="24"
                >
                  <el-form-item label="人员姓名：">
                    李四
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col
                  class="search-item"
                  :span="24"
                >
                  <el-form-item label="人员性别：">
                    男性
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col
                  class="search-item"
                  :span="24"
                >
                  <el-form-item label="当前状态：">
                    在线
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col
                  class="search-item"
                  :span="24"
                >
                  <el-form-item label="联系电话：">
                    55555555
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col
                  class="search-item"
                  :span="24"
                >
                  <el-form-item label="定位时间：">
                    1987-10-01 10:00:00
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="9">
              <div class="photo-container" />
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="轨迹回放"
        name="second"
      >
        <el-form
          label-width="100px"
          label-position="right"
        >
          <el-form-item label="回放时间">
            <el-select>
              <el-option
                label="最近一小时"
                value="1"
              />
            </el-select>
          </el-form-item>
          <div class="title-container">
            自定义
          </div>
          <el-form-item label="开　　始">
            <!-- <el-date-picker
              v-model="value2"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
            /> -->
          </el-form-item>
          <el-form-item label="结　　束">
            <!-- <el-date-picker
              v-model="value2"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
            /> -->
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({

})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private tabActive: String = 'first'
}
</script>
<style scoped>
.search-item >>> .el-form-item{
  margin-bottom: 0px !important;
}
</style>
<style lang="scss" scoped>
.title-container{
  margin: 10px 0;
  font-weight: bold;
}
.photo-container{
  width: 140px;
  height: 166px;
  background: #e5e5e5;
}
.opeate-buttons {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
}
.margin-left {
  padding-left: 10px;
}
.table-container {
  margin-top: 15px;
}
.search-item {
  display: flex;
  flex-flow: row;
  align-items: center;
  label {
    width: 120px;
    text-align: right;
  }
}
</style>
