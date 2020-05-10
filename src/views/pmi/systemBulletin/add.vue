<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
    height="700px"
    :close-on-click-modal="false"
  >
    <div
      v-loading="loading"
      class="add-department"
      style="min-height:500px;"
    >
      <el-tabs
        v-model="activeName"
        class="add-el-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="公告信息"
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
          label="接收人员"
          name="third"
          class="pane-item"
        >
          <person
            :id="id"
            ref="myRoles"
            :roles.sync="basicAraay"
          />
        </el-tab-pane>
      </el-tabs>
      <div 
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: '',
  components: {
    BasicInfo: () => import('./basic.vue'),
    Person: () => import('./person.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Object, default: {} }) dialog!: any
  private activeName: string = 'first'
  private saveFlag: boolean = false
  private basicData: any = {}
  private basicAraay: any = {}
  private loading: boolean = false
  public $refs: any = { quickEntry: HTMLFormElement }
  created() {
    this.initData()
    // console.log(this.basicData)
  }
  private initData() {
    // let requestPostParam = {id: 1}
    // let obj = {name: 2,id: 3}
    // const param = Object.assign(requestPostParam, obj)
    // debugger
    if (this.id) {
      this.$http
        .request({
          url: '/sys/notice/findSysNoticeById',
          method: 'post',
          data: {
            id: this.id
          }
        })
        .then((res: any) => {
          this.basicData = res.data
          let annelist = this.basicData.annexe
          if (annelist.length !== 0){
            annelist.forEach((item: any,i) => {
              this.basicData.annexe[i].name = item.fileName
              this.basicData.annexe[i].url = item.filePath
            })
          }
          this.basicData.annexe = annelist
          // this.selectionItem.img = []
          // if (this.selectionItem.logoUrl) {
          //   this.selectionItem.img = [{name: 'xx.png',id: this.selectionItem.logoId,url: this.selectionItem.logoUrl}]
          //   // 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
          // }
          this.basicAraay = {
            user: res.data.user,
            userIds: '',
            dept: res.data.dept,
            deptIds: '',
            role: res.data.role,
            roleIds: '',
            patrol: res.data.patrol,
            patrolIds: ''
          }
        })
    } else {
      this.basicData = {
        msgTitle: '',
        pubTime: '',
        finishTime: '',
        msgContent: '',
        annexeIds: '',
        annexe: []
      }
      this.basicAraay = {
        user: [],
        userIds: '',
        dept: [],
        deptIds: '',
        role: [],
        roleIds: '',
        patrol: [],
        patrolIds: ''
      }
    }
  }
  async handleSave() {
    await this.$refs.myBasic.submitForm()
    await this.$refs.myRoles.commitRoles()
    this.basicData = Object.assign(this.basicData, this.basicAraay)
    await this.editApp()
    // this.$emit('update:visible', false)
  }
  private editApp() {
    let res = new Promise((resolve, reject) => {
      this.loading = true
      this.$http
        .request({
          url: this.id ? 'sys/notice/editSysNotice' : '/sys/notice/addSysNotice' ,
          method: 'post',
          data: this.basicData
        })
        .then((response: any) => {
          if (response.code === 200){
            let dialog = {
              title: '',
              visible: false,
              isAdd: true
            }
            this.$emit('update:dialog', dialog)
            resolve()
          }
          this.loading = false
          this.$base.win.msgJson(response)
        })
        .catch(() => {
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
<style lang="scss">
  .add-el-tabs{
    .el-tabs__content{
      height: calc(100% - 55px);
      overflow-y: auto;
    }
  }
</style>

<style lang="scss" scoped>
.el-tabs{
    height: 500px;
    margin-bottom: 20px;
  }
</style>
