<template>
  <div class="sidebar-wrapper">
    <div class="ke-logo">
      <img src="@/assets/logo.png">
      <span v-show="!isCollapse">{{ getSystemName }}</span>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/_variables.scss'
import { stringify } from 'querystring'

@Component({
  name: 'SideBar',
  components: {
    SidebarItem
  }
})
export default class extends Vue {
  async created() {
    await this.load()
  }
  private async load() {
    await AppModule.GetMenus()
  }
  get getSystemName() {
    if (AppModule.select.menuIndex === undefined){
      return ''
    }
    return AppModule.menus[AppModule.select.sysIndex].children[AppModule.select.menuIndex].menuName
  }
  get routes() {
    if (AppModule.select.menuIndex === undefined){
      return []
    }

    return AppModule.menus[AppModule.select.sysIndex].children[AppModule.select.menuIndex].children
  }
  get sidebar() {
    return AppModule.sidebar
  }
  get variables() {
    return variables
  }

  get isCollapse() {
    return !this.sidebar.opened
  }
  
}
</script>

<style lang="scss">
.hideSidebar{
  .ke-logo{
    height:40px;
    img{
      width:30px;
      height:30px;
    }
  }
}
.sidebar-container {
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .el-scrollbar__view {
    height: 100%
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
.sidebar-el-menu{
  .el-submenu{
    .el-submenu__title{
      line-height: 44px;
      height: 44px;
      color: #b8c7ce!important;
      padding: 0px 5px!important;
      span{
        font-weight: bold;
        margin-left: 5px;
      }
      i{
        color: #b8c7ce!important;
      }
    }
    .el-menu.el-menu--inline{
      .el-menu-item{
        height: 40px;
        line-height: 40px;
        padding: 0px 20px!important;
        color: #8aa4af;
        &:hover{
          background-color: #369def!important;
          color: #fff!important;
        }
      }
      .el-menu-item.is-active {
        background:#369def !important;
        color:#fff!important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.sidebar-wrapper{
  background:$menuBg;
  position: absolute!important;
}
.el-scrollbar {
  height: calc(100% - 50px);
}
.ke-logo {
  height:80px;
  padding:0 3px;
  display:flex;
  flex-direction: column;
   justify-content:center;
  align-items:center;
  background:$menuBg;
  img{
    width: 48px;
    height: 48px;
    margin-top: -5px;
  }
  span
  {
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    // margin-left: 5px;
  }
}
.el-menu {
  border: none;
  // height: 100%;
  width: 100% !important;
}
</style>
