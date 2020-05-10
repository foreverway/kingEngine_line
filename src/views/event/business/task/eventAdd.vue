<template>
  <div>
    <el-form
      ref="event"
      label-position="right"
      class="ke-form"
      :rules="rules"
      label-width="80px"
      :model="event"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="举报人"
            prop="reporterName"
          >
            <el-input v-model="event.reporterName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="案件类型"
            prop="eventClassId"
          >
            <el-cascader
              v-model="event.eventClassId"
              :options="classTree"
              :show-all-levels="false"
              :props="defaultProps"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="举报时间"
            prop="reporterName"
          >
            <el-input v-model="event.reporterName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="案件来源"
            prop="eventResource"
          >
            <el-cascader
              v-model="event.eventResource"
              :options="resourceTree"
              :show-all-levels="false"
              :props="defaultProps"
              clearable 
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="使用号码"
            prop="reporterTel"
          >
            <el-input v-model="event.reporterTel" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="所属区域"
            prop="eventAreaId"
          >
            <el-cascader
              v-model="event.eventAreaId"
              :options="areaTree"
              :show-all-levels="false"
              :props="defaultProps"
              clearable 
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="案件坐标"
            prop="absX"
          >
            <el-col :span="12">
              <el-input v-model="event.absX" />
            </el-col>
            <el-col :span="12">
              <el-input v-model="event.absY" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="案件等级"
            prop="eventLevel"
          >
            <el-select
              v-model="event.eventLevel"
              placeholder="请选择案件等级"
            >
              <el-option
                label="系统"
                value="1" 
              />
              <el-option
                label="个人"
                value="2" 
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="工作网格"
            prop="workGridCode"
          >
            <el-input v-model="event.workGridCode" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="单元网格"
            prop="cellGridCode"
          >
            <el-input v-model="event.cellGridCode" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="是否回复"
            prop="needReplay"
          >
            <el-checkbox-group v-model="event.needReplay">
              <el-checkbox
                label=""
                name="needReplay"
              />
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="回复方式"
            prop="replayMode"
          >
            <el-select
              v-model="event.replayMode"
              placeholder="请选择回复方式"
            >
              <el-option
                label="系统"
                value="1"
              />
              <el-option
                label="个人"
                value="2"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="回复号码"
            prop="replayPho"
          >
            <el-input v-model="event.replayPho" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="案发位置"
        prop="eventLocation"
      >
        <el-input
          v-model="event.eventLocation"
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        label="问题描述"
        prop="content"
      >
        <el-input
          v-model="event.content"
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="note"
      >
        <el-input
          v-model="event.note"
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        label="关键字"
        prop="keyword"
      >
        <el-input
          v-model="event.keyword"
          type="textarea"
        />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="接收角色"
            prop="receiveRole"
          >
            <el-select
              v-model="receiveRole"
              placeholder="请选择接收角色"
            >
              <el-option
                label="系统"
                value="1" 
              />
              <el-option
                label="个人"
                value="2"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="附件"
            prop="cellGridCode"
          >
            <!--<el-input v-model="event.cellGridCode"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="opeate-buttons">
      <el-button><svg-icon name="hamburger" />取消</el-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="hamburger" />保存
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'event',
  props: {
    id: {
      type: Number,
      default: 0
    }
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) selectionItem !: any
  // 表单
  private event: any = {}
  private receiveRole: any = {}
  private classTree: Array<any> = []
  private resourceTree: Array<any> = []
  private areaTree: Array<any> = []
  created() {
    this.initClassTree()
    this.initAreaTree()
    this.event = this.$base.common.extend(this.selectionItem)
  }
  private defaultProps: any= {
    // children: 'children',
    // label: 'meta[title]',
    // value: 'id',
    checkStrictly: true
  }
  // 案件类型树
  private initClassTree(): void {
    this.$http.request({
      url: '/eventClass/findEventClassTree',
      method: 'post',
      data: {}
    }).then((res: any) => {
      this.classTree = res.data
      this.classTree.forEach((ele) => {
        ele.label = ele.text
        ele.value = ele.id
        if (ele.children) {
          ele.children.forEach((els: any) => {
            els.label = els.text
            els.value = els.id
          })
        }
      })
    })
  }
  // 区域树
  private initAreaTree(): void {
    this.$http.request({
      url: '/area/findAreaTree',
      method: 'post',
      data: {}
    }).then((res: any) => {
      this.areaTree = res.data
      this.areaTree.forEach((ele) => {
        ele.label = ele.text
        ele.value = ele.id
        if (ele.children) {
          ele.children.forEach((els: any) => {
            els.label = els.text
            els.value = els.id
          })
        }
      })
    })
  }
  // 验证
  private rules:object = {
    // eventClassId: [
    //   { required: true, message: '请选择案件类型', trigger: 'blur' }
    // ],
    // eventResource: [
    //   { required: true, message: '请选择案件来源', trigger: 'blur' }
    // ],
    // eventAreaId: [
    //   { required: true, message: '请选择区域', trigger: 'blur' }
    // ],
    // eventLevel: [
    //   { required: true, message: '请选择案件等级', trigger: 'blur' }
    // ],
    // eventLocation: [
    //   { required: true, message: '请输入案发位置', trigger: 'blur' }
    // ],
    // content: [
    //   { required: true, message: '请输入问题描述', trigger: 'blur' }
    // ]
  }
  private handleSave():void {
    let form = this.$refs.event as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        this.$http.request({
          url: '/event/addEvent',
          method: 'post',
          data: this.event
        }).then((res: any) => {
          if (res.code === 1) {
            // this.load(1)
          }
          this.$base.win.msgJson(res)
        })
        form.resetFields()
        // this.dialog.visible = false
      } else {
        this.$base.win.msg('必填项不能为空')
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .left-border {
    margin-left:0;
  }
  .buttons{
    padding-left:0;
  }
</style>
