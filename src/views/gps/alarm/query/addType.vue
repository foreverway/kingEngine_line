<template>
  <el-dialog
    :title="typeDialog.title"
    :visible.sync="typeDialog.visible"
    :width="dialogWidth"
  >
    <el-main class="ke-layout-main">
      <div class="add-department">
        <addSpeeding-form
          v-if="formVisible.dialogvisible"
          :id="id"
          ref="myBasic"
          :selection-item.sync="basicData"
          @setType="handleClick"
        />
        <addTransboundary-form
          v-if="formVisible.transboundaryVisible"
          :id="id"
          ref="transboundary"
          :selection-item.sync="basicData"
          @setType="handleClick"
        />
        <!-- <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="超速报警"
            name="first"
          >
            <addSpeeding-form
              v-if="formVisible.dialogvisible"
              :id="id"
              ref="myBasic"
              :selection-item.sync="basicData.obj"
            />
          </el-tab-pane>
          <el-tab-pane
            label="越界报警"
            name="second"
          >
            <addTransboundary-form
              v-if="formVisible.transboundaryVisible"
              :id="id"
              ref="transboundary"
              :transboundary-dialog.sync="transboundaryDialog"
              :selection-item="basicData.trams"
            />
          </el-tab-pane>
        </el-tabs> -->
      </div>
    </el-main>
    <div 
      slot="footer"
      class="ke-dialog-footer"
    >
      <el-button @click="cancel">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        type="primary"
        :loading="saveLoading"
        @click="handleSave"
      >
        <svg-icon name="save" />保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: '',
  components: {
    AddSpeedingForm: () => import('./addSpeeding.vue'),
    AddTransboundaryForm: () => import('./addTransboundary.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) typeDialog !: any
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Number, default: 0 }) id !: number
  public $refs: any = { quickEntry: HTMLFormElement }
  private basicData: object = this.$base.common.extend(this.selectionItem)
  private saveLoading: boolean = false
  private activeName:string = 'first'
  private dialogWidth:string = '700px'
  private formVisible: any = {
    dialogvisible: false,
    transboundaryVisible: false,
    type: ''
  }
  created() {
    // console.log(this.selectionItem)
    // this.formVisible.type = this.selectionItem.type
    // if (this.selectionItem.type === '1' || !this.selectionItem.type){
    //   this.formVisible.dialogvisible = true
    // } else if (this.selectionItem.type === '2'){
    //   this.formVisible.transboundaryVisible = true
    // }
    this.handleClick(this.selectionItem.type) // 类型控制
    console.log(this.selectionItem)
  }
  private handleClick(event: string) {
    this.formVisible = {
      dialogvisible: false,
      transboundaryVisible: false,
      type: event
    }
    this.dialogWidth = '700px'
    if (event === '2') {
      this.dialogWidth = '1200px'
      this.formVisible.transboundaryVisible = true
    } else if (event === '1' || !event){
      this.formVisible.dialogvisible = true
    }
    console.log(this.formVisible)
  }
  async handleSave() {
    if (this.formVisible.type === '1') {
      await this.$refs.myBasic.submitForm()
    } else if (this.formVisible.type === '2'){
      await this.$refs.transboundary.commitRoles()
    }
    // await this.$refs.transboundary.commitRoles()
    await this.editPort()
  }
  private editPort() {
    let res = new Promise((resolve, reject) => {
      this.saveLoading = true
      this.$http.request({
        url: '/pmi/menu/add',
        method: 'post',
        data: this.basicData
      }).then((response: any) => {
        let dialog = {
          title: '',
          visible: false,
          isAdd: true
        }
        this.$emit('update:typeDialog', dialog)
        this.$base.win.msg('成功', 'success')
        this.saveLoading = false
        resolve()
      }).catch((err: any) => {
        this.saveLoading = false
        this.$base.win.msg(err, 'error')
      })
    })
    return res
  }
  private cancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:typeDialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
  .el-main{
      max-height: 550px;
    .ka-vehicle {
      height: 400px;
    }
  }
</style>
