<template>
  <div class="g-top-tabs">
    <div>
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <el-tabs
        v-if="openTab.length"
        id="g-top-tabs"
        v-model="activeIndex"
        closable
        @tab-click="tabClick"
        @tab-remove="tabRemove"
      >
        <el-tab-pane
          v-for="item in openTab"
          :key="item.path"
          :label="item.meta.title"
          :name="item.path"
        />
      </el-tabs>
    </div>
    <div class="system">
      <el-select
        v-model="value"
        class="g__select"
        @change="handleSelect"
      >
        <el-option-group
          v-for="group in tabItems"
          :key="group.menuName"
          :label="group.menuName"
        >
          <el-option
            v-for="item in group.children"
            :key="item.id"
            :label="item.menuName"
            :value="item.id"
          />
        </el-option-group>
      </el-select>
      <ul>
        <li
          :title="$t('m.setUp')"
        >
          <i
            class="el-icon-user"
            @click="handleUser"
          />
        </li>
        <li
          :title="$t('m.notice')"
        >
          <i
            class="el-icon-bell"
            @click="outbox"
          />
        </li>
        <li
          :title="$t('m.fullScreen')"
        >
          <i
            class="el-icon-rank"
            @click="fullScreen"
          />
        </li>
        <li
          :title="$t('m.navigation')"
        >
          <i
            class="el-icon-back"
            @click="handleBack"
          />
        </li>
        <li :title="$t('m.logout')">
          <i
            class="el-icon-switch-button"
            @click="handleOut"
          />
        </li>
      </ul>
    </div>
    <settings
      v-if="settingsDialog.visible"
      :settings-dialog.sync="settingsDialog"
    />
    <outbox
      v-if="outboxDialog.visible"
      :outbox-dialog.sync="outboxDialog"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TabModule } from '@/store/modules/tab'
import Hamburger from '@/components/Hamburger/index.vue'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import screenfull from 'screenfull'

  @Component({
    name: 'NavTabs',
    components: {
      Hamburger,
      settings: () => import('@/views/pmi/personal/personalInfo/index.vue'),
      outbox: () => import('@/views/pmi/systemBulletin/outbox.vue')
    }
  })
export default class extends Vue {
  private tabItems: Array<any> = []
  private isFullscreen: boolean = false
  private value:number=0

  private settingsDialog: any = {
    title: '个人设置',
    visible: false,
    isAdd: false,
    type: 1
  }
  private outboxDialog: any = {
    title: '系统公告',
    visible: false
  }
  async created() {
    await this.load()
  }
  private async load() {
    this.tabItems = await AppModule.GetMenus()
    if (AppModule.select.menuIndex > -1){
      this.value = this.tabItems[AppModule.select.sysIndex].children[AppModule.select.menuIndex].id
    }
    if (this.$route.path !== '/' && this.$route.path !== '/dashboard') {
      this.setRouteName(this.$route)
      TabModule.updateTabs(this.$route)
    }
  }
  get sidebar() {
    return AppModule.sidebar
  }
  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }
  mounted() {
    if (this.openTab.length > 0) {
      return
    }
    const home = (this.$router as any).options.routes[3].children[0]
    if (this.$route.path !== '/' && this.$route.path !== '/dashboard') {
      TabModule.addTabs(home) 
      TabModule.addTabs(this.$route)
      TabModule.setActiveIndex(this.$route.path)
    } else {
      TabModule.addTabs(home)
      TabModule.setActiveIndex('/dashboard')
      this.$router.push('/')
    }
  }
  tabClick(tab:any) {
    for (let index = 0; index < TabModule.openTab.length; index++) {
      const element = TabModule.openTab[index]
      if (element.path === this.activeIndex){
        element.meta.keepAlive = true
        break
      }
    }
    this.$router.push({ path: this.activeIndex })
  }
  tabRemove(targetName: string) {
    if (targetName === '/' || targetName === '/dashboard'){
      return
    }
    TabModule.deleteTabs(targetName)
    if (this.activeIndex === targetName) {
      if (this.openTab && this.openTab.length >= 1) {
        TabModule.setActiveIndex(this.openTab[this.openTab.length - 1].path)
        this.$router.push({path: this.activeIndex}) 
      } else {
        this.$router.push({path: '/'})
      }
    }
  }
  get openTab() {
    return TabModule.openTab
  }
  get activeIndex() {
    return TabModule.activeIndex
  }
  set activeIndex(val: any) {
    TabModule.setActiveIndex(val)
  }
  private getMenuName(obj:any):string{
    let menus = obj.menus
    if (menus === undefined){
      menus = AppModule.menus
    }
    let name:string = ''
    for (let index = 0; index < menus.length; index++) {
      const item = menus[index]
      if (item.url === obj.path){
        name = item.text
        break
      } else if (item.children && item.children.length > 0){
        name = this.getMenuName({path: obj.path,menus: item.children})
      }
      if (name !== ''){
        break
      }
    }
    return name
  }
  private setRouteName(to: any){
    // 只设置一次就好
    if (to.meta.name === undefined || to.meta.name === ''){
      let name = this.getMenuName({path: to.path})
      if (name === ''){
        name = to.meta.title
      }
      to.meta.name = name
    }
  }
  @Watch('$route')
  onRouteChanged(to: any, from: any) {
    let flag = false
    for (let item of this.openTab) {
      if (item.meta.title === to.meta.title) {
        TabModule.setActiveIndex(to.path)
        flag = true
      }
    }
    if (!flag) {
      TabModule.addTabs(to)
      TabModule.setActiveIndex(to.path)
      TabModule.mostTabs() 
    }
  }
  private handleBack() {
    TabModule.resetTabs()
    this.$router.push('/nav')
  }
  private handleUser() {
    this.settingsDialog.visible = true
  }
  @Watch('settingsDialog.isAdd')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    console.log(this.settingsDialog)
    if (this.settingsDialog.type === 1) {
      this.$confirm('是否重新登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UserModule.LogOut()
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    }
    
  }
  private outbox() {
    this.outboxDialog.visible = true
  }
  private handleOut() {
    UserModule.LogOut()
    this.$router.push(`/login?redirect=${this.$route.fullPath}`)
  }
  private fullScreen() {
    if (!screenfull.isEnabled) {
      this.$message({
        message: 'you browser can not work',
        type: 'warning'
      })
      return false
    }
    screenfull.toggle()
  }
  handleSelect(val:number){
    let menus = AppModule.menus
    for (let index = 0; index < menus.length; index++) {
      const menu = menus[index]
      for (let j = 0; j < menu.children.length; j++) {
        const node = menu.children[j]
        if (node.id === val){
          AppModule.SET_SELECT({
            sysIndex: index,
            menuIndex: j
          })
          break
        }
      }
    }
  }
}
</script>
<style lang="scss">
.g__select{
  margin-top: 3px;
  width: auto !important;
  .el-input__inner{
    border-width: 0;
    text-align: right;
  }
}
  .g-top-tabs {
    background:#fff;
    position:absolute;
    display: flex;
    justify-content: flex-start ;
    top:0;
    left:0;
    width:100%;
    z-index:99;
    border-bottom:1px solid #ddd;
  #g-top-tabs {
    border-bottom: 0;
    box-shadow: none;
    background: #fff;
    margin-left:60px;

    .is-top {
      margin: 0;
    }
    .el-tabs__content {
      display: none
    }
    .el-tabs__nav-wrap::after {
      background:none;
    }

  }
    .navbar-el-dropdown-menu.el-popper{
      margin-top: 0px!important;
    }
    .hamburger-container {
      line-height: 40px;
      height: 100%;
      padding: 0 15px;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color:transparent;
      position:absolute;
      top:-0px;
      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }
    .system {
      position:absolute;
      top:0;
      right:0;
      z-index:999;
      height:40px;
      display: flex;
      ul{
        margin-right: 10px;
        display: flex;
        align-items: center;
        li{
          padding: 0 15px;
          svg,i{
            cursor: pointer;
            color:#666666;
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
    .el-dropdown{
      height:40px;
      line-height: 40px;
      padding: 0px 10px;
    }
    .navbar-el-dropdown-menu.el-dropdown-menu{
        right: 0px;
        left: initial!important;
        .popper__arrow{
          display: none;
        }
      }
    }
  }
</style>
