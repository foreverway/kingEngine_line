<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
    :close-on-click-modal="false"
  >
    <div
      v-loading="loading"
      class="big-add"
    >
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="基本信息"
          name="first"
        >
          <basic-info
            :id="id"
            ref="myBasic"
            :active-name.sync="activeName"
            :selection-item.sync="basicData"
            :save-flag="saveFlag"
          />
        </el-tab-pane>
        <el-tab-pane
          label="默认处置单位"
          name="second"
        >
          <default-depart
            ref="myLimit"
            :disposal-units.sync="disposalUnits"
          />
        </el-tab-pane>
      </el-tabs>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button @click="handleCancel">
          <svg-icon name="hamburger" />取消
        </el-button>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave"
        >
          <svg-icon name="hamburger" />保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'BigAdd',
  components: {
    BasicInfo: () => import('./basic.vue'),
    DefaultDepart: () => import('./depart.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  @Prop({ type: Number, default: 0 }) sonId !: number

  private activeName:string = 'first'
  private saveFlag: boolean = false
  private basicData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = false
  private disposalUnits: any = []
  private flag = false
  public $refs: any = { quickEntry: HTMLFormElement }
  private saveLoading: boolean = false
  created() {
    this.initTableData()
  }
  private async initTableData() {
    if (this.id) {
      await this.$http
        .request({
          url: '/evt/classSetting/findClassSettingById',
          method: 'post',
          data: {id: this.id}
        })
        .then((res: any) => {
          this.basicData = res.data
          this.disposalUnits = res.data.disposalUnits
        })
    }
  }
  private formatChecked(data: any) {
    if (data) {
      return 2
    }
    return 1
  }
  private getFlg() {
    let data = this.basicData
    data.isSaturdaywork = this.formatChecked(data.isSaturdaywork)
    data.isSundaywork = this.formatChecked(data.isSundaywork)
    data.ischeck = this.formatChecked(data.ischeck)
    data.isverify = this.formatChecked(data.isverify)
    data.useDisposeTimea = this.formatChecked(data.useDisposeTimea)
    data.useDisposeTimeb = this.formatChecked(data.useDisposeTimeb)
    data.useDisposeTimec = this.formatChecked(data.useDisposeTimec)
    data.use_disposeTimeB = this.formatChecked(data.use_disposeTimeB)
    data.isSendMsg = this.formatChecked(data.isSendMsg)
    data.isreckon = this.formatChecked(data.isreckon)
    data.isUsetime = this.formatChecked(data.isUsetime)
    data.useCheckTime = this.formatChecked(data.useCheckTime)
    data.useVerifyTime = this.formatChecked(data.useVerifyTime)
  }
  private specificSize() {
    let disposeTimea = this.basicData.disposeTimea
    let useDisposeTimea = this.basicData.useDisposeTimea
    let disposeTimeb = this.basicData.disposeTimeb
    let useDisposeTimeb = this.basicData.useDisposeTimeb
    let disposeTimec = this.basicData.disposeTimec
    let useDisposeTimec = this.basicData.useDisposeTimec
    if (useDisposeTimea && useDisposeTimeb && disposeTimea > disposeTimeb) {
      this.$base.win.msg('工程性处置时限要大于一般性处置时限', 'error')
      return false
    } else if (useDisposeTimeb && useDisposeTimec && disposeTimeb > disposeTimec){
      this.$base.win.msg('特殊性处置时限要大于工程性处置时限', 'error')
      return false
    } else if (useDisposeTimea && useDisposeTimec && disposeTimea > disposeTimec){
      this.$base.win.msg('特殊性处置时限要大于一般性处置时限', 'error')
      return false
    }
    return true
  }
  async handleSave() {
    await this.$refs.myBasic.submitForm()
    await this.$refs.myLimit.commitMenus()
    let flg = this.specificSize()
    this.basicData.disposalUnits = this.disposalUnits
    if ( flg ) {
      await this.getFlg()
      this.saveLoading = true
      await this.editEvent()
      this.saveLoading = false
    }
    // this.$emit('update:visible', false)
  }
  private editEvent() {
    let res = new Promise((resolve, reject) => {
      this.loading = true
      this.$http.request({
        url: this.id ? '/evt/classSetting/editClassSetting' : '/evt/classSetting/addClassSetting',
        method: 'post',
        data: this.basicData
      // eslint-disable-next-line no-shadow
      }).then((res: any) => {
        if (res.code === 200) {
          this.loading = false
          let dialog = {
            title: '',
            visible: false,
            isAdd: true
          }
          this.$emit('update:dialog', dialog)
          this.$base.win.msg('成功', 'success')
          resolve()
        } else {
          this.loading = false
          this.$base.win.msg(res.msg, 'error')
        }  
      }).catch(() => {
        this.loading = false
        this.$base.win.msg('保存失败', 'error')
      })
    })
    return res
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
  private handleClick(tab: any, event: any): void {
    // console.log(tab, event);
  }
}
</script>

<style lang="scss" scoped>
  .big-add{
    height: 520px;
  }
</style>
