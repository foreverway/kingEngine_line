<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar 
      class="sidebar-container" 
      @click="handleClickOutside"
    />
    <div class="main-container">
      <nav-tabs />
      <el-scrollbar
        wrap-class="main-scrollbar-wrapper"
        class="main-scrollbar-wrapper"
      >
        <app-main />
      </el-scrollbar>
    </div>
    <main-footer />
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component,Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType, AppModule } from '@/store/modules/app'
import { AppMain, Sidebar } from './components'
import ResizeMixin from './mixin/resize'
import NavTabs from './components/Navbar/NavTabs.vue'
import MainFooter from './components/MainFooter/index.vue'
@Component({
  name: 'Layout',
  components: {
    AppMain,
    Sidebar,
    NavTabs,
    MainFooter
  }
})
export default class extends mixins(ResizeMixin) {
  created(){
    if (AppModule.select.sysIndex === undefined){
      this.$router.push({
        path: '/nav'
      })
    }
  }
  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile,
      double:AppModule.double
    }
  }
  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }
}
</script>
<style>
  .main-scrollbar-wrapper {
    overflow-x:hidden;
    height:100%;
  }
</style>
<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.double{
    width:50%;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  overflow:hidden;
  height: calc(100% - 29px);
  padding-top:40px;
  transition: margin-left .28s;
  margin-left: $sideBarWidth;
  position: relative;
  background:#f6f7f9;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: calc(100% - 28px);
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.hideSidebar {
  .main-container {
    margin-left: 54px;
  }

  .sidebar-container {
    width: 54px !important;
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform .28s;
    width: $sideBarWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
